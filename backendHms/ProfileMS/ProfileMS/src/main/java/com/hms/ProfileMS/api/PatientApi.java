package com.hms.ProfileMS.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.ProfileMS.dto.PatientDto;
import com.hms.ProfileMS.dto.PatientPhotoUpdateDto;
import com.hms.ProfileMS.exception.HmsException;
import com.hms.ProfileMS.services.PatientService;

import java.util.UUID;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.hms.ProfileMS.dto.PatientDropdown;

@RestController
@RequestMapping("/profile/patient")
@CrossOrigin
@Validated
public class PatientApi {
    private final PatientService patientService;

    public PatientApi(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping("/add")
    public ResponseEntity<UUID> addPatient(@RequestBody PatientDto patient) throws HmsException {
        return new ResponseEntity<>(patientService.addPatient(patient), HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<PatientDto> getPatientById(@PathVariable UUID id) throws HmsException {
        return new ResponseEntity<>(patientService.getPatientById(id), HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<PatientDto> updatePatient(@RequestBody PatientDto dto)
            throws HmsException {
        return new ResponseEntity<>(patientService.updatePatient(dto), HttpStatus.OK);
    }

    @PutMapping("/updatePhoto")
    public ResponseEntity<PatientDto> updatePatientPhoto(@RequestBody PatientPhotoUpdateDto photoUpdateDto)
            throws HmsException {
        return new ResponseEntity<>(patientService.updatePatientPhoto(photoUpdateDto), HttpStatus.OK);
    }

    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> patientExistss(@PathVariable UUID id) throws HmsException {
        return new ResponseEntity<>(patientService.patientExists(id), HttpStatus.OK);
    }

    @GetMapping("/getAllPatientsDropdownById")
    public ResponseEntity<List<PatientDropdown>> getAllPatientsDropdownById(@RequestParam List<UUID> ids)
            throws HmsException {
        return new ResponseEntity<>(patientService.getAllPatientDropdownsByIds(ids), HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<PatientDto>> getAllPatients() throws HmsException {
        return new ResponseEntity<>(patientService.getAllPatients(), HttpStatus.OK);
    }

    @GetMapping("/getAllPatientsDropdown")
    public ResponseEntity<List<PatientDropdown>> getAllPatientsDropdown() throws HmsException {
        return new ResponseEntity<>(patientService.getAllPatientDropdowns(), HttpStatus.OK);
    }

}
