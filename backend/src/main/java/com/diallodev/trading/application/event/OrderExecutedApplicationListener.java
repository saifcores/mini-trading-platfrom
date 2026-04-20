package com.diallodev.trading.application.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderExecutedApplicationListener {

    @Async
    @EventListener
    public void onOrderExecuted(OrderExecutedEvent event) {
        log.info(
                "ORDER_EXECUTED orderId={} userId={} symbol={} total={} unitPrice={}",
                event.orderId(),
                event.userId(),
                event.symbol(),
                event.totalAmount(),
                event.unitPrice());
    }
}
