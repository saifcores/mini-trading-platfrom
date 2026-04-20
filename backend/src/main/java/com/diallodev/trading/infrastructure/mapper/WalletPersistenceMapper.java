package com.diallodev.trading.infrastructure.mapper;

import com.diallodev.trading.domain.model.Wallet;
import com.diallodev.trading.infrastructure.entity.WalletEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface WalletPersistenceMapper {

    Wallet toDomain(WalletEntity entity);

    @Mapping(target = "version", ignore = true)
    WalletEntity toEntity(Wallet domain);
}
