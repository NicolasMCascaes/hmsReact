package com.hms.ProfileMS.services;

import java.util.UUID;
import org.springframework.stereotype.Service;

import com.hms.ProfileMS.dto.DoctorDto;
import com.hms.ProfileMS.exception.HmsException;
import com.hms.ProfileMS.repository.DoctorRepository;

@Service
public class DoctorServiceImpl implements DoctorService {
    private final DoctorRepository doctorRepository;

    public DoctorServiceImpl(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;

    }

    @Override
    public UUID addDoctor(DoctorDto doctor) throws HmsException {
        if (doctorRepository.findByEmail(doctor.getEmail()).isPresent()) {
            throw new HmsException("DOCTOR_ALREADY_EXISTS");
        }
        if (doctorRepository.findByLicenseNumber(doctor.getLicenseNumber()).isPresent()) {
            throw new HmsException("DOCTOR_ALREADY_EXISTS");
        }
        return doctorRepository.save(doctor.toEntity()).getIdDoctor();
    }

    @Override
    public DoctorDto getDoctorById(UUID id) throws HmsException {
        return doctorRepository.findById(id).orElseThrow(() -> new HmsException("DOCTOR_NOT_FOUND")).toDto();
    }

}