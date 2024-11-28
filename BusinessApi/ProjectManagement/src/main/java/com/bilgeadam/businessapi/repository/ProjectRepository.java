package com.bilgeadam.businessapi.repository;

import com.bilgeadam.businessapi.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project,Long> {

}
