package com.rainbowforest.orderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rainbowforest.orderservice.domain.Item;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByCartId(String cartId);
    Optional<Item> findByCartIdAndProduct_Id(String cartId, Long catalogProductId);
}
