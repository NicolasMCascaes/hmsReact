package com.hms.pharmacy.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hms.pharmacy.entity.MedicineInventory;
import com.hms.pharmacy.entity.StockStatus;

@Repository
public interface MedicineInventoryRepository extends JpaRepository<MedicineInventory, Long> {
    @Query("SELECT mi FROM MedicineInventory mi WHERE mi.expireDate <= :now AND mi.stockStatus = :stockStatus")
    List<MedicineInventory> findExpiredMedicines(LocalDate now, StockStatus stockStatus);

    List<MedicineInventory> findByMedicine_IdMedicineAndExpireDateAfterAndQuantityGreaterThanAndStockStatusNotOrderByExpireDateAsc(
            Long medicineId, LocalDate now, Integer quantity, StockStatus status);

}
