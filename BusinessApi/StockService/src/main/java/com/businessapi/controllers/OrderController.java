package com.businessapi.controllers;

import static com.businessapi.constants.Endpoints.*;

import com.businessapi.dto.request.*;
import com.businessapi.dto.response.BuyOrderResponseDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.dto.response.SellOrderResponseDTO;
import com.businessapi.dto.response.SupplierOrderResponseDTO;
import com.businessapi.entities.Order;
import com.businessapi.services.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ROOT + ORDER)
@RequiredArgsConstructor
@CrossOrigin("*")
public class OrderController
{
    private final OrderService orderService;

    @PostMapping(SAVE_SELL_ORDER)
    @Operation(summary = "Creates new sell Order")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> saveSellOrder(@RequestBody SellOrderSaveRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(orderService.saveSellOrder(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(SAVE_BUY_ORDER)
    @Operation(summary = "Creates new buy Order")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> saveBuyOrder(@RequestBody BuyOrderSaveRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(orderService.saveBuyOrder(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @DeleteMapping(DELETE)
    @Operation(summary = "Soft deletes Order")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> delete(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(orderService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }


    @PutMapping(UPDATE_BUY_ORDER)
    @Operation(summary = "Updates Buy Order")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody BuyOrderUpdateRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(orderService.updateBuyOrder(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PutMapping(UPDATE_SELL_ORDER)
    @Operation(summary = "Updates Sell Order")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody SellOrderUpdateRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(orderService.updateSellOrder(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_ALL_BUY_ORDERS)
    @Operation(summary = "Finds all buy orders with respect to pagination")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<List<BuyOrderResponseDTO>>> findAllBuyOrders(@RequestBody PageRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<List<BuyOrderResponseDTO>>builder()
                .data(orderService.findAllBuyOrders(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_ALL_SELL_ORDERS)
    @Operation(summary = "Finds all sell orders with respect to pagination")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<List<SellOrderResponseDTO>>> findAllSellOrders(@RequestBody PageRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<List<SellOrderResponseDTO>>builder()
                .data(orderService.findAllSellOrders(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_BY_ID)
    @Operation(summary = "Finds Order by Id")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Order>> findById(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Order>builder()
                .data(orderService.findById(id))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_ORDERS_OF_SUPPLIER)
    @Operation(summary = "Find all of the supplier's orders")
    @PreAuthorize("hasAnyAuthority('SUPPLIER')")
    public ResponseEntity<ResponseDTO<List<SupplierOrderResponseDTO>>> findOrdersOfSupplier(@RequestBody PageRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<List<SupplierOrderResponseDTO>>builder()
                .data(orderService.findOrdersOfSupplier(dto))
                .message("Success")
                .code(200)
                .build());
    }
}
