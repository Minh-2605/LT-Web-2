package com.rainbowforest.productcatalogservice.controller;

import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.http.header.HeaderGenerator;
import com.rainbowforest.productcatalogservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// Sửa javax thành jakarta
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/admin")
public class AdminProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private HeaderGenerator headerGenerator;

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable("id") Long id, @RequestBody Product productDetails) {
        Product product = productService.getProductById(id);
        if (product != null) {
            // Cập nhật các trường thông tin (giữ nguyên typo discription để khớp DB)
            product.setProductName(productDetails.getProductName());
            product.setPrice(productDetails.getPrice());
            product.setDiscription(productDetails.getDiscription());
            product.setCategory(productDetails.getCategory());
            product.setAvailability(productDetails.getAvailability());
            product.setImage(productDetails.getImage()); // Sửa lỗi không lưu ảnh khi cập nhật

            productService.addProduct(product); // Thường hàm save/add sẽ tự update nếu đã có ID
            return new ResponseEntity<>(product, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping(value = "/products")
    // Đổi private thành public
    public ResponseEntity<Product> addProduct(@RequestBody Product product, HttpServletRequest request) {
        if (product != null) {
            try {
                productService.addProduct(product);
                return new ResponseEntity<Product>(
                        product,
                        headerGenerator.getHeadersForSuccessPostMethod(request, product.getId()),
                        HttpStatus.CREATED);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<Product>(
                        headerGenerator.getHeadersForError(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<Product>(
                headerGenerator.getHeadersForError(),
                HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping(value = "/products/{id}")
    // Đổi private thành public
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Long id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            try {
                productService.deleteProduct(id);
                return new ResponseEntity<Void>(
                        headerGenerator.getHeadersForSuccessGetMethod(),
                        HttpStatus.OK);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<Void>(
                        headerGenerator.getHeadersForError(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<Void>(headerGenerator.getHeadersForError(), HttpStatus.NOT_FOUND);
    }
}