package com.hms.VideoCallMS.dto;

import java.util.UUID;

import com.fasterxml.jackson.databind.JsonNode;
import com.hms.VideoCallMS.entity.CallEventType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoCallEventDto {
    private CallEventType eventType;
    private String message;
    private VideoCallDto videoCall;
    private JsonNode data;
    private UUID participantId;
}
