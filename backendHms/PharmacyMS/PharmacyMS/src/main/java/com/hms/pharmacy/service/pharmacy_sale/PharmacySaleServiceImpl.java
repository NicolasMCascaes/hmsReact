package com.hms.pharmacy.service.pharmacy_sale;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.pharmacy.dto.PharmacySaleDto;
import com.hms.pharmacy.entity.PharmacySale;
import com.hms.pharmacy.exception.HmsException;
import com.hms.pharmacy.repository.PharmacySaleRepository;

@Service
@Transactional
public class PharmacySaleServiceImpl implements PharmacySaleService {

    private final PharmacySaleRepository pharmacySaleRepository;

    public PharmacySaleServiceImpl(PharmacySaleRepository pharmacySaleRepository) {
        this.pharmacySaleRepository = pharmacySaleRepository;
    }

    @Override
    public Long createSale(PharmacySaleDto dto) throws HmsException {
        if (pharmacySaleRepository.existsByPrescriptionId(dto.getPrescriptionId())) {
            throw new HmsException("SALE_ALREADY_EXISTS");
        }
        if (dto.getSaleDate() == null) {
            dto.setSaleDate(LocalDateTime.now());
        }
        PharmacySale savedSale = pharmacySaleRepository.save(dto.toEntity());
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
