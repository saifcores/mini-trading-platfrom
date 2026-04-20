package com.diallodev.trading.application.service;

import com.diallodev.trading.application.dto.WalletResponse;
import com.diallodev.trading.application.mapper.ApiDtoMapper;
import com.diallodev.trading.common.exception.ResourceNotFoundException;
import com.diallodev.trading.domain.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WalletApplicationService {

    private final WalletRepository walletRepository;
    private final ApiDtoMapper apiDtoMapper;

    @Transactional(readOnly = true)
    public WalletResponse getWallet(Long userId) {
        return walletRepository
                .findByUserId(userId)
                .map(apiDtoMapper::toWalletResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet", String.valueOf(userId)));
    }
}
