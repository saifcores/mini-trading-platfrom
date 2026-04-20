package com.diallodev.trading.infrastructure.repository;

import com.diallodev.trading.infrastructure.entity.StockEntity;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StockJpaRepository extends JpaRepository<StockEntity, String> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM StockEntity s WHERE s.symbol = :symbol")
    Optional<StockEntity> findBySymbolForUpdate(@Param("symbol") String symbol);

    List<StockEntity> findAllByOrderBySymbolAsc();
}
