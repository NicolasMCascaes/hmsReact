package com.hms.user.UserMS.service;

import com.hms.user.UserMS.dto.LoginDto;
import com.hms.user.UserMS.dto.UserDto;
import com.hms.user.UserMS.entity.User;
import com.hms.user.UserMS.exception.HmsException;
import com.hms.user.UserMS.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service("userService")
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApiService apiService;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, ApiService apiService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.apiService = apiService;
    }

    @Override
    public void registerUser(UserDto userDto) throws HmsException {
        Optional<User> opt = userRepository.findByEmail(userDto.getEmail());
        if (opt.isPresent()) {
            throw new HmsException("USER_ALREADY_EXISTS");
        }
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        UUID profileId = apiService.addProfile(userDto).block();
        userDto.setProfileId(profileId);
        userRepository.save(userDto.toEntity());
    }

    @Override
    public UserDto login(LoginDto loginDto) throws HmsException {
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new HmsException("USER_NOT_FOUND"));
        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new HmsException("INVALID_CREDENTIALS");
        }
        user.setPassword(null);
        return user.toDto();
    }

    @Override
    public UserDto getUserById(UUID id) throws HmsException {
        return userRepository.findById(id).orElseThrow(() -> new HmsException("USER_NOT_FOUND")).toDto();
    }

    @Override
    public void updateUser(UserDto userDto) {

    }

    @Override
    public UserDto findByEmail(String email) throws HmsException {
        return userRepository.findByEmail(email).orElseThrow(() -> new HmsException("USER_NOT_FOUND"))
                .toDto();
    }

}
