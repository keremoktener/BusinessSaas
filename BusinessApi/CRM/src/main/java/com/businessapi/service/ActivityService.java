package com.businessapi.service;

import com.businessapi.dto.request.ActivitySaveDTO;
import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.entity.Activities;
import com.businessapi.repository.ActivityRepository;
import com.businessapi.utility.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.random.RandomGenerator;

@RequiredArgsConstructor
@Service
public class ActivityService {
    private final ActivityRepository repository;

    public void log(ActivitySaveDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return;
        }
        Long memberId = SessionManager.getMemberIdFromAuthenticatedMember();
        String code = generateActivityCode(dto);


        Activities activities = Activities.builder()
                .memberId(memberId)
                .message(dto.message())
                .type(dto.type())
                .date(LocalDateTime.now())
                .code(code)
                .build();
        repository.save(activities);
    }

    private static String generateActivityCode(ActivitySaveDTO dto) {
        String info = "info";
        String warning = "warning";
        String error = "error";
        RandomGenerator randomGenerator = RandomGenerator.getDefault();
        String codeModelInfo = randomGenerator.nextInt(100, 200) + info + randomGenerator.nextInt(100, 200);
        String codeModelWarning = randomGenerator.nextInt(200, 300) + warning + randomGenerator.nextInt(200, 300);
        String codeModelError = randomGenerator.nextInt(300, 400) + error + randomGenerator.nextInt(300, 400);

        return switch (dto.type()) {
            case "info" -> codeModelInfo;
            case "warning" -> codeModelWarning;
            case "error" -> codeModelError;
            default -> codeModelInfo;
        };
    }

    ;

//    public List<Activities> findAll() {
//        return repository.findAll();
//    }

    public List<Activities> findAll(PageRequestDTO dto) {
        List<Activities> activitiesList = repository.findAllByCodeContainingIgnoreCaseAndMemberIdOrderByMessageAsc(dto.searchText(), SessionManager.getMemberIdFromAuthenticatedMember(), PageRequest.of(dto.page(), dto.size()));
        System.out.println(activitiesList);
        return activitiesList;
    }

    public Activities findById(String uuid) {
        return repository.findByUuid(uuid);
    }
}
