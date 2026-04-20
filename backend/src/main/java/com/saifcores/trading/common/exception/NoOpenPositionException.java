package com.saifcores.trading.common.exception;

public class NoOpenPositionException extends BusinessException {

    public NoOpenPositionException(String symbol) {
        super("NO_POSITION", "No open position for " + symbol);
    }
}
