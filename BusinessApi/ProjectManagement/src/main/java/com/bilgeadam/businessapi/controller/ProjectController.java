package com.bilgeadam.businessapi.controller;

import com.bilgeadam.businessapi.dto.request.ProjectSaveRequestDTO;
import com.bilgeadam.businessapi.dto.request.ProjectUpdateRequestDTO;
import com.bilgeadam.businessapi.dto.response.ProjectResponseDto;
import com.bilgeadam.businessapi.dto.response.ProjectUpdateResponseDto;
import com.bilgeadam.businessapi.entity.Project;
import com.bilgeadam.businessapi.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static com.bilgeadam.businessapi.constant.EndPoints.*;

@RestController
@RequestMapping(ROOT+PROJECT)
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping(SAVE)
    @CrossOrigin("*")
    public ResponseEntity<ProjectResponseDto> saveProject(@RequestBody ProjectSaveRequestDTO dto) {

        Project project=projectService.saveProject(dto);

        return ResponseEntity.ok(ProjectResponseDto.builder().id(project.getId()).name(dto.name()).build());
    }

    @GetMapping(FINDALL)
    @CrossOrigin("*")
    public ResponseEntity<List<ProjectResponseDto>> findAllProjects(){

        return ResponseEntity.ok(projectService.findAllProjects());

    }

    @PutMapping(UPDATE)
    @CrossOrigin("*")
    public ResponseEntity<ProjectUpdateResponseDto> update(@RequestBody ProjectUpdateRequestDTO dto){
        projectService.updateProject(dto);
        return ResponseEntity.ok(ProjectUpdateResponseDto.builder().id(dto.id()).name(dto.name()).description(dto.description()).status(dto.status()).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id){
        Optional<Project> existingProduct = this.projectService.findById(id);
        if(existingProduct.isPresent()){
            this.projectService.delete(existingProduct.get());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }













}
