package com.hms.pharmacy.service.pharmacy_sale;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.pharmacy.dto.PharmacySaleDto;
import com.hms.pharmacy.dto.PharmacySaleItemDto;
import com.hms.pharmacy.dto.SaleRequest;
import com.hms.pharmacy.entity.PharmacySale;
import com.hms.pharmacy.exception.HmsException;
import com.hms.pharmacy.repository.PharmacySaleRepository;
import com.hms.pharmacy.service.medicine_inventory.MedicineInventoryService;
import com.hms.pharmacy.service.pharmacy_sale_item.SaleItemService;

@Service
@Transactional
public class PharmacySaleServiceImpl implements PharmacySaleService {

    private final PharmacySaleRepository pharmacySaleRepository;
    private final SaleItemService saleItemService;
    private final MedicineInventoryService medicineInventoryService;

    public PharmacySaleServiceImpl(PharmacySaleRepository pharmacySaleRepository, SaleItemService saleItemService,
            MedicineInventoryService medicineInventoryService) {
        this.pharmacySaleRepository = pharmacySaleRepository;
        this.saleItemService = saleItemService;
        this.medicineInventoryService = medicineInventoryService;
    }

    @Override
    public Long createSale(SaleRequest dto) throws HmsException {
        System.out.println("Creating sale with prescription ID: " + dto.getPrescriptionId());
        if (pharmacySaleRepository.existsByPrescriptionId(dto.getPrescriptionId())) {
            throw new HmsException("SALE_ALREADY_EXISTS");
        }

        for (PharmacySaleItemDto itemDto : dto.getSaleItems()) {
            itemDto.setBatchNo(medicineInventoryService.sellStock(itemDto.getMedicineId(), itemDto.getQuantity()));
        }
        PharmacySale savedSale = new PharmacySale(null, dto.getPrescriptionId(), LocalDateTime.now(),
                dto.getTotalAmount());
        pharmacySaleRepository.save(savedSale);
        saleItemService.createSaleItems(savedSale.getId(), dto.getSaleItems());
        return savedSale.getId();
    }

    @Override
    public void updateSale(PharmacySaleDto dto) throws HmsException {
        PharmacySale sale = pharmacySaleRepository.findByPrescriptionId(dto.getPrescriptionId())
                .orElseThrow(() -> new HmsException("SALE_NOT_FOUND"));
        sale.setSaleDate(dto.getSaleDate());
        sale.setTotalAmount(dto.getTotalAmount());
        pharmacySaleRepository.save(sale);
    }

    @Override
    public void deleteSale(Long prescriptionId) throws HmsException {
        pharmacySaleRepository.deleteByPrescriptionId(prescriptionId);
    }

    @Override
    public PharmacySaleDto getSaleById(long idSale) throws HmsException {
        PharmacySale sale = pharmacySaleRepository.findById(idSale)
                .orElseThrow(() -> new HmsException("SALE_NOT_FOUND"));
        return sale.toDto();
    }

    @Override
    public PharmacySaleDto getSaleByPrescriptionId(Long prescriptionId) throws HmsException {
        PharmacySale sale = pharmacySaleRepository.findByPrescriptionId(prescriptionId)
                .orElseThrow(() -> new HmsException("SALE_NOT_FOUND"));
        return sale.toDto();
    }

}
