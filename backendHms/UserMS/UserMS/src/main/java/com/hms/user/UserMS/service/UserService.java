package com.hms.user.UserMS.service;

import com.hms.user.UserMS.dto.LoginDto;
import com.hms.user.UserMS.dto.RegistrationCountsDto;
import com.hms.user.UserMS.dto.UserDto;
import com.hms.user.UserMS.exception.HmsException;
import java.util.UUID;

public interface UserService {
    public void registerUser(UserDto userDto) throws HmsException;

    public UserDto login(LoginDto userDto) throws HmsException;

    public UserDto getUserById(UUID id) throws HmsException;

    public void updateUser(UserDto userDto);

    public UserDto findByEmail(String email) throws HmsException;

    public RegistrationCountsDto getRegistrationCountsByRoleGroupedMonth() throws HmsException;

}
