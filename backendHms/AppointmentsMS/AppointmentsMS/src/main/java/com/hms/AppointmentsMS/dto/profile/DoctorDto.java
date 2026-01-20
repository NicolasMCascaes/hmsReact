package com.hms.AppointmentsMS.dto.profile;

import java.time.LocalDate;
import java.util.UUID;
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
    private String phone;
    private String address;
    private String licenseNumber;
    private String specialization;
    private String department;
    private Integer totalExp;

}
