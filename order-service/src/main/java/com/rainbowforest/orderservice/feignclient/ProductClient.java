package com.rainbowforest.orderservice.feignclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.rainbowforest.orderservice.domain.Product;

@FeignClient(name = "product-catalog-service", url = "http://localhost:8810/")
public interface ProductClient {

    @GetMapping(value = "/api/products/{id}")
    public Product getProductById(@PathVariable(value = "id") Long productId);

    @PutMapping(value = "/api/products/{id}/deduct")
    public void deductProductStock(@PathVariable("id") Long id, @RequestParam("quantity") int quantity);

    @PutMapping(value = "/api/products/{id}/add-stock")
    public void addProductStock(@PathVariable("id") Long id, @RequestParam("quantity") int quantity);
}
