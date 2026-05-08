package com.secureprint.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "file_metadata")
public class FileMetadata {
    @Id
    private String id;
    private String gridFsId;
    private String fileName;
    private LocalDateTime expiryTime;
    private String jwtToken;
    private boolean printed;
    private LocalDateTime createdAt;
}
