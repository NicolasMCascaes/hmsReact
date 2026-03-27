package com.hms.pharmacy.dto;

import java.time.LocalDateTime;

import com.hms.pharmacy.entity.PharmacySale;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PharmacySaleDto {
    private Long id;
    @NotNull(message = "Prescription id must not be null")
    private Long prescriptionId;
    private LocalDateTime saleDate;
    @NotNull(message = "Total amount must not be null")
    private Double totalAmount;
    private String buyerName;
    private String contactPhone;

    public PharmacySale toEntity() {
        return new PharmacySale(this.id, this.prescriptionId, this.buyerName, this.contactPhone, this.saleDate,
                this.totalAmount);
    }
}
