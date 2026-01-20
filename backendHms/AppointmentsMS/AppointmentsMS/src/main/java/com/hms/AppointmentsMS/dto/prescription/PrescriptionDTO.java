package com.hms.AppointmentsMS.dto.prescription;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.hms.AppointmentsMS.dto.medicine.MedicineDto;
import com.hms.AppointmentsMS.entity.Appointment;
import com.hms.AppointmentsMS.entity.Prescription;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrescriptionDTO {
    private Long idPrescription;
    private UUID patientId;
    private UUID doctorId;
    private Long appointmentId;
    private LocalDate prescriptionDate;
    private String notes;
    private List<MedicineDto> medicines;

    public Prescription toEntity() {
        return new Prescription(idPrescription, patientId, doctorId, new Appointment(appointmentId), prescriptionDate,
                notes);
    }

}
