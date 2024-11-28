package com.bilgeadam.businessapi.repository;

import com.bilgeadam.businessapi.dto.response.TaskResponseDTO;
import com.bilgeadam.businessapi.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Long> {


    List<Task> findAllByProjectId(Long projectId);

}
