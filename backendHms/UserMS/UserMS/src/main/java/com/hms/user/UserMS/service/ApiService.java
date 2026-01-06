package com.hms.user.UserMS.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.hms.user.UserMS.clients.ProfileClient;
import com.hms.user.UserMS.dto.Roles;
import com.hms.user.UserMS.dto.UserDto;

@Service
public class ApiService {
    private final ProfileClient profileClient;

    public ApiService(ProfileClient profileClient) {
        this.profileClient = profileClient;
    }

    protected UUID addProfile(UserDto dto) {
        if (dto.getRole().equals(Roles.PATIENT)) {
            return profileClient.addPatientProfile(dto);
        } else if (dto.getRole().equals(Roles.DOCTOR)) {
            return profileClient.addDoctorProfile(dto);
        }
        return null;
    }

}
