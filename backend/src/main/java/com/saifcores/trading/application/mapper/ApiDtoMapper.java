package com.saifcores.trading.application.mapper;

import com.saifcores.trading.application.dto.OrderHistoryItemResponse;
import com.saifcores.trading.application.dto.PortfolioItemResponse;
import com.saifcores.trading.application.dto.StockResponse;
import com.saifcores.trading.application.dto.TradeResponse;
import com.saifcores.trading.application.dto.WalletResponse;
import com.saifcores.trading.domain.model.Order;
import com.saifcores.trading.domain.model.PortfolioPosition;
import com.saifcores.trading.domain.model.Stock;
import com.saifcores.trading.domain.model.Wallet;
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
