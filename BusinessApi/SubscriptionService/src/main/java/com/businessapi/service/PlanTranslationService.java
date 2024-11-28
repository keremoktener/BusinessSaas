package com.businessapi.service;

import com.businessapi.entity.PlanTranslation;
import com.businessapi.repository.PlanTranslationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanTranslationService {
    private final PlanTranslationRepository planTranslationRepository;

    public PlanTranslation save(PlanTranslation planTranslation) {
        return planTranslationRepository.save(planTranslation);
    }

    public PlanTranslation findById(Long id) {
        return planTranslationRepository.findById(id).orElse(null);
    }
}
