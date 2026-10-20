package com.frajaytech.eCountyService.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private final Path root;

    public FileStorageService(
            @Value("${app.upload.dir}") String dir
    ) throws IOException {

        this.root = Paths.get(dir)
                .toAbsolutePath()
                .normalize();

        Files.createDirectories(root);
    }

    public Path root() {
        return root;
    }

    /**
     * Returns the stored file name,
     * or null when no file was uploaded.
     */
    public String store(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return null;
        }

        String type = file.getContentType();

        if (type == null || !ALLOWED.contains(type)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only JPG, PNG or WEBP images are allowed"
            );
        }

        String ext = switch (type) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };

        // Never use the client's original file name.
        String name = UUID.randomUUID() + ext;

        try {
            Files.copy(
                    file.getInputStream(),
                    root.resolve(name),
                    StandardCopyOption.REPLACE_EXISTING
            );
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not save the image",
                    e
            );
        }

        return name;
    }
}
