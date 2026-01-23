package com.hms.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.pharmacy.entity.Medicine;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

}
