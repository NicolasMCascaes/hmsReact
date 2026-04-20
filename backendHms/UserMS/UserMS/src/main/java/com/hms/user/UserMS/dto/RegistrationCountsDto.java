package com.hms.user.UserMS.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationCountsDto {
    private List<MonthlyRoleCount> patientCounts;
    private List<MonthlyRoleCount> doctorCounts;
}
