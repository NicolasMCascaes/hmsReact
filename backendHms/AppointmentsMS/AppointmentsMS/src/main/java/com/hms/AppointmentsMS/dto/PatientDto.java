package com.hms.AppointmentsMS.dto;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientDto {
    private UUID idPatient;
    private String name;
    private String email;
    private LocalDate dob;
    private String phone;
    private String address;
    private String cpf;
    private BloodGroup bloodGroup;
    private String alergies;
    private String chronicDisease;

}
