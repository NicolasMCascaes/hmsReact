package com.hms.media.api;

import java.io.IOException;
import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hms.media.dto.MediaFileDto;
import com.hms.media.entity.MediaFile;
import com.hms.media.service.MediaFileService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/media")
@CrossOrigin
public class MediaFileApi {
    private final MediaFileService mediaFileService;

    public MediaFileApi(MediaFileService mediaFileService) {
        this.mediaFileService = mediaFileService;
    }

    @PostMapping("/save")
    public ResponseEntity<MediaFileDto> saveMediaFile(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(mediaFileService.storeMediaFile(file));
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getMediaFile(@PathVariable Long id) {
        Optional<MediaFile> mediaFileOptional = mediaFileService.getMediaFileById(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + mediaFileOptional.get().getName() + "\"")
                .contentType(MediaType.parseMediaType(mediaFileOptional.get().getType()))
                .body(mediaFileOptional.get().getData());
    }

}
