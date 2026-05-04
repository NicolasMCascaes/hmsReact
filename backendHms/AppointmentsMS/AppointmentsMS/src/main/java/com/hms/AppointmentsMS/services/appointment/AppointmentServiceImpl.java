package com.hms.AppointmentsMS.services.appointment;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.AppointmentsMS.clients.ProfileClient;
import com.hms.AppointmentsMS.dto.appointment.AppointmentDTO;
import com.hms.AppointmentsMS.dto.appointment.AppointmentDetailsDto;
import com.hms.AppointmentsMS.dto.appointment.MonthlyVisitDto;
import com.hms.AppointmentsMS.dto.appointment.ReasonCountDto;
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
    @Caching(evict = { @CacheEvict(value = "currentYearVisitsByPatient", key = "#dto.patientId"),
            @CacheEvict(value = "reasonCountByPatient", key = "#dto.patientId"),
            @CacheEvict(value = "currentYearVisits", allEntries = true),
            @CacheEvict(value = "currentYearVisitsByDoctor", key = "#dto.doctorId"),
            @CacheEvict(value = "reasonCountByDoctor", key = "#dto.doctorId"),
            @CacheEvict(value = "reasonCount", allEntries = true),
            @CacheEvict(value = "todayAppointments", allEntries = true),
            @CacheEvict(value = "todayAppointmentsByDoctor", key = "#dto.doctorId"),
            @CacheEvict(value = "todayAppointmentsByPatient", key = "#dto.patientId") })
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
    @Caching(evict = { @CacheEvict(value = "currentYearVisitsByPatient", key = "#appointmentId"),
            @CacheEvict(value = "reasonCountByPatient", key = "#appointmentId"),
            @CacheEvict(value = "currentYearVisits", allEntries = true),
            @CacheEvict(value = "currentYearVisitsByDoctor", key = "#appointmentId"),
            @CacheEvict(value = "reasonCountByDoctor", key = "#appointmentId"),
            @CacheEvict(value = "reasonCount", allEntries = true),
            @CacheEvict(value = "todayAppointments", allEntries = true),
            @CacheEvict(value = "todayAppointmentsByDoctor", key = "#appointmentId"),
            @CacheEvict(value = "todayAppointmentsByPatient", key = "#appointmentId") })
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
    @Caching(evict = { @CacheEvict(value = "currentYearVisitsByPatient", key = "#appointmentId"),
            @CacheEvict(value = "reasonCountByPatient", key = "#appointmentId"),
            @CacheEvict(value = "currentYearVisits", allEntries = true),
            @CacheEvict(value = "currentYearVisitsByDoctor", key = "#appointmentId"),
            @CacheEvict(value = "reasonCountByDoctor", key = "#appointmentId"),
            @CacheEvict(value = "reasonCount", allEntries = true),
            @CacheEvict(value = "todayAppointments", allEntries = true),
            @CacheEvict(value = "todayAppointmentsByDoctor", key = "#appointmentId"),
            @CacheEvict(value = "todayAppointmentsByPatient", key = "#appointmentId") })
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
    @Caching(evict = { @CacheEvict(value = "currentYearVisitsByPatient", key = "#patientId"),
            @CacheEvict(value = "reasonCountByPatient", key = "#patientId"),
            @CacheEvict(value = "currentYearVisits", allEntries = true),
            @CacheEvict(value = "currentYearVisitsByDoctor", key = "#doctorId"),
            @CacheEvict(value = "reasonCountByDoctor", key = "#doctorId"),
            @CacheEvict(value = "reasonCount", allEntries = true) })
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
                }).collect(Collectors.toCollection(() -> new ArrayList<>()));
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
                }).collect(Collectors.toCollection(() -> new ArrayList<>()));
    }

    @Override
    @Cacheable(value = "currentYearVisitsByPatient", key = "#patientId")
    public List<MonthlyVisitProjection> countCurrentYearVisitsByPatient(UUID patientId) throws HmsException {
        return appointmentRepository.countCurrentYearVisitsByPatient(patientId);
    }

    @Override
    @Cacheable(value = "reasonCountByPatient", key = "#patientId")
    public List<ReasonCountDto> countByReasonAndPatientId(UUID patientId) throws HmsException {
        return appointmentRepository.countByReasonAndPatientId(patientId).stream()
                .map(projection -> new ReasonCountDto(projection.getReason(), projection.getCount()))
                .collect(Collectors.toCollection(() -> new ArrayList<>()));
    }

    @Override
    @Cacheable(value = "currentYearVisits")
    public List<MonthlyVisitProjection> countCurrentYearVisits() throws HmsException {
        return appointmentRepository.countCurrentYearVisits();
    }

    @Override
    @Cacheable(value = "currentYearVisitsByDoctor", key = "#doctorId")
    public List<MonthlyVisitDto> countCurrentYearVisitsByDoctor(UUID doctorId) throws HmsException {
        return appointmentRepository.countCurrentYearVisitsByDoctor(doctorId).stream()
                .map(projection -> new MonthlyVisitDto(projection.getMonth(), projection.getCount()))
                .collect(Collectors.toCollection(() -> new ArrayList<>()));
    }

    @Override
    @Cacheable(value = "reasonCountByDoctor", key = "#doctorId")
    public List<ReasonCountDto> countByReasonAndDoctorId(UUID doctorId) throws HmsException {
        return appointmentRepository.countByReasonAndDoctorId(doctorId).stream()
                .map(projection -> new ReasonCountDto(projection.getReason(), projection.getCount()))
                .collect(Collectors.toCollection(() -> new ArrayList<>()));
    }

    @Override
    @Cacheable(value = "reasonCount")
    public List<ReasonCountDto> countByReasons() throws HmsException {
        return appointmentRepository.countByReasons().stream()
                .map(projection -> new ReasonCountDto(projection.getReason(), projection.getCount()))
                .collect(Collectors.toCollection(() -> new ArrayList<>()));
    }

    @Override
    @Cacheable(value = "todayAppointments")
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
                }).collect(Collectors.toCollection(() -> new ArrayList<>()));
    }

    @Override
    @Cacheable(value = "todayAppointmentsByDoctor", key = "#doctorId")
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
                }).collect(Collectors.toCollection(() -> new ArrayList<>()));
    }

    @Override
    @Cacheable(value = "todayAppointmentsByPatient", key = "#patientId")
    public List<AppointmentDetailsDto> findAllTodayAppointmentDetailsByPatientId(UUID patientId) throws HmsException {
        return appointmentRepository.findAllTodayAppointmentDetailsByPatientId(patientId).stream()
                .map(appointment -> {
                    DoctorDto doctorDto = apiService.getDoctor(appointment.getDoctorId());
                    PatientDto patientDto = apiService.getPatient(appointment.getPatientId());
                    appointment.setDoctorName(doctorDto.getName());
                    appointment.setPatientName(patientDto.getName());
                    appointment.setPatientEmail(patientDto.getEmail());
                    appointment.setPatientPhone(patientDto.getPhone());
                    return appointment;
                }).collect(Collectors.toCollection(() -> new ArrayList<>()));
    }

}
