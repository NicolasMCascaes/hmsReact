package com.hms.AppointmentsMS.services;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import com.hms.AppointmentsMS.dto.ApRecordDTO;
import com.hms.AppointmentsMS.entity.ApRecord;
import com.hms.AppointmentsMS.exceptions.HmsException;
import com.hms.AppointmentsMS.repositories.ApRecordRepository;
import com.hms.AppointmentsMS.utilities.StringListConverter;

@Service
public class ApRecordServiceImpl implements ApRecordService {

    private final ApRecordRepository apRecordRepository;

    public ApRecordServiceImpl(ApRecordRepository apRecordRepository) {
        this.apRecordRepository = apRecordRepository;
    }

    @Override
    public Long createApRecord(ApRecordDTO apRecordDTO) throws HmsException {
        Optional<ApRecord> existingRecord = apRecordRepository
                .findByAppointment_IdAppointment(apRecordDTO.getAppointmentId());
        if (existingRecord.isPresent()) {
            throw new HmsException("APPOINTMENT_RECORD_ALREADY_EXISTS");
        }
        return apRecordRepository.save(apRecordDTO.toEntity()).getIdRecord();
    }

    @Override
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

    }

    @Override
    public ApRecordDTO getApRecordByAppointmentId(Long appointmentId) throws HmsException {
        return apRecordRepository.findByAppointment_IdAppointment(appointmentId)
                .orElseThrow(() -> new HmsException("APPOINTMENT_RECORD_NOT_FOUND")).toDto();
    }

    @Override
    public ApRecordDTO getApRecordById(Long apRecordId) throws HmsException {
        return apRecordRepository.findById(apRecordId)
                .orElseThrow(() -> new HmsException("APPOINTMENT_RECORD_NOT_FOUND")).toDto();
    }

}
