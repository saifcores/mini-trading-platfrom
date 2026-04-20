package com.saifcores.trading.domain.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.saifcores.trading.common.exception.InsufficientFundsException;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class WalletTest {

    @Test
    void debitReducesBalance() {
        Wallet w = Wallet.newWallet(1L, new BigDecimal("10000.00"));
        w.debit(new BigDecimal("2500.50"));
        assertThat(w.getBalance()).isEqualByComparingTo("7499.50");
    }

    @Test
    void debitInsufficientThrows() {
        Wallet w = Wallet.newWallet(1L, new BigDecimal("100.00"));
        assertThatThrownBy(() -> w.debit(new BigDecimal("100.01")))
                .isInstanceOf(InsufficientFundsException.class);
    }

    @Test
    void creditIncreasesBalance() {
        Wallet w = Wallet.newWallet(1L, new BigDecimal("100.00"));
        w.credit(new BigDecimal("50.25"));
        assertThat(w.getBalance()).isEqualByComparingTo("150.25");
    }
}
