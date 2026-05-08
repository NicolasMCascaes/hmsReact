package com.hms.VideoCallMS.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.VideoCallMS.dto.VideoCallDto;
import com.hms.VideoCallMS.entity.CallStatus;
import com.hms.VideoCallMS.exceptions.HmsException;
import com.hms.VideoCallMS.services.VideoCallService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    public ResponseEntity<VideoCallDto> createCall(@RequestBody VideoCallDto dto) throws HmsException {
        return new ResponseEntity<>(videoCallService.createCall(dto), HttpStatus.OK);
    }

    @PatchMapping("/accept")
    public ResponseEntity<Void> acceptCall(@RequestBody Long callId) throws HmsException {
        videoCallService.acceptCall(callId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/end")
    public ResponseEntity<Void> endCall(@RequestBody Long callId) throws HmsException {
        videoCallService.endCall(callId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/cancel")
    public ResponseEntity<Void> cancelCall(@RequestBody Long callId) throws HmsException {
        videoCallService.cancelCall(callId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/initiate")
    public ResponseEntity<Void> initiateCall(@RequestBody Long callId) throws HmsException {
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

}
