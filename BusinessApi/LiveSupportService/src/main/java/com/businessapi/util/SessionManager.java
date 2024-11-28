package com.businessapi.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SessionManager
{
    public static Long memberId;
    public static Long getIdFromAuthenticatedUser()
    {
        // Gets authId from authenticated member
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        memberId = Long.parseLong(authentication.getName());
        return Long.parseLong(authentication.getName());
    }
}
