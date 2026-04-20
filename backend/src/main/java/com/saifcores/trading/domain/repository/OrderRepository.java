package com.saifcores.trading.domain.repository;

import com.saifcores.trading.domain.model.Order;
import java.util.List;

public interface OrderRepository {

    Order save(Order order);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
