package com.hms.user.UserMS.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.hms.user.UserMS.dto.Roles;
import com.hms.user.UserMS.dto.UserDto;

import reactor.core.publisher.Mono;

@Service
public class ApiService {
    private final WebClient.Builder webClientBuilder;

    public ApiService(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    public Mono<UUID> addProfile(UserDto user) {
        if (user.getRole().equals(Roles.DOCTOR)) {
            return webClientBuilder.build().post().uri("lb://ProfileMS/profile/doctor/add").bodyValue(user)
                    .retrieve().bodyToMono(UUID.class);
        } else if (user.getRole().equals(Roles.PATIENT)) {
            return webClientBuilder.build().post().uri("lb://ProfileMS/profile/patient/add").bodyValue(user)
                    .retrieve().bodyToMono(UUID.class);
        }
        return null;
    }

}
