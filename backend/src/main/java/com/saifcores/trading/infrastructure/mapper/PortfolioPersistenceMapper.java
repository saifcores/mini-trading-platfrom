package com.saifcores.trading.infrastructure.mapper;

import com.saifcores.trading.domain.model.PortfolioPosition;
import com.saifcores.trading.infrastructure.entity.PortfolioPositionEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PortfolioPersistenceMapper {

    PortfolioPosition toDomain(PortfolioPositionEntity entity);

    PortfolioPositionEntity toEntity(PortfolioPosition domain);
}
