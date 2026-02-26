package com.hms.pharmacy.service.medicine_inventory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.pharmacy.dto.MedicineInventoryDto;
import com.hms.pharmacy.entity.MedicineInventory;
import com.hms.pharmacy.entity.StockStatus;
import com.hms.pharmacy.exception.HmsException;
import com.hms.pharmacy.repository.MedicineInventoryRepository;
import com.hms.pharmacy.service.medicine.MedicineService;

@Service
@Transactional
public class MedicineInventoryServiceImpl implements MedicineInventoryService {
    private static final Logger LOGGER = Logger.getLogger(MedicineInventoryServiceImpl.class.getName());
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
        medicineInventory.setStockStatus(StockStatus.ACTIVE);
        medicineService.addStock(medicineInventory.getMedicineId(), medicineInventory.getQuantity());
        medicineInventory.setInitialQuantity(medicineInventory.getQuantity());
        return medicineInventoryRepository.save(medicineInventory.toEntity()).getId();
    }

    @Override
    public void updateMedicine(MedicineInventoryDto medicineInventory) throws HmsException {
        MedicineInventory existingMedicineInventory = medicineInventoryRepository.findById(medicineInventory.getId())
                .orElseThrow(() -> new HmsException("INVENTORY_NOT_FOUND"));
        if (existingMedicineInventory.getQuantity() < medicineInventory.getQuantity()) {
            medicineService.addStock(medicineInventory.getMedicineId(),
                    medicineInventory.getQuantity() - existingMedicineInventory.getQuantity());
        } else if (existingMedicineInventory.getQuantity() > medicineInventory.getQuantity()) {
            medicineService.reduceStock(medicineInventory.getMedicineId(),
                    existingMedicineInventory.getQuantity() - medicineInventory.getQuantity());
        }

        existingMedicineInventory.setBatchNo(medicineInventory.getBatchNo());
        existingMedicineInventory.setInitialQuantity(medicineInventory.getQuantity());
        existingMedicineInventory.setQuantity(medicineInventory.getQuantity());
        existingMedicineInventory.setExpireDate(medicineInventory.getExpireDate());
        existingMedicineInventory.setAddedDate(existingMedicineInventory.getAddedDate());

        medicineInventoryRepository.save(existingMedicineInventory);
    }

    @Override
    public void deleteMedicine(Long idMedicineInventory) throws HmsException {
        MedicineInventory existingMedicineInventory = medicineInventoryRepository.findById(idMedicineInventory)
                .orElseThrow(() -> new HmsException("INVENTORY_NOT_FOUND"));
        if (existingMedicineInventory.getQuantity() != null && existingMedicineInventory.getQuantity() > 0) {
            medicineService.reduceStock(existingMedicineInventory.getMedicine().getIdMedicine(),
                    existingMedicineInventory.getQuantity());
        }
        medicineInventoryRepository.deleteById(idMedicineInventory);
    }

    @Override
    @Scheduled(cron = "0 21 09 * * ?")
    public void deleteExpiredMedicines() throws HmsException {
        LOGGER.info(() -> "Deleting expired medicines at: " + LocalDateTime.now());
        List<MedicineInventory> expiredMedicines = medicineInventoryRepository.findExpiredMedicines(LocalDate.now(),
                StockStatus.ACTIVE);
        for (MedicineInventory medicineInventory : expiredMedicines) {
            if (medicineInventory.getQuantity() != null && medicineInventory.getQuantity() > 0) {
                medicineService.reduceStock(medicineInventory.getMedicine().getIdMedicine(),
                        medicineInventory.getQuantity());
                medicineInventory.setQuantity(0);
            }
            medicineInventory.setStockStatus(StockStatus.DELETED);
        }
        medicineInventoryRepository.saveAll(expiredMedicines);
    }
}
