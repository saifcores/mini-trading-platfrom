package com.diallodev.trading.infrastructure.mapper;

import com.diallodev.trading.domain.model.User;
import com.diallodev.trading.infrastructure.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserPersistenceMapper {

    @Mapping(target = "email", source = "email")
    User toDomain(UserEntity entity);
}
