package com.hms.AppointmentsMS.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.hms.AppointmentsMS.dto.AppointmentDTO;
import com.hms.AppointmentsMS.dto.AppointmentDetailsDto;
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

}
