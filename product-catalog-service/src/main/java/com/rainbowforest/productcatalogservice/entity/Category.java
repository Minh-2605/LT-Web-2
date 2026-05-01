package com.rainbowforest.productcatalogservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_name")
    @NotNull
    private String categoryName;

    // ĐÚNG LÀ PHẢI ĐẶT Ở ĐÂY:
    @OneToMany(mappedBy = "category")
    @JsonIgnore // Ngăn không cho Jackson quét ngược lại Product để tránh lặp vô hạn
    private List<Product> products;

    // Getter và Setter cho ID
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Getter và Setter cho CategoryName
    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    // Minh nhớ thêm Getter/Setter cho List products này để Hibernate hoạt động nhé
    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}