package com.hms.pharmacy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.pharmacy.entity.PharmacySaleItem;

@Repository
public interface PharmacySaleItemRepository extends JpaRepository<PharmacySaleItem, Long> {
    List<PharmacySaleItem> findAllBySaleId(Long saleId);

    List<PharmacySaleItem> findAllByMedicine(Long medicineId);
}
