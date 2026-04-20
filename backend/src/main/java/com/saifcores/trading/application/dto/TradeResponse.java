package com.saifcores.trading.application.dto;

import com.saifcores.trading.domain.model.OrderSide;
import com.saifcores.trading.domain.model.OrderStatus;
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
