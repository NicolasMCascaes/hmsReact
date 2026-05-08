package com.hms.VideoCallMS.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.hms.VideoCallMS.dto.VideoCallDto;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoCall {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long callId;
    private UUID callerId;
    private UUID receiverId;
    private String callUrl;
    private LocalDateTime startTime;
    private String callerName;
    private String receiverName;
    @Enumerated(EnumType.STRING)
    private CallStatus status;

    public VideoCallDto toDto() {
        return new VideoCallDto(callId, callerId, receiverId, callUrl, startTime, callerName, receiverName,
                status);
    }
}
