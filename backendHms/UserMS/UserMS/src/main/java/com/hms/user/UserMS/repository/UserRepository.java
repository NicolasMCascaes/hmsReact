package com.hms.user.UserMS.repository;

import com.hms.user.UserMS.dto.MonthlyRoleCount;
import com.hms.user.UserMS.dto.Roles;
import com.hms.user.UserMS.entity.User;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends CrudRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    @Query("SELECT FUNCTION('MONTHNAME', u.createdAt) AS month, COUNT(u) AS count " +
            "FROM User u WHERE u.role = :role GROUP BY FUNCTION('MONTH', u.createdAt), FUNCTION(MONTHNAME, u.createdAt) ORDER BY FUNCTION('MONTH', u.createdAt)")
    List<MonthlyRoleCount> countRegistrationsByRoleGroupedMonth(Roles role);

}
