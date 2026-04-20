package com.diallodev.trading.presentation.controller;

import com.diallodev.trading.application.dto.WalletResponse;
import com.diallodev.trading.application.service.WalletApplicationService;
import com.diallodev.trading.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletApplicationService walletApplicationService;

    @GetMapping
    public WalletResponse getWallet() {
        return walletApplicationService.getWallet(SecurityUtils.currentUserId());
    }
}
