package com.hms.AppointmentsMS.services;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.hms.AppointmentsMS.dto.AppointmentDTO;
import com.hms.AppointmentsMS.dto.AppointmentDetailsDto;
import com.hms.AppointmentsMS.dto.DoctorDto;
import com.hms.AppointmentsMS.dto.PatientDto;
import com.hms.AppointmentsMS.dto.Status;
import com.hms.AppointmentsMS.entity.Appointment;
import com.hms.AppointmentsMS.exceptions.HmsException;
import com.hms.AppointmentsMS.repositories.AppointmentRepository;

@Service
public class AppointmentServiceImpl implements AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final ApiService apiService;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, ApiService apiService) {
        this.appointmentRepository = appointmentRepository;
        this.apiService = apiService;
    }

    @Override
    public Long scheduleAppointment(AppointmentDTO dto) throws HmsException {
        Boolean patientExists = apiService.patientExists(dto.getPatientId()).block();
        Boolean doctorExists = apiService.doctorExists(dto.getDoctorId()).block();
        if (!patientExists) {
            throw new HmsException("PATIENT_NOT_FOUND");
        }
        if (!doctorExists) {
            throw new HmsException("DOCTOR_NOT_FOUND");
        }
        dto.setStatus(Status.SCHEDULED);
        return appointmentRepository.save(dto.toEntity()).getIdAppointment();
    }

    @Override
    public void cancelAppointment(Long appointmentId) throws HmsException {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new HmsException("APPOINTMENT_NOT_FOUND"));
        if (appointment.getStatus().equals(Status.CANCELLED)) {
            throw new HmsException("APPOINTMENT_ALREADY_CANCELLED");
        }
        appointment.setStatus(Status.CANCELLED);
        appointmentRepository.save(appointment);
    }

    @Override
    public void completeAppointment(Long appointmentId) throws HmsException {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new HmsException("APPOINTMENT_NOT_FOUND"));
        if (appointment.getStatus().equals(Status.COMPLETED)) {
            throw new HmsException("APPOINTMENT_ALREADY_COMPLETED");
        }
    }

    @Override
    public AppointmentDTO getAppointmentDetails(Long appointmentId) throws HmsException {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new HmsException("APPOINTMENT_NOT_FOUND")).toDTO();
    }

    @Override
    public void rescheduleAppointment(Long appointmentId, LocalDateTime time) throws HmsException {
        throw new UnsupportedOperationException("Unimplemented method 'rescheduleAppointment'");
    }

    @Override
    public AppointmentDetailsDto getAppointmentDetailsWithName(Long appointmentId) throws HmsException {
        AppointmentDTO appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new HmsException("APPOINTMENT_NOT_FOUND")).toDTO();
        PatientDto patient = apiService.getPatient(appointment.getPatientId()).block();
        DoctorDto doctor = apiService.getDoctor(appointment.getDoctorId()).block();
        return new AppointmentDetailsDto(appointment.getIdAppointment(), appointment.getPatientId(), patient.getName(),
                patient.getPhone(), patient.getEmail(), appointment.getDoctorId(), doctor.getName(),
                appointment.getAppointmentTime(), appointment.getStatus(), appointment.getReason(),
                appointment.getNotes());
    }

}
