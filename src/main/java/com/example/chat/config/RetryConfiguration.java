package com.example.chat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.retry.backoff.ExponentialBackOffPolicy;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.support.RetryTemplate;

@Configuration
@EnableRetry
public class RetryConfiguration {

    @Bean
    public RetryTemplate retryTemplate() {
        RetryTemplate tpl = new RetryTemplate();

        ExponentialBackOffPolicy backOff = new ExponentialBackOffPolicy();
        backOff.setInitialInterval(100);  // 100ms
        backOff.setMultiplier(2.0);       // 2x
        backOff.setMaxInterval(2000);     // <= 2s
        tpl.setBackOffPolicy(backOff);

        SimpleRetryPolicy policy = new SimpleRetryPolicy(3);
        tpl.setRetryPolicy(policy);

        return tpl;
    }
}
