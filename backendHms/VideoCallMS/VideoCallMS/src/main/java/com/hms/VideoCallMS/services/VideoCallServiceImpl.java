package com.hms.VideoCallMS.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hms.VideoCallMS.client.ProfileClient;
import com.hms.VideoCallMS.dto.VideoCallDto;
import com.hms.VideoCallMS.dto.DoctorDto;
import com.hms.VideoCallMS.dto.PatientDto;
import com.hms.VideoCallMS.entity.CallStatus;
import com.hms.VideoCallMS.entity.VideoCall;
import com.hms.VideoCallMS.exceptions.HmsException;
import com.hms.VideoCallMS.repositories.VideoCallRepository;

@Service
public class VideoCallServiceImpl implements VideoCallService {
    private final ProfileClient profileClient;
    private final VideoCallRepository videoCallRepository;

    public VideoCallServiceImpl(ProfileClient profileClient, VideoCallRepository videoCallRepository) {
        this.profileClient = profileClient;
        this.videoCallRepository = videoCallRepository;
    }

    @Override
    public VideoCallDto createCall(VideoCallDto request) {
        DoctorDto doctor = profileClient.getDoctor(request.getCallerId());
        PatientDto patient = profileClient.getPatient(request.getReceiverId());
        request.setCallerName(doctor.getName());
        request.setReceiverName(patient.getName());

        request.setStatus(CallStatus.CREATED);
        videoCallRepository.save(request.toEntity());
        return request;
    }

    @Override
    public void acceptCall(Long callId) throws HmsException {
        VideoCall videoCall = videoCallRepository.findById(callId)
                .orElseThrow(() -> new HmsException("CALL_NOT_FOUND"));
        videoCall.setStatus(CallStatus.WAITING_PATIENT);
        videoCallRepository.save(videoCall);
    }

    @Override
    public void endCall(Long callId) throws HmsException {
        VideoCall videoCall = videoCallRepository.findById(callId)
                .orElseThrow(() -> new HmsException("CALL_NOT_FOUND"));
        videoCall.setStatus(CallStatus.ENDED);
        videoCallRepository.save(videoCall);
    }

    @Override
    public void cancelCall(Long callId) throws HmsException {
        VideoCall videoCall = videoCallRepository.findById(callId)
                .orElseThrow(() -> new HmsException("CALL_NOT_FOUND"));
        videoCall.setStatus(CallStatus.CANCELED);
        videoCallRepository.save(videoCall);
    }

    @Override
    public List<VideoCallDto> getAllVideoCalls() {
        return videoCallRepository.findAll().stream().map(VideoCall::toDto).toList();
    }

    @Override
    public void initiateCall(Long callId) throws HmsException {
        VideoCall videoCall = videoCallRepository.findById(callId)
                .orElseThrow(() -> new HmsException("CALL_NOT_FOUND"));
        videoCall.setStatus(CallStatus.IN_PROGRESS);
        videoCallRepository.save(videoCall);
    }

    @Override
    public List<VideoCallDto> getCallsByStatus(CallStatus status) {
        return videoCallRepository.findByStatus(status).stream().map(VideoCall::toDto).toList();
    }

}
