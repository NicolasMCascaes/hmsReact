package com.hms.AppointmentsMS.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.AppointmentsMS.entity.Medicine;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findAllByPrescription_IdPrescription(Long prescriptionId);

    List<Medicine> findAllByPrescription_IdPrescriptionIn(List<Long> prescriptionIds);
}
