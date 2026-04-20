package com.diallodev.trading.domain.repository;

import com.diallodev.trading.domain.model.Order;
import java.util.List;

public interface OrderRepository {

    Order save(Order order);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
