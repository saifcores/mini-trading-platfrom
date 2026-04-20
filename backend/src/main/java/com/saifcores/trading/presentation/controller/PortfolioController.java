package com.saifcores.trading.presentation.controller;

import com.saifcores.trading.application.dto.PortfolioItemResponse;
import com.saifcores.trading.application.service.PortfolioApplicationService;
import com.saifcores.trading.security.SecurityUtils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioApplicationService portfolioApplicationService;

    @GetMapping
    public List<PortfolioItemResponse> getPortfolio() {
        return portfolioApplicationService.getPortfolio(SecurityUtils.currentUserId());
    }
}
