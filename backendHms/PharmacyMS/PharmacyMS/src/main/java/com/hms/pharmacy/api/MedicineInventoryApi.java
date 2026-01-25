package com.hms.pharmacy.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.pharmacy.dto.MedicineInventoryDto;
import com.hms.pharmacy.exception.HmsException;
import com.hms.pharmacy.service.medicine_inventory.MedicineInventoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@Valid
@CrossOrigin
@RequestMapping("pharmacy/inventory")
public class MedicineInventoryApi {
    private final MedicineInventoryService medicineInventoryService;

    public MedicineInventoryApi(MedicineInventoryService medicineInventoryService) {
        this.medicineInventoryService = medicineInventoryService;
    }

    @PostMapping("/addMedicine")
    public ResponseEntity<Long> addMedicine(@RequestBody MedicineInventoryDto dto) throws HmsException {
        return ResponseEntity.ok(medicineInventoryService.addMedicine(dto));
    }

    @GetMapping("/getAllMedicines")
    public ResponseEntity<List<MedicineInventoryDto>> getAllMedicines() throws HmsException {
        return ResponseEntity.ok(medicineInventoryService.getAllMedicines());
    }

    @PatchMapping("/updateMedicine")
    public ResponseEntity<Void> updateMedicine(@RequestBody @Valid MedicineInventoryDto dto) throws HmsException {
        medicineInventoryService.updateMedicine(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getMedicineById")
    public ResponseEntity<MedicineInventoryDto> getMedicineById(@PathVariable Long id) throws HmsException {
        return ResponseEntity.ok(medicineInventoryService.getMedicineById(id));
    }

    @DeleteMapping("/deleteMedicine")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long idMedicine) throws HmsException {
        medicineInventoryService.deleteMedicine(idMedicine);
        return ResponseEntity.ok().build();
    }

}
