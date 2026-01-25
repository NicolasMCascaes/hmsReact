package com.hms.pharmacy.service.medicine;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.pharmacy.dto.MedicineDto;
import com.hms.pharmacy.entity.Medicine;
import com.hms.pharmacy.exception.HmsException;
import com.hms.pharmacy.repository.MedicineRepository;

@Service
@Transactional
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;

    public MedicineServiceImpl(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;

    }

    @Override
    public Long addMedicine(MedicineDto medicineDto) throws HmsException {
        Optional<Medicine> optional = medicineRepository.findByNameIgnoreCaseAndDosageIgnoreCase(medicineDto.getName(),
                medicineDto.getDosage());
        if (optional.isPresent()) {
            throw new HmsException("MEDICINE_ALREADY_EXISTS");
        }
        medicineDto.setCreatedAt(LocalDateTime.now());
        return medicineRepository.save(medicineDto.toEntity()).getIdMedicine();
    }

    @Override
    public MedicineDto getMedicineById(Long id) throws HmsException {
        return medicineRepository.findById(id).orElseThrow(() -> new HmsException("MEDICINE_NOT_FOUND")).toDto();
    }

    @Override
    public void updateMedicine(MedicineDto medicineDto) throws HmsException {
        System.out.println("ID desse lixo de medicine: " + medicineDto.getIdMedicine());
        Medicine existingMedicine = medicineRepository.findById(medicineDto.getIdMedicine())
                .orElseThrow(() -> new HmsException("MEDICINE_NOT_FOUND"));

        Optional<Medicine> optional = medicineRepository
                .findByNameIgnoreCaseAndDosageIgnoreCase(medicineDto.getName(), medicineDto.getDosage());

        if (optional.isPresent() && !optional.get().getIdMedicine().equals(existingMedicine.getIdMedicine())) {
            throw new HmsException("MEDICINE_ALREADY_EXISTS");
        }
        existingMedicine.setName(medicineDto.getName());
        existingMedicine.setCategory(medicineDto.getCategory());
        existingMedicine.setType(medicineDto.getType());
        existingMedicine.setManufacturer(medicineDto.getManufacturer());
        existingMedicine.setPrice(medicineDto.getPrice());
        existingMedicine.setCreatedAt(medicineDto.getCreatedAt());
        existingMedicine.setDosage(medicineDto.getDosage());

        medicineRepository.save(existingMedicine);
    }

    @Override
    public void deleteMedicine(Long id) throws HmsException {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteMedicine'");
    }

    @Override
    public List<MedicineDto> getAllMedicines() throws HmsException {
        return medicineRepository.findAll().stream().map(Medicine::toDto).toList();
    }

}
