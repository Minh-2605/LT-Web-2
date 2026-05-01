package com.rainbowforest.productcatalogservice.controller;

import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.http.header.HeaderGenerator;
import com.rainbowforest.productcatalogservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api") // Thêm tiền tố /api để khớp với cấu hình Gateway thường dùng

public class ProductController {

    @Autowired
    private ProductService productService;
    
    @Autowired
    private HeaderGenerator headerGenerator;

    // 1. Lấy toàn bộ sản phẩm
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProduct();
        
        // Trả về OK kèm danh sách (có thể rỗng) để Frontend không bị lỗi 404
        return new ResponseEntity<>(
                products,
                headerGenerator.getHeadersForSuccessGetMethod(),
                HttpStatus.OK);
    }

    // 2. Lấy sản phẩm theo Category (Sử dụng RequestParam)
    @GetMapping(value = "/products", params = "category")
    public ResponseEntity<List<Product>> getAllProductByCategory(@RequestParam("category") String category) {
        List<Product> products = productService.getAllProductByCategory(category);
        return new ResponseEntity<>(
                products,
                headerGenerator.getHeadersForSuccessGetMethod(),
                HttpStatus.OK);
    }

    // 3. Lấy 1 sản phẩm theo ID
    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getOneProductById(@PathVariable("id") long id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            return new ResponseEntity<>(
                    product,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    // 4. Tìm kiếm sản phẩm theo tên
    @GetMapping(value = "/products", params = "name")
    public ResponseEntity<List<Product>> getAllProductsByName(@RequestParam("name") String name) {
        List<Product> products = productService.getAllProductsByName(name);
        return new ResponseEntity<>(
                products,
                headerGenerator.getHeadersForSuccessGetMethod(),
                HttpStatus.OK);
    }
}