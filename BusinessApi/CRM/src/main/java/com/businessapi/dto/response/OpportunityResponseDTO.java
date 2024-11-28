package com.businessapi.dto.response;


import lombok.Builder;

@Builder
public record OpportunityResponseDTO(Long id, String firstName, String lastName){
}

