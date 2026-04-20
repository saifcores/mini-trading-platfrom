package com.saifcores.trading.domain.repository;

import com.saifcores.trading.domain.model.Wallet;
import java.util.Optional;

public interface WalletRepository {

    Wallet save(Wallet wallet);

    Optional<Wallet> findByUserId(Long userId);

    Optional<Wallet> findByUserIdForUpdate(Long userId);
}
