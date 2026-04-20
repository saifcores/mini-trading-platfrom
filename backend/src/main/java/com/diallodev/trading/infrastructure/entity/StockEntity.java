package com.diallodev.trading.infrastructure.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "stocks")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockEntity {

    @Id
    @Column(length = 16)
    private String symbol;

    @Column(nullable = false)
    private String name;

    @Column(name = "previous_price", precision = 19, scale = 8)
    private BigDecimal previousPrice;

    @Column(name = "current_price", nullable = false, precision = 19, scale = 8)
    private BigDecimal currentPrice;

    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal volatility;

    @Column(name = "last_updated", nullable = false)
    private Instant lastUpdated;
}
