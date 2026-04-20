package com.saifcores.trading.infrastructure.adapter;

import com.saifcores.trading.domain.model.User;
import com.saifcores.trading.domain.repository.UserRepository;
import com.saifcores.trading.infrastructure.entity.UserEntity;
import com.saifcores.trading.infrastructure.mapper.UserPersistenceMapper;
import com.saifcores.trading.infrastructure.repository.UserJpaRepository;
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
