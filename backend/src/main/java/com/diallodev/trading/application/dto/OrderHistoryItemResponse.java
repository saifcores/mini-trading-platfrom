package com.diallodev.trading.application.dto;

import com.diallodev.trading.domain.model.OrderSide;
import com.diallodev.trading.domain.model.OrderStatus;
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
