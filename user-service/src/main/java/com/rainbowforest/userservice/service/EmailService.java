package com.rainbowforest.userservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("no-reply@rainbowforest.com");
        message.setTo(toEmail);
        message.setSubject("Mã OTP Đặt Lại Mật Khẩu");
        message.setText("Chào bạn,\n\n" +
                "Mã OTP để đặt lại mật khẩu của bạn là: " + otp + "\n" +
                "Mã này sẽ hết hạn trong vòng 5 phút.\n\n" +
                "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                "Trân trọng,\nĐội ngũ hỗ trợ.");
        
        mailSender.send(message);
    }
}
