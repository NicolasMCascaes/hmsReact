package com.hms.AppointmentsMS.entity;

import com.hms.AppointmentsMS.dto.MedicineDto;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMedicine;
    private String name;
    private String medicineId;
    private String dosage;
    private String frequency;
    private Integer duration;
    private String route;
    private String type;
    private String instructions;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescriptionId")
    private Prescription prescription;

    public Medicine(Long idMedicine) {
        this.idMedicine = idMedicine;
    }

    public MedicineDto toDto() {
        return new MedicineDto(idMedicine, name, medicineId, dosage, frequency, duration, route, type, instructions,
                prescription.getIdPrescription());
    }
}
