package com.hms.AppointmentsMS.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.AppointmentsMS.entity.Prescription;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findAllByPatientId(UUID patientId);

    Optional<Prescription> findByAppointment_IdAppointment(Long IdAppointment);
}
