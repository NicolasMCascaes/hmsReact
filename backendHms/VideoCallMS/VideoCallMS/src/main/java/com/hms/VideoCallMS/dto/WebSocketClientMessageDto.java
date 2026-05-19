package com.hms.VideoCallMS.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.hms.VideoCallMS.entity.CallEventType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WebSocketClientMessageDto {
    private CallEventType type;
    private Long callId;
    private String message;
    private JsonNode data;
}
