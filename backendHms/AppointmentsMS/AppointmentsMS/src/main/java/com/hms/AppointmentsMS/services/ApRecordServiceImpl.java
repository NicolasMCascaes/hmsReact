package com.hms.AppointmentsMS.services;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.AppointmentsMS.dto.ApRecordDTO;
import com.hms.AppointmentsMS.entity.ApRecord;
import com.hms.AppointmentsMS.exceptions.HmsException;
import com.hms.AppointmentsMS.repositories.ApRecordRepository;
import com.hms.AppointmentsMS.utilities.StringListConverter;

@Service
@Transactional
public class ApRecordServiceImpl implements ApRecordService {

    private final ApRecordRepository apRecordRepository;
    private final PrescriptionService prescriptionService;

    public ApRecordServiceImpl(ApRecordRepository apRecordRepository, PrescriptionService prescriptionService) {
        this.apRecordRepository = apRecordRepository;
        this.prescriptionService = prescriptionService;
    }

    @Override
    public Long createApRecord(ApRecordDTO apRecordDTO) throws HmsException {

        Optional<ApRecord> existingRecord = apRecordRepository
                .findByAppointmentIdNative(apRecordDTO.getAppointmentId());
        if (existingRecord.isPresent()) {
            throw new HmsException("APPOINTMENT_RECORD_ALREADY_EXISTS");
        }
        Long id = apRecordRepository.save(apRecordDTO.toEntity()).getIdRecord();
        if (apRecordDTO.getPrescription() != null) {
            apRecordDTO.getPrescription().setAppointmentId(apRecordDTO.getAppointmentId());
            prescriptionService.savePrescription(apRecordDTO.getPrescription());
        }
        return id;

    }

    @Override
    @Transactional
    public void updateApRecord(ApRecordDTO apRecordDTO) throws HmsException {
        ApRecord existingRecord = apRecordRepository.findById(apRecordDTO.getIdRecord())
                .orElseThrow(() -> new HmsException("APPOINTMENT_RECORD_NOT_FOUND"));
        existingRecord.setNotes(apRecordDTO.getNotes());
        existingRecord.setDiagnosis(apRecordDTO.getDiagnosis());
        existingRecord.setNotes(apRecordDTO.getNotes());
        existingRecord.setFollowUpDate(apRecordDTO.getFollowUpDate());
        existingRecord.setSintoms(StringListConverter.listToString(apRecordDTO.getSintoms()));
        existingRecord.setTests(StringListConverter.listToString(apRecordDTO.getTests()));
        existingRecord.setReferral(apRecordDTO.getReferral());
        apRecordRepository.save(existingRecord);

    }

    @Override
    public ApRecordDTO getApRecordByAppointmentId(Long appointmentId) throws HmsException {
        return apRecordRepository.findByAppointment_IdAppointment(appointmentId)
                .orElseThrow(() -> new HmsException("APPOINTMENT_RECORD_NOT_FOUND")).toDto();
    }

    @Override
    @Transactional(readOnly = true)
    public ApRecordDTO getApRecordById(Long apRecordId) throws HmsException {
        return apRecordRepository.findById(apRecordId)
                .orElseThrow(() -> new HmsException("APPOINTMENT_RECORD_NOT_FOUND")).toDto();
    }

    @Override
    public ApRecordDTO getApRecordDetailsByAppointmentId(Long appointmentId) throws HmsException {
        ApRecordDTO record = apRecordRepository.findByAppointment_IdAppointment(appointmentId)
                .orElseThrow(() -> new HmsException("APPOINTMENT_RECORD_NOT_FOUND")).toDto();
        record.setPrescription(prescriptionService.getPrescriptionByAppointmentId(appointmentId));
        return record;
    }

}
