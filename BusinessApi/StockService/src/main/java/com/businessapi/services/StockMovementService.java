package com.businessapi.services;

import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.request.StockMovementSaveDTO;
import com.businessapi.dto.request.StockMovementUpdateRequestDTO;
import com.businessapi.dto.response.StockMovementResponseDTO;
import com.businessapi.entities.Order;
import com.businessapi.entities.Product;
import com.businessapi.entities.StockMovement;
import com.businessapi.entities.enums.EOrderType;
import com.businessapi.entities.enums.EStatus;
import com.businessapi.entities.enums.EStockMovementType;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.StockServiceException;
import com.businessapi.repositories.StockMovementRepository;
import com.businessapi.util.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockMovementService
{
    private final StockMovementRepository stockMovementRepository;
    private final ProductService productService;
    private final WareHouseService wareHouseService;
    private final OrderService orderService;

    public Boolean save(StockMovementSaveDTO dto)
    {
        if (dto.quantity() < 0)
        {
            throw new StockServiceException(ErrorType.VALUE_CAN_NOT_BE_BELOW_ZERO);
        }
        Product product = productService.findByIdAndMemberId(dto.productId());
        if (dto.stockMovementType() == EStockMovementType.OUT)
        {
            if (product.getStockCount() < dto.quantity())
            {
                throw new StockServiceException(ErrorType.INSUFFICIENT_STOCK, product.getName() + " Stock count is: " + product.getStockCount());
            }
            product.setStockCount(product.getStockCount() - dto.quantity());
            productService.save(product);
        } else
        {
            product.setStockCount(product.getStockCount() + dto.quantity());
            productService.save(product);
        }

        stockMovementRepository.save(StockMovement
                .builder()
                .productId(dto.productId())
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .warehouseId(product.getWareHouseId())
                .quantity(dto.quantity())
                .stockMovementType(dto.stockMovementType())
                .build());
        return null;
    }

    public Boolean saveFromOrderId(Long id)
    {
        Order order = orderService.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember());
        if (order.getOrderType() != EOrderType.BUY)
        {
            throw new StockServiceException(ErrorType.ORDER_NOT_BUY);
        }
        if (order.getStatus() == EStatus.ARRIVED)
        {
            throw new StockServiceException(ErrorType.ORDER_ALREADY_ARRIVED);
        }
        Product product = productService.findByIdAndMemberId(order.getProductId());
        stockMovementRepository.save(StockMovement
                .builder()
                .productId(order.getProductId())
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .warehouseId(product.getWareHouseId())
                .quantity(order.getQuantity())
                .stockMovementType(EStockMovementType.IN)
                .build());

        //Adding stock to product
        product.setStockCount(product.getStockCount() + order.getQuantity());

        //Setting status of product and order
        order.setStatus(EStatus.ARRIVED);
        product.setIsProductAutoOrdered(false);


        orderService.save(order);
        productService.save(product);
        return true;
    }

    public Boolean saveForDemoData(StockMovementSaveDTO dto)
    {
        Product product = productService.findById(dto.productId());

        if (product.getStockCount() < dto.quantity())
        {
            throw new StockServiceException(ErrorType.INSUFFICIENT_STOCK);
        }
        stockMovementRepository.save(StockMovement
                .builder()
                .productId(dto.productId())
                .memberId(2L)
                .warehouseId(product.getWareHouseId())
                .quantity(dto.quantity())
                .stockMovementType(dto.stockMovementType())
                .build());
        return null;
    }

    public Boolean delete(Long id)
    {
        StockMovement stockMovement = stockMovementRepository.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.STOCK_MOVEMENT_NOT_FOUND));
        Product product = productService.findByIdAndMemberId(stockMovement.getProductId());

        if (stockMovement.getStockMovementType() == EStockMovementType.OUT)
        {
            product.setStockCount(product.getStockCount() + stockMovement.getQuantity());
        } else
        {
            product.setStockCount(product.getStockCount() - stockMovement.getQuantity());
            if (product.getStockCount() < 0)
            {
                throw new StockServiceException(ErrorType.STOCK_MOVEMENT_CAN_NOT_BE_DELETED, "Product stock level can not be below zero");
            }
        }
        productService.save(product);
        stockMovement.setStatus(EStatus.DELETED);
        stockMovementRepository.save(stockMovement);
        return true;
    }

    public Boolean update(StockMovementUpdateRequestDTO dto)
    {
        if (dto.quantity() < 0)
        {
            throw new StockServiceException(ErrorType.VALUE_CAN_NOT_BE_BELOW_ZERO);
        }
        Product product = productService.findByIdAndMemberId(dto.productId());

        StockMovement stockMovement = stockMovementRepository.findByIdAndMemberId(dto.id(), SessionManager.getMemberIdFromAuthenticatedMember())
                .orElseThrow(() -> new StockServiceException(ErrorType.STOCK_MOVEMENT_NOT_FOUND));

        // Mevcut stok hareketindeki miktar ve DTO ile gelen yeni miktarı al
        Integer currentQuantity = stockMovement.getQuantity();
        Integer newQuantity = dto.quantity();
        Integer stockDifference = newQuantity - currentQuantity;

        // Stok farkı pozitif ise ekleme yapılacak, negatif ise çıkarma yapılacak
        if (dto.stockMovementType() == EStockMovementType.OUT)
        {
            // Çıkış işlemi (OUT)
            if (stockDifference > 0)
            {
                // Daha fazla çıkış yapılmak isteniyor, stokta yeterli mi?
                if (product.getStockCount() < stockDifference)
                {
                    throw new StockServiceException(ErrorType.INSUFFICIENT_STOCK, product.getName() + " Stock count is: " + product.getStockCount());
                }
                // Stoktan fark kadar çıkış yap
                product.setStockCount(product.getStockCount() - stockDifference);
            } else
            {
                // Çıkış miktarı azaldıysa (stockDifference negatif), stoğa iade yapılır
                product.setStockCount(product.getStockCount() + Math.abs(stockDifference));
            }
        } else if (dto.stockMovementType() == EStockMovementType.IN)
        {
            // Giriş işlemi (IN)
            if (stockDifference > 0)
            {
                // Giriş miktarı arttıysa, fark kadar stoğa ekle
                product.setStockCount(product.getStockCount() + stockDifference);
            } else
            {
                // Giriş miktarı azaldıysa, fark kadar stoktan çıkar
                product.setStockCount(product.getStockCount() - Math.abs(stockDifference));
            }
        }

        productService.save(product);

        stockMovement.setProductId(dto.productId());
        stockMovement.setQuantity(dto.quantity());
        stockMovement.setStockMovementType(dto.stockMovementType());

        stockMovementRepository.save(stockMovement);

        return true;
    }


    public StockMovement findByIdAndMemberId(Long id)
    {
        return stockMovementRepository.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.STOCK_MOVEMENT_NOT_FOUND));
    }

    /**
     * Finds products with name containing search text
     * Finds sell orders with respect to pagination
     * Converts orders to StockMovementResponseDTO
     *
     * @param dto search text , page number , page size parameters
     * @return List of StockMovementResponseDTO
     */
    public List<StockMovementResponseDTO> findAll(PageRequestDTO dto)
    {
        //Finds products with name containing search text
        List<Product> products = productService.findAllByNameContainingIgnoreCaseAndMemberIdOrderByNameAsc(dto.searchText(), SessionManager.getMemberIdFromAuthenticatedMember());
        //Mapping products to their ids
        List<Long> productIdList = products.stream().map(Product::getId).collect(Collectors.toList());
        //Finds buy orders with respect to pagination, order type and product ids
        List<StockMovement> stockList = stockMovementRepository.findAllByProductIdInAndStatusIsNot(productIdList, EStatus.DELETED, PageRequest.of(dto.page(), dto.size()));
        List<StockMovementResponseDTO> stockMovementDtoList = new ArrayList<>();
        //Converting orders to BuyOrderResponseDTO and finding productName + supplierName
        stockList.stream().forEach(stock ->
        {
            String productName = products.stream().filter(product -> product.getId() == stock.getProductId()).findFirst().get().getName();
            String wareHouseName = wareHouseService.findByIdAndMemberId(stock.getWarehouseId()).getName();
            stockMovementDtoList.add(new StockMovementResponseDTO(stock.getId(), productName, wareHouseName, stock.getQuantity(), stock.getStatus(), stock.getStockMovementType(), stock.getCreatedAt()));
        });
        return stockMovementDtoList.stream()
                .sorted(Comparator.comparing(StockMovementResponseDTO::productName))
                .collect(Collectors.toList());
    }


}

