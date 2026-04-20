package com.diallodev.trading.infrastructure.bootstrap;

import com.diallodev.trading.infrastructure.entity.StockEntity;
import com.diallodev.trading.infrastructure.repository.StockJpaRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class StockDataLoader implements ApplicationRunner {

    private final StockJpaRepository stockJpaRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (stockJpaRepository.count() > 0) {
            return;
        }
        Instant now = Instant.now();
        List<StockEntity> seed = List.of(
                stock("AAPL", "Apple Inc.", "189.42", "0.018", now),
                stock("TSLA", "Tesla Inc.", "248.91", "0.025", now),
                stock("NVDA", "NVIDIA Corp.", "892.15", "0.022", now),
                stock("MSFT", "Microsoft Corp.", "415.22", "0.015", now),
                stock("GOOGL", "Alphabet Inc.", "168.30", "0.016", now),
                stock("AMZN", "Amazon.com Inc.", "182.44", "0.019", now),
                stock("META", "Meta Platforms Inc.", "501.18", "0.021", now),
                stock("COIN", "Coinbase Global Inc.", "256.70", "0.030", now));
        stockJpaRepository.saveAll(seed);
        log.info("Seeded {} stocks", seed.size());
    }

    private static StockEntity stock(String sym, String name, String price, String vol, Instant now) {
        BigDecimal p = new BigDecimal(price);
        return StockEntity.builder()
                .symbol(sym)
                .name(name)
                .previousPrice(p)
                .currentPrice(p)
                .volatility(new BigDecimal(vol))
                .lastUpdated(now)
                .build();
    }
}
