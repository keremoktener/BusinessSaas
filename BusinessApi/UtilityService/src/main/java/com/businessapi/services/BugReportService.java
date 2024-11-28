package com.businessapi.services;

import com.businessapi.RabbitMQ.Model.EmailSendModal;
import com.businessapi.dto.request.BugReportSaveRequestDTO;
import com.businessapi.dto.request.BugReportUpdateStatusRequestDTO;
import com.businessapi.dto.request.FeedbackSaveRequestDTO;
import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.response.BugReportResponseDTO;
import com.businessapi.entities.BugReport;
import com.businessapi.entities.enums.EBugStatus;
import com.businessapi.entities.enums.EStatus;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.UtilityServiceException;
import com.businessapi.repository.BugReportRepository;
import com.businessapi.util.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BugReportService
{
    private final BugReportRepository bugReportRepository;
    private final RabbitTemplate rabbitTemplate;

    public Boolean save(BugReportSaveRequestDTO dto)
    {
        bugReportRepository.save(BugReport
                .builder()
                .description(dto.description())
                .subject(dto.subject())
                .authId(SessionManager.getMemberIdFromAuthenticatedMember())
                .build());

        return true;
    }

    public Boolean saveForDemoData(BugReportSaveRequestDTO dto)
    {
        bugReportRepository.save(BugReport
                .builder()
                .description(dto.description())
                .subject(dto.subject())
                .authId(2L)
                .build());

        return true;
    }

    public Boolean delete(Long id)
    {
        BugReport bugReport = bugReportRepository.findById(id).orElseThrow(() -> new UtilityServiceException(ErrorType.BUG_REPORT_NOT_FOUND));
        bugReport.setStatus(EStatus.DELETED);
        bugReportRepository.save(bugReport);
        return true;
    }

    public List<BugReportResponseDTO> findAllByDescriptionContainingIgnoreCaseAndStatusIsNotOrderByDescriptionAsc(PageRequestDTO dto)
    {
        List<BugReport> bugReportList = bugReportRepository
                .findAllByDescriptionContainingIgnoreCaseAndStatusIsNotOrderByDescriptionAsc(dto.searchText(), EStatus.DELETED, PageRequest.of(dto.page(), dto.size()));
        List<BugReportResponseDTO> bugReportResponseDTOList = new ArrayList<>();

        for (BugReport bugReport : bugReportList)
        {
            //TODO IT CAN BE OPTIMIZED LATER BY SENDING IDS AS BULK FOR EMAIL
            String email = (String) (rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keyFindMailOfAuth", bugReport.getAuthId()));
            bugReportResponseDTOList.add(new BugReportResponseDTO(bugReport.getId(), email, bugReport.getSubject(), bugReport.getDescription(), bugReport.getAdminFeedback(), bugReport.getResolvedAt(),bugReport.getBugStatus(),bugReport.getVersion()));
        }
        return bugReportResponseDTOList;
    }

    public BugReport findById(Long id)
    {
        return bugReportRepository.findById(id).orElseThrow(() -> new UtilityServiceException(ErrorType.BUG_REPORT_NOT_FOUND));
    }

    public Boolean updateStatus(BugReportUpdateStatusRequestDTO dto)
    {
        BugReport bugReport = bugReportRepository.findById(dto.id()).orElseThrow(() -> new UtilityServiceException(ErrorType.BUG_REPORT_NOT_FOUND));


        if (dto.bugStatus().equals(EBugStatus.OPEN))
        {
                throw new UtilityServiceException(ErrorType.BUG_STATUS_UPDATE_NOT_ALLOWED);
        }
        if (dto.bugStatus().equals(EBugStatus.IN_PROGRESS))
        {
            if (!bugReport.getBugStatus().equals(EBugStatus.OPEN))
            {
                throw new UtilityServiceException(ErrorType.BUG_STATUS_SHOULD_BE_OPEN);
            }
            bugReport.setBugStatus(EBugStatus.IN_PROGRESS);
        }

        if (dto.bugStatus().equals(EBugStatus.RESOLVED))
        {
            if (!bugReport.getBugStatus().equals(EBugStatus.IN_PROGRESS))
            {
                throw new UtilityServiceException(ErrorType.BUG_REPORT_STATUS_SHOULD_BE_IN_PROGRESS);
            }
            bugReport.setResolvedAt(LocalDateTime.now());
            bugReport.setBugStatus(EBugStatus.RESOLVED);

            String email = (String) (rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keyFindMailOfAuth", bugReport.getAuthId()));


            if (email != null)
            {
                EmailSendModal emailObject = new EmailSendModal(email, bugReport.getSubject(),"Hello, your bug report has been resolved");
                rabbitTemplate.convertAndSend("businessDirectExchange", "keySendMail", emailObject);
            }
        }
        if (dto.bugStatus().equals(EBugStatus.REJECTED))
        {
            if (!bugReport.getBugStatus().equals(EBugStatus.OPEN))
            {
                throw new UtilityServiceException(ErrorType.BUG_STATUS_SHOULD_BE_OPEN);
            }
            String email = (String) (rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keyFindMailOfAuth", bugReport.getAuthId()));


            if (email != null)
            {
                EmailSendModal emailObject = new EmailSendModal(email, bugReport.getSubject(),"Hello, your bug report has been declined. Detailed information will be sent later.");
                rabbitTemplate.convertAndSend("businessDirectExchange", "keySendMail", emailObject);
            }

            bugReport.setBugStatus(EBugStatus.REJECTED);
        }

        if (dto.bugStatus().equals(EBugStatus.CLOSED))
        {
            if (!bugReport.getBugStatus().equals(EBugStatus.RESOLVED))
            {
                throw new UtilityServiceException(ErrorType.BUG_REPORT_STATUS_SHOULD_BE_RESOLVED);
            }
            bugReport.setBugStatus(EBugStatus.CLOSED);
        }

        bugReportRepository.save(bugReport);
        return true;
    }

    public Boolean feedback(FeedbackSaveRequestDTO dto)
    {
        BugReport bugReport = bugReportRepository.findById(dto.id()).orElseThrow(() -> new UtilityServiceException(ErrorType.BUG_REPORT_NOT_FOUND));
        if (bugReport.getAdminFeedback() == null)
        {
            bugReport.setAdminFeedback(dto.feedback());
            bugReportRepository.save(bugReport);

            String email = (String) (rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keyFindMailOfAuth", bugReport.getAuthId()));

            //If email is not null we will send email to member to inform
            if (email != null)
            {
                EmailSendModal emailObject = new EmailSendModal(email, bugReport.getSubject(), bugReport.getAdminFeedback());
                rabbitTemplate.convertAndSend("businessDirectExchange", "keySendMail", emailObject);
            }

        }else
        {
            throw new UtilityServiceException(ErrorType.BUG_FEEDBACK_ALREADY_EXIST);
        }

        return true;
    }

    private void incrementVersion(BugReport bugReport) {

        String currentVersion = bugReport.getVersion();
        int currentVersionNumber = Integer.parseInt(currentVersion.substring(1));
        int newVersionNumber = currentVersionNumber + 1;
        bugReport.setVersion("v" + newVersionNumber);
    }

    public Boolean reopenCase(Long id)
    {
        BugReport bugReport = bugReportRepository.findById(id).orElseThrow(() -> new UtilityServiceException(ErrorType.BUG_REPORT_NOT_FOUND));
        bugReport.setBugStatus(EBugStatus.OPEN);
        bugReport.setAdminFeedback(null);
        bugReport.setResolvedAt(null);
        incrementVersion(bugReport);
        bugReportRepository.save(bugReport);
        return true;
    }
}
