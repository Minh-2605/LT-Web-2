package com.rainbowforest.paymentservice.service;

import com.rainbowforest.paymentservice.feignclient.ProductClient;
import com.rainbowforest.paymentservice.entity.Payment;
import com.rainbowforest.paymentservice.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ProductClient productClient; // Cổng Feign đã tạo ở bước trước

    public Payment processPayment(Payment payment) {
        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus("SUCCESS");

        // TỰ ĐỘNG LẤY CATEGORY THẬT
        try {
            // Lấy productId từ đơn hàng. 
            // Giả sử lấy từ payment gửi lên hoặc mặc định là 1 để test
            Long productId = (payment.getOrderId() != null) ? payment.getOrderId() : 1L; 
            
            // Gọi sang Product Service lấy Category "hàng thật"
            String realCategory = productClient.getCategoryByProductId(productId);
            payment.setCategory(realCategory);
            
        } catch (Exception e) {
            // Nếu Product Service chưa bật hoặc lỗi, ta để dự phòng
            payment.setCategory("N/A (Service Offline)");
        }

        return paymentRepository.save(payment);
    }

    public java.util.List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}