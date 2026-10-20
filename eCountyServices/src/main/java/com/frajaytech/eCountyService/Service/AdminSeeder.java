package com.frajaytech.eCountyService.Service;

import com.frajaytech.eCountyService.Entity.User;
import com.frajaytech.eCountyService.Repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Creates the first admin account on startup if it does not exist yet. */
@Component
public class AdminSeeder implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final String idNumber, fullName, email, phone, password;

    public AdminSeeder(UserRepository users, PasswordEncoder encoder,
                       @Value("${app.admin.id-number}") String idNumber,
                       @Value("${app.admin.full-name}") String fullName,
                       @Value("${app.admin.email}") String email,
                       @Value("${app.admin.phone}") String phone,
                       @Value("${app.admin.password}") String password) {
        this.users = users;
        this.encoder = encoder;
        this.idNumber = idNumber;
        this.fullName = fullName;
        this.email = email.toLowerCase();
        this.phone = phone;
        this.password = password;
    }

    @Override
    public void run(String... args) {
        if (users.findByIdNumberOrEmailOrPhone(idNumber, email, phone).isPresent()) {
            log.info("Admin seed skipped: a user with that ID, email or phone already exists");
            return;
        }
        User admin = new User();
        admin.setFullName(fullName);
        admin.setIdNumber(idNumber);
        admin.setEmail(email);
        admin.setPhone(phone);
        admin.setPasswordHash(encoder.encode(password));
        admin.setRole("ADMIN");
        users.save(admin);
        log.info("Admin account created. Sign in with ID number {}", idNumber);
    }
}
