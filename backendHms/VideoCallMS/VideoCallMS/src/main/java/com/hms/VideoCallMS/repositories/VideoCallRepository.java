package com.hms.VideoCallMS.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.VideoCallMS.entity.CallStatus;
import com.hms.VideoCallMS.entity.VideoCall;
import java.util.UUID;

public interface VideoCallRepository extends JpaRepository<VideoCall, Long> {
    List<VideoCall> findByStatus(CallStatus status);

    List<VideoCall> findByCallerIdOrderByStartTimeDesc(UUID callerId);

    List<VideoCall> findByReceiverIdOrderByStartTimeDesc(UUID receiverId);
}
