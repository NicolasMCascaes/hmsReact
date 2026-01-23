package com.hms.pharmacy.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.hms.pharmacy.entity.Category;
import com.hms.pharmacy.entity.Medicine;
import com.hms.pharmacy.entity.Type;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicineDto {
    private Long idMedicine;
    private String name;
    private Category category;
    private Type type;
    private String manufacturer;
    private BigDecimal price;
    private LocalDateTime createdAt;
    private String dosage;

    public Medicine toEntity() {
        return new Medicine(this.idMedicine, this.name, this.category, this.type, this.manufacturer, this.price,
                this.createdAt, this.dosage);
    }
}
