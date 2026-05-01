package com.rainbowforest.orderservice.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
// Chuyển đổi toàn bộ sang jakarta
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table (name = "items")
@EqualsAndHashCode
public class Item {
    
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (name = "quantity")
    @NotNull
    private int quantity;

    @Column (name = "subtotal")
    @NotNull
    private BigDecimal subTotal;

    @Column(name = "cart_id")
    private String cartId;

    // CascadeType.ALL ở đây cần cẩn thận: nếu xóa Item, nó có thể xóa luôn Product gốc.
    // Thường thì với Product, chúng ta chỉ nên dùng MERGE hoặc PERSIST.
    @ManyToOne (cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn (name = "product_id")
    private Product product;

    @ManyToMany (mappedBy = "items")
    @JsonIgnore
    private List<Order> orders;
    
    public Item() {
    }

    public Item(@NotNull int quantity, Product product, BigDecimal subTotal) {
        this.quantity = quantity;
        this.product = product;
        this.subTotal = subTotal;
    }

    // --- Getter & Setter ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public BigDecimal getSubTotal() { return subTotal; }
    public void setSubTotal(BigDecimal subTotal) { this.subTotal = subTotal; }
    public String getCartId() { return cartId; }
    public void setCartId(String cartId) { this.cartId = cartId; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public List<Order> getOrders() { return orders; }
    public void setOrders(List<Order> orders) { this.orders = orders; }
}