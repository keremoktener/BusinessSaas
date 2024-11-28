package com.businessapi.util;

import com.businessapi.exception.ErrorType;
import com.businessapi.exception.FinanceServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SessionManager
{

    public static Long getMemberIdFromAuthenticatedMember()
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null)
        {
            throw new FinanceServiceException(ErrorType.UNAUTHORIZED);
        }
        return Long.parseLong(authentication.getName());
    }

    public static String getTokenFromAuthenticatedMember() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getCredentials() == null)
        {
            throw new FinanceServiceException(ErrorType.UNAUTHORIZED);
        }
        return authentication.getCredentials().toString();
    }

}
