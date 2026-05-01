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
}