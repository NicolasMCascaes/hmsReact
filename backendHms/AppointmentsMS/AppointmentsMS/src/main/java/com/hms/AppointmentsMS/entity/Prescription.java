package com.hms.AppointmentsMS.entity;

import java.time.LocalDate;
import java.util.UUID;

import com.hms.AppointmentsMS.dto.PrescriptionDTO;

import jakarta.persistence.OneToOne;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPrescription;
    private UUID patientId;
    private UUID doctorId;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    private LocalDate prescriptionDate;
    private String notes;

    public Prescription(Long idPrescription) {
        this.idPrescription = idPrescription;
    }

    public PrescriptionDTO toDto() {
        return new PrescriptionDTO(this.idPrescription, this.patientId, this.doctorId, this.idPrescription,
                this.prescriptionDate, this.notes, null);
    }
}
