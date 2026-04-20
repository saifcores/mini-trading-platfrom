package com.saifcores.trading.domain.model;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class User {

    private final Long id;
    private final String email;

    public static User register(String email) {
        return User.builder().email(email).build();
    }

    public User withId(Long id) {
        return User.builder().id(id).email(this.email).build();
    }
}
