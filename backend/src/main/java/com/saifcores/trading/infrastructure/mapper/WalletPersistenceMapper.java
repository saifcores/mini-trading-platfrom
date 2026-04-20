package com.saifcores.trading.infrastructure.mapper;

import com.saifcores.trading.domain.model.Wallet;
import com.saifcores.trading.infrastructure.entity.WalletEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface WalletPersistenceMapper {

    Wallet toDomain(WalletEntity entity);

    @Mapping(target = "version", ignore = true)
    WalletEntity toEntity(Wallet domain);
}
