package com.hms.AppointmentsMS.services.prescription;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.hms.AppointmentsMS.clients.ProfileClient;
import com.hms.AppointmentsMS.dto.prescription.PrescriptionDTO;
import com.hms.AppointmentsMS.dto.prescription.PrescriptionDetails;
import com.hms.AppointmentsMS.dto.profile.DoctorName;
import com.hms.AppointmentsMS.dto.profile.PatientName;
import com.hms.AppointmentsMS.entity.Prescription;
import com.hms.AppointmentsMS.exceptions.HmsException;
import com.hms.AppointmentsMS.repositories.PrescriptionRepository;
import com.hms.AppointmentsMS.services.medicine.MedicineService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PrescriptionServiceImpl implements PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;

    private final MedicineService medicineService;

    private final ProfileClient apiService;

    public PrescriptionServiceImpl(PrescriptionRepository prescriptionRepository, MedicineService medicineService,
            ProfileClient apiService) {
        this.prescriptionRepository = prescriptionRepository;
        this.medicineService = medicineService;
        this.apiService = apiService;
    }

    @Override
    public Long savePrescription(PrescriptionDTO dto) throws HmsException {
        dto.setPrescriptionDate(LocalDate.now());
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

    @Override
    public List<PrescriptionDetails> getPrescriptionsByPatientId(UUID patientId) throws HmsException {
        List<Prescription> prescriptions = prescriptionRepository.findAllByPatientId(patientId);
        List<PrescriptionDetails> prescriptionDetails = prescriptions.stream().map(Prescription::toPrescriptionDetails)
                .toList();
        prescriptionDetails.forEach(details -> {
            try {
                details.setMedicines(medicineService.getAllMedicinesByPrescriptionId(details.getIdPrescription()));
            } catch (HmsException e) {
                e.printStackTrace();
            }

        });
        List<UUID> doctorsIds = prescriptionDetails.stream().map(PrescriptionDetails::getDoctorId).distinct().toList();
        List<DoctorName> doctorNames = apiService.getAllDoctorDropdowns(doctorsIds);
        Map<UUID, String> doctorMap = doctorNames.stream()
                .collect(Collectors.toMap(DoctorName::getId, DoctorName::getName));
        prescriptionDetails.forEach(prescription -> {
            String doctorName = doctorMap.get(prescription.getDoctorId());
            if (doctorName != null) {
                prescription.setDoctorName(doctorName);
            } else {
                prescription.setDoctorName("DOCTOR_NOT_FOUND");
            }
        });
        return prescriptionDetails;
    }

    @Override
    public List<PrescriptionDetails> getAllPrescriptionDetails() throws HmsException {
        List<PrescriptionDetails> prescriptionDetails = prescriptionRepository.findAll().stream()
                .map(Prescription::toPrescriptionDetails)
                .toList();
        prescriptionDetails.forEach(details -> {
            try {
                details.setMedicines(medicineService.getAllMedicinesByPrescriptionId(details.getIdPrescription()));
            } catch (HmsException e) {
                e.printStackTrace();
            }

        });
        List<UUID> patientIds = prescriptionDetails.stream().map(PrescriptionDetails::getPatientId).distinct().toList();
        if (!patientIds.isEmpty()) {
            List<PatientName> patientNames = apiService.getAllPatientDropdowns(patientIds);
            Map<UUID, String> patientMap = patientNames.stream()
                    .collect(Collectors.toMap(PatientName::getId, PatientName::getName));
            prescriptionDetails.forEach(prescription -> {
                String patientName = patientMap.get(prescription.getPatientId());
                if (patientName != null) {
                    prescription.setPatientName(patientName);
                } else {
                    prescription.setPatientName("Paciente desconhecido");
                }
            });
        }
        List<UUID> doctorsIds = prescriptionDetails.stream().map(PrescriptionDetails::getDoctorId).distinct().toList();
        if (doctorsIds.isEmpty()) {
            return prescriptionDetails;
        }
        List<DoctorName> doctorNames = apiService.getAllDoctorDropdowns(doctorsIds);
        Map<UUID, String> doctorMap = doctorNames.stream()
                .collect(Collectors.toMap(DoctorName::getId, DoctorName::getName));
        prescriptionDetails.forEach(prescription -> {
            String doctorName = doctorMap.get(prescription.getDoctorId());
            if (doctorName != null) {
                prescription.setDoctorName(doctorName);
            } else {
                prescription.setDoctorName("Doutor desconhecido");
            }
        });
        return prescriptionDetails;
    }

}
