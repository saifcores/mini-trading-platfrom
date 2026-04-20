package com.saifcores.trading.application.dto;

import com.saifcores.trading.domain.model.OrderSide;
import com.saifcores.trading.domain.model.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;

public record OrderHistoryItemResponse(
                Long id,
                Instant createdAt,
                String symbol,
                OrderSide side,
                OrderStatus status,
                int quantity,
                BigDecimal totalAmount) {
}
