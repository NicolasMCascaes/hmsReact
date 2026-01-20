package com.hms.AppointmentsMS.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.hms.AppointmentsMS.dto.appointment.AppointmentDetailsDto;
import com.hms.AppointmentsMS.entity.Appointment;

public interface AppointmentRepository extends CrudRepository<Appointment, Long> {
    @Query("SELECT new com.hms.AppointmentsMS.dto.AppointmentDetailsDto(a.idAppointment, a.patientId, null, null, null, a.doctorId, null, a.appointmentTime, a.status, a.reason, a.notes) FROM Appointment a WHERE a.patientId = ?1")
    List<AppointmentDetailsDto> findAllByPatientId(UUID profileId);

    @Query("SELECT new com.hms.AppointmentsMS.dto.AppointmentDetailsDto(a.idAppointment, a.patientId, null, null, null, a.doctorId, null, a.appointmentTime, a.status, a.reason, a.notes) FROM Appointment a WHERE a.doctorId = ?1")
    List<AppointmentDetailsDto> findAllByDoctorId(UUID profileId);
}
