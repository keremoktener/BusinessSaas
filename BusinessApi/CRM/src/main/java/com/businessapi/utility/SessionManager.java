package com.businessapi.utility;

import com.businessapi.exception.CustomerServiceException;
import com.businessapi.exception.ErrorType;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SessionManager
{
    public static Long memberId;
    public static Long getMemberIdFromAuthenticatedMember()
    {
        // Gets authId from authenticated member
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        memberId = Long.parseLong(authentication.getName());
        return Long.parseLong(authentication.getName());
    }

    public static void authorizationCheck(Long entityMemberId)
    {
        if (!entityMemberId.equals(memberId))
        {
            throw new CustomerServiceException(ErrorType.INVALID_TOKEN);
        }
    }
}
