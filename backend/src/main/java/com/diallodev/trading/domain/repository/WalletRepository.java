package com.diallodev.trading.domain.repository;

import com.diallodev.trading.domain.model.Wallet;
import java.util.Optional;

public interface WalletRepository {

    Wallet save(Wallet wallet);

    Optional<Wallet> findByUserId(Long userId);

    Optional<Wallet> findByUserIdForUpdate(Long userId);
}
