package com.hms.ProfileMS.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.hms.ProfileMS.dto.PatientDto;
import com.hms.ProfileMS.exception.HmsException;
import com.hms.ProfileMS.repository.PatientRepository;

import jakarta.transaction.Transactional;

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
        if (patient.getCpf() != null && patientRepository.findByCpf(patient.getCpf()).isPresent()) {
            throw new HmsException("PATIENT_ALREADY_EXISTS!");
        }
        return patientRepository.save(patient.toEntity()).getIdPatient();
    }

    @Override
    public PatientDto getPatientById(UUID id) throws HmsException {
        return patientRepository.findById(id).orElseThrow(() -> new HmsException("PATIENT_NOT_FOUND")).toDto();
    }

    @Override
    @Transactional
    public PatientDto updatePatient(PatientDto dto) throws HmsException {
        patientRepository.findById(dto.getIdPatient()).orElseThrow(() -> new HmsException("PATIENT_NOT_FOUND"));
        return patientRepository.save(dto.toEntity()).toDto();
    }

    @Override
    public Boolean patientExists(UUID id) throws HmsException {
        return patientRepository.existsById(id);
    }

}
