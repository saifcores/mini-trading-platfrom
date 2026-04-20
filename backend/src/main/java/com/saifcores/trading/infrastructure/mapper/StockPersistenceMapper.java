package com.saifcores.trading.infrastructure.mapper;

import com.saifcores.trading.domain.model.Stock;
import com.saifcores.trading.infrastructure.entity.StockEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StockPersistenceMapper {

    Stock toDomain(StockEntity entity);

    StockEntity toEntity(Stock domain);
}
