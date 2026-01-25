package com.hms.pharmacy.service.medicine_inventory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.pharmacy.dto.MedicineInventoryDto;
import com.hms.pharmacy.entity.MedicineInventory;
import com.hms.pharmacy.exception.HmsException;
import com.hms.pharmacy.repository.MedicineInventoryRepository;
import com.hms.pharmacy.service.medicine.MedicineService;

@Service
@Transactional
public class MedicineInventoryServiceImpl implements MedicineInventoryService {
    private final MedicineInventoryRepository medicineInventoryRepository;
    private final MedicineService medicineService;

    public MedicineInventoryServiceImpl(MedicineInventoryRepository medicineInventoryRepository,
            MedicineService medicineService) {
        this.medicineInventoryRepository = medicineInventoryRepository;
        this.medicineService = medicineService;
    }

    @Override
    public List<MedicineInventoryDto> getAllMedicines() throws HmsException {
        return medicineInventoryRepository.findAll().stream().map(MedicineInventory::toDto).toList();
    }

    @Override
    public MedicineInventoryDto getMedicineById(Long idMedicine) throws HmsException {
        MedicineInventory medicineInventory = medicineInventoryRepository.findById(idMedicine)
                .orElseThrow(() -> new HmsException("MEDICINE_NOT_FOUND"));
        return medicineInventory.toDto();
    }

    @Override
    public Long addMedicine(MedicineInventoryDto medicineInventory) throws HmsException {
        medicineInventory.setAddedDate(LocalDateTime.now());
        return medicineInventoryRepository.save(medicineInventory.toEntity()).getId();
    }

    @Override
    public void updateMedicine(MedicineInventoryDto medicineInventory) throws HmsException {
        MedicineInventory existingMedicineInventory = medicineInventoryRepository.findById(medicineInventory.getId())
                .orElseThrow(() -> new HmsException("MEDICINE_NOT_FOUND"));

        existingMedicineInventory
                .setMedicine(medicineService.getMedicineById(medicineInventory.getMedicineId()).toEntity());
        existingMedicineInventory.setBatchNo(medicineInventory.getBatchNo());
        existingMedicineInventory.setQuantity(medicineInventory.getQuantity());
        existingMedicineInventory.setExpireDate(medicineInventory.getExpireDate());
        existingMedicineInventory.setAddedDate(existingMedicineInventory.getAddedDate());

        medicineInventoryRepository.save(existingMedicineInventory);
    }

    @Override
    public void deleteMedicine(Long idMedicineInventory) throws HmsException {

        medicineInventoryRepository.deleteById(idMedicineInventory);
    }

}
