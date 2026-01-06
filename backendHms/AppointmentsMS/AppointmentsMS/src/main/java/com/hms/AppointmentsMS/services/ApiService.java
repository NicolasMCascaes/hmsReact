package com.hms.AppointmentsMS.services;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.hms.AppointmentsMS.dto.DoctorDto;
import com.hms.AppointmentsMS.dto.PatientDto;

import reactor.core.publisher.Mono;

@Service
public class ApiService {
    private final WebClient.Builder webClientBuilder;

    public ApiService(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    public Mono<Boolean> doctorExists(UUID id) {

        return webClientBuilder.build().get().uri("http://localhost:8081/profile/doctor/exists/" + id)
                .retrieve().bodyToMono(Boolean.class);
    }

    public Mono<Boolean> patientExists(UUID id) {
        return webClientBuilder.build().get().uri("http://localhost:8081/profile/patient/exists/" + id)
                .retrieve().bodyToMono(Boolean.class);
    }
    public Mono<PatientDto> getPatient(UUID id) {
        return webClientBuilder.build().get().uri("http://localhost:8081/profile/patient/get/" + id)
                .retrieve().bodyToMono(PatientDto.class);
    }
    public Mono<DoctorDto> getDoctor(UUID id) {
        return webClientBuilder.build().get().uri("http://localhost:8081/profile/doctor/get/" + id)
                .retrieve().bodyToMono(DoctorDto.class);
    }
}