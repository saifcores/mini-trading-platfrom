package com.diallodev.trading.infrastructure.adapter;

import com.diallodev.trading.domain.model.PortfolioPosition;
import com.diallodev.trading.domain.repository.PortfolioPositionRepository;
import com.diallodev.trading.infrastructure.entity.PortfolioPositionEntity;
import com.diallodev.trading.infrastructure.mapper.PortfolioPersistenceMapper;
import com.diallodev.trading.infrastructure.repository.PortfolioPositionJpaRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PortfolioPositionRepositoryAdapter implements PortfolioPositionRepository {

    private final PortfolioPositionJpaRepository jpa;
    private final PortfolioPersistenceMapper mapper;

    @Override
    public PortfolioPosition save(PortfolioPosition position) {
        PortfolioPositionEntity entity = mapper.toEntity(position);
        PortfolioPositionEntity saved = jpa.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public List<PortfolioPosition> findByUserId(Long userId) {
        return jpa.findByUserId(userId).stream().map(mapper::toDomain).toList();
    }

    @Override
    public Optional<PortfolioPosition> findByUserIdAndSymbol(Long userId, String symbol) {
        return jpa.findByUserIdAndSymbol(userId, symbol).map(mapper::toDomain);
    }

    @Override
    public Optional<PortfolioPosition> findByUserIdAndSymbolForUpdate(Long userId, String symbol) {
        return jpa.findByUserIdAndSymbolForUpdate(userId, symbol).map(mapper::toDomain);
    }

    @Override
    public void delete(PortfolioPosition position) {
        if (position.getId() != null) {
            jpa.deleteById(position.getId());
        }
    }
}
