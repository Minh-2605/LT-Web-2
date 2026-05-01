package com.rainbowforest.orderservice.controller;

import com.rainbowforest.orderservice.domain.Item;
import com.rainbowforest.orderservice.domain.Order;
import com.rainbowforest.orderservice.domain.User;
import com.rainbowforest.orderservice.feignclient.UserClient;
import com.rainbowforest.orderservice.http.header.HeaderGenerator;
import com.rainbowforest.orderservice.service.CartService;
import com.rainbowforest.orderservice.service.OrderService;
import com.rainbowforest.orderservice.utilities.OrderUtilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

// Sửa javax thành jakarta
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class OrderController {

    @Autowired
    private UserClient userClient;

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;

    @Autowired
    private HeaderGenerator headerGenerator;

    @PostMapping(value = "/order/{userId}")
    public ResponseEntity<Order> saveOrder(
            @PathVariable("userId") Long userId,
            @RequestHeader(value = "cartId") String cartId,
            @RequestBody List<Long> itemIds,
            HttpServletRequest request) {

        List<Item> cart = cartService.getItemsByIds(itemIds);

        // Gọi User Service qua Feign Client
        User user = userClient.getUserById(userId);

        if (cart != null && !cart.isEmpty() && user != null) {
            Order order = this.createOrder(cart, user);
            try {
                Order savedOrder = orderService.saveOrder(order);
                cartService.clearCartItems(itemIds); // Xóa cartId khỏi các Item đã đặt hàng

                return new ResponseEntity<Order>(
                        savedOrder,
                        headerGenerator.getHeadersForSuccessPostMethod(request, savedOrder.getId()),
                        HttpStatus.CREATED);
            } catch (Exception ex) {
                ex.printStackTrace();
                return new ResponseEntity<Order>(
                        headerGenerator.getHeadersForError(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        return new ResponseEntity<Order>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    // Tạo object Order từ giỏ hàng và thông tin User
    private Order createOrder(List<Item> cart, User user) {
        Order order = new Order();
        order.setItems(cart);
        order.setUser(user);
        order.setTotal(OrderUtilities.countTotalPrice(cart));
        order.setOrderedDate(LocalDate.now());
        order.setStatus("PAYMENT_EXPECTED");
        return order;
    }

    // 1. Lấy tất cả đơn hàng cho Admin
    @GetMapping(value = "/admin/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders(); // Đảm bảo trong OrderService đã có hàm này
        return new ResponseEntity<List<Order>>(
                orders,
                headerGenerator.getHeadersForSuccessGetMethod(),
                HttpStatus.OK);
    }

    // 2. Cập nhật trạng thái đơn hàng (Ví dụ từ PAYMENT_EXPECTED sang DELIVERED)
    @PatchMapping(value = "/admin/orders/{id}")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable("id") Long id,
            @RequestParam("status") String status) {
        Order order = orderService.getOrderById(id);
        if (order != null) {
            order.setStatus(status);
            orderService.saveOrder(order);
            return new ResponseEntity<Order>(
                    order,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<Order>(HttpStatus.NOT_FOUND);
    }

    // 3. Lấy đơn hàng theo người dùng (cho Customer)
    @GetMapping(value = "/order/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable("userId") Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return new ResponseEntity<List<Order>>(
                orders,
                headerGenerator.getHeadersForSuccessGetMethod(),
                HttpStatus.OK);
    }
}