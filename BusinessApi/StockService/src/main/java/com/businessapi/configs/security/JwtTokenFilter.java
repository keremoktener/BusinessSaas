package com.businessapi.configs.security;


import com.businessapi.RabbitMQ.Model.EmailAndPasswordModel;
import com.businessapi.RabbitMQ.Model.UserRoleListModel;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.StockServiceException;
import com.businessapi.util.JwtTokenManager;
import com.businessapi.util.SessionManager;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter
{
    private final JwtTokenManager jwtTokenManager;
    private final RabbitTemplate rabbitTemplate;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException
    {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null)
        {
            String token = bearerToken.substring(7);

            Long authId = jwtTokenManager.getIdFromToken(token).orElseThrow(() -> new StockServiceException(ErrorType.INVALID_TOKEN));



            UserRoleListModel modal = (UserRoleListModel) rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keyRolesByAuthId", authId);
            //EmailAndPasswordModel modal2 = (EmailAndPasswordModel) rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keyEmailAndPasswordFromAuth", authId);

            List<GrantedAuthority> authorities = modal.getUserRoles().stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(authId, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }

        filterChain.doFilter(request, response);
    }
}
