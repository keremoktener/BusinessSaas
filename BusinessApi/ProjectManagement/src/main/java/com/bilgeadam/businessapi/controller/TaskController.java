package com.bilgeadam.businessapi.controller;

import com.bilgeadam.businessapi.dto.request.TaskSaveRequestDTO;
import com.bilgeadam.businessapi.dto.request.TaskUpdateRequestDTO;
import com.bilgeadam.businessapi.dto.response.TaskResponseDTO;
import com.bilgeadam.businessapi.dto.response.TaskSaveResponseDTO;
import com.bilgeadam.businessapi.dto.response.TaskUpdateResponseDto;
import com.bilgeadam.businessapi.entity.Project;
import com.bilgeadam.businessapi.service.ProjectService;
import com.bilgeadam.businessapi.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static com.bilgeadam.businessapi.constant.EndPoints.*;
import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping(ROOT + TASK)
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final ProjectService projectService;



    @PostMapping(SAVED)
    @CrossOrigin("*")
    public ResponseEntity<TaskSaveResponseDTO> saveTask(@RequestBody TaskSaveRequestDTO dto) {
        TaskSaveResponseDTO response = taskService.saveTask(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping(FINDBYPROJECTID + "/{projectId}")
    @CrossOrigin("*")
    public ResponseEntity<List<TaskResponseDTO>> findTasksByProjectId(@PathVariable Long projectId) {
        Optional<Project> existingProduct = this.projectService.findById(projectId);
        if(existingProduct.isPresent()){
            return ResponseEntity.ok(taskService.findTasksByProjectId(projectId));
        }
        return ResponseEntity.notFound().build();

    }

    @PutMapping
    @CrossOrigin("*")
    public ResponseEntity<TaskUpdateResponseDto> updateTask(@RequestBody TaskUpdateRequestDTO dto) {
         taskService.updateTask(dto);
        return ResponseEntity.ok(TaskUpdateResponseDto.builder().
                id(dto.id()).name(dto.name()).
                description(dto.description()).assignedUserId(dto.assignedUserId()).
                priority(dto.priority()).status(dto.status()).build());
    }

    @GetMapping("start-task/{taskId}")
    @CrossOrigin("*")
    public ResponseEntity<String> startTask(@PathVariable Long taskId) {
        return taskService.startTask(taskId);
    }

    @GetMapping("end-task/{taskId}")
    @CrossOrigin("*")
    public ResponseEntity<String> endTask(@PathVariable Long taskId) {
        return taskService.endTask(taskId);
    }

    @GetMapping("calculate-task-time/{taskId}")
    @CrossOrigin("*")
    public ResponseEntity<String> calculateTimeTask(@PathVariable Long taskId) {
        return taskService.calculateTimeTask(taskId);
    }










    }





