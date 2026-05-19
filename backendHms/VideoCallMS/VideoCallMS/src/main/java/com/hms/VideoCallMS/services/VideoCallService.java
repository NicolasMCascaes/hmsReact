package com.hms.VideoCallMS.services;

import java.util.List;
import java.util.UUID;

import com.hms.VideoCallMS.dto.VideoCallDto;
import com.hms.VideoCallMS.dto.VideoCallRequest;
import com.hms.VideoCallMS.entity.CallStatus;
import com.hms.VideoCallMS.exceptions.HmsException;

public interface VideoCallService {
    VideoCallDto createCall(UUID callerId, VideoCallRequest request) throws HmsException;

    void acceptCall(Long callId) throws HmsException;

    void endCall(Long callId) throws HmsException;

    void cancelCall(Long callId) throws HmsException;

    void initiateCall(Long callId) throws HmsException;

    List<VideoCallDto> getAllVideoCalls();

    List<VideoCallDto> getCallsByStatus(CallStatus status);

    List<VideoCallDto> getCallsByParticipant(UUID participantId);

    List<VideoCallDto> getCallsByCaller(UUID callerId);
}
