package com.hms.ProfileMS.services;

import java.util.UUID;

import com.hms.ProfileMS.dto.DoctorDto;
import com.hms.ProfileMS.exception.HmsException;

public interface DoctorService {
    public UUID addDoctor(DoctorDto doctor) throws HmsException;

    public DoctorDto getDoctorById(UUID id) throws HmsException;

    public DoctorDto updateDoctor(DoctorDto doctor) throws HmsException;

    public Boolean doctorExists(UUID id) throws HmsException;
}
