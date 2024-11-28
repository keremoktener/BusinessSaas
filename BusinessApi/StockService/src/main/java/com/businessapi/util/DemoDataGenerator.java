package com.businessapi.util;

import com.businessapi.dto.request.*;
import com.businessapi.dto.response.CustomerSaveRequestDTO;
import com.businessapi.entities.enums.EStockMovementType;
import com.businessapi.services.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@RequiredArgsConstructor
@Service
public class DemoDataGenerator
{
    private final ProductService productService;
    private final ProductCategoryService productCategoryService;
    private final OrderService orderService;
    private final SupplierService supplierService;
    private final StockMovementService stockMovementService;
    private final WareHouseService wareHouseService;
    private final CustomerService customerService;

    @PostConstruct
    public void generateDemoData()
    {
        productCategoryDemoData();
        productDemoData();
        customerDemoData();
        supplierDemoData();
        wareHouseDemoData();
        orderDemoData();
        stockMovementDemoData();

    }

    private void productCategoryDemoData()
    {
        productCategoryService.saveForDemoData(new ProductCategorySaveRequestDTO("Electronics"));
        productCategoryService.saveForDemoData(new ProductCategorySaveRequestDTO("Home Appliances"));
        productCategoryService.saveForDemoData(new ProductCategorySaveRequestDTO("Clothing"));
        productCategoryService.saveForDemoData(new ProductCategorySaveRequestDTO("Books"));
        productCategoryService.saveForDemoData(new ProductCategorySaveRequestDTO("Toys"));
        productCategoryService.saveForDemoData(new ProductCategorySaveRequestDTO("Sports Equipment"));
        productCategoryService.saveForDemoData(new ProductCategorySaveRequestDTO("Furniture"));
        productCategoryService.saveForDemoData(new ProductCategorySaveRequestDTO("Beauty Products"));
        productCategoryService.saveForDemoData(new ProductCategorySaveRequestDTO("Jewelry"));
        productCategoryService.saveForDemoData(new ProductCategorySaveRequestDTO("Health & Wellness"));
        productCategoryService.saveForDemoData(new ProductCategorySaveRequestDTO("Automotive"));
        productCategoryService.saveForDemoData(new ProductCategorySaveRequestDTO("Grocery"));
        productCategoryService.saveForDemoData(new ProductCategorySaveRequestDTO("Pet Supplies"));
        productCategoryService.saveForDemoData(new ProductCategorySaveRequestDTO("Office Supplies"));
        productCategoryService.saveForDemoData(new ProductCategorySaveRequestDTO("Musical Instruments"));

    }

    private void productDemoData()
    {
        productService.saveForDemoData(new ProductSaveRequestDTO(1L,1L,1L, "iPhone 13", "Smart Phone", BigDecimal.valueOf(50000), 100, 10));
        productService.saveForDemoData(new ProductSaveRequestDTO(2L,1L,2L, "Samsung Galaxy S21", "Smart Phone", BigDecimal.valueOf(45000), 80, 15));
        productService.saveForDemoData(new ProductSaveRequestDTO(2L,5L,3L, "Sony Bravia 55", "Television", BigDecimal.valueOf(70000), 50, 100));
        productService.saveForDemoData(new ProductSaveRequestDTO(4L,5L,4L, "HP Pavilion Laptop", "Laptop", BigDecimal.valueOf(60000), 40, 100));
        productService.saveForDemoData(new ProductSaveRequestDTO(1L,4L,5L, "Canon EOS 250D", "Camera", BigDecimal.valueOf(30000), 30, 12));
        productService.saveForDemoData(new ProductSaveRequestDTO(4L,1L,6L, "PlayStation 5", "Gaming Console", BigDecimal.valueOf(75000), 20, 4));
        productService.saveForDemoData(new ProductSaveRequestDTO(1L,1L,7L, "KitchenAid Mixer", "Home Appliance", BigDecimal.valueOf(20000), 60, 10));
        productService.saveForDemoData(new ProductSaveRequestDTO(1L,3L,5L, "Nike Air Max", "Shoes", BigDecimal.valueOf(15000), 120, 20));
        productService.saveForDemoData(new ProductSaveRequestDTO(5L,1L,10L, "Levi's 501 Jeans", "Clothing", BigDecimal.valueOf(5000), 200, 30));
        productService.saveForDemoData(new ProductSaveRequestDTO(1L,5L,11L, "The Great Gatsby", "Book", BigDecimal.valueOf(300), 500, 50));
        productService.saveForDemoData(new ProductSaveRequestDTO(6L,1L,12L, "Apple Watch Series 7", "Smart Watch", BigDecimal.valueOf(30000), 75, 7));
        productService.saveForDemoData(new ProductSaveRequestDTO(11L,3L,2L, "Dyson V11 Vacuum", "Home Appliance", BigDecimal.valueOf(40000), 25, 100));
        productService.saveForDemoData(new ProductSaveRequestDTO(2L,5L,3L, "Bose QuietComfort 35", "Headphones", BigDecimal.valueOf(25000), 45, 100));
        productService.saveForDemoData(new ProductSaveRequestDTO(1L,1L,4L, "Adidas Soccer Ball", "Sports Equipment", BigDecimal.valueOf(1200), 150, 25));
        productService.saveForDemoData(new ProductSaveRequestDTO(2L,3L,5L, "Fitbit Charge 5", "Fitness Tracker", BigDecimal.valueOf(12000), 90, 10));

    }

    private void supplierDemoData()
    {

        supplierService.saveForDemoData(new SupplierSaveRequestDTO("Apple","Production" ,"apple@gmail.com", "USA","Apple address", "Some notes about Apple"));
        supplierService.saveForDemoData(new SupplierSaveRequestDTO("Samsung", "Production" ,"samsung@gmail.com","South Korea", "Samsung HQ, Seoul", "Leading tech company in mobile devices"));
        supplierService.saveForDemoData(new SupplierSaveRequestDTO("Sony", "Production" ,"sony@gmail.com","Japan", "Sony Tower, Tokyo", "Renowned for electronics and entertainment products"));
        supplierService.saveForDemoData(new SupplierSaveRequestDTO("Microsoft","Production" ,"microsoft@gmail.com", "USA", "Microsoft Campus, Redmond", "Global leader in software development"));
        supplierService.saveForDemoData(new SupplierSaveRequestDTO("Nike", "Production" ,"nike@gmail.com","USA", "Nike World HQ, Oregon", "Top brand for sportswear and equipment"));
        supplierService.saveForDemoData(new SupplierSaveRequestDTO("Adidas", "Production" ,"adidas@gmail.com","Germany", "Adidas HQ, Herzogenaurach", "Famous for sports shoes and apparel"));
        supplierService.saveForDemoData(new SupplierSaveRequestDTO("Canon", "Production" ,"canon@gmail.com","Japan", "Canon HQ, Tokyo", "Specializes in cameras and imaging solutions"));
        supplierService.saveForDemoData(new SupplierSaveRequestDTO("HP", "Production" ,"hp@gmail.com","USA", "HP HQ, Palo Alto", "Known for printers and personal computing devices"));
        supplierService.saveForDemoData(new SupplierSaveRequestDTO("LG", "Production" ,"lg@gmail.com","South Korea", "LG Twin Towers, Seoul", "Major producer of electronics and home appliances"));
        supplierService.saveForDemoData(new SupplierSaveRequestDTO("Dell","Production" ,"dell@gmail.com", "USA", "Dell Technologies, Texas", "Leading company in computers and IT infrastructure"));
        supplierService.saveForDemoData(new SupplierSaveRequestDTO("Can Deniz","Gumus" ,"celestialalpacastudios@gmail.com", "Turkey", "Istanbul", "Technology company"));


    }

    private void wareHouseDemoData()
    {

        wareHouseService.saveForDemoData(new WareHouseSaveRequestDTO("Kartal", "Main Warehouse"));
        wareHouseService.saveForDemoData(new WareHouseSaveRequestDTO("Pendik", "Pendik Warehouse"));
        wareHouseService.saveForDemoData(new WareHouseSaveRequestDTO("Kadıköy", "Kadıköy Warehouse"));
        wareHouseService.saveForDemoData(new WareHouseSaveRequestDTO("Ümraniye", "Ümraniye Warehouse"));
        wareHouseService.saveForDemoData(new WareHouseSaveRequestDTO("Maltepe", "Maltepe Warehouse"));
        wareHouseService.saveForDemoData(new WareHouseSaveRequestDTO("Ataşehir", "Ataşehir Warehouse"));
        wareHouseService.saveForDemoData(new WareHouseSaveRequestDTO("Tuzla", "Tuzla Warehouse"));
        wareHouseService.saveForDemoData(new WareHouseSaveRequestDTO("Beşiktaş", "Beşiktaş Warehouse"));
        wareHouseService.saveForDemoData(new WareHouseSaveRequestDTO("Şişli", "Şişli Warehouse"));
        wareHouseService.saveForDemoData(new WareHouseSaveRequestDTO("Sarıyer", "Sarıyer Warehouse"));




    }

    private void customerDemoData()
    {

        customerService.saveForDemoData(new CustomerSaveRequestDTO("12345678999","5353563421","John", "Doe", "johndoe@gmail.com"));
        customerService.saveForDemoData(new CustomerSaveRequestDTO("11111111111","5354825421","Jane", "Doe", "janedoe@gmail.com"));
        customerService.saveForDemoData(new CustomerSaveRequestDTO("22222222222","5355555421","Bob", "Smith", "bobsmith@gmail.com"));
        customerService.saveForDemoData(new CustomerSaveRequestDTO("33333333333","5353666421","Alice", "Johnson", "alicejohnson@gmail.com"));
        customerService.saveForDemoData(new CustomerSaveRequestDTO("44444444444","5222555421","Tom", "Lee", "tomlee@gmail.com"));
        customerService.saveForDemoData(new CustomerSaveRequestDTO("55555555555","5322255421","Sarah", "Brown", "sarahbrown@gmail.com"));
        customerService.saveForDemoData(new CustomerSaveRequestDTO("66666666666","5355559991","Michael", "Davis", "michaeldavis@gmail.com"));
        customerService.saveForDemoData(new CustomerSaveRequestDTO("77777777777","5354453211","Emily", "Wilson", "emilywilson@gmail.com"));
        customerService.saveForDemoData(new CustomerSaveRequestDTO("88888888888","5234555421","Olivia", "Martinez", "oliviamartinez@gmail.com"));
        customerService.saveForDemoData(new CustomerSaveRequestDTO("99999999999","5521555421","William", "Anderson", "williamanderson@gmail.com"));
        customerService.saveForDemoData(new CustomerSaveRequestDTO("11222233444","5765475421","Ava", "Thomas", "avathomas@gmail.com"));

    }

    private void orderDemoData()
    {

        orderService.saveSellOrderForDemoData(new SellOrderSaveRequestDTO(1L, 2L, 10));
        orderService.saveSellOrderForDemoData(new SellOrderSaveRequestDTO(2L, 5L, 15));
        orderService.saveSellOrderForDemoData(new SellOrderSaveRequestDTO(3L, 8L, 20));
        orderService.saveSellOrderForDemoData(new SellOrderSaveRequestDTO(4L, 10L, 5));
        orderService.saveSellOrderForDemoData(new SellOrderSaveRequestDTO(5L, 12L, 8));
        orderService.saveSellOrderForDemoData(new SellOrderSaveRequestDTO(6L, 1L, 30));
        orderService.saveSellOrderForDemoData(new SellOrderSaveRequestDTO(7L, 3L, 25));
        orderService.saveSellOrderForDemoData(new SellOrderSaveRequestDTO(3L, 7L, 12));
        orderService.saveSellOrderForDemoData(new SellOrderSaveRequestDTO(4L, 9L, 18));
        orderService.saveSellOrderForDemoData(new SellOrderSaveRequestDTO(5L, 14L, 22));





    }

    private void stockMovementDemoData()
    {

        stockMovementService.saveForDemoData(new StockMovementSaveDTO(1L,  10, EStockMovementType.IN));
        stockMovementService.saveForDemoData(new StockMovementSaveDTO(2L,  15, EStockMovementType.OUT));
        stockMovementService.saveForDemoData(new StockMovementSaveDTO(3L,  20, EStockMovementType.IN));
        stockMovementService.saveForDemoData(new StockMovementSaveDTO(4L,  22, EStockMovementType.OUT));
        stockMovementService.saveForDemoData(new StockMovementSaveDTO(5L,  2, EStockMovementType.IN));
        stockMovementService.saveForDemoData(new StockMovementSaveDTO(6L,  7, EStockMovementType.OUT));
        stockMovementService.saveForDemoData(new StockMovementSaveDTO(7L,  3, EStockMovementType.IN));
        stockMovementService.saveForDemoData(new StockMovementSaveDTO(8L,  5, EStockMovementType.OUT));
        stockMovementService.saveForDemoData(new StockMovementSaveDTO(9L,  15, EStockMovementType.IN));
        stockMovementService.saveForDemoData(new StockMovementSaveDTO(10L, 25, EStockMovementType.OUT));

    }



}
