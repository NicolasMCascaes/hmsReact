package com.hms.pharmacy.entity;

import java.time.LocalDateTime;

import com.hms.pharmacy.dto.PharmacySaleDto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PharmacySale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long prescriptionId;
    private LocalDateTime saleDate;
    private Double totalAmount;

    public PharmacySale(Long id) {
        this.id = id;
    }

    public PharmacySaleDto toDto() {
        return new PharmacySaleDto(this.id, this.prescriptionId, this.saleDate, this.totalAmount);
    }

}
