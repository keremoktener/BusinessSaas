package com.businessapi.service;

import com.businessapi.dto.request.*;
import com.businessapi.entity.Customer;
import com.businessapi.entity.MarketingCampaign;
import com.businessapi.exception.CustomerServiceException;
import com.businessapi.exception.ErrorType;
import com.businessapi.repository.MarketingCampeignRepository;
import com.businessapi.utility.SessionManager;
import com.businessapi.utility.enums.EStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class MarketingCampaignService {
    private final MarketingCampeignRepository marketingCampeignRepository;
    private ActivityService activityService;

    @Autowired
    public void setService(@Lazy ActivityService activityService) {
        this.activityService = activityService;
    }

    public Boolean save(MarketingCampaignSaveDTO dto) {
        marketingCampeignRepository.save(MarketingCampaign.builder()
                .name(dto.name())
                .description(dto.description())
                .startDate(dto.startDate())
                .endDate(dto.endDate())
                .budget(dto.budget())
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .status(EStatus.ACTIVE)
                .build());

        activityService.log(ActivitySaveDTO.builder().type("info").message("Marketing campaign created").build());
        return true;
    }

    public void saveForDemoData(MarketingCampaignSaveDemoDTO dto) {
        marketingCampeignRepository.save(MarketingCampaign.builder().memberId(2L).name(dto.name()).description(dto.description()).startDate(dto.startDate()).endDate(dto.endDate()).budget(dto.budget()).status(EStatus.ACTIVE).build());
    }

    public List<MarketingCampaign> findAll(PageRequestDTO dto) {
        List<MarketingCampaign> marketingCampaignList = marketingCampeignRepository.findAllByNameContainingIgnoreCaseAndStatusAndMemberIdOrderByNameAsc(dto.searchText(), EStatus.ACTIVE, SessionManager.getMemberIdFromAuthenticatedMember(), PageRequest.of(dto.page(), dto.size()));
        activityService.log(ActivitySaveDTO.builder().type("info").message("Marketing campaigns viewed").build());
        return marketingCampaignList;

    }


    public Boolean update(MarketingCampaignUpdateDTO dto) {
        MarketingCampaign marketingCampaign = marketingCampeignRepository.findById(dto.id()).orElseThrow(() -> new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR));
        SessionManager.authorizationCheck(marketingCampaign.getMemberId());
        marketingCampaign.setName(dto.name() != null ? dto.name() : marketingCampaign.getName());
        marketingCampaign.setDescription(dto.description() != null ? dto.description() : marketingCampaign.getDescription());
        marketingCampaign.setStartDate(dto.startDate() != null ? dto.startDate() : marketingCampaign.getStartDate());
        marketingCampaign.setEndDate(dto.endDate() != null ? dto.endDate() : marketingCampaign.getEndDate());
        marketingCampaign.setBudget(dto.budget() != null ? dto.budget() : marketingCampaign.getBudget());
        marketingCampeignRepository.save(marketingCampaign);
        activityService.log(ActivitySaveDTO.builder().type("info").message("Marketing campaign updated").build());
        return true;
    }

    public Boolean delete(Long id) {
        MarketingCampaign marketingCampaign = marketingCampeignRepository.findById(id).orElseThrow(() -> new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR));
        SessionManager.authorizationCheck(marketingCampaign.getMemberId());
        if (marketingCampaign.getStatus() == EStatus.DELETED) {
            activityService.log(ActivitySaveDTO.builder().type("warning").message("Marketing campaign already deleted").build());
            throw new CustomerServiceException(ErrorType.MARKETING_CAMPAIGN_ALREADY_DELETED);
        }
        marketingCampaign.setStatus(EStatus.DELETED);
        marketingCampeignRepository.save(marketingCampaign);
        activityService.log(ActivitySaveDTO.builder().type("info").message("Marketing campaign deleted").build());
        return true;
    }

    public MarketingCampaign findById(Long id) {
        MarketingCampaign marketingCampaign = marketingCampeignRepository.findById(id).orElseThrow(() -> new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR));
        activityService.log(ActivitySaveDTO.builder().type("info").message("Marketing campaign viewed").build());
        return marketingCampaign;
    }
}