package com.hms.ProfileMS.repository;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.hms.ProfileMS.entity.Doctor;
import java.util.Optional;

@Repository
public interface DoctorRepository extends CrudRepository<Doctor, UUID> {
    Optional<Doctor> findByEmail(String email);

    Optional<Doctor> findByLicenseNumber(String licenseNumber);
}
