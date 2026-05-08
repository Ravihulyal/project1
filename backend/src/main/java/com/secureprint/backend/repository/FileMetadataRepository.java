package com.secureprint.backend.repository;

import com.secureprint.backend.model.FileMetadata;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface FileMetadataRepository extends MongoRepository<FileMetadata, String> {
    Optional<FileMetadata> findByJwtToken(String jwtToken);
}
