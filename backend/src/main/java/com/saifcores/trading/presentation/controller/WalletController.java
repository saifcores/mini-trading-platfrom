package com.saifcores.trading.presentation.controller;

import com.saifcores.trading.application.dto.WalletResponse;
import com.saifcores.trading.application.service.WalletApplicationService;
import com.saifcores.trading.security.SecurityUtils;
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
