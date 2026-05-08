package com.hms.VideoCallMS.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.hms.VideoCallMS.entity.CallStatus;
import com.hms.VideoCallMS.entity.VideoCall;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoCallDto {
    private Long callId;
    private UUID callerId;
    private UUID receiverId;
    private String callUrl;
    private LocalDateTime startTime;
    private String callerName;
    private String receiverName;
    private CallStatus status;

    public VideoCall toEntity() {
        return new VideoCall(callId, callerId, receiverId, callUrl, startTime, callerName, receiverName, status);
    }
}
