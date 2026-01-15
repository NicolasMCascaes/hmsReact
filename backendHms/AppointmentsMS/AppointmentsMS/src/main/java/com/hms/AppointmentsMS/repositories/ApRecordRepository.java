package com.hms.AppointmentsMS.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hms.AppointmentsMS.entity.ApRecord;

@Repository
public interface ApRecordRepository extends JpaRepository<ApRecord, Long> {
    Optional<ApRecord> findByAppointment_IdAppointment(Long appointmentId);

    @Query(value = "SELECT * FROM ap_record WHERE appointment_id = :appointmentId", nativeQuery = true)
    Optional<ApRecord> findByAppointmentIdNative(@Param("appointmentId") Long appointmentId);

}
