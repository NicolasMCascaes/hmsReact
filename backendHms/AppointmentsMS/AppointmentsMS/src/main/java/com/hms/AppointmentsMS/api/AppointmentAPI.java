package com.hms.AppointmentsMS.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.AppointmentsMS.dto.appointment.AppointmentDTO;
import com.hms.AppointmentsMS.dto.appointment.AppointmentDetailsDto;
import com.hms.AppointmentsMS.dto.appointment.ReasonCountProjection;
import com.hms.AppointmentsMS.dto.profile.MonthlyVisitProjection;
import com.hms.AppointmentsMS.exceptions.HmsException;
import com.hms.AppointmentsMS.services.appointment.AppointmentService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/appointment")
@CrossOrigin
@Validated
public class AppointmentAPI {
    private final AppointmentService appointmentService;

    public AppointmentAPI(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/schedule")
    public ResponseEntity<Long> scheduleAppointment(@RequestBody AppointmentDTO dto) throws HmsException {
        return new ResponseEntity<>(appointmentService.scheduleAppointment(dto), HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<AppointmentDTO> getAppointment(@PathVariable Long id) throws HmsException {
        return new ResponseEntity<>(appointmentService.getAppointmentDetails(id), HttpStatus.OK);
    }

    @PatchMapping("/cancel/{idAppointment}")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long idAppointment) throws HmsException {
        appointmentService.cancelAppointment(idAppointment);
        return new ResponseEntity<>("Appointment Cancelled", HttpStatus.OK);
    }

    @GetMapping("/get/details/{id}")
    public ResponseEntity<AppointmentDetailsDto> getAppointmentDetailsWithName(@PathVariable Long id)
            throws HmsException {

        return new ResponseEntity<>(appointmentService.getAppointmentDetailsWithName(id), HttpStatus.OK);
    }

    @GetMapping("/getAllByPatient/details/{patientId}")
    public ResponseEntity<List<AppointmentDetailsDto>> getAllAppointmentsWithDetails(@PathVariable UUID patientId)
            throws HmsException {
        return new ResponseEntity<>(appointmentService.findAllAppointmentsWithDetails(patientId), HttpStatus.OK);
    }

    @GetMapping("/getAllByDoctor/details/{profileId}")
    public ResponseEntity<List<AppointmentDetailsDto>> getAllAppointmentsByDoctorId(@PathVariable UUID profileId)
            throws HmsException {
        return new ResponseEntity<>(appointmentService.findAllAppointmentsByDoctorId(profileId), HttpStatus.OK);
    }

    @GetMapping("/getCurrentYearVisits/{patientId}")
    public ResponseEntity<List<MonthlyVisitProjection>> getCurrentYearVisits(@PathVariable UUID patientId)
            throws HmsException {
        return new ResponseEntity<>(appointmentService.countCurrentYearVisitsByPatient(patientId), HttpStatus.OK);
    }

    @GetMapping("/getByReasonAndPatientId/{patientId}")
    public ResponseEntity<List<ReasonCountProjection>> getByReasonAndPatientId(@PathVariable UUID patientId)
            throws HmsException {
        return new ResponseEntity<>(appointmentService.countByReasonAndPatientId(patientId), HttpStatus.OK);
    }

    @GetMapping("/getByReasonAndDoctorId/{doctorId}")
    public ResponseEntity<List<ReasonCountProjection>> getByReasonAndDoctorId(@PathVariable UUID doctorId)
            throws HmsException {
        return new ResponseEntity<>(appointmentService.countByReasonAndDoctorId(doctorId), HttpStatus.OK);
    }

    @GetMapping("/getAppointmentCount")
    public ResponseEntity<List<MonthlyVisitProjection>> getAppointmentCount() throws HmsException {
        return new ResponseEntity<>(appointmentService.countCurrentYearVisits(), HttpStatus.OK);
    }

    @GetMapping("/getAppointmentCountByDoctor/{doctorId}")
    public ResponseEntity<List<MonthlyVisitProjection>> getAppointmentCountByDoctor(@PathVariable UUID doctorId)
            throws HmsException {
        return new ResponseEntity<>(appointmentService.countCurrentYearVisitsByDoctor(doctorId), HttpStatus.OK);
    }

    @GetMapping("/getReasonCount")
    public ResponseEntity<List<ReasonCountProjection>> getReasonCount() throws HmsException {
        return new ResponseEntity<>(appointmentService.countByReasons(), HttpStatus.OK);
    }

    @GetMapping("/findAllTodayAppointments")
    public ResponseEntity<List<AppointmentDetailsDto>> findAllTodayAppointments() throws HmsException {
        return new ResponseEntity<>(appointmentService.findAllTodayAppointmentDetails(), HttpStatus.OK);
    }

    @GetMapping("/findAllTodayAppointmentsByDoctorId/{doctorId}")
    public ResponseEntity<List<AppointmentDetailsDto>> findAllTodayAppointmentsByDoctorId(@PathVariable UUID doctorId)
            throws HmsException {
        return new ResponseEntity<>(appointmentService.findAllTodayAppointmentDetailsByDoctorId(doctorId),
                HttpStatus.OK);
    }

    @GetMapping("/findAllTodayAppointmentsByPatientId/{patientId}")
    public ResponseEntity<List<AppointmentDetailsDto>> findAllTodayAppointmentsByPatientId(@PathVariable UUID patientId)
            throws HmsException {
        return new ResponseEntity<>(appointmentService.findAllTodayAppointmentDetailsByPatientId(patientId),
                HttpStatus.OK);
    }

}
