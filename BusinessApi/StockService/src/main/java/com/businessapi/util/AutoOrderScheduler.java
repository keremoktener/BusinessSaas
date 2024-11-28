package com.businessapi.util;

import com.businessapi.RabbitMQ.Model.EmailSendModal;
import com.businessapi.dto.request.BuyOrderSaveRequestDTO;
import com.businessapi.entities.Product;
import com.businessapi.entities.Supplier;
import com.businessapi.entities.enums.EStatus;
import com.businessapi.services.OrderService;
import com.businessapi.services.ProductService;
import com.businessapi.services.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AutoOrderScheduler
{
    private final ProductService productService;
    private final OrderService orderService;
    private final RabbitTemplate rabbitTemplate;
    private final SupplierService supplierService;

    /**
     * Every minute database will be checked and if product is below minimum stock level it will be auto ordered
     */
    //TODO CHANGE 1 MIN SCHEDULER TO 1 HOUR LATER
    @Scheduled(cron = "0 * * * * ?")
    public void AutoOrderByStockLevel() {

        List<Product> productList = productService.findAllByMinimumStockLevelAndStatus(EStatus.ACTIVE);
        productList.forEach(product ->
        {
            if (!product.getIsProductAutoOrdered() && product.getIsAutoOrderEnabled())
            {
                //Sending suppliers email to inform them.
                Supplier supplier = supplierService.findById(product.getSupplierId());
                rabbitTemplate.convertAndSend("businessDirectExchange", "keySendMail", new EmailSendModal(supplier.getEmail(), "Auto Order", "Your product " + product.getName()+" is below minimum stock level. We would like to order " + product.getMinimumStockLevel()*2 + " of it."));

                //TODO AUTO ORDER COUNT SET TO MINSTOCKLEVEL*2 MAYBE IT CAN BE CHANGED LATER
                orderService.saveBuyOrderForAutoScheduler(new BuyOrderSaveRequestDTO(product.getSupplierId(), product.getId(), product.getMinimumStockLevel() * 2),product.getMemberId());
                product.setIsProductAutoOrdered(true);
                productService.save(product);
            }
        });


    }
}
