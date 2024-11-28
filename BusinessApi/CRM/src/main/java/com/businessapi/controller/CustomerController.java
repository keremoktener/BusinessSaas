package com.businessapi.controller;

import com.businessapi.RabbitMQ.Model.CustomerSaveMailModel;
import com.businessapi.dto.request.*;
import com.businessapi.dto.response.CustomerResponseForOpportunityDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entity.Customer;
import com.businessapi.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

import static com.businessapi.constants.EndPoints.*;

@RestController
@RequestMapping(CUSTOMER)
@RequiredArgsConstructor
@CrossOrigin("*")
public class CustomerController {

    private final CustomerService customerService;


    @PostMapping(SAVE)
    @Operation(summary = "Save customer", description = "Save customer")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody CustomerSaveDTO customerSaveDTO) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(customerService.save(customerSaveDTO))
                .code(200)
                .message("Customer saved successfully").build());

    }

    @PostMapping(FINDALL)
    @Operation(summary = "Find all customers", description = "Find all customers")
    public ResponseEntity<ResponseDTO<List<Customer>>> findAll(@RequestBody PageRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO.<List<Customer>>builder()
                .data(customerService.findAll(dto))
                .code(200)
                .message("Customers found successfully")
                .build());
    }


    @PutMapping(UPDATE)
    @Operation(summary = "Update customer by token",description = "Update customer by token")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody CustomerUpdateDTO customerUpdateDTO) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(customerService.update(customerUpdateDTO))
                .code(200)
                .message("Customer updated successfully").build());

    }

    @DeleteMapping(DELETE)
    @Operation(summary = "Delete customer by token",description = "Delete customer by token")
    public ResponseEntity<ResponseDTO<Boolean>> deleteById(@RequestParam Long id) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(customerService.delete(id))
                .code(200)
                .message("Customer deleted successfully").build());
    }
    @PostMapping(FINDBYID)
    @Operation(summary = "Find customer by id",description = "Find customer by id")
    public ResponseEntity<ResponseDTO<Customer>> findById(@RequestParam Long id) {
        return ResponseEntity.ok(ResponseDTO.<Customer>builder()
                .data(customerService.findById(id))
                .code(200)
                .message("Customer found successfully").build());
    }

    @PostMapping(FOR_OPPORTUNITY)
    @Operation(summary = "Find customer by id",description = "Find customer by id")
    public ResponseEntity<ResponseDTO<List<CustomerResponseForOpportunityDTO>>> getCustomersForOpportunity(@RequestBody PageRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO.<List<CustomerResponseForOpportunityDTO>>builder()
                .data(customerService.getAllCustomersForOpportunity(dto))
                .code(200)
                .message("Customer found successfully").build());

    }

    @PostMapping(UPLOAD_EXCEL_CUSTOMER)
    public ResponseEntity<ResponseDTO<Boolean>> uploadExcelCustomer(@RequestBody AllCustomerSaveDTO dto) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(customerService.uploadExcelCustomers(dto))
                .code(200)
                .message("Customers uploaded successfully").build());
    }

    @PostMapping(SAVE_EXTERNAL_SOURCE_CUSTOMER)
    public ResponseEntity<ResponseDTO<Boolean>> saveExternalSourceCustomer(@RequestBody CustomerSaveLinkDTO dto) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(customerService.saveExternalSourceCustomers(dto))
                .code(200)
                .message("Customer saved successfully").build());
    }

    @PostMapping(SEND_EMAIL_EXTERNAL_SOURCE_CUSTOMER)
    public ResponseEntity<ResponseDTO<Void>> sendEmailExternalSourceCustomer(@RequestBody String email) {
        return ResponseEntity.ok(ResponseDTO.<Void>builder()
                .data(customerService.sendEmailExternalSourceCustomers(email))
                .code(200)
                .message("Email send successfully").build());
    }








}
