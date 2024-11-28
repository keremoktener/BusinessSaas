package com.businessapi.utilty;



import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class JwtTokenManager {
    @Value("${mail.secret.secret-key}")
    String secretKey;
    @Value("${mail.secret.issuer}")
    String issuer;
    private final Long EXDATE = 1000L * 60 * 60 ;

    public Optional<String> createToken (Long authId){
        String token;
        try{
            token = JWT.create().withAudience()
                    .withClaim("authId", authId)
                    .withIssuer(issuer)
                    .withIssuedAt(new Date())
                    .withExpiresAt(new Date(System.currentTimeMillis() + EXDATE))
                    .sign(Algorithm.HMAC512(secretKey));
            return Optional.of(token);
        }catch (Exception e){
            return Optional.empty();
        }
    }




    //  Şifre Sıfırlama İçin Email İle Token Oluşturma
    public Optional<String> createPasswordResetToken(String email){
        String token;
        try {
            token = JWT.create()
                    .withClaim("email", email) // Email'i token içinde saklıyoruz
                    .withIssuer(issuer)
                    .withIssuedAt(new Date()) // Şu anki tarih
                    .withExpiresAt(new Date(System.currentTimeMillis() + EXDATE)) // Token geçerlilik süresi
                    .sign(Algorithm.HMAC512(secretKey)); // HMAC512 algoritması ile imzalama
            return Optional.of(token);
        } catch (Exception e) {
            return Optional.empty();
        }
    }






}