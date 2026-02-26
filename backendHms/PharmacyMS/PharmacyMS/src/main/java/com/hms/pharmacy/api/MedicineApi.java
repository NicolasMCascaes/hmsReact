package com.hms.pharmacy.api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.pharmacy.dto.MedicineDto;
import com.hms.pharmacy.dto.ResponseDto;
import com.hms.pharmacy.exception.HmsException;
import com.hms.pharmacy.service.medicine.MedicineService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@Validated
@CrossOrigin
@RequestMapping("pharmacy/medicine")
public class MedicineApi {
    private final MedicineService medicineService;

    public MedicineApi(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @PostMapping("/add")
    public ResponseEntity<Long> addMedicine(@RequestBody MedicineDto medicineDto) throws HmsException {
        return new ResponseEntity<>(medicineService.addMedicine(medicineDto), HttpStatus.OK);
    }

    @GetMapping("/getMedicineById/{idMedicine}")
    public ResponseEntity<MedicineDto> getMedicineByid(@PathVariable Long idMedicine) throws HmsException {
        return new ResponseEntity<>(medicineService.getMedicineById(idMedicine), HttpStatus.OK);
    }

    @GetMapping("/getAllMedicines")
    public ResponseEntity<List<MedicineDto>> getAllMedicines() throws HmsException {
        return new ResponseEntity<>(medicineService.getAllMedicines(), HttpStatus.OK);
    }

    @PatchMapping("/update")
    public ResponseEntity<ResponseDto> updateMedicine(@RequestBody MedicineDto medicineDto) throws HmsException {
        medicineService.updateMedicine(medicineDto);
        return new ResponseEntity<>(new ResponseDto("MedicineUpdated"), HttpStatus.OK);
    }

    @GetMapping("/getStockById/{id}")
    public ResponseEntity<Integer> getStockById(@PathVariable Long id) throws HmsException {
        return new ResponseEntity<>(medicineService.getMedicineStockById(id), HttpStatus.OK);
    }

    @PatchMapping("/addStock/{id}/{quantity}")
    public ResponseEntity<ResponseDto> addStock(@PathVariable Long id, @PathVariable Integer quantity)
            throws HmsException {
        medicineService.addStock(id, quantity);
        return new ResponseEntity<>(new ResponseDto("StockAdded"), HttpStatus.OK);
    }

    @PatchMapping("/reduceStock/{id}/{quantity}")
    public ResponseEntity<ResponseDto> reduceStock(@PathVariable Long id, @PathVariable Integer quantity)
            throws HmsException {
        medicineService.reduceStock(id, quantity);
        return new ResponseEntity<>(new ResponseDto("StockReduced"), HttpStatus.OK);
    }

}
