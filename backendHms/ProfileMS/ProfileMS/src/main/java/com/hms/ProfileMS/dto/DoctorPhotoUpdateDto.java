package com.hms.ProfileMS.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorPhotoUpdateDto {
    private UUID idDoctor;
    private Long profilePictureId;
}
