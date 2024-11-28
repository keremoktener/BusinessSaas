package com.businessapi.config;


import io.minio.MinioClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Configuration {
    @Bean
    public MinioClient getMinioClient(ConfigProperties properties) {
        return MinioClient.builder()
                .credentials(properties.getAccessKey(),properties.getSecretKey())
                .endpoint(properties.getUrl())
               .build();
    }
}
