package com.saifcores.trading.infrastructure.adapter;

import com.saifcores.trading.domain.model.Order;
import com.saifcores.trading.domain.repository.OrderRepository;
import com.saifcores.trading.infrastructure.entity.OrderEntity;
import com.saifcores.trading.infrastructure.mapper.OrderPersistenceMapper;
import com.saifcores.trading.infrastructure.repository.OrderJpaRepository;
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
