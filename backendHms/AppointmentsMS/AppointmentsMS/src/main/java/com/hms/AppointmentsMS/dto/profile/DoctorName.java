package com.hms.AppointmentsMS.dto.profile;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorName {
    private UUID id;
    private String name;
}
