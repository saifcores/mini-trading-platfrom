package com.diallodev.trading.infrastructure.market;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.concurrent.ThreadLocalRandom;

public final class MarketPriceSimulator {

    private static final RoundingMode ROUND = RoundingMode.HALF_UP;

    private MarketPriceSimulator() {
    }

    /**
     * Random walk with volatility scaling. Ensures price stays positive.
     */
    public static BigDecimal nextPrice(BigDecimal current, BigDecimal volatility, double randomFactor) {
        double u = ThreadLocalRandom.current().nextDouble(-1.0, 1.0);
        BigDecimal delta = current
                .multiply(volatility)
                .multiply(BigDecimal.valueOf(u * randomFactor))
                .setScale(8, ROUND);
        BigDecimal next = current.add(delta).setScale(8, ROUND);
        BigDecimal min = new BigDecimal("0.01");
        if (next.compareTo(min) < 0) {
            return min;
        }
        return next;
    }
}
