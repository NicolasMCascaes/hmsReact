package com.hms.AppointmentsMS.services.appointment;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.AppointmentsMS.clients.ProfileClient;
import com.hms.AppointmentsMS.dto.appointment.AppointmentDTO;
import com.hms.AppointmentsMS.dto.appointment.AppointmentDetailsDto;
import com.hms.AppointmentsMS.dto.appointment.ReasonCountProjection;
import com.hms.AppointmentsMS.dto.profile.DoctorDto;
import com.hms.AppointmentsMS.dto.profile.MonthlyVisitProjection;
import com.hms.AppointmentsMS.dto.profile.PatientDto;
import com.hms.AppointmentsMS.dto.profile.Status;
import com.hms.AppointmentsMS.entity.Appointment;
import com.hms.AppointmentsMS.exceptions.HmsException;
import com.hms.AppointmentsMS.repositories.AppointmentRepository;

@Service
@Transactional
public class AppointmentServiceImpl implements AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final ProfileClient apiService;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, ProfileClient apiService) {
        this.appointmentRepository = appointmentRepository;
        this.apiService = apiService;
    }

    @Override
    public Long scheduleAppointment(AppointmentDTO dto) throws HmsException {
        Boolean patientExists = apiService.patientExists(dto.getPatientId());
        Boolean doctorExists = apiService.doctorExists(dto.getDoctorId());
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
        appointment.setStatus(Status.COMPLETED);
        appointmentRepository.save(appointment);
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
        PatientDto patient = apiService.getPatient(appointment.getPatientId());
        DoctorDto doctor = apiService.getDoctor(appointment.getDoctorId());
        return new AppointmentDetailsDto(appointment.getIdAppointment(), appointment.getPatientId(), patient.getName(),
                patient.getPhone(), patient.getEmail(), appointment.getDoctorId(), doctor.getName(),
                appointment.getAppointmentTime(), appointment.getStatus(), appointment.getReason(),
                appointment.getNotes());
    }

    @Override
    public List<AppointmentDetailsDto> findAllAppointmentsWithDetails(UUID patientId) throws HmsException {
        return appointmentRepository.findAllByPatientId(patientId).stream()
                .map(appointment -> {
                    DoctorDto doctorDto = apiService.getDoctor(appointment.getDoctorId());
                    appointment.setDoctorName(doctorDto.getName());
                    return appointment;
                }).toList();
    }

    @Override
    @Transactional
    public List<AppointmentDetailsDto> findAllAppointmentsByDoctorId(UUID doctorId) throws HmsException {
        return appointmentRepository.findAllByDoctorId(doctorId).stream()
                .map(appointment -> {
                    PatientDto patientDto = apiService.getPatient(appointment.getPatientId());
                    appointment.setPatientName(patientDto.getName());
                    appointment.setPatientEmail(patientDto.getEmail());
                    appointment.setPatientPhone(patientDto.getPhone());
                    return appointment;
                }).toList();
    }

    @Override
    public List<MonthlyVisitProjection> countCurrentYearVisitsByPatient(UUID patientId) throws HmsException {
        return appointmentRepository.countCurrentYearVisitsByPatient(patientId);
    }

    @Override
    public List<ReasonCountProjection> countByReasonAndPatientId(UUID patientId) throws HmsException {
        return appointmentRepository.countByReasonAndPatientId(patientId);
    }

    @Override
    public List<MonthlyVisitProjection> countCurrentYearVisits() throws HmsException {
        return appointmentRepository.countCurrentYearVisits();
    }

    @Override
    public List<MonthlyVisitProjection> countCurrentYearVisitsByDoctor(UUID doctorId) throws HmsException {
        return appointmentRepository.countCurrentYearVisitsByDoctor(doctorId);
    }

    @Override
    public List<ReasonCountProjection> countByReasonAndDoctorId(UUID doctorId) throws HmsException {
        return appointmentRepository.countByReasonAndDoctorId(doctorId);
    }

    @Override
    public List<ReasonCountProjection> countByReasons() throws HmsException {
        return appointmentRepository.countByReasons();
    }

    @Override
    public List<AppointmentDetailsDto> findAllTodayAppointmentDetails() throws HmsException {
        return appointmentRepository.findAllTodayAppointmentDetails().stream()
                .map(appointment -> {
                    DoctorDto doctorDto = apiService.getDoctor(appointment.getDoctorId());
                    PatientDto patientDto = apiService.getPatient(appointment.getPatientId());
                    appointment.setDoctorName(doctorDto.getName());
                    appointment.setPatientName(patientDto.getName());
                    appointment.setPatientEmail(patientDto.getEmail());
                    appointment.setPatientPhone(patientDto.getPhone());
                    return appointment;
                }).toList();
    }

    @Override
    public List<AppointmentDetailsDto> findAllTodayAppointmentDetailsByDoctorId(UUID doctorId) throws HmsException {
        return appointmentRepository.findAllTodayAppointmentDetailsByDoctorId(doctorId).stream()
                .map(appointment -> {
                    DoctorDto doctorDto = apiService.getDoctor(appointment.getDoctorId());
                    PatientDto patientDto = apiService.getPatient(appointment.getPatientId());
                    appointment.setDoctorName(doctorDto.getName());
                    appointment.setPatientName(patientDto.getName());
                    appointment.setPatientEmail(patientDto.getEmail());
                    appointment.setPatientPhone(patientDto.getPhone());
                    return appointment;
                }).toList();
    }

}
