package com.hms.media.service;

import java.io.IOException;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.hms.media.dto.MediaFileDto;
import com.hms.media.entity.MediaFile;

public interface MediaFileService {
    MediaFileDto storeMediaFile(MultipartFile file) throws IOException;

    Optional<MediaFile> getMediaFileById(Long id);

}
