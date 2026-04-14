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

import com.hms.AppointmentsMS.dto.aprecord.ApRecordDTO;
import com.hms.AppointmentsMS.dto.aprecord.RecordDetails;
import com.hms.AppointmentsMS.dto.medicine.MedicineDto;
import com.hms.AppointmentsMS.dto.prescription.PrescriptionDetails;
import com.hms.AppointmentsMS.exceptions.HmsException;
import com.hms.AppointmentsMS.services.aprecord.ApRecordService;
import com.hms.AppointmentsMS.services.medicine.MedicineService;
import com.hms.AppointmentsMS.services.prescription.PrescriptionService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@CrossOrigin
@RequestMapping("/appointment/report")
@Validated
public class ApRecordApi {
    private final ApRecordService apRecordService;
    private final PrescriptionService prescriptionService;
    private final MedicineService medicineService;

    public ApRecordApi(ApRecordService apRecordService, PrescriptionService prescriptionService,
            MedicineService medicineService) {
        this.apRecordService = apRecordService;
        this.prescriptionService = prescriptionService;
        this.medicineService = medicineService;
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

    @GetMapping("/getRecordsByPatientId/{patientId}")
    public ResponseEntity<List<RecordDetails>> getRecordsByPatientId(@PathVariable UUID patientId) throws HmsException {
        return new ResponseEntity<>(apRecordService.getRecordsByPatientId(patientId), HttpStatus.OK);
    }

    @GetMapping("/isRecordExists/{appointmentId}")
    public ResponseEntity<Boolean> isRecordExists(@PathVariable Long appointmentId) throws HmsException {
        return new ResponseEntity<>(apRecordService.isReportExists(appointmentId), HttpStatus.OK);
    }

    @GetMapping("/getPrescriptionsByPatientId/{patientId}")
    public ResponseEntity<List<PrescriptionDetails>> getPrescriptionsByPatientId(@PathVariable UUID patientId)
            throws HmsException {
        return new ResponseEntity<>(prescriptionService.getPrescriptionsByPatientId(patientId), HttpStatus.OK);
    }

    @GetMapping("/getAllPrescriptionDetails")
    public ResponseEntity<List<PrescriptionDetails>> getAllPrescriptionDetails() throws HmsException {
        return new ResponseEntity<>(prescriptionService.getAllPrescriptionDetails(), HttpStatus.OK);
    }

    @GetMapping("/getMedicinesByPrescriptionId/{id}")
    public ResponseEntity<List<MedicineDto>> getMedicinesByPrescriptionId(@PathVariable Long id)
            throws HmsException {
        return new ResponseEntity<>(medicineService.getAllMedicinesByPrescriptionId(id), HttpStatus.OK);
    }

}
