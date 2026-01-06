package com.hms.user.UserMS.clients;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.hms.user.UserMS.dto.UserDto;

@FeignClient(name = "ProfileMS")
public interface ProfileClient {
    @PostMapping("/profile/patient/add")
    UUID addPatientProfile(@RequestBody UserDto dto);

    @PostMapping("/profile/doctor/add")
    UUID addDoctorProfile(@RequestBody UserDto dto);
}
