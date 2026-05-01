package com.rainbowforest.orderservice.service;

import com.rainbowforest.orderservice.domain.Item;
import com.rainbowforest.orderservice.domain.Product;
import com.rainbowforest.orderservice.feignclient.ProductClient;
import com.rainbowforest.orderservice.repository.ItemRepository;
import com.rainbowforest.orderservice.utilities.CartUtilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    @Autowired
    private ProductClient productClient;

    @Autowired
    private ItemRepository itemRepository;

    @Override
    public void addItemToCart(String cartId, Long productId, Integer quantity) {
        Optional<Item> existingItem = itemRepository.findByCartIdAndProduct_Id(cartId, productId);

        if (existingItem.isPresent()) {
            Item item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            item.setSubTotal(CartUtilities.getSubTotalForItem(item.getProduct(), item.getQuantity()));
            itemRepository.save(item);
        } else {
            Product product = productClient.getProductById(productId);
            Item item = new Item(quantity, product, CartUtilities.getSubTotalForItem(product, quantity));
            item.setCartId(cartId);
            itemRepository.save(item);
        }
    }

    @Override
    public List<Object> getCart(String cartId) {
        return (List<Object>)(List<?>)itemRepository.findByCartId(cartId);
    }

    @Override
    public void changeItemQuantity(String cartId, Long productId, Integer quantity) {
        Optional<Item> existingItem = itemRepository.findByCartIdAndProduct_Id(cartId, productId);
        if (existingItem.isPresent()) {
            Item item = existingItem.get();
            item.setQuantity(quantity);
            item.setSubTotal(CartUtilities.getSubTotalForItem(item.getProduct(), quantity));
            itemRepository.save(item);
        }
    }

    @Override
    public void deleteItemFromCart(String cartId, Long productId) {
        Optional<Item> existingItem = itemRepository.findByCartIdAndProduct_Id(cartId, productId);
        existingItem.ifPresent(itemRepository::delete);
    }

    @Override
    public boolean checkIfItemIsExist(String cartId, Long productId) {
        return itemRepository.findByCartIdAndProduct_Id(cartId, productId).isPresent();
    }

    @Override
    public List<Item> getAllItemsFromCart(String cartId) {
        return itemRepository.findByCartId(cartId);
    }

    @Override
    public void deleteCart(String cartId) {
        // Hàm này giữ lại cho code cũ
        List<Item> items = itemRepository.findByCartId(cartId);
        for (Item item : items) {
            item.setCartId(null);
        }
        itemRepository.saveAll(items);
    }

    @Override
    public List<Item> getItemsByIds(List<Long> itemIds) {
        return itemRepository.findAllById(itemIds);
    }

    @Override
    public void clearCartItems(List<Long> itemIds) {
        List<Item> items = itemRepository.findAllById(itemIds);
        for (Item item : items) {
            item.setCartId(null);
        }
        itemRepository.saveAll(items);
    }
}
