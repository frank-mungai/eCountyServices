
package com.frajaytech.eCountyService.Config;

import com.frajaytech.eCountyService.Security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain chain(
            HttpSecurity http,
            JwtAuthFilter jwtFilter
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(Customizer.withDefaults())

                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // Allow CORS preflight requests.
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public health endpoints.
                        .requestMatchers("/", "/health", "/error").permitAll()

                        // Public technician invitation activation.
                        .requestMatchers("/api/technicians/activate").permitAll()

                        // Public registration and login endpoints.
                        .requestMatchers("/api/auth/**").permitAll()

                        // Allow access to uploaded images.
                        .requestMatchers("/uploads/**").permitAll()

                        // Administrator-only endpoints.
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Technician-only endpoints.
                        .requestMatchers("/api/technician/**").hasRole("TECHNICIAN")

                        // All other endpoints require authentication.
                        .anyRequest().authenticated()
                )

                // Return HTTP 401 for unauthenticated requests.
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(
                                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)
                        )
                )

                // Process JWT authentication before username/password authentication.
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors.allowed-origin}") String configuredOrigins
    ) {

        // Support comma-separated frontend origins.
        List<String> origins = Arrays.stream(configuredOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList();

        CorsConfiguration cfg = new CorsConfiguration();

        cfg.setAllowedOrigins(origins);

        cfg.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        cfg.setAllowedHeaders(List.of("*"));

        // This application uses JWT bearer tokens rather than cookie sessions.
        cfg.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource src =
                new UrlBasedCorsConfigurationSource();

        src.registerCorsConfiguration("/**", cfg);

        return src;
    }
}
