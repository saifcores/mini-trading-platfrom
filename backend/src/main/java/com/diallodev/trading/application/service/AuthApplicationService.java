package com.diallodev.trading.application.service;

import com.diallodev.trading.application.dto.AuthResponse;
import com.diallodev.trading.application.dto.LoginRequest;
import com.diallodev.trading.application.dto.RegisterRequest;
import com.diallodev.trading.common.exception.DuplicateUserException;
import com.diallodev.trading.config.JwtProperties;
import com.diallodev.trading.config.WalletProperties;
import com.diallodev.trading.domain.model.User;
import com.diallodev.trading.domain.model.Wallet;
import com.diallodev.trading.domain.repository.UserRepository;
import com.diallodev.trading.domain.repository.WalletRepository;
import com.diallodev.trading.security.JwtTokenProvider;
import com.diallodev.trading.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthApplicationService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtProperties jwtProperties;
    private final WalletProperties walletProperties;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateUserException(request.email());
        }
        String hash = passwordEncoder.encode(request.password());
        User user = userRepository.register(request.email(), hash);
        Wallet wallet = Wallet.newWallet(user.getId(), walletProperties.getInitialBalance());
        walletRepository.save(wallet);
        log.info("Registered user id={} email={}", user.getId(), user.getEmail());
        return buildAuthResponse(user.getId(), user.getEmail());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return buildAuthResponse(principal.getId(), principal.getEmail());
    }

    private AuthResponse buildAuthResponse(Long userId, String email) {
        String token = jwtTokenProvider.createAccessToken(userId, email);
        return new AuthResponse(token, "Bearer", jwtProperties.getExpirationMs(), userId, email);
    }
}
