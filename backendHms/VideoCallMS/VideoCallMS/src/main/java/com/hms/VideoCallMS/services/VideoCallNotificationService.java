package com.hms.VideoCallMS.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.hms.VideoCallMS.api.HmsWebSocketHandler;
import com.hms.VideoCallMS.dto.VideoCallEventDto;

@Service
public class VideoCallNotificationService {
    private final HmsWebSocketHandler webSocketHandler;

    public VideoCallNotificationService(HmsWebSocketHandler webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
    }

    public void notifyCallStatusChange(UUID profileId, VideoCallEventDto videoCall) {
        webSocketHandler.sendMessageToUser(profileId, videoCall);
    }
}
