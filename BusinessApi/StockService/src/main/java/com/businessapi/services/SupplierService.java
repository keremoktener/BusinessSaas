package com.businessapi.services;


import com.businessapi.RabbitMQ.Model.EmailSendModal;
import com.businessapi.RabbitMQ.Model.ExistByEmailModel;
import com.businessapi.RabbitMQ.Model.SaveUserFromOtherServicesModel;
import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.request.SupplierSaveRequestDTO;
import com.businessapi.dto.request.SupplierUpdateRequestDTO;
import com.businessapi.entities.Order;
import com.businessapi.entities.Supplier;
import com.businessapi.entities.enums.EOrderType;
import com.businessapi.entities.enums.EStatus;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.StockServiceException;
import com.businessapi.repositories.SupplierRepository;
import com.businessapi.util.PasswordGenerator;
import com.businessapi.util.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService
{
    private final SupplierRepository supplierRepository;
    private final OrderService orderService;
    private final ProductService productService;
    private final RabbitTemplate rabbitTemplate;


    @Transactional
    public Boolean save(SupplierSaveRequestDTO dto)
    {
        Boolean isEmailExist = (Boolean) (rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keyExistByEmail", ExistByEmailModel.builder().email(dto.email()).build()));
        if (Boolean.TRUE.equals(isEmailExist))
        {
            throw new StockServiceException(ErrorType.SUPPLIER_EMAIL_ALREADY_EXISTS);
        }
        supplierRepository.findByEmail(dto.email()).ifPresent(supplier -> {
            throw new StockServiceException(ErrorType.SUPPLIER_EMAIL_ALREADY_EXISTS);
        });
        String password = PasswordGenerator.generatePassword();
        //saving supplier as auth and user
        Long authId = (Long) rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keySaveUserFromOtherServices", new SaveUserFromOtherServicesModel(dto.name(), dto.surname(), dto.email(), password, "SUPPLIER"));
        //sending password to suppliers
        EmailSendModal emailObject = new EmailSendModal(dto.email(), "Supplier Registration", "You can use your mail (" + dto.email() + ") to login. Your password is: " + password + " You can check your orders in our panel.");
        rabbitTemplate.convertAndSend("businessDirectExchange", "keySendMail", emailObject);

        supplierRepository.save(Supplier
                .builder()
                .name(dto.name())
                .surname(dto.surname())
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .email(dto.email())
                .contactInfo(dto.contactInfo())
                .address(dto.address())
                .notes(dto.notes())
                .authId(authId)
                .build());

        return true;
    }

    @Transactional
    public Boolean saveForDemoData(SupplierSaveRequestDTO dto)
    {
        String password = PasswordGenerator.generatePassword();
        //saving supplier as auth and user
        Long authId = (Long) rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keySaveUserFromOtherServices", new SaveUserFromOtherServicesModel(dto.name(), dto.surname(), dto.email(), password, "SUPPLIER"));
        //sending password to suppliers
        EmailSendModal emailObject = new EmailSendModal(dto.email(), "Supplier Registration", "You can use your mail (" + dto.email() + ") to login. Your password is: " + password + " You can check your orders in our panel.");
        rabbitTemplate.convertAndSend("businessDirectExchange", "keySendMail", emailObject);

        supplierRepository.save(Supplier
                .builder()
                .name(dto.name())
                .surname(dto.surname())
                .memberId(2L)
                .email(dto.email())
                .contactInfo(dto.contactInfo())
                .address(dto.address())
                .notes(dto.notes())
                .authId(authId)
                .build());

        return true;
    }

    public Boolean delete(Long id)
    {
        Supplier supplier = supplierRepository.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.SUPPLIER_NOT_FOUND));
        supplier.setStatus(EStatus.DELETED);
        supplierRepository.save(supplier);
        return true;
    }

    public Boolean update(SupplierUpdateRequestDTO dto)
    {
        Supplier supplier = supplierRepository.findByIdAndMemberId(dto.id(), SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.SUPPLIER_NOT_FOUND));
        if (dto.name() != null)
        {
            supplier.setName(dto.name());
        }
        if (dto.contactInfo() != null)
        {
            supplier.setContactInfo(dto.contactInfo());
        }
        if (dto.address() != null)
        {
            supplier.setAddress(dto.address());
        }
        if (dto.notes() != null)
        {
            supplier.setNotes(dto.notes());
        }
        if (dto.surname() != null)
        {
            supplier.setSurname(dto.surname());
        }
        supplierRepository.save(supplier);
        return true;
    }

    public List<Supplier> findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(PageRequestDTO dto)
    {
        return supplierRepository.findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(dto.searchText(),SessionManager.getMemberIdFromAuthenticatedMember(), EStatus.DELETED, PageRequest.of(dto.page(), dto.size()));
    }

    public Supplier findByIdAndMemberId(Long id)
    {
        return supplierRepository.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.SUPPLIER_NOT_FOUND));
    }

    public Supplier findById(Long id)
    {
        return supplierRepository.findById(id).orElseThrow(() -> new StockServiceException(ErrorType.SUPPLIER_NOT_FOUND));
    }

    public Boolean approveOrder(Long id)
    {
        Order order = orderService.findById(id);
        //Authorization check.
        Supplier supplier = supplierRepository.findByAuthId(SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.SUPPLIER_NOT_FOUND));
        if (!order.getSupplierId().equals(supplier.getId()))
        {
            throw new StockServiceException(ErrorType.UNAUTHORIZED);
        }
        if (order.getStatus() != EStatus.ACTIVE)
        {
            throw new StockServiceException(ErrorType.ORDER_NOT_ACTIVE);
        }
        if (order.getOrderType() != EOrderType.BUY)
        {
            throw new StockServiceException(ErrorType.WRONG_ORDER_TYPE);
        }
        //TODO MONEY MECHANISM CAN BE IMPLEMENTED LATER
        order.setStatus(EStatus.APPROVED);
        orderService.save(order);
        return true;
    }

    public Supplier findByAuthId(Long authId)
    {
        return supplierRepository.findByAuthId(authId).orElseThrow(() -> new StockServiceException(ErrorType.SUPPLIER_NOT_FOUND));
    }
}
