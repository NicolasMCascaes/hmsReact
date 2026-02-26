package com.hms.pharmacy.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.hms.pharmacy.dto.MedicineDto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMedicine;
    private String name;
    private Category category;
    private Type type;
    private String manufacturer;
    private BigDecimal price;
    private Integer stock;
    private LocalDateTime createdAt;
    private String dosage;

    public MedicineDto toDto() {
        return new MedicineDto(this.idMedicine, this.name, this.category, this.type, this.manufacturer, this.price,
                this.stock, this.createdAt, this.dosage);
    }

    public Medicine(Long idMedicine) {
        this.idMedicine = idMedicine;
    }
}
