package com.saifcores.trading.application.service;

import com.saifcores.trading.application.dto.OrderHistoryItemResponse;
import com.saifcores.trading.application.mapper.ApiDtoMapper;
import com.saifcores.trading.domain.repository.OrderRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderQueryApplicationService {

    private final OrderRepository orderRepository;
    private final ApiDtoMapper apiDtoMapper;

    @Transactional(readOnly = true)
    public List<OrderHistoryItemResponse> listOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(apiDtoMapper::toOrderHistory)
                .toList();
    }
}
