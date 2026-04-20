package com.hms.AppointmentsMS.services.medicine;

import java.util.List;

import com.hms.AppointmentsMS.dto.medicine.MedicineDto;
import com.hms.AppointmentsMS.exceptions.HmsException;

public interface MedicineService {
    public Long saveMedicine(MedicineDto medicineDto) throws HmsException;

    public List<MedicineDto> saveAllMedicines(List<MedicineDto> medicines) throws HmsException;

    public List<MedicineDto> getAllMedicinesByPrescriptionId(Long id) throws HmsException;

    public List<MedicineDto> getMedicinesByPrescriptionIds(List<Long> prescriptionIds) throws HmsException;
}
