package com.businessapi.analyticsservice.repository;

import com.businessapi.analyticsservice.entity.Widget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WidgetRepository extends JpaRepository<Widget, Long> {
}

