package com.hms.AppointmentsMS.dto.aprecord;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecordDetails {
    private Long idRecord;
    private UUID patientId;
    private UUID doctorId;
    private String doctorName;
    private Long appointmentId;
    private List<String> sintoms;
    private String diagnosis;
    private List<String> tests;
    private String notes;
    private String referral;
    private LocalDate followUpDate;
    private LocalDateTime createdAt;
}
