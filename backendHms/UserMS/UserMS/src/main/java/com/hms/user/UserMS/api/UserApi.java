package com.hms.user.UserMS.api;

import com.hms.user.UserMS.dto.LoginDto;
import com.hms.user.UserMS.dto.RegistrationCountsDto;
import com.hms.user.UserMS.dto.ResponseDto;
import com.hms.user.UserMS.dto.UserDto;
import com.hms.user.UserMS.exception.HmsException;
import com.hms.user.UserMS.jwt.JwtUtil;
import com.hms.user.UserMS.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/user")
@Validated
@CrossOrigin
public class UserApi {
    private final UserService userService;
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public UserApi(UserService userService, UserDetailsService userDetailsService,
            AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userService = userService;
        this.userDetailsService = userDetailsService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseDto> registerUser(@RequestBody @Valid UserDto userDto) throws HmsException {
        userService.registerUser(userDto);
        return new ResponseEntity<>(new ResponseDto("Account created."), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody @Valid LoginDto loginDto) throws HmsException {
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));

        } catch (AuthenticationException e) {
            throw new HmsException("INVALID_CREDENTIALS");
        }
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginDto.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);
        return new ResponseEntity<>(jwt, HttpStatus.OK);
    }

    @GetMapping("/getRegistrationCounts")
    public ResponseEntity<RegistrationCountsDto> getRegistrationCounts() throws HmsException {
        return new ResponseEntity<>(userService.getRegistrationCountsByRoleGroupedMonth(), HttpStatus.OK);
    }

}
