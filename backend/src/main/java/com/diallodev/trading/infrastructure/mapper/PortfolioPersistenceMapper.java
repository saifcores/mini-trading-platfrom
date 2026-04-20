package com.diallodev.trading.infrastructure.mapper;

import com.diallodev.trading.domain.model.PortfolioPosition;
import com.diallodev.trading.infrastructure.entity.PortfolioPositionEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PortfolioPersistenceMapper {

    PortfolioPosition toDomain(PortfolioPositionEntity entity);

    PortfolioPositionEntity toEntity(PortfolioPosition domain);
}
