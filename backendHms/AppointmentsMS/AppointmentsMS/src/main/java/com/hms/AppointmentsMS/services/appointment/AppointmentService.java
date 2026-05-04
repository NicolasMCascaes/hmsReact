package com.hms.AppointmentsMS.services.appointment;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.hms.AppointmentsMS.dto.appointment.AppointmentDTO;
import com.hms.AppointmentsMS.dto.appointment.AppointmentDetailsDto;
import com.hms.AppointmentsMS.dto.appointment.MonthlyVisitDto;
import com.hms.AppointmentsMS.dto.appointment.ReasonCountDto;
import com.hms.AppointmentsMS.dto.profile.MonthlyVisitProjection;
import com.hms.AppointmentsMS.exceptions.HmsException;

public interface AppointmentService {
    Long scheduleAppointment(AppointmentDTO dto) throws HmsException;

    void cancelAppointment(Long appointmentId) throws HmsException;

    void completeAppointment(Long appointmentId) throws HmsException;

    AppointmentDTO getAppointmentDetails(Long appointmentId) throws HmsException;

    void rescheduleAppointment(Long appointmentId, LocalDateTime time) throws HmsException;

    AppointmentDetailsDto getAppointmentDetailsWithName(Long appointmentId) throws HmsException;

    List<AppointmentDetailsDto> findAllAppointmentsWithDetails(UUID patientId) throws HmsException;

    List<AppointmentDetailsDto> findAllAppointmentsByDoctorId(UUID doctorId) throws HmsException;

    List<MonthlyVisitProjection> countCurrentYearVisitsByPatient(UUID patientId) throws HmsException;

    List<MonthlyVisitProjection> countCurrentYearVisits() throws HmsException;

    List<MonthlyVisitDto> countCurrentYearVisitsByDoctor(UUID doctorId) throws HmsException;

    List<ReasonCountDto> countByReasonAndPatientId(UUID patientId) throws HmsException;

    List<ReasonCountDto> countByReasonAndDoctorId(UUID doctorId) throws HmsException;

    List<ReasonCountDto> countByReasons() throws HmsException;

    List<AppointmentDetailsDto> findAllTodayAppointmentDetails() throws HmsException;

    List<AppointmentDetailsDto> findAllTodayAppointmentDetailsByDoctorId(UUID doctorId) throws HmsException;

    List<AppointmentDetailsDto> findAllTodayAppointmentDetailsByPatientId(UUID patientId) throws HmsException;

}
