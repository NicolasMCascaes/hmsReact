package com.hms.AppointmentsMS.dto.appointment;

import java.time.LocalDateTime;
import java.util.UUID;

import com.hms.AppointmentsMS.dto.profile.Status;
import com.hms.AppointmentsMS.entity.Appointment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentDTO {
    private Long idAppointment;
    private UUID patientId;
    private UUID doctorId;
    @NotNull(message = "Appointment time cannot be null!")
    private LocalDateTime appointmentTime;
    @NotBlank(message = "Status is mandatory!")
    private Status status;
    @NotBlank(message = "Reason is mandatory!")
    private String reason;
    private String notes;

    public Appointment toEntity() {
        return new Appointment(this.idAppointment, this.patientId, this.doctorId, this.appointmentTime, this.status,
                this.reason, this.notes);
    }
}
