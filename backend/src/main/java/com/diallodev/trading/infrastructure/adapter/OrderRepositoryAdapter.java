package com.diallodev.trading.infrastructure.adapter;

import com.diallodev.trading.domain.model.Order;
import com.diallodev.trading.domain.repository.OrderRepository;
import com.diallodev.trading.infrastructure.entity.OrderEntity;
import com.diallodev.trading.infrastructure.mapper.OrderPersistenceMapper;
import com.diallodev.trading.infrastructure.repository.OrderJpaRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class OrderRepositoryAdapter implements OrderRepository {

    private final OrderJpaRepository jpa;
    private final OrderPersistenceMapper mapper;

    @Override
    public Order save(Order order) {
        OrderEntity entity = mapper.toEntity(order);
        OrderEntity saved = jpa.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public List<Order> findByUserIdOrderByCreatedAtDesc(Long userId) {
        return jpa.findByUserIdOrderByCreatedAtDesc(userId).stream().map(mapper::toDomain).toList();
    }
}
