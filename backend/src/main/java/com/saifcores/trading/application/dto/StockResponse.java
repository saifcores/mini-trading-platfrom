package com.saifcores.trading.application.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record StockResponse(
                String symbol, String name, BigDecimal price, BigDecimal changePct, Instant lastUpdated) {
}
