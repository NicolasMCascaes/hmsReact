package com.hms.pharmacy.dto;

import java.math.BigDecimal;

import com.hms.pharmacy.entity.Medicine;
import com.hms.pharmacy.entity.PharmacySale;
import com.hms.pharmacy.entity.PharmacySaleItem;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PharmacySaleItemDto {
    private Long idPharmacySale;
    @NotNull(message = "Sale id must not be null!")
    private Long saleId;
    @NotNull(message = "Medicine id must not be null")
    private Long medicineId;
    private String batchNo;
    @NotNull()
    @Min(value = 1, message = "Quantity should not be less than 1")
    private Integer quantity;
    @NotNull(message = "Unit price should not be null")
    private BigDecimal unitPrice;

    public PharmacySaleItem toEntity() {
        return new PharmacySaleItem(this.idPharmacySale, new PharmacySale(this.saleId),
                new Medicine(this.medicineId), batchNo, quantity, unitPrice);
    }
}
