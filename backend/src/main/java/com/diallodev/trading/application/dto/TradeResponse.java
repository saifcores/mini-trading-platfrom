package com.diallodev.trading.application.dto;

import com.diallodev.trading.domain.model.OrderSide;
import com.diallodev.trading.domain.model.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;

public record TradeResponse(
                Long orderId,
                String symbol,
                OrderSide side,
                int quantity,
                OrderStatus status,
                BigDecimal unitPrice,
                BigDecimal totalAmount,
                String failureReason,
                Instant createdAt) {
}
