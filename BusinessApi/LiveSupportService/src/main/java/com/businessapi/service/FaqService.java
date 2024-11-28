package com.businessapi.service;

import com.businessapi.entity.Faq;
import com.businessapi.entity.enums.EStatus;
import com.businessapi.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FaqService {
    private final FaqRepository faqRepository;
    public Faq save(Faq faq) {
        return faqRepository.save(faq);
    }
    public List<Faq> getAllFaqs() {
        return faqRepository.findAllByStatus(EStatus.ACTIVE);
    }
    public Faq delete(Long id) {
        Faq faq = faqRepository.getReferenceById(id);
        faq.setStatus(EStatus.DELETED);
        faqRepository.save(faq);
        return faq;
    }
}