package com.businessapi.repository;

import com.businessapi.entity.Event;
import com.businessapi.views.EventWithStatusView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    Optional<List<Event>> findAllByAuthId(Long authId);
    Optional<Event> findById(Long id);
}
