package com.hms.ProfileMS.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.hms.ProfileMS.dto.PatientDto;
import com.hms.ProfileMS.exception.HmsException;
import com.hms.ProfileMS.repository.PatientRepository;

@Service
public class PatientServiceImpl implements PatientService {
    private final PatientRepository patientRepository;

    public PatientServiceImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public UUID addPatient(PatientDto patient) throws HmsException {
        if (patientRepository.findByEmail(patient.getEmail()).isPresent()) {
            throw new HmsException("PATIENT_ALREADY_EXISTS!");
        }
        if (patientRepository.findByCpf(patient.getCpf()).isPresent()) {
            throw new HmsException("PATIENT_ALREADY_EXISTS!");
        }
        return patientRepository.save(patient.toEntity()).getIdPatient();
    }

    @Override
    public PatientDto getPatientById(UUID id) throws HmsException {
        return patientRepository.findById(id).orElseThrow(() -> new HmsException("PATIENT_NOT_FOUND")).toDto();
    }

}
