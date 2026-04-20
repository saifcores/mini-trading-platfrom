package com.diallodev.trading.infrastructure.repository;

import com.diallodev.trading.infrastructure.entity.WalletEntity;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WalletJpaRepository extends JpaRepository<WalletEntity, Long> {

    Optional<WalletEntity> findByUserId(Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT w FROM WalletEntity w WHERE w.userId = :userId")
    Optional<WalletEntity> findByUserIdForUpdate(@Param("userId") Long userId);
}
