package com.diallodev.trading.domain.service;

import com.diallodev.trading.common.exception.NoOpenPositionException;
import com.diallodev.trading.domain.model.Order;
import com.diallodev.trading.domain.model.OrderSide;
import com.diallodev.trading.domain.model.PortfolioPosition;
import com.diallodev.trading.domain.model.Stock;
import com.diallodev.trading.domain.model.Wallet;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

/**
 * Pure domain logic for executing a market order at the current stock price.
 */
public final class MarketOrderDomainService {

        private static final int NOTIONAL_SCALE = 2;
        private static final RoundingMode NOTIONAL_ROUND = RoundingMode.HALF_UP;

        private MarketOrderDomainService() {
        }

        /**
         * Mutates wallet, position, and order. Caller must persist changes in one
         * transaction.
         *
         * @param position empty for first BUY of a symbol; required for SELL
         */
        public static PortfolioPosition execute(
                        Order order,
                        Wallet wallet,
                        Optional<PortfolioPosition> position,
                        Stock stock) {

                BigDecimal price = stock.getCurrentPrice();
                int qty = order.getQuantity();

                if (order.getSide() == OrderSide.BUY) {
                        BigDecimal notional = price.multiply(BigDecimal.valueOf(qty)).setScale(NOTIONAL_SCALE,
                                        NOTIONAL_ROUND);
                        wallet.debit(notional);
                        PortfolioPosition p = position.orElseGet(
                                        () -> PortfolioPosition.newPosition(order.getUserId(), order.getSymbol()));
                        p.applyBuy(qty, price);
                        order.markExecuted(price);
                        return p;
                }

                PortfolioPosition p = position.orElseThrow(() -> new NoOpenPositionException(order.getSymbol()));
                p.applySell(qty);
                BigDecimal notional = price.multiply(BigDecimal.valueOf(qty)).setScale(NOTIONAL_SCALE, NOTIONAL_ROUND);
                wallet.credit(notional);
                order.markExecuted(price);
                return p;
        }
}
