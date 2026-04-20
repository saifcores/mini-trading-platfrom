package com.diallodev.trading.infrastructure.adapter;

import com.diallodev.trading.domain.model.User;
import com.diallodev.trading.domain.repository.UserRepository;
import com.diallodev.trading.infrastructure.entity.UserEntity;
import com.diallodev.trading.infrastructure.mapper.UserPersistenceMapper;
import com.diallodev.trading.infrastructure.repository.UserJpaRepository;
import java.time.Instant;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepository {

    private final UserJpaRepository jpa;
    private final UserPersistenceMapper mapper;

    @Override
    public User register(String email, String passwordHash) {
        UserEntity entity = UserEntity.builder()
                .email(email)
                .passwordHash(passwordHash)
                .createdAt(Instant.now())
                .build();
        return mapper.toDomain(jpa.save(entity));
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpa.findByEmail(email).map(mapper::toDomain);
    }

    @Override
    public Optional<User> findById(Long id) {
        return jpa.findById(id).map(mapper::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpa.existsByEmail(email);
    }

    public Optional<UserEntity> findEntityByEmail(String email) {
        return jpa.findByEmail(email);
    }
}
