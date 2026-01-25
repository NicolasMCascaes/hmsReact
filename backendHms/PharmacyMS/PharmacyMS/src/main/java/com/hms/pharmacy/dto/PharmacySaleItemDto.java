package com.hms.pharmacy.dto;

import java.math.BigDecimal;

import com.hms.pharmacy.entity.Medicine;
import com.hms.pharmacy.entity.PharmacySale;
import com.hms.pharmacy.entity.PharmacySaleItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PharmacySaleItemDto {
    private Long idPharmacySale;
    private Long saleId;
    private Long medicineId;
    private String batchNo;
    private Integer quantity;
    private BigDecimal unitPrice;

    public PharmacySaleItem toEntity() {
        return new PharmacySaleItem(this.idPharmacySale, new PharmacySale(this.idPharmacySale),
                new Medicine(this.medicineId), batchNo, quantity, unitPrice);
    }
}
