package com.businessapi.config.security;

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

                        .requestMatchers("/swagger-ui/**","/dev/v1/auth/**","/v3/api-docs/**").permitAll()

                        //local host
                        .anyRequest().authenticated())
                .csrf(csrf -> csrf.disable());

        return httpSecurity.build();

    }
}


