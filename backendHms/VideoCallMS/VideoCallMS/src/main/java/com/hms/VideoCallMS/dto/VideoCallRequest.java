package com.hms.VideoCallMS.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoCallRequest {
    UUID receiverId;
    LocalDateTime startTime;
}
