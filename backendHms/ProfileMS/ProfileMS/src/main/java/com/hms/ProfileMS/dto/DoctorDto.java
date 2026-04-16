package com.hms.ProfileMS.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.hms.ProfileMS.entity.Doctor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDto {
    private UUID idDoctor;
    private String name;
    private String email;
    private LocalDate dob;
    private Long profilePictureId;
    private String phone;
    private String address;
    private String licenseNumber;
    private String specialization;
    private String department;
    private Integer totalExp;

    public Doctor toEntity() {
        return new Doctor(this.idDoctor, this.name, this.email, this.dob, this.profilePictureId, this.phone,
                this.address, this.licenseNumber,
                this.specialization, this.department, this.totalExp);
    }

}
