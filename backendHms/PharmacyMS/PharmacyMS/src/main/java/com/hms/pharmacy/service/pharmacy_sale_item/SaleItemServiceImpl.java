package com.hms.pharmacy.service.pharmacy_sale_item;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.pharmacy.dto.PharmacySaleItemDto;
import com.hms.pharmacy.entity.PharmacySaleItem;
import com.hms.pharmacy.exception.HmsException;
import com.hms.pharmacy.repository.PharmacySaleItemRepository;

@Service
@Transactional
public class SaleItemServiceImpl implements SaleItemService {
    private final PharmacySaleItemRepository repository;

    public SaleItemServiceImpl(PharmacySaleItemRepository repository) {
        this.repository = repository;
    }

    @Override
    public Long createSaleItem(PharmacySaleItemDto dto) throws HmsException {
        return repository.save(dto.toEntity()).getIdPharmacySaleItem();
    }

    @Override
    public void deleteSaleItem(Long itemId) throws HmsException {
        repository.deleteById(itemId);
    }

    @Override
    public void createMultipleSaleItem(Long saleId, Long medicineId, List<PharmacySaleItemDto> saleItems)
            throws HmsException {
        saleItems.stream().map((sale) -> {
            sale.setMedicineId(medicineId);
            sale.setSaleId(saleId);
            return sale.toEntity();
        }).forEach(repository::save);
        ;
    }

    @Override
    public void updateSaleItem(PharmacySaleItemDto dto) throws HmsException {
        PharmacySaleItem existingItem = repository.findById(dto.getIdPharmacySale())
                .orElseThrow(() -> new HmsException("ITEM_NOT_FOUND"));
        existingItem.setUnitPrice(dto.getUnitPrice());
        existingItem.setQuantity(dto.getQuantity());
        repository.save(dto.toEntity());
    }

    @Override
    public List<PharmacySaleItemDto> getItemBySaleId(Long saleId) throws HmsException {
        return repository.findAllBySaleId(saleId).stream().map(PharmacySaleItem::toDto).toList();
    }

    @Override
    public PharmacySaleItemDto getItemById(Long saleId) throws HmsException {
        return repository.findById(saleId).orElseThrow(() -> new HmsException("ITEM_NOT_FOUND")).toDto();
    }

}
