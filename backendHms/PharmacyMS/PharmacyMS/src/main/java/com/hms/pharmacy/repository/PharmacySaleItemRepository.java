package com.hms.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.pharmacy.entity.PharmacySaleItem;

@Repository
public interface PharmacySaleItemRepository extends JpaRepository<PharmacySaleItem, Long> {

}
