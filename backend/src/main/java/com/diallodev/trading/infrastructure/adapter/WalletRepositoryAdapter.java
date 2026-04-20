package com.diallodev.trading.infrastructure.adapter;

import com.diallodev.trading.domain.model.Wallet;
import com.diallodev.trading.domain.repository.WalletRepository;
import com.diallodev.trading.infrastructure.entity.WalletEntity;
import com.diallodev.trading.infrastructure.mapper.WalletPersistenceMapper;
import com.diallodev.trading.infrastructure.repository.WalletJpaRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class WalletRepositoryAdapter implements WalletRepository {

    private final WalletJpaRepository jpa;
    private final WalletPersistenceMapper mapper;

    @Override
    public Wallet save(Wallet wallet) {
        WalletEntity entity = mapper.toEntity(wallet);
        WalletEntity saved = jpa.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Wallet> findByUserId(Long userId) {
        return jpa.findByUserId(userId).map(mapper::toDomain);
    }

    @Override
    public Optional<Wallet> findByUserIdForUpdate(Long userId) {
        return jpa.findByUserIdForUpdate(userId).map(mapper::toDomain);
    }
}
