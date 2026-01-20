package com.hms.AppointmentsMS.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.AppointmentsMS.dto.ApRecordDTO;
import com.hms.AppointmentsMS.dto.RecordDetails;
import com.hms.AppointmentsMS.exceptions.HmsException;
import com.hms.AppointmentsMS.services.ApRecordService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@CrossOrigin
@RequestMapping("/appointment/report")
@Validated
public class ApRecordApi {
    private final ApRecordService apRecordService;

    public ApRecordApi(ApRecordService apRecordService) {
        this.apRecordService = apRecordService;
    }

    @PostMapping("/create")
    public ResponseEntity<Long> createApRecord(@RequestBody ApRecordDTO dto) throws HmsException {
        return new ResponseEntity<>(apRecordService.createApRecord(dto), HttpStatus.CREATED);
    }

    @PatchMapping("/update")
    public ResponseEntity<Void> updateApRecord(@RequestBody ApRecordDTO dto) throws HmsException {
        apRecordService.updateApRecord(dto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<ApRecordDTO> getApRecordById(@PathVariable Long id) throws HmsException {
        return new ResponseEntity<>(apRecordService.getApRecordById(id), HttpStatus.OK);
    }

    @GetMapping("/getByAppointmentId/{id}")
    public ResponseEntity<ApRecordDTO> getApRecordByAppointmentId(@PathVariable Long id) throws HmsException {
        return new ResponseEntity<>(apRecordService.getApRecordByAppointmentId(id), HttpStatus.OK);
    }

    @GetMapping("/getRecordsByPatientId")
    public ResponseEntity<List<RecordDetails>> getMethodName(@PathVariable UUID patientId) throws HmsException {
        return new ResponseEntity<>(apRecordService.getRecordsByPatientId(patientId), HttpStatus.OK);
    }

}
