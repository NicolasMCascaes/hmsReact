package com.hms.pharmacy.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaleRequest {
    private Long prescriptionId;
    private String buyerName;
    private String contactPhone;
    private Double totalAmount;
    private List<PharmacySaleItemDto> saleItems;
}
