package com.businessapi.services;

import com.businessapi.dto.request.CalculateTaxRequestDto;
import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.request.TaxSaveRequestDTO;
import com.businessapi.dto.request.TaxUpdateRequestDTO;
import com.businessapi.entity.Tax;
import com.businessapi.entity.enums.EStatus;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.FinanceServiceException;
import com.businessapi.repositories.TaxRepository;
import com.businessapi.util.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaxService {
    private final TaxRepository taxRepository;

    public Boolean save(TaxSaveRequestDTO dto) {
        Tax tax = Tax.builder()
                .taxType(dto.taxType())
                .taxRate(dto.taxRate())
                .description(dto.description())
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .build();

        taxRepository.save(tax);
        return true;
    }

    public Boolean update(TaxUpdateRequestDTO dto) {
        Tax tax = taxRepository.findById(dto.id()).orElseThrow(() -> new FinanceServiceException(ErrorType.TAX_NOT_FOUND));
        tax.setTaxType(dto.taxType());
        tax.setTaxRate(dto.taxRate());
        tax.setDescription(dto.description());

        taxRepository.save(tax);
        return true;
    }

    public Boolean delete(Long id) {
        Tax tax = taxRepository.findById(id).orElseThrow(() -> new FinanceServiceException(ErrorType.TAX_NOT_FOUND));
        tax.setStatus(EStatus.DELETED);
        taxRepository.save(tax);
        return true;
    }

    public List<Tax> findAll(PageRequestDTO dto) {
        Long memberId = SessionManager.getMemberIdFromAuthenticatedMember();
        List<Tax> taxList = taxRepository.findAllByStatusNot(EStatus.DELETED, PageRequest.of(dto.page(), dto.size())).getContent();
        taxList.removeIf(tax -> !tax.getMemberId().equals(memberId));
        return taxList;
    }

    public Tax findById(Long id) {
        return taxRepository.findById(id).orElseThrow(() -> new FinanceServiceException(ErrorType.TAX_NOT_FOUND));
    }

    public BigDecimal calculateIncomeTax(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.valueOf(110000)) < 0) {
            return amount.multiply(BigDecimal.valueOf(0.15));
        }
        else if (amount.compareTo(BigDecimal.valueOf(110000)) > 0 && amount.compareTo(BigDecimal.valueOf(230000)) < 0) {
            return amount.multiply(BigDecimal.valueOf(0.20));
        }
        else if (amount.compareTo(BigDecimal.valueOf(230000)) > 0 && amount.compareTo(BigDecimal.valueOf(580000)) < 0) {
            return amount.multiply(BigDecimal.valueOf(0.27));
        }
        else if (amount.compareTo(BigDecimal.valueOf(580000)) > 0 && amount.compareTo(BigDecimal.valueOf(3000000)) < 0) {
            return amount.multiply(BigDecimal.valueOf(0.35));
        }
        else {
            return amount.multiply(BigDecimal.valueOf(0.40));
        }
    }

    public BigDecimal calculateVat(BigDecimal amount) {
        return amount.multiply(BigDecimal.valueOf(0.20));
    }

    public BigDecimal calculateCorporateTax(BigDecimal amount) {
        return amount.multiply(BigDecimal.valueOf(0.25));
    }

    public Boolean calculateTax(CalculateTaxRequestDto dto) {
        Tax tax = taxRepository.findById(dto.id()).orElseThrow(() -> new FinanceServiceException(ErrorType.TAX_NOT_FOUND));
        BigDecimal taxedAmount = dto.amount().multiply(tax.getTaxRate());
        return true;
    }
}
