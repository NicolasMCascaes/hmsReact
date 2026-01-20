package com.hms.AppointmentsMS.services.prescription;

import com.hms.AppointmentsMS.dto.prescription.PrescriptionDTO;
import com.hms.AppointmentsMS.exceptions.HmsException;

public interface PrescriptionService {
    public Long savePrescription(PrescriptionDTO dto) throws HmsException;

    public PrescriptionDTO getPrescriptionByAppointmentId(Long appointmentId) throws HmsException;

    public PrescriptionDTO getPrescriptionId(Long appointmentId) throws HmsException;
}
