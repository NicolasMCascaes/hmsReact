package com.hms.user.UserMS.service;

import com.hms.user.UserMS.dto.UserDto;
import com.hms.user.UserMS.exception.HmsException;

import java.util.UUID;

public interface UserService {
    public void registerUser(UserDto userDto) throws HmsException;
    public UserDto login(UserDto userDto) throws HmsException;
    public UserDto getUserById(UUID id) throws HmsException;
    public void updateUser(UserDto userDto);


}
