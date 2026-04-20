package com.saifcores.trading.presentation.controller;

import com.saifcores.trading.application.dto.StockResponse;
import com.saifcores.trading.application.service.MarketApplicationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
public class MarketController {

    private final MarketApplicationService marketApplicationService;

    @GetMapping("/stocks")
    public List<StockResponse> listStocks() {
        return marketApplicationService.listStocks();
    }
}
