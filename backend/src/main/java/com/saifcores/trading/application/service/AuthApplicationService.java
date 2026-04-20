package com.saifcores.trading.application.service;

import com.saifcores.trading.application.dto.AuthResponse;
import com.saifcores.trading.application.dto.LoginRequest;
import com.saifcores.trading.application.dto.RegisterRequest;
import com.saifcores.trading.common.exception.DuplicateUserException;
import com.saifcores.trading.config.JwtProperties;
import com.saifcores.trading.config.WalletProperties;
import com.saifcores.trading.domain.model.User;
import com.saifcores.trading.domain.model.Wallet;
import com.saifcores.trading.domain.repository.UserRepository;
import com.saifcores.trading.domain.repository.WalletRepository;
import com.saifcores.trading.security.JwtTokenProvider;
import com.saifcores.trading.security.UserPrincipal;
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
