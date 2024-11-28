package com.businessapi.services;

import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.request.ProductSaveRequestDTO;
import com.businessapi.dto.request.ProductUpdateRequestDTO;
import com.businessapi.dto.response.ProductResponseDTO;
import com.businessapi.entities.Product;
import com.businessapi.entities.enums.EStatus;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.StockServiceException;
import com.businessapi.repositories.ProductRepository;
import com.businessapi.util.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService
{
    private final ProductRepository productRepository;
    private final ProductCategoryService productCategoryService;

    public Product   findByIdAndMemberId(Long id)
    {
        return productRepository.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.PRODUCT_NOT_FOUND));
    }

    public Product findByIdForSupplier(Long id)
    {
        return productRepository.findById(id).orElseThrow(() -> new StockServiceException(ErrorType.PRODUCT_NOT_FOUND));
    }

    public Product findById(Long id)
    {
        return productRepository.findById(id).orElseThrow(() -> new StockServiceException(ErrorType.PRODUCT_NOT_FOUND));
    }

    public Boolean save(ProductSaveRequestDTO dto)
    {
        if (dto.stockCount() < 0 || dto.minimumStockLevel() < 0 || dto.price().compareTo(BigDecimal.ZERO) < 0)
        {
            throw new StockServiceException(ErrorType.VALUE_CAN_NOT_BE_BELOW_ZERO);
        }
        productCategoryService.findByIdAndMemberId(dto.productCategoryId());
        productRepository.save(Product
                .builder()
                .productCategoryId(dto.productCategoryId())
                .name(dto.name())
                .supplierId(dto.supplierId())
                .wareHouseId(dto.wareHouseId())
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .description(dto.description())
                .price(dto.price())
                .stockCount(dto.stockCount())
                .minimumStockLevel(dto.minimumStockLevel())
                .build());
        return true;
    }

    public Boolean saveForDemoData(ProductSaveRequestDTO dto)
    {
        productCategoryService.findById(dto.productCategoryId());
        productRepository.save(Product
                .builder()
                .productCategoryId(dto.productCategoryId())
                .name(dto.name())
                .supplierId(dto.supplierId())
                .wareHouseId(dto.wareHouseId())
                .memberId(2L)
                .description(dto.description())
                .price(dto.price())
                .stockCount(dto.stockCount())
                .minimumStockLevel(dto.minimumStockLevel())
                .build());
        return true;
    }

    public Boolean save(Product product)
    {
        productRepository.save(product);
        return true;
    }

    public Boolean delete(Long id)
    {
        Product product = productRepository.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.PRODUCT_NOT_FOUND));
        product.setStatus(EStatus.DELETED);
        productRepository.save(product);
        return true;
    }

    public Boolean update(ProductUpdateRequestDTO dto)
    {
        if (dto.stockCount() < 0 || dto.minimumStockLevel() < 0 || dto.price().compareTo(BigDecimal.ZERO) < 0)
        {
            throw new StockServiceException(ErrorType.VALUE_CAN_NOT_BE_BELOW_ZERO);
        }
        Product product = productRepository.findByIdAndMemberId(dto.id(), SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.PRODUCT_NOT_FOUND));
        if (dto.productCategoryId() != null)
        {
            product.setProductCategoryId(dto.productCategoryId());
        }
        if (dto.name() != null)
        {
            product.setName(dto.name());
        }
        if (dto.description() != null)
        {
            product.setDescription(dto.description());
        }
        if (dto.price() != null)
        {
            product.setPrice(dto.price());
        }
        if (dto.stockCount() != null)
        {
            product.setStockCount(dto.stockCount());
        }
        if (dto.minimumStockLevel() != null)
        {
            product.setMinimumStockLevel(dto.minimumStockLevel());
        }
        productRepository.save(product);
        return true;
    }

    public List<ProductResponseDTO> findAllByNameContainingIgnoreCaseAndStatusAndMemberIdOrderByName(PageRequestDTO dto)
    {
        return productRepository.findAllByNameContainingIgnoreCaseAndStatusAndMemberIdOrderByName(dto.searchText(), EStatus.ACTIVE, SessionManager.getMemberIdFromAuthenticatedMember(), PageRequest.of(dto.page(), dto.size()));
    }

    public List<Product> findAllByMinimumStockLevel(PageRequestDTO dto)
    {
        return productRepository.findAllByMinimumStockLevelAndStatusAndNameContainingIgnoreCaseOrderByNameAsc(EStatus.ACTIVE, SessionManager.getMemberIdFromAuthenticatedMember(), dto.searchText(), PageRequest.of(dto.page(), dto.size()));
    }

    public Boolean changeAutoOrderMode(Long id)
    {

        Product product = productRepository.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.PRODUCT_NOT_FOUND));
        product.setIsAutoOrderEnabled(!product.getIsAutoOrderEnabled());
        productRepository.save(product);
        return true;
    }


    public List<Product> findAllByNameContainingIgnoreCaseAndMemberIdOrderByNameAsc(String name, Long memberId)
    {
        return productRepository.findAllByNameContainingIgnoreCaseAndMemberIdOrderByNameAsc(name, memberId);
    }

    public List<Product> findAllByMinimumStockLevelAndStatus(EStatus eStatus)
    {
        return productRepository.findAllByMinimumStockLevelAndStatus(eStatus);
    }
}
