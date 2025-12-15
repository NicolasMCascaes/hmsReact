package com.hms.user.UserMS.api;

import com.hms.user.UserMS.dto.ResponseDto;
import com.hms.user.UserMS.dto.UserDto;
import com.hms.user.UserMS.exception.HmsException;
import com.hms.user.UserMS.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@Validated
@CrossOrigin
public class UserApi {
    private final UserService userService;

    public UserApi(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/register")
    public ResponseEntity<ResponseDto> registerUser(@RequestBody @Valid UserDto userDto) throws HmsException {
        userService.registerUser(userDto);
        return new ResponseEntity<>(new ResponseDto("Account created."), HttpStatus.CREATED);
    }
    @PostMapping("/login")
    public ResponseEntity<UserDto> loginUser(@RequestBody UserDto userDto) throws HmsException {
        return new ResponseEntity<>(userService.login(userDto), HttpStatus.OK);
    }

}
