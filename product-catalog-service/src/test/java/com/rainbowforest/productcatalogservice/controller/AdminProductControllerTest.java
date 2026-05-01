package com.rainbowforest.productcatalogservice.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.entity.Category; // Import thêm cái này
import com.rainbowforest.productcatalogservice.service.ProductService;
import java.math.BigDecimal;

@SpringBootTest
@AutoConfigureMockMvc
class AdminProductControllerTest {

    private static final String PRODUCT_NAME = "test";
    private static final String CATEGORY_NAME = "testCategory"; // Đổi tên cho rõ nghĩa

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    @Test
    void add_product_controller_should_return201_when_product_isSaved() throws Exception {
        // given
        // 1. Tạo object Category giả lập
        Category category = new Category();
        category.setId(1L);
        category.setCategoryName(CATEGORY_NAME);

        // 2. Tạo object Product và gán Category vào
        Product product = new Product();
        product.setProductName(PRODUCT_NAME);
        product.setPrice(new BigDecimal("1000")); // Thêm giá để tránh lỗi @NotNull nếu có
        product.setCategory(category); // Bây giờ truyền object vào là hết báo đỏ!
        product.setAvailability(1);

        String requestJson = objectMapper.writeValueAsString(product);

        // when
        when(productService.addProduct(any(Product.class))).thenReturn(product);

        // then
        mockMvc.perform(post("/admin/products")
                .content(requestJson)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.productName").value(PRODUCT_NAME))
                // Kiểm tra category_name bên trong object category
                .andExpect(jsonPath("$.category.categoryName").value(CATEGORY_NAME));

        verify(productService, times(1)).addProduct(any(Product.class));
        verifyNoMoreInteractions(productService);
    }

    @Test
    void add_product_controller_should_return400_when_product_isNull() throws Exception {
        // given
        String requestJson = "";

        // then
        mockMvc.perform(post("/admin/products")
                .content(requestJson)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}