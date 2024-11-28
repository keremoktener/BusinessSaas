package com.businessapi.services;

import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.request.ProductCategorySaveRequestDTO;
import com.businessapi.dto.request.ProductCategoryUpdateRequestDTO;
import com.businessapi.entities.ProductCategory;
import com.businessapi.entities.enums.EStatus;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.StockServiceException;
import com.businessapi.repositories.ProductCategoryRepository;
import com.businessapi.util.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductCategoryService
{
    private final ProductCategoryRepository productCategoryRepository;

    public Boolean save(ProductCategorySaveRequestDTO dto)
    {
        Boolean isProductExist = productCategoryRepository.existsByMemberIdAndNameIgnoreCase(SessionManager.getMemberIdFromAuthenticatedMember(), dto.name());
        if (isProductExist)
        {
            throw new StockServiceException(ErrorType.PRODUCT_CATEGORY_ALREADY_EXISTS);
        }
        productCategoryRepository.save(ProductCategory.builder().memberId(SessionManager.getMemberIdFromAuthenticatedMember()).name(dto.name()).build());
        return true;
    }

    public Boolean saveForDemoData(ProductCategorySaveRequestDTO dto)
    {
        productCategoryRepository.save(ProductCategory.builder().memberId(2L).name(dto.name()).build());
        return true;
    }

    public Boolean delete(Long id)
    {
        ProductCategory productCategory = productCategoryRepository.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.PRODUCT_CATEGORY_NOT_FOUND));
        productCategory.setStatus(EStatus.DELETED);
        productCategoryRepository.save(productCategory);
        return true;
    }

    public Boolean update(ProductCategoryUpdateRequestDTO dto)
    {
        ProductCategory productCategory = productCategoryRepository.findByIdAndMemberId(dto.id(), SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.PRODUCT_CATEGORY_NOT_FOUND));
        Boolean isProductExist = productCategoryRepository.existsByMemberIdAndNameIgnoreCase(SessionManager.getMemberIdFromAuthenticatedMember(), dto.name());
        if (isProductExist)
        {
            throw new StockServiceException(ErrorType.PRODUCT_CATEGORY_ALREADY_EXISTS);
        }
        if (dto.name() != null)
        {
            productCategory.setName(dto.name());
        }

        productCategoryRepository.save(productCategory);
        return true;
    }

    public List<ProductCategory> findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(PageRequestDTO dto)
    {
        return productCategoryRepository.findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(dto.searchText(), SessionManager.getMemberIdFromAuthenticatedMember(), EStatus.DELETED, PageRequest.of(dto.page(), dto.size()));
    }

    public ProductCategory findByIdAndMemberId(Long id)
    {
        return productCategoryRepository.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.PRODUCT_CATEGORY_NOT_FOUND));
    }

    public ProductCategory findById(Long id)
    {
        return productCategoryRepository.findById(id).orElseThrow(() -> new StockServiceException(ErrorType.PRODUCT_CATEGORY_NOT_FOUND));
    }
}
