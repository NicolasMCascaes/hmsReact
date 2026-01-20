package com.hms.AppointmentsMS.services.aprecord;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.AppointmentsMS.clients.ProfileClient;
import com.hms.AppointmentsMS.dto.aprecord.ApRecordDTO;
import com.hms.AppointmentsMS.dto.aprecord.RecordDetails;
import com.hms.AppointmentsMS.dto.profile.DoctorName;
import com.hms.AppointmentsMS.entity.ApRecord;
import com.hms.AppointmentsMS.exceptions.HmsException;
import com.hms.AppointmentsMS.repositories.ApRecordRepository;
import com.hms.AppointmentsMS.services.prescription.PrescriptionService;
import com.hms.AppointmentsMS.utilities.StringListConverter;

@Service
@Transactional
public class ApRecordServiceImpl implements ApRecordService {

    private final ApRecordRepository apRecordRepository;
    private final PrescriptionService prescriptionService;
    private final ProfileClient apiService;

    public ApRecordServiceImpl(ApRecordRepository apRecordRepository, PrescriptionService prescriptionService,
            ProfileClient apiService) {
        this.apRecordRepository = apRecordRepository;
        this.prescriptionService = prescriptionService;
        this.apiService = apiService;
    }

    @Override
    public Long createApRecord(ApRecordDTO apRecordDTO) throws HmsException {

        Optional<ApRecord> existingRecord = apRecordRepository
                .findByAppointmentIdNative(apRecordDTO.getAppointmentId());
        if (existingRecord.isPresent()) {
            throw new HmsException("APPOINTMENT_RECORD_ALREADY_EXISTS");
        }
        apRecordDTO.setCreatedAt(LocalDateTime.now());
        Long id = apRecordRepository.save(apRecordDTO.toEntity()).getIdRecord();
        if (apRecordDTO.getPrescription() != null) {
            apRecordDTO.getPrescription().setAppointmentId(apRecordDTO.getAppointmentId());
            prescriptionService.savePrescription(apRecordDTO.getPrescription());
        }
        return id;

    }

    @Override
    @Transactional
    public void updateApRecord(ApRecordDTO apRecordDTO) throws HmsException {
        ApRecord existingRecord = apRecordRepository.findById(apRecordDTO.getIdRecord())
                .orElseThrow(() -> new HmsException("APPOINTMENT_RECORD_NOT_FOUND"));
        existingRecord.setNotes(apRecordDTO.getNotes());
        existingRecord.setDiagnosis(apRecordDTO.getDiagnosis());
        existingRecord.setNotes(apRecordDTO.getNotes());
        existingRecord.setFollowUpDate(apRecordDTO.getFollowUpDate());
        existingRecord.setSintoms(StringListConverter.listToString(apRecordDTO.getSintoms()));
        existingRecord.setTests(StringListConverter.listToString(apRecordDTO.getTests()));
        existingRecord.setReferral(apRecordDTO.getReferral());
        apRecordRepository.save(existingRecord);

    }

    @Override
    public ApRecordDTO getApRecordByAppointmentId(Long appointmentId) throws HmsException {
        return apRecordRepository.findByAppointment_IdAppointment(appointmentId)
                .orElseThrow(() -> new HmsException("APPOINTMENT_RECORD_NOT_FOUND")).toDto();
    }

    @Override

    public ApRecordDTO getApRecordById(Long apRecordId) throws HmsException {
        return apRecordRepository.findById(apRecordId)
                .orElseThrow(() -> new HmsException("APPOINTMENT_RECORD_NOT_FOUND")).toDto();
    }

    @Override
    public ApRecordDTO getApRecordDetailsByAppointmentId(Long appointmentId) throws HmsException {
        ApRecordDTO record = apRecordRepository.findByAppointment_IdAppointment(appointmentId)
                .orElseThrow(() -> new HmsException("APPOINTMENT_RECORD_NOT_FOUND")).toDto();
        record.setPrescription(prescriptionService.getPrescriptionByAppointmentId(appointmentId));
        return record;
    }

    @Override
    public List<RecordDetails> getRecordsByPatientId(UUID patientId) throws HmsException {
        List<ApRecord> records = apRecordRepository.findAllByPatientId(patientId);
        List<RecordDetails> recordDetails = records.stream().map(ApRecord::toRecordDetails).toList();
        List<UUID> doctorsIds = recordDetails.stream().map(RecordDetails::getDoctorId).distinct().toList();
        List<DoctorName> doctorsNames = apiService.getAllDoctorDropdowns(doctorsIds);
        Map<UUID, String> doctorMap = doctorsNames.stream()
                .collect(Collectors.toMap(DoctorName::getId, DoctorName::getName));
        recordDetails.forEach(record -> {
            String doctorName = doctorMap.get(record.getDoctorId());
            if (doctorName != null) {
                record.setDoctorName(doctorName);
            } else {
                record.setDoctorName("Doutor desconhecido");
            }

        });
        return recordDetails;
    }

    @Override
    public List<RecordDetails> getRecordsById(Long recordId) throws HmsException {

        throw new UnsupportedOperationException("Unimplemented method 'getRecordsById'");
    }

}
