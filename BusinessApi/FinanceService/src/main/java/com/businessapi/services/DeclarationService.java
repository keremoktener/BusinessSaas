package com.businessapi.services;

import com.businessapi.dto.request.DeclarationSaveRequestDTO;
import com.businessapi.dto.request.GenerateDeclarationRequestDTO;
import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.response.DeclarationResponseDTO;
import com.businessapi.dto.response.ExpenseResponseDTO;
import com.businessapi.entity.Declaration;
import com.businessapi.entity.Income;
import com.businessapi.entity.enums.EStatus;
import com.businessapi.repositories.DeclarationRepository;
import com.businessapi.util.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeclarationService {
    private final DeclarationRepository declarationRepository;
    private final IncomeService incomeService;
    private final ExpenseService expenseService;
    private final TaxService taxService;

    public Declaration createDeclarationForIncomeTax(DeclarationSaveRequestDTO dto) {
        BigDecimal taxableIncome = calculateTaxableIncome(dto).get(2);
        BigDecimal totalTax = taxService.calculateIncomeTax(taxableIncome);

        Declaration declaration = Declaration.builder()
                .startDate(dto.startDate())
                .endDate(dto.endDate())
                .totalIncome(calculateTaxableIncome(dto).get(0))
                .totalExpense(calculateTaxableIncome(dto).get(1))
                .totalTax(totalTax)
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .build();

        declarationRepository.save(declaration);
        return declaration;
    }

    public Declaration createDeclarationForVat(DeclarationSaveRequestDTO dto) {
        BigDecimal taxableIncome = calculateTaxableIncome(dto).get(2);
        BigDecimal totalTax = taxService.calculateVat(taxableIncome);

        Declaration declaration = Declaration.builder()
                .startDate(dto.startDate())
                .endDate(dto.endDate())
                .totalIncome(calculateTaxableIncome(dto).get(0))
                .totalExpense(calculateTaxableIncome(dto).get(1))
                .totalTax(totalTax)
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .build();

        declarationRepository.save(declaration);
        return declaration;
    }

    public Declaration createDeclarationForCorporateTax(DeclarationSaveRequestDTO dto) {
        BigDecimal taxableIncome = calculateTaxableIncome(dto).get(2);
        BigDecimal totalTax = taxService.calculateCorporateTax(taxableIncome);

        Declaration declaration = Declaration.builder()
                .startDate(dto.startDate())
                .endDate(dto.endDate())
                .totalIncome(calculateTaxableIncome(dto).get(0))
                .totalExpense(calculateTaxableIncome(dto).get(1))
                .totalTax(totalTax)
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .build();

        declarationRepository.save(declaration);
        return declaration;
    }

    private List<BigDecimal> calculateTaxableIncome(DeclarationSaveRequestDTO dto){
        Long memberId = SessionManager.getMemberIdFromAuthenticatedMember();
        List<Income> incomeList = incomeService.findByDateForDeclaration(dto.startDate(), dto.endDate());
        List<ExpenseResponseDTO> expenseList = expenseService.findByDate(dto.startDate(), dto.endDate());

        BigDecimal totalIncome = incomeList.stream().map(Income::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpense = expenseList.stream().map(ExpenseResponseDTO::amount).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal taxableIncome = totalIncome.subtract(totalExpense);

        return List.of(totalIncome, totalExpense, taxableIncome);
    }


    public BigDecimal createDeclaration(GenerateDeclarationRequestDTO dto) {
        declarationRepository.findAllByTaxType(dto.taxType()).forEach(declaration -> {
            if (declaration.getStartDate().equals(dto.startDate()) && declaration.getEndDate().equals(dto.endDate())) {
                declaration.setStatus(EStatus.INACTIVE);
            }
        });
        BigDecimal netIncome = dto.totalIncome().subtract(dto.totalExpense());

        if (netIncome.compareTo(BigDecimal.ZERO) < 0) {
            Declaration declaration = Declaration.builder()
                    .startDate(dto.startDate())
                    .endDate(dto.endDate())
                    .totalIncome(dto.totalIncome())
                    .totalExpense(dto.totalExpense())
                    .totalTax(BigDecimal.ZERO)
                    .taxType(dto.taxType())
                    .status(EStatus.INACTIVE)
                    .build();
            declarationRepository.save(declaration);
            return BigDecimal.ZERO;
        }
        BigDecimal totalTax = switch (dto.taxType()) {
            case "income" -> taxService.calculateIncomeTax(netIncome);
            case "kdv" -> taxService.calculateVat(netIncome);
            case "corporate" -> taxService.calculateCorporateTax(netIncome);
            default -> throw new IllegalStateException("Invalid Tax Type: " + dto.taxType());
        };

        Declaration declaration = Declaration.builder()
                .startDate(dto.startDate())
                .endDate(dto.endDate())
                .totalIncome(dto.totalIncome())
                .totalExpense(dto.totalExpense())
                .totalTax(totalTax)
                .taxType(dto.taxType())
                .build();

        declarationRepository.save(declaration);
        return totalTax;

    }

    public List<DeclarationResponseDTO> getAllDeclarations(PageRequestDTO dto) {
        List<Declaration> declarations = declarationRepository.findByTaxTypeContainingIgnoreCase(dto.searchText(), PageRequest.of(dto.page(), dto.size())).getContent();
        List<DeclarationResponseDTO> dtoList = new ArrayList<>();
        for (Declaration declaration : declarations) {
            DeclarationResponseDTO declarationResponseDTO = new DeclarationResponseDTO(
                    declaration.getId(),
                    declaration.getStartDate(),
                    declaration.getEndDate(),
                    declaration.getTotalIncome(),
                    declaration.getTotalExpense(),
                    declaration.getTotalIncome().subtract(declaration.getTotalExpense()),
                    declaration.getTotalTax(),
                    declaration.getTaxType(),
                    declaration.getStatus()
            );
            dtoList.add(declarationResponseDTO);
        }
        return dtoList;
    }


}
