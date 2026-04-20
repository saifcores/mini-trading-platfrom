package com.saifcores.trading.infrastructure.market;

import com.saifcores.trading.config.MarketProperties;
import com.saifcores.trading.domain.model.Stock;
import com.saifcores.trading.infrastructure.entity.StockEntity;
import com.saifcores.trading.infrastructure.mapper.StockPersistenceMapper;
import com.saifcores.trading.infrastructure.repository.StockJpaRepository;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("!test")
@RequiredArgsConstructor
@Slf4j
public class MarketPriceTicker {

    private final StockJpaRepository stockJpaRepository;
    private final StockPersistenceMapper stockMapper;
    private final MarketProperties marketProperties;
    private final SimpMessagingTemplate messagingTemplate;

    @Scheduled(fixedRateString = "${app.market.tick-interval-ms:5000}")
    @Transactional
    public void tick() {
        List<StockEntity> entities = stockJpaRepository.findAllByOrderBySymbolAsc();
        if (entities.isEmpty()) {
            return;
        }
        Instant now = Instant.now();
        Map<String, Object> payload = new HashMap<>();
        for (StockEntity entity : entities) {
            Stock domain = stockMapper.toDomain(entity);
            var next = MarketPriceSimulator.nextPrice(
                    domain.getCurrentPrice(),
                    domain.getVolatility(),
                    marketProperties.getPriceRandomFactor());
            domain.applySimulatedMove(next, now);
            stockJpaRepository.save(stockMapper.toEntity(domain));
            payload.put(
                    domain.getSymbol(),
                    Map.of(
                            "symbol", domain.getSymbol(),
                            "price", domain.getCurrentPrice(),
                            "changePct", domain.changePercent()));
        }
        messagingTemplate.convertAndSend("/topic/prices", payload);
    }
}
