package com.diallodev.trading.domain.repository;

import com.diallodev.trading.domain.model.PortfolioPosition;
import java.util.List;
import java.util.Optional;

public interface PortfolioPositionRepository {

    PortfolioPosition save(PortfolioPosition position);

    List<PortfolioPosition> findByUserId(Long userId);

    Optional<PortfolioPosition> findByUserIdAndSymbol(Long userId, String symbol);

    Optional<PortfolioPosition> findByUserIdAndSymbolForUpdate(Long userId, String symbol);

    void delete(PortfolioPosition position);
}
