package com.saifcores.trading.domain.repository;

import com.saifcores.trading.domain.model.Stock;
import java.util.List;
import java.util.Optional;

public interface StockRepository {

    List<Stock> findAll();

    Optional<Stock> findBySymbol(String symbol);

    Optional<Stock> findBySymbolForUpdate(String symbol);

    Stock save(Stock stock);
}
