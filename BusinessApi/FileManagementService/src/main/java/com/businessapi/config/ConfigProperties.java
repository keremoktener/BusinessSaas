package com.businessapi.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties("minio")
public class ConfigProperties {
    private String url;
    private String accessKey;
    private String secretKey;
    private String bucket;

}
