package com.saifcores.trading.config;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.wallet")
public class WalletProperties {

    private BigDecimal initialBalance;
}
