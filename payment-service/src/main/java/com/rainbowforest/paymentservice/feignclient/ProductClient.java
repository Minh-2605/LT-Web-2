package com.rainbowforest.paymentservice.feignclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// Tên này phải khớp với spring.application.name của Product Service trên Eureka
@FeignClient(name = "product-catalog-service") 
public interface ProductClient {

    // Định nghĩa đúng đường dẫn API lấy category bên Product Service
    @GetMapping("/products/{id}/category")
    String getCategoryByProductId(@PathVariable("id") Long id);
}