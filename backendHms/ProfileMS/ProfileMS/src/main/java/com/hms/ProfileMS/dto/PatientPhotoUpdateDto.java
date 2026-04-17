package com.hms.ProfileMS.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientPhotoUpdateDto {
    private UUID idPatient;
    private Long profilePictureId;
}
