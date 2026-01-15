package com.hms.AppointmentsMS.services;

import org.springframework.stereotype.Service;

import com.hms.AppointmentsMS.dto.PrescriptionDTO;
import com.hms.AppointmentsMS.exceptions.HmsException;
import com.hms.AppointmentsMS.repositories.PrescriptionRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PrescriptionServiceImpl implements PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;

    private final MedicineService medicineService;

    public PrescriptionServiceImpl(PrescriptionRepository prescriptionRepository, MedicineService medicineService) {
        this.prescriptionRepository = prescriptionRepository;
        this.medicineService = medicineService;
    }

    @Override
    public Long savePrescription(PrescriptionDTO dto) throws HmsException {
        Long prescriptionId = prescriptionRepository.save(dto.toEntity()).getIdPrescription();
        dto.getMedicines().forEach(medicine -> {
            medicine.setPrescriptionId(prescriptionId);
        });
        dto.setMedicines(medicineService.saveAllMedicines(dto.getMedicines()));
        dto.setIdPrescription(prescriptionId);
        return prescriptionId;
    }

    @Override
    public PrescriptionDTO getPrescriptionByAppointmentId(Long appointmentId) throws HmsException {
        PrescriptionDTO prescriptionDTO = prescriptionRepository.findByAppointment_IdAppointment(appointmentId)
                .orElseThrow(() -> new HmsException("PRESCRIPTION_NOT_FOUND")).toDto();
        prescriptionDTO
                .setMedicines(medicineService.getAllMedicinesByPrescriptionId(prescriptionDTO.getIdPrescription()));
        return prescriptionDTO;
    }

    @Override
    public PrescriptionDTO getPrescriptionId(Long id) throws HmsException {
        PrescriptionDTO prescriptionDTO = prescriptionRepository.findById(id)
                .orElseThrow(() -> new HmsException("PRESCRIPTION_NOT_FOUND"))
                .toDto();
        prescriptionDTO.setMedicines(medicineService.getAllMedicinesByPrescriptionId(id));
        return prescriptionDTO;

    }

}
