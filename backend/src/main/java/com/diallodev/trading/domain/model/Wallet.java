package com.diallodev.trading.domain.model;

import com.diallodev.trading.common.exception.InsufficientFundsException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Wallet {

    private static final int SCALE = 2;
    private static final RoundingMode ROUND = RoundingMode.HALF_UP;

    private final Long id;
    private final Long userId;
    private BigDecimal balance;

    public static Wallet newWallet(Long userId, BigDecimal initialBalance) {
        return Wallet.builder()
                .userId(userId)
                .balance(initialBalance.setScale(SCALE, ROUND))
                .build();
    }

    public void debit(BigDecimal amount) {
        BigDecimal normalized = amount.setScale(SCALE, ROUND);
        if (balance.compareTo(normalized) < 0) {
            throw new InsufficientFundsException();
        }
        balance = balance.subtract(normalized).setScale(SCALE, ROUND);
    }

    public void credit(BigDecimal amount) {
        BigDecimal normalized = amount.setScale(SCALE, ROUND);
        balance = balance.add(normalized).setScale(SCALE, ROUND);
    }

    public boolean canAfford(BigDecimal amount) {
        return balance.compareTo(amount.setScale(SCALE, ROUND)) >= 0;
    }

    public Wallet withId(Long walletId) {
        return Wallet.builder().id(walletId).userId(userId).balance(balance).build();
    }
}
