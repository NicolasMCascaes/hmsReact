package com.hms.ProfileMS.services;

import java.util.UUID;

import com.hms.ProfileMS.dto.PatientDto;
import com.hms.ProfileMS.exception.HmsException;

public interface PatientService {
    public UUID addPatient(PatientDto patient) throws HmsException;

    public PatientDto getPatientById(UUID id) throws HmsException;

}
