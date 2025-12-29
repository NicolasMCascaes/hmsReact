package com.hms.user.UserMS.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

@Configuration
public class WebClientConfig {
    @Bean
    public WebClient.Builder getWebClientBuilder() {
        return WebClient.builder().defaultHeader("X-Secret-Key", "SECRET").filter(logRequest());
    }

    public ExchangeFilterFunction logRequest() {
        return ExchangeFilterFunction
                .ofRequestProcessor(clientRequest -> {
                    System.out
                            .println("Request: " + clientRequest.method() + " " + clientRequest.url());
                    return Mono.just(clientRequest);
                });

    }
}
