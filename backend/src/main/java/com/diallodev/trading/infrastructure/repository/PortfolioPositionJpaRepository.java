package com.diallodev.trading.infrastructure.repository;

import com.diallodev.trading.infrastructure.entity.PortfolioPositionEntity;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PortfolioPositionJpaRepository extends JpaRepository<PortfolioPositionEntity, Long> {

    List<PortfolioPositionEntity> findByUserId(Long userId);

    Optional<PortfolioPositionEntity> findByUserIdAndSymbol(Long userId, String symbol);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM PortfolioPositionEntity p WHERE p.userId = :userId AND p.symbol = :symbol")
    Optional<PortfolioPositionEntity> findByUserIdAndSymbolForUpdate(
            @Param("userId") Long userId, @Param("symbol") String symbol);
}
