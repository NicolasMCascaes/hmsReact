package com.hms.pharmacy.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.hms.pharmacy.dto.MedicineInventoryDto;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
public class MedicineInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicineId", nullable = false)
    private Medicine medicine;
    private String batchNo;
    private Integer quantity;
    private LocalDate expireDate;
    private LocalDateTime addedDate;
    private Integer initialQuantity;
    @Enumerated(EnumType.STRING)
    private StockStatus stockStatus;

    public MedicineInventoryDto toDto() {
        return new MedicineInventoryDto(this.id, medicine.getIdMedicine(), this.batchNo, this.quantity, this.expireDate,
                this.addedDate, this.initialQuantity, this.stockStatus);
    }
}
