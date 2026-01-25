package com.hms.pharmacy.entity;

import java.math.BigDecimal;

import com.hms.pharmacy.dto.PharmacySaleItemDto;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

public class PharmacySaleItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPharmacySaleItem;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id")
    private PharmacySale sale;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;
    private String batchNo;
    private Integer quantity;
    private BigDecimal unitPrice;

    public PharmacySaleItemDto toDto() {
        return new PharmacySaleItemDto(idPharmacySaleItem, sale.getId(), medicine.getIdMedicine(), batchNo,
                quantity, unitPrice);
    }
}
