package com.saifcores.trading.application.service;

import com.saifcores.trading.application.dto.StockResponse;
import com.saifcores.trading.application.mapper.ApiDtoMapper;
import com.saifcores.trading.domain.repository.StockRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MarketApplicationService {

    private final StockRepository stockRepository;
    private final ApiDtoMapper apiDtoMapper;

    @Transactional(readOnly = true)
    public List<StockResponse> listStocks() {
        return stockRepository.findAll().stream().map(apiDtoMapper::toStockResponse).toList();
    }
}
