package com.hms.AppointmentsMS.dto.prescription;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.hms.AppointmentsMS.dto.medicine.MedicineDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrescriptionDetails {
    private Long idPrescription;
    private UUID patientId;
    private String patientName;
    private UUID doctorId;
    private String doctorName;
    private Long appointmentId;
    private LocalDate prescriptionDate;
    private String notes;
    private List<MedicineDto> medicines;
}
