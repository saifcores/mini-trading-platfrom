package com.saifcores.trading.infrastructure.mapper;

import com.saifcores.trading.domain.model.Order;
import com.saifcores.trading.infrastructure.entity.OrderEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderPersistenceMapper {

    Order toDomain(OrderEntity entity);

    @Mapping(target = "id", source = "id")
    OrderEntity toEntity(Order domain);
}
