package com.hms.user.UserMS.jwt;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.hms.user.UserMS.dto.UserDto;
import com.hms.user.UserMS.exception.HmsException;
import com.hms.user.UserMS.service.UserService;

@Service
public class MyUserDetailsService implements UserDetailsService {
    private final UserService userService;

    public MyUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        try {
            UserDto dto = userService.findByEmail(email);
            return new CustomUserDetails(dto.getId(), dto.getEmail(), dto.getPassword(), dto.getRole(), dto.getName());
        } catch (HmsException e) {
            e.printStackTrace();
        }
        return null;
    }

}
