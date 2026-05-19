package com.hms.VideoCallMS.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.VideoCallMS.client.ProfileClient;
import com.hms.VideoCallMS.dto.VideoCallDto;
import com.hms.VideoCallMS.dto.VideoCallEventDto;
import com.hms.VideoCallMS.dto.VideoCallRequest;
import com.hms.VideoCallMS.dto.DoctorDto;
import com.hms.VideoCallMS.dto.PatientDto;
import com.hms.VideoCallMS.entity.CallEventType;
import com.hms.VideoCallMS.entity.CallStatus;
import com.hms.VideoCallMS.entity.VideoCall;
import com.hms.VideoCallMS.exceptions.HmsException;
import com.hms.VideoCallMS.repositories.VideoCallRepository;

@Service
@Transactional
public class VideoCallServiceImpl implements VideoCallService {
        private final ProfileClient profileClient;
        private final VideoCallRepository videoCallRepository;
        private final VideoCallNotificationService notificationService;

        public VideoCallServiceImpl(ProfileClient profileClient, VideoCallRepository videoCallRepository,
                        VideoCallNotificationService notificationService) {
                this.profileClient = profileClient;
                this.videoCallRepository = videoCallRepository;
                this.notificationService = notificationService;
        }

        @Override
        public VideoCallDto createCall(UUID callerId, VideoCallRequest request) {
                VideoCall videoCall = new VideoCall();
                DoctorDto doctor = profileClient.getDoctor(callerId);
                PatientDto patient = profileClient.getPatient(request.getReceiverId());
                videoCall.setCallerId(callerId);
                videoCall.setReceiverId(request.getReceiverId());
                videoCall.setCallerName(doctor.getName());
                videoCall.setReceiverName(patient.getName());
                videoCall.setStartTime(request.getStartTime());
                videoCall.setStatus(CallStatus.CREATED);
                String roomId = "/video-room/" + UUID.randomUUID();
                videoCall.setCallUrl(roomId);
                videoCallRepository.save(videoCall);
                notificationService.notifyCallStatusChange(videoCall.getReceiverId(), new VideoCallEventDto(
                                CallEventType.CALL_CREATED, "New call from " + doctor.getName(), videoCall.toDto(),
                                null, null));
                return videoCall.toDto();
        }

        @Override
        @Transactional
        public void acceptCall(Long callId) throws HmsException {
                VideoCall videoCall = videoCallRepository.findById(callId)
                                .orElseThrow(() -> new HmsException("CALL_NOT_FOUND"));
                videoCall.setStatus(CallStatus.WAITING_PATIENT);
                videoCallRepository.save(videoCall);
                notificationService.notifyCallStatusChange(videoCall.getCallerId(),
                                new VideoCallEventDto(CallEventType.CALL_ACCEPTED,
                                                "Call accepted by " + videoCall.getReceiverName(),
                                                videoCall.toDto(), null, null));
        }

        @Override
        @Transactional
        public void endCall(Long callId) throws HmsException {
                VideoCall videoCall = videoCallRepository.findById(callId)
                                .orElseThrow(() -> new HmsException("CALL_NOT_FOUND"));
                videoCall.setStatus(CallStatus.ENDED);
                videoCallRepository.save(videoCall);
                notificationService.notifyCallStatusChange(videoCall.getReceiverId(),
                                new VideoCallEventDto(CallEventType.CALL_ENDED,
                                                "Call ended by " + videoCall.getCallerName(),
                                                videoCall.toDto(), null, videoCall.getCallerId()));
        }

        @Override
        @Transactional
        public void cancelCall(Long callId) throws HmsException {
                VideoCall videoCall = videoCallRepository.findById(callId)
                                .orElseThrow(() -> new HmsException("CALL_NOT_FOUND"));
                videoCall.setStatus(CallStatus.CANCELED);
                videoCallRepository.save(videoCall);
                notificationService.notifyCallStatusChange(videoCall.getReceiverId(),
                                new VideoCallEventDto(CallEventType.CALL_CANCELED,
                                                "Call canceled by " + videoCall.getCallerName(),
                                                videoCall.toDto(), null, null));
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
                notificationService.notifyCallStatusChange(videoCall.getReceiverId(),
                                new VideoCallEventDto(CallEventType.CALL_STARTED,
                                                "Call initiated by " + videoCall.getCallerName(),
                                                videoCall.toDto(), null, null));
        }

        @Override
        public List<VideoCallDto> getCallsByStatus(CallStatus status) {
                return videoCallRepository.findByStatus(status).stream().map(VideoCall::toDto).toList();
        }

        @Override
        public List<VideoCallDto> getCallsByParticipant(UUID participantId) {
                return videoCallRepository.findByReceiverIdOrderByStartTimeDesc(participantId).stream()
                                .map(VideoCall::toDto)
                                .toList();
        }

        @Override
        public List<VideoCallDto> getCallsByCaller(UUID callerId) {
                return videoCallRepository.findByCallerIdOrderByStartTimeDesc(callerId).stream().map(VideoCall::toDto)
                                .toList();
        }

}
