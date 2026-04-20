package com.diallodev.trading.infrastructure.adapter;

import com.diallodev.trading.domain.model.Stock;
import com.diallodev.trading.domain.repository.StockRepository;
import com.diallodev.trading.infrastructure.entity.StockEntity;
import com.diallodev.trading.infrastructure.mapper.StockPersistenceMapper;
import com.diallodev.trading.infrastructure.repository.StockJpaRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class StockRepositoryAdapter implements StockRepository {

    private final StockJpaRepository jpa;
    private final StockPersistenceMapper mapper;

    @Override
    public List<Stock> findAll() {
        return jpa.findAllByOrderBySymbolAsc().stream().map(mapper::toDomain).toList();
    }

    @Override
    public Optional<Stock> findBySymbol(String symbol) {
        return jpa.findById(symbol).map(mapper::toDomain);
    }

    @Override
    public Optional<Stock> findBySymbolForUpdate(String symbol) {
        return jpa.findBySymbolForUpdate(symbol).map(mapper::toDomain);
    }

    @Override
    public Stock save(Stock stock) {
        StockEntity entity = mapper.toEntity(stock);
        return mapper.toDomain(jpa.save(entity));
    }
}
