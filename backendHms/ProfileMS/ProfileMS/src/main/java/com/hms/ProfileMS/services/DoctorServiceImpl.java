package com.hms.ProfileMS.services;

import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

import com.hms.ProfileMS.dto.DoctorDropdown;
import com.hms.ProfileMS.dto.DoctorDto;
import com.hms.ProfileMS.exception.HmsException;
import com.hms.ProfileMS.repository.DoctorRepository;

import jakarta.transaction.Transactional;

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
        if (doctor.getLicenseNumber() != null
                && doctorRepository.findByLicenseNumber(doctor.getLicenseNumber()).isPresent()) {
            throw new HmsException("DOCTOR_ALREADY_EXISTS");
        }
        return doctorRepository.save(doctor.toEntity()).getIdDoctor();
    }

    @Override
    public DoctorDto getDoctorById(UUID id) throws HmsException {
        return doctorRepository.findById(id).orElseThrow(() -> new HmsException("DOCTOR_NOT_FOUND")).toDto();
    }

    @Override
    @Transactional
    public DoctorDto updateDoctor(DoctorDto dto) throws HmsException {
        doctorRepository.findById(dto.getIdDoctor())
                .orElseThrow(() -> new HmsException("DOCTOR_NOT_FOUND"));
        return doctorRepository.save(dto.toEntity()).toDto();
    }

    @Override
    public Boolean doctorExists(UUID id) throws HmsException {
        return doctorRepository.existsById(id);
    }

    @Override
    public List<DoctorDropdown> getAllDoctorsName() throws HmsException {
        return doctorRepository.findAllDoctorDropdown();
    }

    @Override
    public List<DoctorDropdown> getAllDoctorDropdownsByIds(List<UUID> ids) {
        return doctorRepository.findAllDoctorDropdownsByIds(ids);
    }

    @Override
    public List<DoctorDto> getAllDoctors() throws HmsException {
        return doctorRepository.findAll().stream().map(doctor -> doctor.toDto()).toList();
    }

}