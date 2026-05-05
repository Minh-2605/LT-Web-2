package com.rainbowforest.userservice.controller;

import com.rainbowforest.userservice.entity.User;
import com.rainbowforest.userservice.http.header.HeaderGenerator;
import com.rainbowforest.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// Thay đổi quan trọng ở đây: javax -> jakarta
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private HeaderGenerator headerGenerator;

    @GetMapping(value = "/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        if (!users.isEmpty()) {
            return new ResponseEntity<List<User>>(
                    users,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<List<User>>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/users", params = "name")
    public ResponseEntity<User> getUserByName(@RequestParam("name") String userName) {
        User user = userService.getUserByName(userName);
        if (user != null) {
            return new ResponseEntity<User>(
                    user,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<User>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return new ResponseEntity<User>(
                    user,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<User>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @PostMapping(value = "/users")
    public ResponseEntity<User> addUser(@RequestBody User user, HttpServletRequest request) {
        if (user != null)
            try {
                userService.saveUser(user);
                return new ResponseEntity<User>(
                        user,
                        headerGenerator.getHeadersForSuccessPostMethod(request, user.getId()),
                        HttpStatus.CREATED);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<User>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        return new ResponseEntity<User>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User loginUser) {
        // 1. Tìm user theo userName từ Database
        User user = userService.getUserByName(loginUser.getUserName());

        // 2. Kiểm tra user có tồn tại và password có khớp không
        // Lưu ý: Minh đang lưu pass dạng plain text (chưa mã hóa) nên so sánh trực tiếp
        // ==
        if (user != null && user.getUserPassword().equals(loginUser.getUserPassword())) {

            // 3. Kiểm tra xem tài khoản có đang bị khóa (active = 0) không
            if (user.getActive() == 0) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN); // 403: Tài khoản bị khóa
            }

            return new ResponseEntity<>(user, HttpStatus.OK); // 200: Ok
        }

        // 4. Sai tài khoản hoặc mật khẩu
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // 401: Không được phép
    }

    @PutMapping(value = "/users/{id}/details")
    public ResponseEntity<User> updateUserDetails(
            @PathVariable("id") Long id,
            @RequestBody com.rainbowforest.userservice.entity.UserDetails userDetails) {
        
        User updatedUser = userService.updateUserDetails(id, userDetails);
        if (updatedUser != null) {
            return new ResponseEntity<User>(updatedUser, HttpStatus.OK);
        }
        return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
    }

    // --- QUÊN MẬT KHẨU & OTP ---
    
    @Autowired
    private com.rainbowforest.userservice.service.EmailService emailService;

    // Lưu trữ OTP tạm thời: Key = email, Value = OTP:Time
    private final java.util.concurrent.ConcurrentHashMap<String, String> otpStorage = new java.util.concurrent.ConcurrentHashMap<>();

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam("email") String email) {
        User user = userService.getUserByEmail(email);
        if (user == null) {
            return new ResponseEntity<>("Không tìm thấy tài khoản với email này", HttpStatus.NOT_FOUND);
        }

        // Tạo mã OTP 6 số
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        // Thời gian hết hạn (5 phút = 300000ms)
        long expiryTime = System.currentTimeMillis() + 300000;
        otpStorage.put(email, otp + ":" + expiryTime);

        try {
            emailService.sendOtpEmail(email, otp);
            return new ResponseEntity<>("OTP đã được gửi đến email", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Lỗi hệ thống khi gửi email", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam("email") String email, 
                                                @RequestParam("otp") String otp, 
                                                @RequestParam("newPassword") String newPassword) {
        String storedData = otpStorage.get(email);
        if (storedData == null) {
            return new ResponseEntity<>("Không có yêu cầu đổi mật khẩu cho email này", HttpStatus.BAD_REQUEST);
        }

        String[] parts = storedData.split(":");
        String storedOtp = parts[0];
        long expiryTime = Long.parseLong(parts[1]);

        if (System.currentTimeMillis() > expiryTime) {
            otpStorage.remove(email);
            return new ResponseEntity<>("Mã OTP đã hết hạn", HttpStatus.BAD_REQUEST);
        }

        if (!storedOtp.equals(otp)) {
            return new ResponseEntity<>("Mã OTP không hợp lệ", HttpStatus.BAD_REQUEST);
        }

        // Đổi mật khẩu
        User user = userService.getUserByEmail(email);
        if (user != null) {
            user.setUserPassword(newPassword);
            userService.saveUser(user);
            otpStorage.remove(email); // Xóa OTP sau khi dùng thành công
            return new ResponseEntity<>("Đổi mật khẩu thành công", HttpStatus.OK);
        }

        return new ResponseEntity<>("Lỗi không tìm thấy người dùng", HttpStatus.NOT_FOUND);
    }
}