package com.hms.AppointmentsMS.services;

import java.util.List;

import com.hms.AppointmentsMS.dto.MedicineDto;
import com.hms.AppointmentsMS.exceptions.HmsException;

public interface MedicineService {
    public Long saveMedicine(MedicineDto medicineDto) throws HmsException;

    public List<MedicineDto> saveAllMedicines(List<MedicineDto> medicines) throws HmsException;

    public List<MedicineDto> getAllMedicinesByPrescriptionId(Long id) throws HmsException;
}
