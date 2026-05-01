package com.rainbowforest.productcatalogservice.controller;

import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.entity.Category; // Thêm import này
import com.rainbowforest.productcatalogservice.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTests {

    private static final String PRODUCT_NAME = "test";
    private static final Long PRODUCT_ID = 5L;
    private static final String CATEGORY_NAME = "testCategory"; // Đổi tên cho rõ nghĩa
    private List<Product> products;
    private Product product;

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @BeforeEach
    void setUp() {
        // 1. Khởi tạo Category object
        Category category = new Category();
        category.setId(1L);
        category.setCategoryName(CATEGORY_NAME);

        // 2. Khởi tạo Product và gán Category object vào
        product = new Product();
        product.setId(PRODUCT_ID);
        product.setProductName(PRODUCT_NAME);
        product.setCategory(category); // Truyền object thay vì String

        products = new ArrayList<>();
        products.add(product);
    }

    @Test
    void get_all_products_controller_should_return200_when_validRequest() throws Exception {
        when(productService.getAllProduct()).thenReturn(products);

        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(PRODUCT_ID))
                .andExpect(jsonPath("$[0].productName").value(PRODUCT_NAME));

        verify(productService, times(1)).getAllProduct();
    }

    @Test
    void get_all_products_controller_should_return404_when_productList_isEmpty() throws Exception {
        List<Product> emptyList = new ArrayList<>();
        when(productService.getAllProduct()).thenReturn(emptyList);

        mockMvc.perform(get("/products"))
                .andExpect(status().isNotFound());

        verify(productService, times(1)).getAllProduct();
    }

    @Test
    void get_all_product_by_category_controller_should_return200_when_validRequest() throws Exception {
        // Mock service nhận vào String (tên category) và trả về list sản phẩm chứa
        // Object Category
        when(productService.getAllProductByCategory(CATEGORY_NAME)).thenReturn(products);

        mockMvc.perform(get("/products").param("category", CATEGORY_NAME))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(PRODUCT_ID))
                // Kiểm tra tên category bên trong object
                .andExpect(jsonPath("$[0].category.categoryName").value(CATEGORY_NAME));

        verify(productService, times(1)).getAllProductByCategory(anyString());
    }

    @Test
    void get_all_product_by_category_controller_should_return404_when_productList_isEmpty() throws Exception {
        List<Product> emptyList = new ArrayList<>();
        when(productService.getAllProductByCategory(anyString())).thenReturn(emptyList);

        mockMvc.perform(get("/products").param("category", CATEGORY_NAME))
                .andExpect(status().isNotFound());

        verify(productService, times(1)).getAllProductByCategory(anyString());
    }

    @Test
    void get_one_product_by_id_controller_should_return200_when_validRequest() throws Exception {
        when(productService.getProductById(anyLong())).thenReturn(product);

        mockMvc.perform(get("/products/{id}", PRODUCT_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(PRODUCT_ID))
                .andExpect(jsonPath("$.productName").value(PRODUCT_NAME));

        verify(productService, times(1)).getProductById(PRODUCT_ID);
    }

    @Test
    void get_one_product_by_id_controller_should_return404_when_product_isNotExist() throws Exception {
        when(productService.getProductById(anyLong())).thenReturn(null);

        mockMvc.perform(get("/products/{id}", PRODUCT_ID))
                .andExpect(status().isNotFound());

        verify(productService, times(1)).getProductById(PRODUCT_ID);
    }
}