package com.hms.ProfileMS.entity;

import java.time.LocalDate;
import java.util.UUID;

import com.hms.ProfileMS.dto.DoctorDto;

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
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idDoctor;
    private String name;
    @Column(unique = true)
    private String email;
    private LocalDate dob;
    private String phone;
    private String address;
    @Column(unique = true)
    private String licenseNumber;
    private String specialization;
    private String department;
    private Integer totalExp;

    public DoctorDto toDto() {
        return new DoctorDto(this.idDoctor, this.name, this.email, this.dob, this.phone, this.address,
                this.licenseNumber,
                this.specialization, this.department, this.totalExp);
    }
}
