package com.businessapi.analyticsservice.controller;

import com.businessapi.analyticsservice.entity.stockService.entity.Order;
import com.businessapi.analyticsservice.entity.stockService.entity.StockMovement;
import com.businessapi.analyticsservice.entity.stockService.entity.Supplier;
import com.businessapi.analyticsservice.service.StockService;
import com.businessapi.analyticsservice.entity.stockService.entity.Product;
import com.businessapi.analyticsservice.dto.response.ResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dev/v1/analytics/stocks")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    /*
     * Order
     */
    @GetMapping("/get-total-sales")
    @Operation(summary = "Get total sales")
    public ResponseEntity<ResponseDTO<BigDecimal>> getTotalSales() throws Exception {
        String jsonOrders = stockService.getDataFromDataSource("order");
        List<Order> orders = stockService.parseOrders(jsonOrders);
        BigDecimal totalSales = stockService.analyzeTotalSalesOverTime(orders);

        return ResponseEntity.ok(ResponseDTO.<BigDecimal>builder()
                .data(totalSales)
                .message("Success")
                .code(200)
                .build());
    }

    /*
     * Product
     */
    @GetMapping("/sales-per-day")
    @Operation(summary = "Get total sales per day")
    public ResponseEntity<ResponseDTO<Map<LocalDate, BigDecimal>>> calculateTotalSalesPerDay() throws Exception {
        String jsonOrders = stockService.getDataFromDataSource("order");
        List<Order> orders = stockService.parseOrders(jsonOrders);
        Map<LocalDate, BigDecimal> totalSalesByDay = stockService.calculateTotalSalesPerDay(orders);

        return ResponseEntity.ok(ResponseDTO.<Map<LocalDate, BigDecimal>>builder()
                .data(totalSalesByDay)
                .message("Success")
                .code(200)
                .build());
    }

    // Endpoint to export total sales to Excel
    @GetMapping("/export-total-sales")
    public ResponseEntity<byte[]> exportTotalSales() throws Exception {
        String jsonOrders = stockService.getDataFromDataSource("order");
        List<Order> orders = stockService.parseOrders(jsonOrders);
        return stockService.exportTotalSalesToExcel(orders);
    }

    @PostMapping("/low-stock")
    @Operation(summary = "Get low stock alerts")
    public ResponseEntity<ResponseDTO<List<Product>>> getLowStockAlerts() throws Exception {
        String jsonProducts = stockService.getDataFromDataSource("product");
        List<Product> products = stockService.parseProduct(jsonProducts);
        List<Product> lowStockProducts = stockService.getLowStockAlerts(products);

        return ResponseEntity.ok(ResponseDTO.<List<Product>>builder()
                .data(lowStockProducts)
                .message("Success")
                .code(200)
                .build());
    }

    /*
     * Stock Movement
     */
    @PostMapping("/stock-per-warehouse")
    @Operation(summary = "Get stock per warehouse")
    public ResponseEntity<ResponseDTO<Map<Long, Integer>>> getStockPerWarehouse() throws Exception {
        String jsonStockMovements = stockService.getDataFromDataSource("stock-movement");
        List<StockMovement> stockMovements = stockService.parseStockMovement(jsonStockMovements);
        Map<Long, Integer> stockPerWarehouse = stockService.analyzeStockPerWarehouse(stockMovements);
        return ResponseEntity.ok(ResponseDTO.<Map<Long, Integer>>builder()
                .data(stockPerWarehouse)
                .message("Success")
                .code(200)
                .build());
    }

    /*
     * Supplier
     */
    @PostMapping("/num-of-suppliers-per-country")
    @Operation(summary = "Get number of suppliers per country")
    public ResponseEntity<ResponseDTO<Map<String, Long>>> getNumOfSuppliersPerCountry() throws Exception {
        String jsonSupplier = stockService.getDataFromDataSource("supplier");
        List<Supplier> supplier = stockService.parseSupplier(jsonSupplier);
        Map<String, Long> stockPerWarehouse = stockService.analyzeNumOfSuppliersPerCountry(supplier);
        return ResponseEntity.ok(ResponseDTO.<Map<String, Long>>builder()
                .data(stockPerWarehouse)
                .message("Success")
                .code(200)
                .build());
    }

    // Endpoint to export suppliers per country to Excel
    @GetMapping("/export-suppliers-per-country")
    public ResponseEntity<byte[]> exportSuppliersPerCountry() throws Exception {
        String jsonSupplier = stockService.getDataFromDataSource("supplier");
        List<Supplier> suppliers = stockService.parseSupplier(jsonSupplier);
        return stockService.exportSuppliersPerCountryToExcel(suppliers);
    }
    // Endpoint to export sales per day to Excel
    @GetMapping("/export-sales-per-day")
    public ResponseEntity<byte[]> exportSalesPerDay() throws Exception {
        String jsonOrders = stockService.getDataFromDataSource("order");
        List<Order> orders = stockService.parseOrders(jsonOrders);
        return stockService.exportSalesPerDayToExcel(orders);
    }

    // Endpoint to export low stock alerts to Excel
    @GetMapping("/export-low-stock-alerts")
    public ResponseEntity<byte[]> exportLowStockAlerts() throws Exception {
        String jsonProducts = stockService.getDataFromDataSource("product");
        List<Product> products = stockService.parseProduct(jsonProducts);
        return stockService.exportLowStockAlertsToExcel(products);
    }
}
