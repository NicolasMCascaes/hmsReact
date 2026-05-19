package com.hms.VideoCallMS.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.VideoCallMS.dto.VideoCallDto;
import com.hms.VideoCallMS.dto.VideoCallRequest;
import com.hms.VideoCallMS.entity.CallStatus;
import com.hms.VideoCallMS.exceptions.HmsException;
import com.hms.VideoCallMS.services.VideoCallService;

import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@Valid
@RequestMapping("/videocalls")
public class VideoCallAPI {
    private final VideoCallService videoCallService;

    public VideoCallAPI(VideoCallService videoCallService) {
        this.videoCallService = videoCallService;
    }

    @PostMapping("/create")
    public ResponseEntity<VideoCallDto> createCall(@RequestHeader("X-Profile-Id") UUID callerId,
            @RequestBody VideoCallRequest dto) throws HmsException {
        return new ResponseEntity<>(videoCallService.createCall(callerId, dto), HttpStatus.OK);
    }

    @PatchMapping("/accept/{callId}")
    public ResponseEntity<Void> acceptCall(@PathVariable Long callId) throws HmsException {
        videoCallService.acceptCall(callId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/end/{callId}")
    public ResponseEntity<Void> endCall(@PathVariable Long callId) throws HmsException {
        videoCallService.endCall(callId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/cancel/{callId}")
    public ResponseEntity<Void> cancelCall(@PathVariable Long callId) throws HmsException {
        videoCallService.cancelCall(callId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/initiate/{callId}")
    public ResponseEntity<Void> initiateCall(@PathVariable Long callId) throws HmsException {
        videoCallService.initiateCall(callId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<VideoCallDto>> getAllCalls() throws HmsException {
        return new ResponseEntity<>(videoCallService.getAllVideoCalls(), HttpStatus.OK);
    }

    @GetMapping("/getAllByStatus")
    public ResponseEntity<List<VideoCallDto>> getAllCallsByStatus(@RequestParam CallStatus status) throws HmsException {
        return new ResponseEntity<>(videoCallService.getCallsByStatus(status), HttpStatus.OK);
    }

    @GetMapping("/getAllByReceiver/{receiverId}")
    public ResponseEntity<List<VideoCallDto>> getAllCallsByReceiver(@PathVariable UUID receiverId)
            throws HmsException {
        return new ResponseEntity<>(videoCallService.getCallsByParticipant(receiverId), HttpStatus.OK);
    }

    @GetMapping("/getAllByCaller/{callerId}")
    public ResponseEntity<List<VideoCallDto>> getAllCallsByCaller(@PathVariable UUID callerId)
            throws HmsException {
        return new ResponseEntity<>(videoCallService.getCallsByCaller(callerId), HttpStatus.OK);
    }

}
