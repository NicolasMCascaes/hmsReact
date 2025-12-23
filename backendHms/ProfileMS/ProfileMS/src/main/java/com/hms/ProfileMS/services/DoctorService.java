package com.hms.ProfileMS.services;

import java.util.UUID;

import com.hms.ProfileMS.dto.DoctorDto;
import com.hms.ProfileMS.exception.HmsException;

public interface DoctorService {
    public UUID addDoctor(DoctorDto doctor) throws HmsException;

    public DoctorDto getDoctorById(UUID id) throws HmsException;
}
