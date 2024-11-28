package com.businessapi.security;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration

@SecurityScheme(

        name = "bearerUser",

        type = SecuritySchemeType.HTTP,

        bearerFormat = "JWT",

        scheme = "bearer"

)

public class SwaggerSecurityConfig {
}
