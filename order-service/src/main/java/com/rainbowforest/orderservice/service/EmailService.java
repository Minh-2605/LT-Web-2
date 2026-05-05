package com.rainbowforest.orderservice.service;

import com.rainbowforest.orderservice.domain.Item;
import com.rainbowforest.orderservice.domain.Order;
import com.rainbowforest.orderservice.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendOrderConfirmationEmail(Order order, User user) {
        if (user == null || user.getUserDetails() == null || user.getUserDetails().getEmail() == null) {
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("no-reply@rainbowforest.com");
            helper.setTo(user.getUserDetails().getEmail());
            helper.setSubject("Xác nhận đơn hàng #" + order.getId() + " - Rainbow Forest");

            StringBuilder htmlMsg = new StringBuilder();
            htmlMsg.append("<h2>Cảm ơn bạn đã đặt hàng tại Rainbow Forest!</h2>");
            htmlMsg.append("<p>Xin chào <b>").append(user.getUserDetails().getFirstName()).append(" ").append(user.getUserDetails().getLastName()).append("</b>,</p>");
            htmlMsg.append("<p>Đơn hàng của bạn đã được ghi nhận thành công.</p>");
            htmlMsg.append("<h3>Chi tiết đơn hàng:</h3>");
            htmlMsg.append("<table border='1' cellpadding='10' cellspacing='0' style='border-collapse: collapse; width: 100%;'>");
            htmlMsg.append("<tr style='background-color: #f2f2f2;'><th>Sản phẩm</th><th>Số lượng</th><th>Thành tiền</th></tr>");

            for (Item item : order.getItems()) {
                String productName = item.getProduct() != null ? item.getProduct().getProductName() : "Sản phẩm";
                htmlMsg.append("<tr>")
                       .append("<td>").append(productName).append("</td>")
                       .append("<td style='text-align:center;'>").append(item.getQuantity()).append("</td>")
                       .append("<td style='text-align:right;'>").append(item.getSubTotal()).append(" VNĐ</td>")
                       .append("</tr>");
            }

            htmlMsg.append("<tr><th colspan='2' style='text-align:right;'>Tổng thanh toán:</th>")
                   .append("<th style='text-align:right; color: red;'>").append(order.getTotal()).append(" VNĐ</th></tr>");
            htmlMsg.append("</table>");
            htmlMsg.append("<br/><p>Chúng tôi sẽ sớm giao hàng cho bạn.</p>");
            htmlMsg.append("<p>Trân trọng,<br/>Đội ngũ Rainbow Forest</p>");

            helper.setText(htmlMsg.toString(), true);
            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Lỗi khi gửi email xác nhận đơn hàng: " + e.getMessage());
        }
    }
}
