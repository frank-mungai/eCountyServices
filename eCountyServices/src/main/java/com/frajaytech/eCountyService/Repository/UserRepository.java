package com.frajaytech.eCountyService.Repository;

import com.frajaytech.eCountyService.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByIdNumberOrEmailOrPhone(String idNumber, String email, String phone);
    boolean existsByIdNumber(String idNumber);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}
