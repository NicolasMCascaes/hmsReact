package com.hms.AppointmentsMS.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.hms.AppointmentsMS.entity.Prescription;

@Repository
public interface PrescriptionRepository extends CrudRepository<Prescription, Long> {
    List<Prescription> findAllByPatientId(UUID patientId);

    Optional<Prescription> findByAppointment_IdAppointment(Long IdAppointment);
}
