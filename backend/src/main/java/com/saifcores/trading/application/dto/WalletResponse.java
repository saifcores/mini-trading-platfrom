package com.saifcores.trading.application.dto;

import java.math.BigDecimal;

public record WalletResponse(Long walletId, BigDecimal balance) {
}
