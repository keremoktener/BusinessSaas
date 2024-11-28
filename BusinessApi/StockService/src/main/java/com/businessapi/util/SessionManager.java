package com.businessapi.util;

import com.businessapi.exception.ErrorType;
import com.businessapi.exception.StockServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SessionManager
{

    public static Long getMemberIdFromAuthenticatedMember()
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null)
        {
            throw new StockServiceException(ErrorType.UNAUTHORIZED);
        }

        return Long.parseLong(authentication.getName());
    }

}
