package com.hms.pharmacy.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.pharmacy.dto.PharmacySaleDto;
import com.hms.pharmacy.exception.HmsException;
import com.hms.pharmacy.service.pharmacy_sale.PharmacySaleService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@CrossOrigin
@RequestMapping("pharmacy/sales")
public class PharmacySaleApi {
    private final PharmacySaleService pharmacySaleService;

    public PharmacySaleApi(PharmacySaleService pharmacySaleService) {
        this.pharmacySaleService = pharmacySaleService;
    }

    @PostMapping("/create")
    public ResponseEntity<Long> postMethodName(@RequestBody PharmacySaleDto dto) throws HmsException {
        return ResponseEntity.ok(pharmacySaleService.createSale(dto));
    }

    @PatchMapping("/update")
    public ResponseEntity<Void> updateSale(@RequestBody PharmacySaleDto dto) throws HmsException {
        pharmacySaleService.updateSale(dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{prescriptionId}")
    public ResponseEntity<Void> deleteSale(@PathVariable Long prescriptionId) throws HmsException {
        pharmacySaleService.deleteSale(prescriptionId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getById/{saleId}")
    public ResponseEntity<PharmacySaleDto> getById(@PathVariable Long saleId) throws HmsException {
        return ResponseEntity.ok(pharmacySaleService.getSaleById(saleId));
    }

    @GetMapping("/getByPrescriptionId/{prescriptionId}")
    public ResponseEntity<PharmacySaleDto> getByPrescriptionId(@PathVariable Long prescriptionId) throws HmsException {
        return ResponseEntity.ok(pharmacySaleService.getSaleByPrescriptionId(prescriptionId));
    }

}
