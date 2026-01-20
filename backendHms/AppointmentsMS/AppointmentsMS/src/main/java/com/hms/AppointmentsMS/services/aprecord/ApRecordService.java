package com.hms.AppointmentsMS.services.aprecord;

import java.util.List;
import java.util.UUID;

import com.hms.AppointmentsMS.dto.aprecord.ApRecordDTO;
import com.hms.AppointmentsMS.dto.aprecord.RecordDetails;
import com.hms.AppointmentsMS.exceptions.HmsException;

public interface ApRecordService {
    public Long createApRecord(ApRecordDTO apRecordDTO) throws HmsException;

    public void updateApRecord(ApRecordDTO apRecordDTO) throws HmsException;

    public ApRecordDTO getApRecordByAppointmentId(Long appointmentId) throws HmsException;

    public ApRecordDTO getApRecordById(Long apRecordId) throws HmsException;

    public ApRecordDTO getApRecordDetailsByAppointmentId(Long appointmentId) throws HmsException;

    public List<RecordDetails> getRecordsByPatientId(UUID patientId) throws HmsException;

    public List<RecordDetails> getRecordsById(Long recordId) throws HmsException;

}
