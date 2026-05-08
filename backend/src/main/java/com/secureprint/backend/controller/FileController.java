package com.secureprint.backend.controller;

import com.secureprint.backend.model.FileMetadata;
import com.secureprint.backend.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*") // In production, restrict this
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            FileMetadata metadata = fileService.uploadAndEncrypt(file);
            return ResponseEntity.ok(metadata);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file: " + e.getMessage());
        }
    }

    @GetMapping("/view/{token}")
    public ResponseEntity<byte[]> viewFile(@PathVariable String token) {
        try {
            byte[] fileData = fileService.getDecryptedFile(token);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"secure_document.pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(fileData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping("/print-complete/{token}")
    public ResponseEntity<?> confirmPrint(@PathVariable String token) {
        try {
            fileService.cleanup(token);
            return ResponseEntity.ok(Map.of("message", "File processed and deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during cleanup: " + e.getMessage());
        }
    }
}
