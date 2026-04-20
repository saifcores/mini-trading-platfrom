package com.diallodev.trading.domain.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Order {

    private static final int SCALE = 2;
    private static final RoundingMode ROUND = RoundingMode.HALF_UP;

    private final Long id;
    private final Long userId;
    private final String symbol;
    private final OrderSide side;
    private final int quantity;
    private OrderStatus status;
    private BigDecimal unitPrice;
    private BigDecimal totalAmount;
    private String failureReason;
    private final Instant createdAt;

    public static Order pending(Long userId, String symbol, OrderSide side, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        return Order.builder()
                .userId(userId)
                .symbol(symbol)
                .side(side)
                .quantity(quantity)
                .status(OrderStatus.PENDING)
                .createdAt(Instant.now())
                .build();
    }

    public void markExecuted(BigDecimal marketPrice) {
        this.unitPrice = marketPrice.setScale(8, RoundingMode.HALF_UP);
        this.totalAmount = marketPrice
                .multiply(BigDecimal.valueOf(quantity))
                .setScale(SCALE, ROUND);
        this.status = OrderStatus.EXECUTED;
        this.failureReason = null;
    }

    public void markFailed(String reason) {
        this.status = OrderStatus.FAILED;
        this.failureReason = reason;
        this.unitPrice = null;
        this.totalAmount = null;
    }

    public Order withId(Long orderId) {
        return Order.builder()
                .id(orderId)
                .userId(userId)
                .symbol(symbol)
                .side(side)
                .quantity(quantity)
                .status(status)
                .unitPrice(unitPrice)
                .totalAmount(totalAmount)
                .failureReason(failureReason)
                .createdAt(createdAt)
                .build();
    }
}
