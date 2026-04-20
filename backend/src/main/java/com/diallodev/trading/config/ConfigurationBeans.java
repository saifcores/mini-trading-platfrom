package com.diallodev.trading.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({ JwtProperties.class, WalletProperties.class, MarketProperties.class })
public class ConfigurationBeans {
}
