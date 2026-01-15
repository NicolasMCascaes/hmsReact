package com.hms.AppointmentsMS.dto;

import com.hms.AppointmentsMS.entity.Medicine;
import com.hms.AppointmentsMS.entity.Prescription;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicineDto {
    private Long idMedicine;
    private String name;
    private String medicineId;
    private String dosage;
    private String frequency;
    private Integer duration;
    private String route;
    private String type;
    private String instructions;
    private Long prescriptionId;

    public Medicine toEntity() {
        return new Medicine(this.idMedicine, this.name, this.medicineId, this.dosage, this.frequency, this.duration,
                this.route, this.type, this.instructions,
                new Prescription(this.prescriptionId));
    }
}
