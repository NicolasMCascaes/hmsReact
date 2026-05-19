package com.hms.VideoCallMS.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomStateDto {
    Long callId;
    int participantCount;
    boolean hasEnoughParticipants;
    boolean isCallActive;
}
