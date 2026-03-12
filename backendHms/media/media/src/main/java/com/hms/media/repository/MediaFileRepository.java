package com.hms.media.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.media.entity.MediaFile;

public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {

}
