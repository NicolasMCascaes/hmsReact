package com.hms.AppointmentsMS.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.AppointmentsMS.dto.AppointmentDTO;
import com.hms.AppointmentsMS.dto.AppointmentDetailsDto;
import com.hms.AppointmentsMS.exceptions.HmsException;
import com.hms.AppointmentsMS.services.AppointmentService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

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

    @GetMapping("/getAll/details/{patientId}")
    public ResponseEntity<List<AppointmentDetailsDto>> getAllAppointmentsWithDetails(@PathVariable UUID patientId)
            throws HmsException {
        return new ResponseEntity<>(appointmentService.findAllAppointmentsWithDetails(patientId), HttpStatus.OK);
    }

}
