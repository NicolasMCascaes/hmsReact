package com.hms.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.pharmacy.entity.MedicineInventory;

public interface MedicineInventoryRepository extends JpaRepository<MedicineInventory, Long> {

}
