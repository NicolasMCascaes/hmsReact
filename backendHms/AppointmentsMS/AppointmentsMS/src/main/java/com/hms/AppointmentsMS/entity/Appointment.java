package com.hms.AppointmentsMS.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.hms.AppointmentsMS.dto.AppointmentDTO;
import com.hms.AppointmentsMS.dto.Status;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAppointment;
    private UUID patientId;
    private UUID doctorId;
    @Column(nullable = false)
    private LocalDateTime appointmentTime;
    @Column(nullable = false)
    private Status status;
    private String reason;
    private String notes;

    public AppointmentDTO toDTO() {
        return new AppointmentDTO(this.idAppointment, this.patientId, this.doctorId, this.appointmentTime, this.status,
                this.reason, this.notes);
    }
}
