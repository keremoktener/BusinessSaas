package com.businessapi.repository;
import com.businessapi.entity.Activities;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activities, Long> {
    List<Activities> findAllByCodeContainingIgnoreCaseAndMemberIdOrderByMessageAsc(String s, Long memberId, PageRequest of);
    Activities findByUuid(String uuid);


}
