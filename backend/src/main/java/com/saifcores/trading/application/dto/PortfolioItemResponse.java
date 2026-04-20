package com.saifcores.trading.application.dto;

import java.math.BigDecimal;

public record PortfolioItemResponse(
                String symbol,
                int quantity,
                BigDecimal averagePrice,
                BigDecimal currentPrice,
                BigDecimal marketValue,
                BigDecimal unrealizedPnl) {
}
