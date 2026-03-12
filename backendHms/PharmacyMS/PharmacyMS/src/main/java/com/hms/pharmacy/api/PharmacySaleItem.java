package com.hms.pharmacy.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hms.pharmacy.dto.PharmacySaleItemDto;
import com.hms.pharmacy.exception.HmsException;
import com.hms.pharmacy.service.pharmacy_sale_item.SaleItemService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin
@RequestMapping("pharmacy/saleItem")
public class PharmacySaleItem {
    private final SaleItemService saleItemService;

    public PharmacySaleItem(SaleItemService saleItemService) {
        this.saleItemService = saleItemService;
    }

    @PostMapping("/create")
    public ResponseEntity<Long> createSaleItem(@RequestBody @Valid PharmacySaleItemDto dto) throws HmsException {
        return ResponseEntity.ok(saleItemService.createSaleItem(dto));
    }

    @DeleteMapping("/delete/{itemId}")
    public ResponseEntity<Void> deleteSaleItem(@PathVariable Long itemId) throws HmsException {
        saleItemService.deleteSaleItem(itemId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/createMultipleSaleItems")
    public ResponseEntity<Void> createMultipleSaleItems(@RequestBody List<PharmacySaleItemDto> items,
            @RequestParam Long medicineid, @RequestParam Long saleId) throws HmsException {
        saleItemService.createMultipleSaleItem(saleId, medicineid, items);
        return ResponseEntity.ok().build();
    }

}
