package com.saifcores.trading.common.exception;

import lombok.Getter;

@Getter
public class ResourceNotFoundException extends RuntimeException {

    private final String code;

    public ResourceNotFoundException(String resource, String id) {
        super("%s not found: %s".formatted(resource, id));
        this.code = "NOT_FOUND";
    }
}
