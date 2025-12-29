package com.hms.ProfileMS.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.hms.ProfileMS.entity.Patient;

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

    public Patient toEntity() {
        return new Patient(this.idPatient, this.name, this.email, this.dob, this.phone, this.address, this.cpf,
                this.bloodGroup, this.alergies, this.chronicDisease);
    }
}
