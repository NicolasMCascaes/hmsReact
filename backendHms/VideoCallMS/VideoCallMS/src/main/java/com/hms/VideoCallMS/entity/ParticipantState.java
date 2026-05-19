package com.hms.VideoCallMS.entity;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantState {
    private UUID participantId;
    private boolean audioEnabled;
    private boolean videoEnabled;
    private boolean connected;
}
