package com.businessapi.repository;

import com.businessapi.entity.Role;
import com.businessapi.entity.User;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByAuthId(Long authId);

    //@Query("SELECT new com.usermanagement.views.GetAllUsersView(u.firstName,u.lastName,u.role) from User u ")
    //List<GetAllUsersView> getAllUsers();

    @Query("SELECT u.role from User u where u.authId=?1")
    List<Role> getUserRoles(Long authId);




    @Query("SELECT u FROM User u WHERE NOT EXISTS (SELECT r FROM u.role r WHERE r.roleName = 'SUPER_ADMIN') AND LOWER(u.lastName) LIKE LOWER(CONCAT('%', :lastName, '%')) ORDER BY u.lastName ASC, u.firstName ASC, u.id ASC")
    Page<User> findAllByLastNameContainingIgnoreCaseExcludingSuperAdmin(@Param("lastName") String lastName, Pageable pageable);



}
