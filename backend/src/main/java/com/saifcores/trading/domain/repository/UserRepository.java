package com.saifcores.trading.domain.repository;

import com.saifcores.trading.domain.model.User;
import java.util.Optional;

public interface UserRepository {

    User register(String email, String passwordHash);

    Optional<User> findByEmail(String email);

    Optional<User> findById(Long id);

    boolean existsByEmail(String email);
}
