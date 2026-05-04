package com.hms.AppointmentsMS.services.medicine;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.hms.AppointmentsMS.dto.medicine.MedicineDto;
import com.hms.AppointmentsMS.entity.Medicine;
import com.hms.AppointmentsMS.exceptions.HmsException;
import com.hms.AppointmentsMS.repositories.MedicineRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class MedicineServiceImpl implements MedicineService {
    private final MedicineRepository medicineRepository;

    public MedicineServiceImpl(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    @Override
    public Long saveMedicine(MedicineDto medicineDto) throws HmsException {
        return medicineRepository.save(medicineDto.toEntity()).getIdMedicine();
    }

    @Override
    public List<MedicineDto> saveAllMedicines(List<MedicineDto> medicines) throws HmsException {
        List<Medicine> medicineEntities = medicines.stream()
                .map(MedicineDto::toEntity)
                .collect(Collectors.toCollection(ArrayList::new));
        return medicineRepository.saveAll(medicineEntities)
                .stream().map(Medicine::toDto).collect(Collectors.toCollection(ArrayList::new));
    }

    @Override
    public List<MedicineDto> getAllMedicinesByPrescriptionId(Long id) throws HmsException {
        return medicineRepository.findAllByPrescription_IdPrescription(id).stream().map(Medicine::toDto)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    @Override
    public List<MedicineDto> getMedicinesByPrescriptionIds(List<Long> prescriptionIds) throws HmsException {
        return medicineRepository.findAllByPrescription_IdPrescriptionIn(prescriptionIds).stream().map(Medicine::toDto)
                .collect(Collectors.toCollection(ArrayList::new));
    }

}
