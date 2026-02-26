package com.hms.pharmacy.service.medicine;

import java.util.List;

import com.hms.pharmacy.dto.MedicineDto;
import com.hms.pharmacy.exception.HmsException;

public interface MedicineService {
    public Long addMedicine(MedicineDto medicineDto) throws HmsException;

    public MedicineDto getMedicineById(Long id) throws HmsException;

    public void updateMedicine(MedicineDto medicineDto) throws HmsException;

    public void deleteMedicine(Long id) throws HmsException;

    public List<MedicineDto> getAllMedicines() throws HmsException;

    public Integer getMedicineStockById(Long id) throws HmsException;

    public Integer addStock(Long id, Integer quantity) throws HmsException;

    public Integer reduceStock(Long id, Integer quantity) throws HmsException;

}
