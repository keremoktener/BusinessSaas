package com.businessapi.dto.request;

import java.util.List;

public record OpportunitySaveDTO(String name, String description, Double value, String stage, Double probability) {
}
