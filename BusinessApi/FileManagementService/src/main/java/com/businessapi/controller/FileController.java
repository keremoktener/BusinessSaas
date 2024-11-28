package com.businessapi.controller;


import com.businessapi.dto.request.DeleteFileRequestDTO;
import com.businessapi.dto.request.SaveFileRequestDTO;
import com.businessapi.dto.request.UpdateFileRequestDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entity.File;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.FileManagementServiceException;
import com.businessapi.service.FileService;
import com.businessapi.utilty.JwtTokenManager;
import com.businessapi.utilty.enums.EContentType;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import static com.businessapi.constants.EndPoints.*;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@RequiredArgsConstructor
@RequestMapping(FILE)
@RestController

public class FileController {
    private final FileService fileService;
    private final JwtTokenManager jwtTokenManager;

    @PostMapping(SAVE)
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN','MEMBER')")
    @Operation(summary = "Upload a file")
    public ResponseEntity<ResponseDTO<String>> uploadFile (@ModelAttribute SaveFileRequestDTO dto) {
        try (InputStream inputStream = dto.file().getInputStream() ) {

            String uuid = fileService.save(dto);

            return ResponseEntity.ok(
                    ResponseDTO.<String>builder()
                            .code(200)
                            .message("File uploaded successfully")
                            .data(uuid)
                            .build()
            );
        } catch (IOException e) {
            return ResponseEntity.status(500).body(
                    ResponseDTO.<String>builder()
                            .code(500)
                            .message("File upload failed: " + e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }


    @DeleteMapping(DELETE)
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN','MEMBER')")
    @Operation(summary = "Delete a file")
    public ResponseEntity<ResponseDTO<String>> deleteFile(@RequestBody DeleteFileRequestDTO fileDeleteDTO) {
        fileService.deleteFile(fileDeleteDTO);
        return ResponseEntity.ok(
                ResponseDTO.<String>builder()
                        .code(200)
                        .message("File deleted successfully")
                        .data(fileDeleteDTO.uuid())
                        .build()
        );
    }



    @PostMapping(UPDATE)
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN')")
    @Operation(summary = "Update a file")
    public ResponseEntity<ResponseDTO<String>> updateFile(@ModelAttribute UpdateFileRequestDTO fileUpdateDTO) {
        try (InputStream inputStream = fileUpdateDTO.file().getInputStream()) {
            fileService.updateFile(fileUpdateDTO);
            return ResponseEntity.ok(
                    ResponseDTO.<String>builder()
                            .code(200)
                            .message("File updated successfully.")
                            .data(fileUpdateDTO.uuid())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    ResponseDTO.<String>builder()
                            .code(500)
                            .message("File update failed: " + e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }


    @GetMapping(value = GET+"/{uuid}")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN','MEMBER')")
    public ResponseEntity<Resource> getFile(@PathVariable String uuid) {
        try {
            File existingFile = fileService.getFileMetadata(uuid);
            InputStream inputStream = fileService.getFile(uuid);
            Resource resource = new InputStreamResource(inputStream);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + uuid + "\"")
                    .contentType(MediaType.parseMediaType(existingFile.getContentType().getContentType()))
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @PostMapping(UPLOADPROFILEIMAGE)
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN','MEMBER')")
    @Operation(summary = "Upload a profile image")
    public ResponseEntity<ResponseDTO<String>> uploadProfileImage(
            @ModelAttribute SaveFileRequestDTO dto)
           {

        try (InputStream inputStream = dto.file().getInputStream()) {

            String uuid = fileService.saveProfileImage(dto);

            return ResponseEntity.ok(
                    ResponseDTO.<String>builder()
                            .code(200)
                            .message("Profile image uploaded successfully")
                            .data(uuid)
                            .build()
            );
        } catch (IOException e) {
            return ResponseEntity.status(500).body(
                    ResponseDTO.<String>builder()
                            .code(500)
                            .message("Profile image upload failed: " + e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }

    @GetMapping(value = GETPROFILEIMAGE)
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN','MEMBER')")
    public ResponseEntity<Resource> getProfileImage(@RequestHeader("Authorization")String token) {
        String jwtToken = token.replace("Bearer ", "");
        Long authId = jwtTokenManager.getIdFromToken(jwtToken).orElseThrow(()-> new FileManagementServiceException(ErrorType.INVALID_TOKEN));
        try {

            InputStream inputStream = fileService.getProfileImage(authId);
            if (inputStream == null) {
                return ResponseEntity.status(404).body(null);
            }
            List<File> activeFiles = fileService.getActiveFilesByAuthId(authId);
            File existingFile = activeFiles.get(0);
            Resource resource = new InputStreamResource(inputStream);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + existingFile.getUuid() + "\"")
                    .contentType(MediaType.parseMediaType(existingFile.getContentType().getContentType()))
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(null);
        }


    }



}






