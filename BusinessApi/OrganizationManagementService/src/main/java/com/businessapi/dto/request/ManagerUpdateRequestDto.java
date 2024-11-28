package com.businessapi.dto.request;

public record ManagerUpdateRequestDto(Long id,
                                      Long departmentId,
                                      String identityNo,
                                      String phoneNo,
                                      String name,
                                      String surname
                                    )
{
}
