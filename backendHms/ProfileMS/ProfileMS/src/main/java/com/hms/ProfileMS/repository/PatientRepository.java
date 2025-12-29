package com.hms.ProfileMS.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.hms.ProfileMS.entity.Patient;

@Repository
public interface PatientRepository extends CrudRepository<Patient, UUID> {
    Optional<Patient> findByEmail(String email);

    Optional<Patient> findByCpf(String cpf);
}
