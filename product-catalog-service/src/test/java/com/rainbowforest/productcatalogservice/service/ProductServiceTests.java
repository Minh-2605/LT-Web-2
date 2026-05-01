package com.rainbowforest.productcatalogservice.service;

import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.entity.Category;
import com.rainbowforest.productcatalogservice.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class ProductServiceTests {

    private static final String PRODUCT_NAME = "test";
    private static final Long PRODUCT_ID = 5L;
    private static final String CATEGORY_NAME = "testCategory";

    private List<Product> products;
    private Product product;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @BeforeEach
    void setUp() {
        Category category = new Category();
        category.setId(1L);
        category.setCategoryName(CATEGORY_NAME);

        product = new Product();
        product.setId(PRODUCT_ID);
        product.setProductName(PRODUCT_NAME);
        product.setCategory(category);

        products = new ArrayList<>();
        products.add(product);
    }

    @Test
    void get_all_product_test() {
        Mockito.when(productRepository.findAll()).thenReturn(products);
        List<Product> foundProducts = productService.getAllProduct();
        assertEquals(foundProducts.get(0).getProductName(), PRODUCT_NAME);
        Mockito.verify(productRepository, Mockito.times(1)).findAll();
    }

    @Test
    void get_one_by_id_test() {
        Mockito.when(productRepository.findById(PRODUCT_ID)).thenReturn(Optional.of(product));
        Product found = productService.getProductById(PRODUCT_ID);
        assertEquals(found.getId(), PRODUCT_ID);
        Mockito.verify(productRepository, Mockito.times(1)).findById(Mockito.anyLong());
    }

    @Test
    void get_all_product_by_category_test() {
        // SỬA TẠI ĐÂY: findAllByCategoryCategoryName (phải khớp 100% với Repository)
        Mockito.when(productRepository.findAllByCategoryCategoryName(CATEGORY_NAME)).thenReturn(products);

        List<Product> foundProducts = productService.getAllProductByCategory(CATEGORY_NAME);

        assertEquals(foundProducts.get(0).getCategory().getCategoryName(), CATEGORY_NAME);
        assertEquals(foundProducts.get(0).getProductName(), PRODUCT_NAME);

        // SỬA TẠI ĐÂY: verify cũng phải dùng tên method mới
        Mockito.verify(productRepository, Mockito.times(1)).findAllByCategoryCategoryName(Mockito.anyString());
        Mockito.verifyNoMoreInteractions(productRepository);
    }

    @Test
    void get_all_products_by_name_test() {
        Mockito.when(productRepository.findAllByProductName(PRODUCT_NAME)).thenReturn(products);
        List<Product> foundProducts = productService.getAllProductsByName(PRODUCT_NAME);
        assertEquals(foundProducts.get(0).getProductName(), PRODUCT_NAME);
        Mockito.verify(productRepository, Mockito.times(1)).findAllByProductName(Mockito.anyString());
    }
}