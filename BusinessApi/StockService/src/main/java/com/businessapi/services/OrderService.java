package com.businessapi.services;

import com.businessapi.RabbitMQ.Model.InvoiceModel;
import com.businessapi.dto.request.*;
import com.businessapi.dto.response.BuyOrderResponseDTO;
import com.businessapi.dto.response.SellOrderResponseDTO;
import com.businessapi.dto.response.SupplierOrderResponseDTO;
import com.businessapi.entities.Customer;
import com.businessapi.entities.Order;
import com.businessapi.entities.Product;
import com.businessapi.entities.Supplier;
import com.businessapi.entities.enums.EOrderType;
import com.businessapi.entities.enums.EStatus;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.StockServiceException;
import com.businessapi.repositories.OrderRepository;
import com.businessapi.util.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService
{
    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final CustomerService customerService;
    private final RabbitTemplate rabbitTemplate;
    private SupplierService supplierService;

    @Autowired
    private void setService(@Lazy SupplierService supplierService)
    {
        this.supplierService = supplierService;
    }

    public Boolean saveSellOrder(SellOrderSaveRequestDTO dto)
    {
        if (dto.quantity() < 0)
        {
            throw new StockServiceException(ErrorType.VALUE_CAN_NOT_BE_BELOW_ZERO);
        }
        Product product = productService.findByIdAndMemberId(dto.productId());
        if (product.getStockCount() <= dto.quantity())
        {
            throw new StockServiceException(ErrorType.INSUFFICIENT_STOCK, product.getName() + " Stock count is: " + product.getStockCount());
        }
        if (product.getStatus() != EStatus.ACTIVE)
        {
            throw new StockServiceException(ErrorType.PRODUCT_NOT_ACTIVE);
        }
        //TODO IT CAN BE MOVED TO SOMEWHERE LIKE APPROVEOFFER.
        product.setStockCount(product.getStockCount() - dto.quantity());

        Order order = Order
                .builder()
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .customerId(dto.customerId())
                .unitPrice(product.getPrice())
                .quantity(dto.quantity())
                .productId(dto.productId())
                .orderType(EOrderType.SELL)
                .build();

        Order savedOrder = orderRepository.save(order);
        Customer customer = customerService.findByIdAndMemberId(dto.customerId());
        InvoiceModel invoiceModel = new InvoiceModel(customer.getIdentityNo(), customer.getEmail(), customer.getPhoneNo(), product.getId(), product.getName(),dto.quantity(),product.getPrice(),savedOrder.getTotal(), savedOrder.getCreatedAt().toLocalDate());
        rabbitTemplate.convertAndSend("businessDirectExchange", "keyGetModelFromStockService",invoiceModel );
        return true;
    }

    public Boolean saveSellOrderForDemoData(SellOrderSaveRequestDTO dto)
    {

        Product product = productService.findById(dto.productId());
        if (product.getStockCount() <= dto.quantity())
        {
            throw new StockServiceException(ErrorType.INSUFFICIENT_STOCK, product.getName() + " Stock count is: " + product.getStockCount());
        }
        if (product.getStatus() != EStatus.ACTIVE)
        {
            throw new StockServiceException(ErrorType.PRODUCT_NOT_ACTIVE);
        }
        //TODO IT CAN BE MOVED TO SOMEWHERE LIKE APPROVEOFFER.
        product.setStockCount(product.getStockCount() - dto.quantity());

        Order order = Order
                .builder()
                .memberId(2L)
                .customerId(dto.customerId())
                .unitPrice(product.getPrice())
                .quantity(dto.quantity())
                .productId(dto.productId())
                .orderType(EOrderType.SELL)
                .build();

        Order savedOrder = orderRepository.save(order);
        Customer customer = customerService.findbyId(dto.customerId());
        InvoiceModel invoiceModel = new InvoiceModel(customer.getIdentityNo(), customer.getEmail(), customer.getPhoneNo(), product.getId(), product.getName(),dto.quantity(),product.getPrice(),savedOrder.getTotal(), savedOrder.getCreatedAt().toLocalDate());
        rabbitTemplate.convertAndSend("businessDirectExchange", "keyGetModelFromStockService",invoiceModel );
        return true;
    }

    public Boolean saveBuyOrder(BuyOrderSaveRequestDTO dto)
    {
        if (dto.quantity() < 0)
        {
            throw new StockServiceException(ErrorType.VALUE_CAN_NOT_BE_BELOW_ZERO);
        }
        Product product = productService.findByIdAndMemberId(dto.productId());
        if (product.getStatus() != EStatus.ACTIVE)
        {
            throw new StockServiceException(ErrorType.PRODUCT_NOT_ACTIVE);
        }

        Order order = Order
                .builder()
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .supplierId(dto.supplierId())
                .unitPrice(product.getPrice())
                .quantity(dto.quantity())
                .productId(dto.productId())
                .orderType(EOrderType.BUY)
                .build();

        orderRepository.save(order);
        return true;
    }

    public Boolean saveBuyOrderForAutoScheduler(BuyOrderSaveRequestDTO dto, Long memberId)
    {
        Product product = productService.findById(dto.productId());
        if (product.getStatus() != EStatus.ACTIVE)
        {
            throw new StockServiceException(ErrorType.PRODUCT_NOT_ACTIVE);
        }

        Order order = Order
                .builder()
                .memberId(memberId)
                .supplierId(dto.supplierId())
                .unitPrice(product.getPrice())
                .quantity(dto.quantity())
                .productId(dto.productId())
                .orderType(EOrderType.BUY)
                .build();

        orderRepository.save(order);
        return true;
    }

    public void save(Order order)
    {
        orderRepository.save(order);
    }

    public Boolean delete(Long id)
    {
        Order order = orderRepository.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.ORDER_NOT_FOUND));

        if (order.getStatus() == EStatus.ARRIVED || order.getStatus() == EStatus.APPROVED)
        {
            throw new StockServiceException(ErrorType.ORDER_CAN_NOT_BE_DELETED);
        }
        if (order.getOrderType() == EOrderType.SELL)
        {
            Product product = productService.findByIdAndMemberId(order.getProductId());
            product.setStockCount(product.getStockCount() + order.getQuantity());
            productService.save(product);
        }

        order.setStatus(EStatus.DELETED);
        orderRepository.save(order);
        return true;
    }


    public Boolean updateBuyOrder(BuyOrderUpdateRequestDTO dto)
    {
        if (dto.quantity() < 0)
        {
            throw new StockServiceException(ErrorType.VALUE_CAN_NOT_BE_BELOW_ZERO);
        }
        Order order = orderRepository.findByIdAndMemberId(dto.id(), SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.ORDER_NOT_FOUND));
        if (order.getStatus() == EStatus.ARRIVED || order.getStatus() == EStatus.APPROVED)
        {
            throw new StockServiceException(ErrorType.ORDER_CAN_NOT_BE_UPDATED);
        }
        order.setQuantity(dto.quantity());
        order.setProductId(dto.productId());
        order.setSupplierId(dto.supplierId());
        orderRepository.save(order);
        return true;
    }

    public Boolean updateSellOrder(SellOrderUpdateRequestDTO dto)
    {
        if (dto.quantity() < 0)
        {
            throw new StockServiceException(ErrorType.VALUE_CAN_NOT_BE_BELOW_ZERO);
        }
        Order order = orderRepository.findByIdAndMemberId(dto.id(), SessionManager.getMemberIdFromAuthenticatedMember())
                .orElseThrow(() -> new StockServiceException(ErrorType.ORDER_NOT_FOUND));

        Product product = productService.findByIdAndMemberId(dto.productId());

        Integer stockDifference = dto.quantity() - order.getQuantity();

        if (stockDifference < 0)
        {
            product.setStockCount(product.getStockCount() + Math.abs(stockDifference));
        } else if (stockDifference > 0)
        {

            if (product.getStockCount() < stockDifference)
            {

                throw new StockServiceException(ErrorType.INSUFFICIENT_STOCK, product.getName() + " Stock count is: " + product.getStockCount());
            }
            product.setStockCount(product.getStockCount() - stockDifference);
        }

        order.setQuantity(dto.quantity());
        order.setProductId(dto.productId());
        order.setCustomerId(dto.customerId());


        orderRepository.save(order);
        productService.save(product);

        return true;
    }

    public List<Order> findAll(PageRequestDTO dto)
    {
        return orderRepository.findAll(PageRequest.of(dto.page(), dto.size())).getContent();
    }

    public Order findById(Long id)
    {
        return orderRepository.findById(id).orElseThrow(() -> new StockServiceException(ErrorType.ORDER_NOT_FOUND));
    }

    /**
     * Finds products with name containing search text
     * Finds buy orders with respect to pagination
     * Converts orders to BuyOrderResponseDTO
     *
     * @param dto search text , page number , page size parameters
     * @return List of BuyOrderResponseDTO
     */
    public List<BuyOrderResponseDTO> findAllBuyOrders(PageRequestDTO dto)
    {
        //Finds products with name containing search text
        List<Product> products = productService.findAllByNameContainingIgnoreCaseAndMemberIdOrderByNameAsc(dto.searchText(), SessionManager.getMemberIdFromAuthenticatedMember());
        //Mapping products to their ids
        List<Long> productIdList = products.stream().map(Product::getId).collect(Collectors.toList());
        //Finds buy orders with respect to pagination, order type and product ids
        List<Order> orderList = orderRepository.findAllByProductIdInAndMemberIdAndStatusIsNotAndOrderType(productIdList, SessionManager.getMemberIdFromAuthenticatedMember(), EStatus.DELETED, EOrderType.BUY, PageRequest.of(dto.page(), dto.size()));
        List<BuyOrderResponseDTO> buyOrderResponseDTOList = new ArrayList<>();
        //Converting orders to BuyOrderResponseDTO and finding productName + supplierName
        orderList.stream().forEach(order ->
        {
            String productName = products.stream().filter(product -> product.getId() == order.getProductId()).findFirst().get().getName();
            Supplier supplier = supplierService.findByIdAndMemberId(order.getSupplierId());
            buyOrderResponseDTOList.add(new BuyOrderResponseDTO(order.getId(), supplier.getName(), supplier.getEmail(), productName, order.getUnitPrice(), order.getQuantity(), order.getTotal(), order.getOrderType(), order.getCreatedAt(), order.getStatus()));
        });
        return buyOrderResponseDTOList.stream()
                .sorted(Comparator.comparing(BuyOrderResponseDTO::productName))
                .collect(Collectors.toList());
    }

    /**
     * Finds products with name containing search text
     * Finds sell orders with respect to pagination
     * Converts orders to SellOrderResponseDTO
     *
     * @param dto search text , page number , page size parameters
     * @return List of SellOrderResponseDTO
     */
    public List<SellOrderResponseDTO> findAllSellOrders(PageRequestDTO dto)
    {
        //Finds products with name containing search text
        List<Product> products = productService.findAllByNameContainingIgnoreCaseAndMemberIdOrderByNameAsc(dto.searchText(), SessionManager.getMemberIdFromAuthenticatedMember());
        //Mapping products to their ids
        List<Long> productIdList = products.stream().map(Product::getId).collect(Collectors.toList());
        //Finds buy orders with respect to pagination, order type and product ids
        List<Order> orderList = orderRepository.findAllByProductIdInAndMemberIdAndStatusIsNotAndOrderType(productIdList, SessionManager.getMemberIdFromAuthenticatedMember(), EStatus.DELETED, EOrderType.SELL, PageRequest.of(dto.page(), dto.size()));
        List<SellOrderResponseDTO> sellOrderResponseDTOList = new ArrayList<>();
        //Converting orders to BuyOrderResponseDTO and finding productName + supplierName
        orderList.stream().forEach(order ->
        {
            String productName = products.stream().filter(product -> product.getId() == order.getProductId()).findFirst().get().getName();
            Customer customer = customerService.findByIdAndMemberId(order.getCustomerId());

            sellOrderResponseDTOList.add(new SellOrderResponseDTO(order.getId(), customer.getName() + " " + customer.getSurname(), customer.getEmail(), productName, order.getUnitPrice(), order.getTotal(), order.getQuantity(), order.getOrderType(), order.getCreatedAt(), order.getStatus()));
        });
        return sellOrderResponseDTOList.stream()
                .sorted(Comparator.comparing(SellOrderResponseDTO::productName))
                .collect(Collectors.toList());

    }

    public List<SupplierOrderResponseDTO> findOrdersOfSupplier(PageRequestDTO dto)
    {
        //TODO LOOK AT THIS LATER THERE MIGHT BE PROBLEM
        Supplier supplier = supplierService.findByAuthId(SessionManager.getMemberIdFromAuthenticatedMember());

        return orderRepository.findAllByProductNameContainingIgnoreCaseAndsupplierIdAndStatusNot(dto.searchText(), supplier.getId(), EStatus.DELETED, PageRequest.of(dto.page(), dto.size()));

    }

    public Order findByIdAndMemberId(Long id, Long memberIdFromAuthenticatedMember)
    {
        return orderRepository.findByIdAndMemberId(id, memberIdFromAuthenticatedMember).orElseThrow(() -> new StockServiceException(ErrorType.ORDER_NOT_FOUND));
    }
}
