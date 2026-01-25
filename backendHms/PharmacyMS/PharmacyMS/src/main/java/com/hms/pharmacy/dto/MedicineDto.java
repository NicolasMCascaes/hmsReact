package com.hms.pharmacy.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.hms.pharmacy.entity.Category;
import com.hms.pharmacy.entity.Medicine;
import com.hms.pharmacy.entity.Type;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicineDto {
    private Long idMedicine;
    @NotBlank(message = "Medicine name can not be blank!")
    private String name;
    private Category category;
    @NotNull(message = "Medicine type can not be null!")
    private Type type;
    private String manufacturer;
    @NotNull(message = "Medicine price can not be null!")
    private BigDecimal price;
    private LocalDateTime createdAt;
    @NotBlank(message = "Medicine dosage can not be blank!")
    private String dosage;

    public Medicine toEntity() {
        return new Medicine(this.idMedicine, this.name, this.category, this.type, this.manufacturer, this.price,
                this.createdAt, this.dosage);
    }
}
