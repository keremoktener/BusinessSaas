package com.businessapi.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.businessapi.exception.CalendarAndPlannigServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Optional;

import static com.businessapi.exception.ErrorType.*;

@Component
public class JwtTokenManager {
    @Value("${CPM_management.secret.secret-key}")
    String secretKey;
    @Value("${CPM_management.secret.issuer}")
    String issuer;
    Long expireTime = 1000L * 60 * 120; // 120 dakika


    public Optional<String> createToken(Long authId){
        String token="";

        //claim içersindeki değerler herkes tarafından görülebilir.

        try {
            token = JWT.create()
                    .withAudience()
                    .withClaim("authId",authId)
                    .withIssuer(issuer)
                    .withIssuedAt(new Date())
                    .sign(Algorithm.HMAC512(secretKey));
            return Optional.of(token);
        } catch (IllegalArgumentException e) {
            throw new CalendarAndPlannigServiceException(TOKEN_CREATION_FAILED);
        } catch (JWTCreationException e) {
            throw new CalendarAndPlannigServiceException(TOKEN_CREATION_FAILED);
        }
    }

    public Optional<Long> getAuthIdFromToken(String token){
        DecodedJWT decodedJWT = null;
        try {
            Algorithm algorithm = Algorithm.HMAC512(secretKey);
            JWTVerifier verifier = JWT.require(algorithm).withIssuer(issuer).build();
            decodedJWT = verifier.verify(token);

            if(decodedJWT==null){
                return Optional.empty();
            } else {
                return Optional.of(decodedJWT.getClaim("authId").asLong());
            }

        } catch (IllegalArgumentException e) {
            throw new CalendarAndPlannigServiceException(TOKEN_FORMAT_NOT_ACCEPTABLE);
        } catch (JWTVerificationException e) {
            throw new CalendarAndPlannigServiceException(TOKEN_VERIFY_FAILED);
        }
    }













}
