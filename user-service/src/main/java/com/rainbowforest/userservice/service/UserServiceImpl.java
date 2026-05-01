package com.rainbowforest.userservice.service;

import com.rainbowforest.userservice.entity.User;
import com.rainbowforest.userservice.entity.UserRole;
import com.rainbowforest.userservice.repository.UserRepository;
import com.rainbowforest.userservice.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.getOne(id);
    }

    @Override
    public User getUserByName(String userName) {
        return userRepository.findByUserName(userName);
    }

    @Override
    public User saveUser(User user) {
        user.setActive(1);
        UserRole role = userRoleRepository.findUserRoleByRoleName("ROLE_USER");
        user.setRole(role);
        return userRepository.save(user);
    }

    @Override
    public User updateUserDetails(Long userId, com.rainbowforest.userservice.entity.UserDetails details) {
        User existingUser = userRepository.findById(userId).orElse(null);
        if (existingUser != null) {
            com.rainbowforest.userservice.entity.UserDetails currentDetails = existingUser.getUserDetails();
            if (currentDetails == null) {
                currentDetails = new com.rainbowforest.userservice.entity.UserDetails();
            }
            // Update fields
            currentDetails.setFirstName(details.getFirstName());
            currentDetails.setLastName(details.getLastName());
            currentDetails.setEmail(details.getEmail());
            currentDetails.setPhoneNumber(details.getPhoneNumber());
            currentDetails.setStreet(details.getStreet());
            currentDetails.setStreetNumber(details.getStreetNumber());
            currentDetails.setZipCode(details.getZipCode());
            currentDetails.setLocality(details.getLocality());
            currentDetails.setCountry(details.getCountry());
            
            existingUser.setUserDetails(currentDetails);
            return userRepository.save(existingUser);
        }
        return null;
    }
}
