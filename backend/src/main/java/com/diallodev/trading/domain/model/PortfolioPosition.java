package com.diallodev.trading.domain.model;

import com.diallodev.trading.common.exception.InsufficientSharesException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PortfolioPosition {

    private static final int SCALE = 8;
    private static final RoundingMode ROUND = RoundingMode.HALF_UP;

    private final Long id;
    private final Long userId;
    private final String symbol;
    private int quantity;
    private BigDecimal averagePrice;

    public void applyBuy(int qty, BigDecimal executionPrice) {
        if (qty <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        BigDecimal price = executionPrice.setScale(SCALE, ROUND);
        BigDecimal oldCost = averagePrice.multiply(BigDecimal.valueOf(quantity));
        BigDecimal buyCost = price.multiply(BigDecimal.valueOf(qty));
        int newQty = quantity + qty;
        averagePrice = oldCost.add(buyCost).divide(BigDecimal.valueOf(newQty), SCALE, ROUND);
        quantity = newQty;
    }

    public void applySell(int qty) {
        if (qty <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        if (qty > quantity) {
            throw new InsufficientSharesException(symbol, qty, quantity);
        }
        quantity -= qty;
    }

    public boolean isClosed() {
        return quantity == 0;
    }

    public BigDecimal unrealizedPnl(BigDecimal currentPrice) {
        BigDecimal cost = averagePrice.multiply(BigDecimal.valueOf(quantity));
        BigDecimal market = currentPrice.multiply(BigDecimal.valueOf(quantity));
        return market.subtract(cost).setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal marketValue(BigDecimal currentPrice) {
        return currentPrice
                .multiply(BigDecimal.valueOf(quantity))
                .setScale(2, RoundingMode.HALF_UP);
    }

    public PortfolioPosition withId(Long positionId) {
        return PortfolioPosition.builder()
                .id(positionId)
                .userId(userId)
                .symbol(symbol)
                .quantity(quantity)
                .averagePrice(averagePrice)
                .build();
    }

    public static PortfolioPosition newPosition(Long userId, String symbol) {
        return PortfolioPosition.builder()
                .userId(userId)
                .symbol(symbol)
                .quantity(0)
                .averagePrice(BigDecimal.ZERO.setScale(SCALE, ROUND))
                .build();
    }
}
