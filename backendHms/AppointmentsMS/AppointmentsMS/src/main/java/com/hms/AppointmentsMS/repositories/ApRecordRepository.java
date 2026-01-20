package com.hms.AppointmentsMS.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hms.AppointmentsMS.entity.ApRecord;

@Repository
public interface ApRecordRepository extends JpaRepository<ApRecord, Long> {
    Optional<ApRecord> findByAppointment_IdAppointment(Long appointmentId);

    @Query(value = "SELECT * FROM ap_record WHERE appointment_id = :appointmentId", nativeQuery = true)
    Optional<ApRecord> findByAppointmentIdNative(@Param("appointmentId") Long appointmentId);

    @Query("SELECT new com.hms.AppointmentsMS.dto.RecordDetails(a.idAppointment, a.patientId, a.doctorId, null, a.appointmentId, a.sintoms, a.diagnosis, a.tests, a.notes, a.referral) FROM ApRecord a WHERE a.patientId = ?1")
    List<ApRecord> findAllByPatientId(UUID patientId);
}
