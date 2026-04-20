package com.diallodev.trading.application.dto;

public record AuthResponse(
                String accessToken,
                String tokenType,
                long expiresInMs,
                Long userId,
                String email) {
}
