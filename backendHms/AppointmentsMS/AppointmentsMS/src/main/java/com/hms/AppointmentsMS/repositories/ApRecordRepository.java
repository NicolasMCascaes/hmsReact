package com.hms.AppointmentsMS.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.hms.AppointmentsMS.entity.ApRecord;

@Repository
public interface ApRecordRepository extends CrudRepository<ApRecord, Long> {
    Optional<ApRecord> findByAppointment_IdAppointment(Long appointmentId);
}
