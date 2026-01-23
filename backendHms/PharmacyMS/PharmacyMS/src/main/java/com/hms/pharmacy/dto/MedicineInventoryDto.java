package com.hms.pharmacy.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.hms.pharmacy.entity.Medicine;
import com.hms.pharmacy.entity.MedicineInventory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicineInventoryDto {
    private Long id;
    private Long medicineId;
    private String batchNo;
    private Integer quantity;
    private LocalDate expireDate;
    private LocalDateTime addedDate;

    public MedicineInventory toEntity() {
        return new MedicineInventory(this.id, new Medicine(this.medicineId), this.batchNo, this.quantity,
                this.expireDate,
                this.addedDate);
    }
}
