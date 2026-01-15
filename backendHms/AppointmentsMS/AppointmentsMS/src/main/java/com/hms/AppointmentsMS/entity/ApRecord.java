package com.hms.AppointmentsMS.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.hms.AppointmentsMS.dto.ApRecordDTO;
import com.hms.AppointmentsMS.utilities.StringListConverter;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ApRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRecord;
    private UUID patientId;
    private UUID doctorId;
    @OneToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    private String sintoms;
    private String diagnosis;
    private String tests;
    private String notes;
    private String referral;
    private LocalDate followUpDate;
    private LocalDateTime createdAt;

    public ApRecordDTO toDto() {
        return new ApRecordDTO(idRecord, patientId, doctorId,
                appointment != null ? appointment.getIdAppointment() : null,
                sintoms != null ? StringListConverter.stringToList(tests) : null, diagnosis,
                tests != null ? StringListConverter.stringToList(tests) : null, null, notes, referral, followUpDate,
                createdAt);
    }
}
