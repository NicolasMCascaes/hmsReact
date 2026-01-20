package com.hms.AppointmentsMS.dto.aprecord;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.hms.AppointmentsMS.dto.prescription.PrescriptionDTO;
import com.hms.AppointmentsMS.entity.ApRecord;
import com.hms.AppointmentsMS.entity.Appointment;
import com.hms.AppointmentsMS.utilities.StringListConverter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApRecordDTO {
    private Long idRecord;
    private UUID patientId;
    private UUID doctorId;
    private Long appointmentId;
    private List<String> sintoms;
    private String diagnosis;
    private List<String> tests;
    private PrescriptionDTO prescription;
    private String notes;
    private String referral;
    private LocalDate followUpDate;
    private LocalDateTime createdAt;

    public ApRecord toEntity() {
        return new ApRecord(
                this.idRecord,
                this.patientId,
                this.doctorId,
                new Appointment(appointmentId),
                StringListConverter.listToString(sintoms),
                this.diagnosis,
                StringListConverter.listToString(tests),
                this.notes,
                this.referral,
                this.followUpDate,
                this.createdAt);
    }
}
