package com.saifcores.trading.application.dto;

import com.saifcores.trading.domain.model.OrderSide;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TradeRequest(
                @NotBlank @Size(min = 1, max = 16) String symbol,
                @NotNull OrderSide side,
                @NotNull @Min(1) Integer quantity) {
}
