package com.diallodev.trading.application.mapper;

import com.diallodev.trading.application.dto.OrderHistoryItemResponse;
import com.diallodev.trading.application.dto.PortfolioItemResponse;
import com.diallodev.trading.application.dto.StockResponse;
import com.diallodev.trading.application.dto.TradeResponse;
import com.diallodev.trading.application.dto.WalletResponse;
import com.diallodev.trading.domain.model.Order;
import com.diallodev.trading.domain.model.PortfolioPosition;
import com.diallodev.trading.domain.model.Stock;
import com.diallodev.trading.domain.model.Wallet;
import java.math.BigDecimal;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ApiDtoMapper {

    @Mapping(target = "orderId", source = "id")
    TradeResponse toTradeResponse(Order order);

    @Mapping(target = "id", source = "id")
    OrderHistoryItemResponse toOrderHistory(Order order);

    @Mapping(target = "walletId", source = "id")
    WalletResponse toWalletResponse(Wallet wallet);

    @Mapping(target = "price", source = "currentPrice")
    @Mapping(target = "changePct", expression = "java(stock.changePercent())")
    StockResponse toStockResponse(Stock stock);

    default PortfolioItemResponse toPortfolioItem(PortfolioPosition position, BigDecimal currentPrice) {
        return new PortfolioItemResponse(
                position.getSymbol(),
                position.getQuantity(),
                position.getAveragePrice(),
                currentPrice,
                position.marketValue(currentPrice),
                position.unrealizedPnl(currentPrice));
    }
}
