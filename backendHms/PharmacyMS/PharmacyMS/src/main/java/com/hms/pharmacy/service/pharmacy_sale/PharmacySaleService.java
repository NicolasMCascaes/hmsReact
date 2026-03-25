package com.hms.pharmacy.service.pharmacy_sale;

import com.hms.pharmacy.dto.PharmacySaleDto;
import com.hms.pharmacy.dto.SaleRequest;
import com.hms.pharmacy.exception.HmsException;

public interface PharmacySaleService {
    Long createSale(SaleRequest dto) throws HmsException;

    void updateSale(PharmacySaleDto dto) throws HmsException;

    void deleteSale(Long prescriptionId) throws HmsException;

    PharmacySaleDto getSaleById(long idSale) throws HmsException;

    PharmacySaleDto getSaleByPrescriptionId(Long prescriptionId) throws HmsException;
}
