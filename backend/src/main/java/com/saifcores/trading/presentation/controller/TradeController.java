package com.saifcores.trading.presentation.controller;

import com.saifcores.trading.application.dto.TradeRequest;
import com.saifcores.trading.application.dto.TradeResponse;
import com.saifcores.trading.application.service.TradeApplicationService;
import com.saifcores.trading.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trades")
@RequiredArgsConstructor
public class TradeController {

    private final TradeApplicationService tradeApplicationService;

    @PostMapping
    public TradeResponse place(@Valid @RequestBody TradeRequest request) {
        return tradeApplicationService.placeOrder(SecurityUtils.currentUserId(), request);
    }
}
