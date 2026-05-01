package com.rainbowforest.paymentservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private Long orderId; // ID của đơn hàng từ Order Service
    private Double amount; // Số tiền thanh toán
    private String paymentMethod; // Ví dụ: "CASH", "BANK_TRANSFER"
    private String status; // Ví dụ: "SUCCESS", "PENDING"
    private LocalDateTime paymentDate;
    @Transient // Quan trọng: Thư viện JPA sẽ bỏ qua không tạo cột này trong DB
    private String category;

    // Getter và Setter (Bạn có thể chuột phải chọn Source Action -> Generate
    // Getters and Setters)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}