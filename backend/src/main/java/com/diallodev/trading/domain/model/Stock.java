package com.diallodev.trading.domain.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Stock {

    private final String symbol;
    private final String name;
    private BigDecimal previousPrice;
    private BigDecimal currentPrice;
    private final BigDecimal volatility;
    private Instant lastUpdated;

    public void applySimulatedMove(BigDecimal newPrice, Instant updatedAt) {
        this.previousPrice = this.currentPrice;
        this.currentPrice = newPrice.setScale(4, RoundingMode.HALF_UP);
        this.lastUpdated = updatedAt;
    }

    public BigDecimal changePercent() {
        if (previousPrice == null || previousPrice.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        return currentPrice
                .subtract(previousPrice)
                .divide(previousPrice, 6, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
    }
}
