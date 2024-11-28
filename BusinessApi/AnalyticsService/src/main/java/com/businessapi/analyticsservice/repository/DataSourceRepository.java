package com.businessapi.analyticsservice.repository;

import com.businessapi.analyticsservice.entity.DataSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DataSourceRepository extends JpaRepository<DataSource, Long> {
    void deleteByServiceType(String serviceType);
    void deleteByEndpointType(String endpointType);
    Optional<DataSource> findByServiceType(String serviceType);
    Optional<DataSource> findByEndpointType(String endpointType);
}

