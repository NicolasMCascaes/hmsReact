package com.hms.ProfileMS.entity;

import java.time.LocalDate;
import java.util.UUID;

import com.hms.ProfileMS.dto.BloodGroup;
import com.hms.ProfileMS.dto.PatientDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idPatient;
    private String name;
    @Column(unique = true)
    private String email;
    private LocalDate dob;
    private String phone;
    private String address;
    @Column(unique = true)
    private String cpf;
    private BloodGroup bloodGroup;
    private String alergies;
    private String chronicDisease;

    public PatientDto toDto() {
        return new PatientDto(this.idPatient, this.name, this.email, this.dob, this.phone, this.address, this.cpf,
                this.bloodGroup, this.alergies, this.chronicDisease);
    }
}
