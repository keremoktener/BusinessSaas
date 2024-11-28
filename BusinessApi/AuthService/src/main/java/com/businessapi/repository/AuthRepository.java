package com.businessapi.repository;

import com.businessapi.entity.Auth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepository  extends JpaRepository<Auth,Long> {
    boolean existsByEmail(String email);



    Optional<Auth> findOptionalByEmail(String email);

    @Query("SELECT a.email FROM Auth a WHERE a.id = :authId")
    String findEmailById(@Param("authId") Long authId);

    Boolean existsByEmailIgnoreCase(String email);
}

