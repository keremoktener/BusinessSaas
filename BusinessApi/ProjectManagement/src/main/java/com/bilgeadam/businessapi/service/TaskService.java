package com.bilgeadam.businessapi.service;

import com.bilgeadam.businessapi.dto.request.TaskSaveRequestDTO;
import com.bilgeadam.businessapi.dto.request.TaskUpdateRequestDTO;
import com.bilgeadam.businessapi.dto.response.TaskResponseDTO;
import com.bilgeadam.businessapi.dto.response.TaskSaveResponseDTO;
import com.bilgeadam.businessapi.entity.Project;
import com.bilgeadam.businessapi.entity.Task;
import com.bilgeadam.businessapi.entity.enums.EStatus;
import com.bilgeadam.businessapi.repository.ProjectRepository;
import com.bilgeadam.businessapi.repository.TaskRepository;
import com.bilgeadam.businessapi.utility.ServiceManager;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService extends ServiceManager<Task,Long> {

private final TaskRepository taskRepository;
private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        super(taskRepository);
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    public TaskSaveResponseDTO saveTask(TaskSaveRequestDTO dto) {
        // İlgili projeyi buluyoruz
        Optional<Project> projectOpt = projectRepository.findById(dto.projectId());
        if (projectOpt.isEmpty()) {
            throw new RuntimeException("Proje bulunamadı");
        }

        Project project = projectOpt.get();

        // Task'ı oluşturarak Project ile ilişkilendirdik
        Task taskToSave = Task.builder()
                .name(dto.name())
                .description(dto.description())
                .assignedUserId(dto.assignedUserId())
                .priority(dto.priority())
                .status(dto.status())
                //.resources(dto.resources())
                .project(project) // İlgili project'e bağlanma kısmı
                .build();


        Task savedTask = taskRepository.save(taskToSave);


        return TaskSaveResponseDTO.builder()
                .id(savedTask.getId())
                .name(savedTask.getName())
                .description(savedTask.getDescription())
                .assignedUserId(savedTask.getAssignedUserId())
                .priority(savedTask.getPriority())
                .status(savedTask.getStatus())
               //.resources(savedTask.getResources())
                .projectId(savedTask.getProject().getId())  // Proje id'sini set et
                .build();

    }

    public List<TaskResponseDTO> findTasksByProjectId(Long projectId) {

      List<Task> tasks= taskRepository.findAllByProjectId(projectId);
        return tasks.stream().map(task -> new TaskResponseDTO(task.getId(),task.getName(),task.getAssignedUserId(), task.getStatus(), projectId)).collect(Collectors.toList());
    }

    public void updateTask(TaskUpdateRequestDTO dto) {
       Task task = taskRepository.findById(dto.id())
                .orElseThrow(() -> new IllegalArgumentException("Task bulunamadı: " + dto.id()));

        task.setName(dto.name());
        task.setDescription(dto.description());
        task.setStatus(dto.status());
        task.setAssignedUserId(dto.assignedUserId());
        task.setPriority(dto.priority());
        task.setStatus(dto.status());
        taskRepository.save(task);
    }

    public ResponseEntity<String> startTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task bulunamadı: " + taskId));
        task.setStatus(EStatus.STARTED);
        task.setStartDate(LocalDateTime.now());
        taskRepository.save(task);
        return ResponseEntity.ok("Task başlatıldı: " + taskId);
    }


    public ResponseEntity<String> endTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task bulunamadı: " + taskId));
        task.setStatus(EStatus.FINISHED);
        task.setEndDate(LocalDateTime.now());
        taskRepository.save(task);
        return ResponseEntity.ok("Task bitti " + taskId);
    }


    public ResponseEntity<String> calculateTimeTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task bulunamadı: " + taskId));

        if (task.getStartDate() == null){
            return ResponseEntity.ok("Task henüz başlamadı: " + taskId);
        }

        if(task.getStatus()== EStatus.FINISHED){
            Duration duration = Duration.between(task.getStartDate(), task.getEndDate());
            return ResponseEntity.ok("Task süresi: " + duration.toMinutes() + " dakika");
        }
        Duration duration = Duration.between(task.getStartDate(), LocalDateTime.now());
        return ResponseEntity.ok("Task süresi: " + duration.toMinutes() + " dakika");

    }

}
