package com.saifcores.trading.application.service;

import com.saifcores.trading.application.dto.PortfolioItemResponse;
import com.saifcores.trading.application.mapper.ApiDtoMapper;
import com.saifcores.trading.domain.model.PortfolioPosition;
import com.saifcores.trading.domain.model.Stock;
import com.saifcores.trading.domain.repository.PortfolioPositionRepository;
import com.saifcores.trading.domain.repository.StockRepository;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PortfolioApplicationService {

    private final PortfolioPositionRepository portfolioPositionRepository;
    private final StockRepository stockRepository;
    private final ApiDtoMapper apiDtoMapper;

    @Transactional(readOnly = true)
    public List<PortfolioItemResponse> getPortfolio(Long userId) {
        List<PortfolioPosition> positions = portfolioPositionRepository.findByUserId(userId);
        return positions.stream()
                .map(
                        p -> {
                            BigDecimal price = stockRepository
                                    .findBySymbol(p.getSymbol())
                                    .map(Stock::getCurrentPrice)
                                    .orElse(BigDecimal.ZERO);
                            return apiDtoMapper.toPortfolioItem(p, price);
                        })
                .toList();
    }
}
