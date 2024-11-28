package com.businessapi.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/swagger-ui/**", "/dev/v1/notifications/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/topic/**").permitAll() // /topic endpoint'leri için izin ver
                        .requestMatchers("/notifications/**").permitAll() // /notifications/create için izin ver
                        .requestMatchers("/api/notify").permitAll() // API için izin ver



                        // local host
                        .anyRequest().authenticated())
                .csrf(csrf -> csrf.disable());

        return httpSecurity.build();
    }
}


