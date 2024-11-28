package com.businessapi.analyticsservice.service;

import com.businessapi.analyticsservice.entity.DataSource;
import com.businessapi.analyticsservice.entity.stockService.entity.Order;
import com.businessapi.analyticsservice.entity.stockService.entity.Product;
import com.businessapi.analyticsservice.entity.stockService.entity.StockMovement;
import com.businessapi.analyticsservice.entity.stockService.entity.Supplier;
import com.businessapi.analyticsservice.entity.stockService.enums.EStockMovementType;
import com.businessapi.analyticsservice.repository.DataSourceRepository;
import com.businessapi.analyticsservice.util.ExcelUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StockService {
    private final DataSourceRepository dataSourceRepository;

    public StockService(DataSourceRepository dataSourceRepository) {
        this.dataSourceRepository = dataSourceRepository;
    }

    // fetch data from the DataSource by serviceType
    public String getDataFromDataSource(String endpointType) {
        DataSource dataSource = dataSourceRepository.findByEndpointType(endpointType)
                .orElseThrow(() -> new RuntimeException("DataSource not found for service type: " + endpointType));
        return dataSource.getData();
    }

    /*
     * Order
     */
    // parse orders from JSON string
    public List<Order> parseOrders(String jsonOrders) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        JsonNode dataNode = objectMapper.readTree(jsonOrders).get("data");
        return Arrays.asList(objectMapper.treeToValue(dataNode, Order[].class));
    }

    // total sales over time
    public BigDecimal analyzeTotalSalesOverTime(List<Order> orders) {
        return orders.stream()
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    public ResponseEntity<byte[]> exportTotalSalesToExcel(List<Order> orders) {
        try {
            List<String> headers = Arrays.asList("Order ID", "Total", "Created At");
            List<List<Object>> data = orders.stream()
                    .map(order -> Arrays.asList((Object) order.getId(), order.getTotal(), order.getCreatedAt()))
                    .collect(Collectors.toList());

            ByteArrayOutputStream outputStream = ExcelUtil.writeToExcel("Total Sales", headers, data);

            HttpHeaders headersExcel = new HttpHeaders();
            headersExcel.set("Content-Disposition", "attachment; filename=total_sales.xlsx");

            return new ResponseEntity<>(outputStream.toByteArray(), headersExcel, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // total sales per day
    public Map<LocalDate, BigDecimal> calculateTotalSalesPerDay(List<Order> orders) {
        return orders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getCreatedAt().toLocalDate(),  // group by date (without time)
                        Collectors.reducing(BigDecimal.ZERO, Order::getTotal, BigDecimal::add)  // sum total for each date
                ));
    }
    /*
     * Export daily total sales to Excel
     */
    public ResponseEntity<byte[]> exportSalesPerDayToExcel(List<Order> orders) {
        try {
            Map<LocalDate, BigDecimal> salesPerDay = calculateTotalSalesPerDay(orders);

            List<String> headers = Arrays.asList("Date", "Total Sales");
            List<List<Object>> data = orders.stream()
                    .map(order -> Arrays.asList((Object) order.getId(), order.getTotal(), order.getCreatedAt()))
                    .collect(Collectors.toList());

            ByteArrayOutputStream outputStream = ExcelUtil.writeToExcel("Sales Per Day", headers, data);

            HttpHeaders headersExcel = new HttpHeaders();
            headersExcel.set("Content-Disposition", "attachment; filename=sales_per_day.xlsx");

            return new ResponseEntity<>(outputStream.toByteArray(), headersExcel, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*
     * Product
     */
    // parse product from JSON string
    public List<Product> parseProduct(String jsonProduct) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        JsonNode dataNode = objectMapper.readTree(jsonProduct).get("data");
        return Arrays.asList(objectMapper.treeToValue(dataNode, Product[].class));
    }

    // Get products with stock below their minimum level
    public List<Product> getLowStockAlerts(List<Product> products) {
        return products.stream()
                .filter(product -> product.getStockCount() < product.getMinimumStockLevel())
                .collect(Collectors.toList());
    }

    /*
     * Export low stock alerts to Excel
     */
    public ResponseEntity<byte[]> exportLowStockAlertsToExcel(List<Product> products) {
        try {
            List<Product> lowStockProducts = getLowStockAlerts(products);

            List<String> headers = Arrays.asList("Product ID", "Product Name", "Warehouse", "Quantity");
            List<List<Object>> data = lowStockProducts.stream()
                    .map(product -> Arrays.asList((Object) product.getId(), product.getName(), product.getWareHouseName(), product.getStockCount()))
                    .collect(Collectors.toList());

            ByteArrayOutputStream outputStream = ExcelUtil.writeToExcel("Low Stock Alerts", headers, data);

            HttpHeaders headersExcel = new HttpHeaders();
            headersExcel.set("Content-Disposition", "attachment; filename=low_stock_alerts.xlsx");

            return new ResponseEntity<>(outputStream.toByteArray(), headersExcel, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*
     * Stock
     */
    // parse stock movement from JSON string
    public List<StockMovement> parseStockMovement(String jsonStockMovements) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        JsonNode dataNode = objectMapper.readTree(jsonStockMovements).get("data");
        return Arrays.asList(objectMapper.treeToValue(dataNode, StockMovement[].class));
    }

    // Analyze stock allocation per warehouse
    public Map<Long, Integer> analyzeStockPerWarehouse(List<StockMovement> stockMovements) {
        return stockMovements.stream()
                .collect(Collectors.groupingBy(
                        StockMovement::getWarehouseId,
                        Collectors.summingInt(movement -> movement.getStockMovementType() == EStockMovementType.IN
                                ? movement.getQuantity()
                                : -movement.getQuantity())
                ));
    }

    /*
     * Supplier
     */
    // parse supplier from JSON string
    public List<Supplier> parseSupplier(String jsonSupplier) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        JsonNode dataNode = objectMapper.readTree(jsonSupplier).get("data");
        return Arrays.asList(objectMapper.treeToValue(dataNode, Supplier[].class));
    }

    // Analyze number of suppliers per country
    public Map<String, Long> analyzeNumOfSuppliersPerCountry(List<Supplier> suppliers) {
        return suppliers.stream()
                .collect(Collectors.groupingBy(
                        Supplier::getContactInfo,
                        Collectors.counting()
                ));
    }

    public ResponseEntity<byte[]> exportSuppliersPerCountryToExcel(List<Supplier> suppliers) {
        try {
            Map<String, Long> suppliersPerCountry = analyzeNumOfSuppliersPerCountry(suppliers);

            List<String> headers = Arrays.asList("Country", "Number of Suppliers");
            List<List<Object>> data = suppliersPerCountry.entrySet().stream()
                    .map(entry -> Arrays.asList((Object) entry.getKey(), entry.getValue()))
                    .collect(Collectors.toList());

            ByteArrayOutputStream outputStream = ExcelUtil.writeToExcel("Suppliers Per Country", headers, data);

            HttpHeaders headersExcel = new HttpHeaders();
            headersExcel.set("Content-Disposition", "attachment; filename=suppliers_per_country.xlsx");

            return new ResponseEntity<>(outputStream.toByteArray(), headersExcel, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
