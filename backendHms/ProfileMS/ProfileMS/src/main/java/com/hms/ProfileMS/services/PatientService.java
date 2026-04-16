package com.hms.ProfileMS.services;

import java.util.List;
import java.util.UUID;

import com.hms.ProfileMS.dto.PatientDropdown;
import com.hms.ProfileMS.dto.PatientDto;
import com.hms.ProfileMS.exception.HmsException;

public interface PatientService {
    public UUID addPatient(PatientDto patient) throws HmsException;

    public PatientDto getPatientById(UUID id) throws HmsException;

    public PatientDto updatePatient(PatientDto doctor) throws HmsException;

    public Boolean patientExists(UUID id) throws HmsException;

    public List<PatientDto> getAllPatients() throws HmsException;

    public List<PatientDropdown> getAllPatientDropdownsByIds(List<UUID> ids) throws HmsException;
}
