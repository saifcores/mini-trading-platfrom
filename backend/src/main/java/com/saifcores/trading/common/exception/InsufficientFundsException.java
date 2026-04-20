package com.saifcores.trading.common.exception;

public class InsufficientFundsException extends BusinessException {

    public InsufficientFundsException() {
        super("INSUFFICIENT_FUNDS", "Insufficient wallet balance for this order");
    }
}
