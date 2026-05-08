package com.hms.VideoCallMS.client;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.hms.VideoCallMS.dto.DoctorDto;
import com.hms.VideoCallMS.dto.PatientDto;

@FeignClient(name = "ProfileMS")
public interface ProfileClient {
    @GetMapping("/profile/doctor/exists/{id}")
    Boolean doctorExists(@PathVariable UUID id);

    @GetMapping("/profile/patient/exists/{id}")
    Boolean patientExists(@PathVariable UUID id);

    @GetMapping("/profile/patient/get/{id}")
    PatientDto getPatient(@PathVariable UUID id);

    @GetMapping("/profile/doctor/get/{id}")
    DoctorDto getDoctor(@PathVariable UUID id);
}
