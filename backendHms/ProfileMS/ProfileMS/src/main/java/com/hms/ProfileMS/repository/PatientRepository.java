package com.hms.ProfileMS.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hms.ProfileMS.dto.PatientDropdown;
import com.hms.ProfileMS.entity.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, UUID> {
    Optional<Patient> findByEmail(String email);

    Optional<Patient> findByCpf(String cpf);

    @Query("SELECT p.idPatient AS id, p.name AS name FROM Patient p WHERE p.idPatient in ?1")
    List<PatientDropdown> findAllPatientDropdownsByIds(List<UUID> ids);
}
