package com.diallodev.trading.common.exception;

public class InsufficientSharesException extends BusinessException {

    public InsufficientSharesException(String symbol, int requested, int available) {
        super(
                "INSUFFICIENT_SHARES",
                "Not enough shares of %s: requested %d, available %d".formatted(symbol, requested, available));
    }
}
