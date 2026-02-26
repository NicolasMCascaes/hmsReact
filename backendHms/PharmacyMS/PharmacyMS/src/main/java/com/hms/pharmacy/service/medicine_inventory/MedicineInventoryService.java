package com.hms.pharmacy.service.medicine_inventory;

import java.util.List;

import com.hms.pharmacy.dto.MedicineInventoryDto;
import com.hms.pharmacy.exception.HmsException;

public interface MedicineInventoryService {
    List<MedicineInventoryDto> getAllMedicines() throws HmsException;

    MedicineInventoryDto getMedicineById(Long idMedicine) throws HmsException;

    Long addMedicine(MedicineInventoryDto medicineInventory) throws HmsException;

    void updateMedicine(MedicineInventoryDto medicineInventory) throws HmsException;

    void deleteMedicine(Long idMedicine) throws HmsException;

    void deleteExpiredMedicines() throws HmsException;
}
