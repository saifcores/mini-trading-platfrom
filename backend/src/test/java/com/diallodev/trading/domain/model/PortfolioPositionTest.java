package com.diallodev.trading.domain.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.diallodev.trading.common.exception.InsufficientSharesException;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class PortfolioPositionTest {

    @Test
    void buyAveragesPrice() {
        PortfolioPosition p = PortfolioPosition.newPosition(1L, "AAPL");
        p.applyBuy(10, new BigDecimal("100.00"));
        assertThat(p.getQuantity()).isEqualTo(10);
        assertThat(p.getAveragePrice()).isEqualByComparingTo("100");

        p.applyBuy(10, new BigDecimal("120.00"));
        assertThat(p.getQuantity()).isEqualTo(20);
        assertThat(p.getAveragePrice()).isEqualByComparingTo("110");
    }

    @Test
    void sellReducesQuantity() {
        PortfolioPosition p = PortfolioPosition.newPosition(1L, "AAPL");
        p.applyBuy(10, new BigDecimal("100.00"));
        p.applySell(4);
        assertThat(p.getQuantity()).isEqualTo(6);
    }

    @Test
    void sellTooManyThrows() {
        PortfolioPosition p = PortfolioPosition.newPosition(1L, "AAPL");
        p.applyBuy(2, new BigDecimal("100.00"));
        assertThatThrownBy(() -> p.applySell(3)).isInstanceOf(InsufficientSharesException.class);
    }
}
