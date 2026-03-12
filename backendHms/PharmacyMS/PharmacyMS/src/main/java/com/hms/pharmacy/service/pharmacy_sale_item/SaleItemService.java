package com.hms.pharmacy.service.pharmacy_sale_item;

import java.util.List;

import com.hms.pharmacy.dto.PharmacySaleItemDto;
import com.hms.pharmacy.exception.HmsException;

public interface SaleItemService {
    Long createSaleItem(PharmacySaleItemDto dto) throws HmsException;

    void deleteSaleItem(Long itemId) throws HmsException;

    void createMultipleSaleItem(Long saleId, Long medicineId, List<PharmacySaleItemDto> saleItems) throws HmsException;

    void updateSaleItem(PharmacySaleItemDto dto) throws HmsException;

    List<PharmacySaleItemDto> getItemBySaleId(Long saleId) throws HmsException;

    PharmacySaleItemDto getItemById(Long saleId) throws HmsException;

}
