package com.businessapi.security;

import com.businessapi.RabbitMQ.Model.EmailAndPasswordModel;
import com.businessapi.RabbitMQ.Model.UserRoleListModel;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.core.GrantedAuthority;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JwtUserDetails implements UserDetailsService {

    private final RabbitTemplate rabbitTemplate;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }

    public UserDetails loadByTokenId(Long authId){
        List<GrantedAuthority> grantedAuthorities = new ArrayList<>();

        List<String> rolesRabbit = getRolesRabbit(authId);

        rolesRabbit.forEach(roles->grantedAuthorities.add(new SimpleGrantedAuthority(roles)));

        EmailAndPasswordModel emailAndPassword = getEmailAndPassword(authId);

        return User.builder().username(emailAndPassword.getEmail()).password("").authorities(grantedAuthorities).build(); //email ve password auth'dan çekilecek
    }

    public List<String> getRolesRabbit(Long authId){
        UserRoleListModel userRoleListModel = (UserRoleListModel) rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keyRolesByAuthId", authId);
        return userRoleListModel.getUserRoles();
    }

    public EmailAndPasswordModel getEmailAndPassword(Long authId){
        return  (EmailAndPasswordModel) rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keyEmailAndPasswordFromAuth", authId);
    }

}
