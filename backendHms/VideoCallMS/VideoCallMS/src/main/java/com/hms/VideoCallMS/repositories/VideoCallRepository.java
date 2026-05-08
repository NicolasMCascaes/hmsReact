package com.hms.VideoCallMS.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.VideoCallMS.entity.CallStatus;
import com.hms.VideoCallMS.entity.VideoCall;

public interface VideoCallRepository extends JpaRepository<VideoCall, Long> {
    List<VideoCall> findByStatus(CallStatus status);
}
