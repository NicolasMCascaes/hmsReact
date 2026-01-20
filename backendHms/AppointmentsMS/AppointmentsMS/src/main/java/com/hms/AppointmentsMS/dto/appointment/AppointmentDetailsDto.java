package com.hms.AppointmentsMS.dto.appointment;

import java.time.LocalDateTime;
import java.util.UUID;

import com.hms.AppointmentsMS.dto.profile.Status;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentDetailsDto {
    private Long idAppointment;
    private UUID patientId;
    private String patientName;
    private String patientPhone;
    private String patientEmail;
    private UUID doctorId;
    private String doctorName;
    private LocalDateTime appointmentTime;
    private Status status;
    private String reason;
    private String notes;
}
