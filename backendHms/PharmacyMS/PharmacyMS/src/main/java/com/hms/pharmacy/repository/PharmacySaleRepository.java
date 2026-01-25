package com.hms.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.pharmacy.entity.PharmacySale;

@Repository
public interface PharmacySaleRepository extends JpaRepository<PharmacySale, Long> {

}
