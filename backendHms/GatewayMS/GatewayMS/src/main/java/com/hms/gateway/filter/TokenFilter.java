package com.hms.gateway.filter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Component
public class TokenFilter extends AbstractGatewayFilterFactory<TokenFilter.Config> {
    @Value("${JWT_KEY:${jwt.key}}")
    private String secret;

    public TokenFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getPath().toString();
            if (path.equals("/user/login") || path.equals("/user/register")) {

                return chain.filter(exchange.mutate().request(r -> r.header("X-Secret-Key", "SECRET")).build());
            }
            HttpHeaders header = exchange.getRequest().getHeaders();
            String authHeader = header.getFirst(HttpHeaders.AUTHORIZATION);
            String token = null;

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
            if (token == null) {
                token = exchange.getRequest().getQueryParams().getFirst("token");
            }
            if (token == null || token.isBlank()) {
                throw new RuntimeException("Authorization token is missing");
            }
            String profileId;
            String roles;
            try {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(secret)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();
                profileId = claims.get("profileId").toString();
                roles = claims.get("roles").toString();
            } catch (Exception e) {
                throw new RuntimeException("INVALID_TOKEN");
            }
            return chain.filter(
                    exchange.mutate()
                            .request(r -> r.headers(httpHeaders -> {
                                httpHeaders.remove("X-Secret-Key");
                                httpHeaders.remove("X-Profile-Id");
                                httpHeaders.remove("X-User-Role");
                                httpHeaders.remove("Origin");
                                httpHeaders.remove("Access-Control-Request-Method");
                                httpHeaders.remove("Access-Control-Request-Headers");
                            }).header("X-Secret-Key", "SECRET").header("X-Profile-Id", profileId).header("X-User-Role",
                                    roles))
                            .build());
        };

    }

    public static class Config {

    }

}
