package com.hms.media.service;

import java.io.IOException;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hms.media.dto.MediaFileDto;
import com.hms.media.entity.MediaFile;
import com.hms.media.entity.Storage;
import com.hms.media.repository.MediaFileRepository;

@Service
public class MediaFileServiceImpl implements MediaFileService {

    private final MediaFileRepository mediaFileRepository;

    public MediaFileServiceImpl(MediaFileRepository mediaFileRepository) {
        this.mediaFileRepository = mediaFileRepository;
    }

    @Override
    public MediaFileDto storeMediaFile(MultipartFile file) throws IOException {
        MediaFile mediaFile = MediaFile.builder()
                .name(file.getOriginalFilename())
                .type(file.getContentType())
                .storage(Storage.DB)
                .data(file.getBytes())
                .size(file.getSize())
                .build();
        mediaFileRepository.save(mediaFile);
        return MediaFileDto.builder()
                .id(mediaFile.getId())
                .name(mediaFile.getName())
                .type(mediaFile.getType())
                .size(mediaFile.getSize())
                .build();
    }

    @Override
    public Optional<MediaFile> getMediaFileById(Long id) {
        Optional<MediaFile> mediaFileOptional = mediaFileRepository.findById(id);
        if (!mediaFileOptional.isPresent()) {
            throw new RuntimeException("MEDIA_NOT_FOUND");
        }
        return mediaFileOptional;
    }

}
