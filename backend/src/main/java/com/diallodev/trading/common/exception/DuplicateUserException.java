package com.diallodev.trading.common.exception;

public class DuplicateUserException extends BusinessException {

    public DuplicateUserException(String email) {
        super("EMAIL_IN_USE", "Email already registered: " + email);
    }
}
