package com.diallodev.trading.application.service;

import com.diallodev.trading.application.dto.TradeRequest;
import com.diallodev.trading.application.dto.TradeResponse;
import com.diallodev.trading.application.event.OrderExecutedEvent;
import com.diallodev.trading.application.mapper.ApiDtoMapper;
import com.diallodev.trading.common.exception.InsufficientFundsException;
import com.diallodev.trading.common.exception.InsufficientSharesException;
import com.diallodev.trading.common.exception.NoOpenPositionException;
import com.diallodev.trading.common.exception.ResourceNotFoundException;
import com.diallodev.trading.domain.model.Order;
import com.diallodev.trading.domain.model.PortfolioPosition;
import com.diallodev.trading.domain.model.Stock;
import com.diallodev.trading.domain.model.Wallet;
import com.diallodev.trading.domain.repository.OrderRepository;
import com.diallodev.trading.domain.repository.PortfolioPositionRepository;
import com.diallodev.trading.domain.repository.StockRepository;
import com.diallodev.trading.domain.repository.WalletRepository;
import com.diallodev.trading.domain.service.MarketOrderDomainService;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TradeApplicationService {

    private final OrderRepository orderRepository;
    private final WalletRepository walletRepository;
    private final StockRepository stockRepository;
    private final PortfolioPositionRepository portfolioPositionRepository;
    private final ApiDtoMapper apiDtoMapper;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional(noRollbackFor = {
            InsufficientFundsException.class,
            InsufficientSharesException.class,
            NoOpenPositionException.class
    })
    public TradeResponse placeOrder(Long userId, TradeRequest request) {
        String symbol = request.symbol().trim().toUpperCase();

        Order order = Order.pending(userId, symbol, request.side(), request.quantity());
        order = orderRepository.save(order);

        try {
            Wallet wallet = walletRepository
                    .findByUserIdForUpdate(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Wallet", String.valueOf(userId)));
            Stock stock = stockRepository
                    .findBySymbolForUpdate(symbol)
                    .orElseThrow(() -> new ResourceNotFoundException("Stock", symbol));

            Optional<PortfolioPosition> locked = portfolioPositionRepository.findByUserIdAndSymbolForUpdate(userId,
                    symbol);

            PortfolioPosition updated = MarketOrderDomainService.execute(order, wallet, locked, stock);

            walletRepository.save(wallet);
            orderRepository.save(order);

            if (updated.isClosed()) {
                portfolioPositionRepository.delete(updated);
            } else {
                portfolioPositionRepository.save(updated);
            }

            eventPublisher.publishEvent(OrderExecutedEvent.from(order));
            log.info(
                    "Trade executed userId={} orderId={} {} {} qty={}",
                    userId,
                    order.getId(),
                    symbol,
                    request.side(),
                    request.quantity());

            return apiDtoMapper.toTradeResponse(order);
        } catch (InsufficientFundsException
                | InsufficientSharesException
                | NoOpenPositionException ex) {
            order.markFailed(ex.getMessage());
            orderRepository.save(order);
            log.warn("Trade failed userId={} symbol={} reason={}", userId, symbol, ex.getMessage());
            throw ex;
        }
    }
}
