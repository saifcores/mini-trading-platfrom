package com.saifcores.trading.infrastructure.adapter;

import com.saifcores.trading.domain.model.Wallet;
import com.saifcores.trading.domain.repository.WalletRepository;
import com.saifcores.trading.infrastructure.entity.WalletEntity;
import com.saifcores.trading.infrastructure.mapper.WalletPersistenceMapper;
import com.saifcores.trading.infrastructure.repository.WalletJpaRepository;
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
