package com.hms.AppointmentsMS.services;

import com.hms.AppointmentsMS.dto.ApRecordDTO;
import com.hms.AppointmentsMS.exceptions.HmsException;

public interface ApRecordService {
    public Long createApRecord(ApRecordDTO apRecordDTO) throws HmsException;

    public void updateApRecord(ApRecordDTO apRecordDTO) throws HmsException;

    public ApRecordDTO getApRecordByAppointmentId(Long appointmentId) throws HmsException;

    public ApRecordDTO getApRecordById(Long apRecordId) throws HmsException;
}
