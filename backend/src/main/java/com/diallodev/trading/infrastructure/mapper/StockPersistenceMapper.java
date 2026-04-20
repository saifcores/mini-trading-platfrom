package com.diallodev.trading.infrastructure.mapper;

import com.diallodev.trading.domain.model.Stock;
import com.diallodev.trading.infrastructure.entity.StockEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StockPersistenceMapper {

    Stock toDomain(StockEntity entity);

    StockEntity toEntity(Stock domain);
}
