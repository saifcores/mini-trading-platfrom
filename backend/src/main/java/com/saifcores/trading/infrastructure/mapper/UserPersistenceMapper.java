package com.saifcores.trading.infrastructure.mapper;

import com.saifcores.trading.domain.model.User;
import com.saifcores.trading.infrastructure.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserPersistenceMapper {

    @Mapping(target = "email", source = "email")
    User toDomain(UserEntity entity);
}
