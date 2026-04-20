package com.diallodev.trading.application.event;

import com.diallodev.trading.domain.model.Order;
import java.math.BigDecimal;

public record OrderExecutedEvent(
        Long orderId, Long userId, String symbol, BigDecimal totalAmount, BigDecimal unitPrice) {

    public static OrderExecutedEvent from(Order order) {
        return new OrderExecutedEvent(
                order.getId(),
                order.getUserId(),
                order.getSymbol(),
                order.getTotalAmount(),
                order.getUnitPrice());
    }
}
