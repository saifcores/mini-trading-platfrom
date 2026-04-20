package com.diallodev.trading.infrastructure.mapper;

import com.diallodev.trading.domain.model.Order;
import com.diallodev.trading.infrastructure.entity.OrderEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderPersistenceMapper {

    Order toDomain(OrderEntity entity);

    @Mapping(target = "id", source = "id")
    OrderEntity toEntity(Order domain);
}
