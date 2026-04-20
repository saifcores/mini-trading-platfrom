package com.saifcores.trading.presentation.controller;

import com.saifcores.trading.application.dto.OrderHistoryItemResponse;
import com.saifcores.trading.application.service.OrderQueryApplicationService;
import com.saifcores.trading.security.SecurityUtils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderQueryApplicationService orderQueryApplicationService;

    @GetMapping
    public List<OrderHistoryItemResponse> listOrders() {
        return orderQueryApplicationService.listOrders(SecurityUtils.currentUserId());
    }
}
