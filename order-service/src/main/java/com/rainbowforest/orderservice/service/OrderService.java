package com.rainbowforest.orderservice.service;

import java.util.List;
import com.rainbowforest.orderservice.domain.Order;

public interface OrderService {
    public Order saveOrder(Order order);

    List<Order> getAllOrders();

    Order getOrderById(Long id);

    List<Order> getOrdersByUserId(Long userId);
}
