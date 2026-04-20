package com.hms.AppointmentsMS.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.hms.AppointmentsMS.dto.appointment.AppointmentDetailsDto;
import com.hms.AppointmentsMS.dto.appointment.ReasonCountProjection;
import com.hms.AppointmentsMS.dto.profile.MonthlyVisitProjection;
import com.hms.AppointmentsMS.entity.Appointment;

public interface AppointmentRepository extends CrudRepository<Appointment, Long> {
    @Query("SELECT new com.hms.AppointmentsMS.dto.appointment.AppointmentDetailsDto(a.idAppointment, a.patientId, null, null, null, a.doctorId, null, a.appointmentTime, a.status, a.reason, a.notes) FROM Appointment a WHERE a.patientId = ?1")
    List<AppointmentDetailsDto> findAllByPatientId(UUID profileId);

    @Query("SELECT new com.hms.AppointmentsMS.dto.appointment.AppointmentDetailsDto(a.idAppointment, a.patientId, null, null, null, a.doctorId, null, a.appointmentTime, a.status, a.reason, a.notes) FROM Appointment a WHERE a.doctorId = ?1")
    List<AppointmentDetailsDto> findAllByDoctorId(UUID profileId);

    @Query("SELECT FUNCTION('MONTHNAME', a.appointmentTime) as month, COUNT(a) as count FROM Appointment a WHERE a.patientId = ?1 AND YEAR(a.appointmentTime) = YEAR(CURRENT_DATE) GROUP BY FUNCTION('MONTH', a.appointmentTime), FUNCTION('MONTHNAME', a.appointmentTime) ORDER BY FUNCTION('MONTH', a.appointmentTime)")
    List<MonthlyVisitProjection> countCurrentYearVisitsByPatient(UUID patientId);

    @Query("SELECT FUNCTION('MONTHNAME', a.appointmentTime) as month, COUNT(a) as count FROM Appointment a WHERE a.doctorId = ?1 AND YEAR(a.appointmentTime) = YEAR(CURRENT_DATE) GROUP BY FUNCTION('MONTH', a.appointmentTime), FUNCTION('MONTHNAME', a.appointmentTime) ORDER BY FUNCTION('MONTH', a.appointmentTime)")
    List<MonthlyVisitProjection> countCurrentYearVisitsByDoctor(UUID doctorId);

    @Query("SELECT FUNCTION('MONTHNAME', a.appointmentTime) as month, COUNT(a) as count FROM Appointment a WHERE YEAR(a.appointmentTime) = YEAR(CURRENT_DATE) GROUP BY FUNCTION('MONTH', a.appointmentTime), FUNCTION('MONTHNAME', a.appointmentTime) ORDER BY FUNCTION('MONTH', a.appointmentTime)")
    List<MonthlyVisitProjection> countCurrentYearVisits();

    @Query("SELECT a.reason as reason, COUNT(a) as count FROM Appointment a WHERE a.patientId = ?1 GROUP BY a.reason")
    List<ReasonCountProjection> countByReasonAndPatientId(UUID patientId);

    @Query("SELECT a.reason as reason, COUNT(a) as count FROM Appointment a WHERE a.doctorId = ?1 GROUP BY a.reason")
    List<ReasonCountProjection> countByReasonAndDoctorId(UUID doctorId);

    @Query("SELECT a.reason as reason, COUNT(a) as count FROM Appointment a GROUP BY a.reason")
    List<ReasonCountProjection> countByReasons();

    @Query("SELECT new com.hms.AppointmentsMS.dto.appointment.AppointmentDetailsDto(a.idAppointment, a.patientId, null, null, null, a.doctorId, null, a.appointmentTime, a.status, a.reason, a.notes) FROM Appointment a WHERE DATE(a.appointmentTime) = CURRENT_DATE")
    List<AppointmentDetailsDto> findAllTodayAppointmentDetails();

    @Query("SELECT new com.hms.AppointmentsMS.dto.appointment.AppointmentDetailsDto(a.idAppointment, a.patientId, null, null, null, a.doctorId, null, a.appointmentTime, a.status, a.reason, a.notes) FROM Appointment a WHERE DATE(a.appointmentTime) = CURRENT_DATE AND a.doctorId = ?1")
    List<AppointmentDetailsDto> findAllTodayAppointmentDetailsByDoctorId(UUID doctorId);

    @Query("SELECT new com.hms.AppointmentsMS.dto.appointment.AppointmentDetailsDto(a.idAppointment, a.patientId, null, null, null, a.doctorId, null, a.appointmentTime, a.status, a.reason, a.notes) FROM Appointment a WHERE DATE(a.appointmentTime) = CURRENT_DATE AND a.patientId = ?1")
    List<AppointmentDetailsDto> findAllTodayAppointmentDetailsByPatientId(UUID patientId);
}
