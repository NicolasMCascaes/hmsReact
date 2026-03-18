package com.hms.pharmacy.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hms.pharmacy.dto.MedicineDropdown;
import com.hms.pharmacy.entity.Medicine;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    Optional<Medicine> findByNameIgnoreCaseAndDosageIgnoreCase(String name, String dosage);

    @Query("SELECT m.stock FROM Medicine m WHERE m.idMedicine = :id")
    Optional<Integer> findStockByIdMedicine(@Param("id") Long id);

    @Query("SELECT m.idMedicine AS id, m.name AS name, m.manufacturer as manufacturer FROM Medicine m ORDER BY m.name ASC")
    List<MedicineDropdown> findAllMedicineDropdown();

}
