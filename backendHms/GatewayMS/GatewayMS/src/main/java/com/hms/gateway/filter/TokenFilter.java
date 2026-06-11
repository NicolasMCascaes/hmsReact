package com.hms.gateway.filter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
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
            Claims claims;
            try {
                claims = Jwts.parserBuilder()
                        .setSigningKey(secret)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();
            } catch (JwtException | IllegalArgumentException e) {
                throw new RuntimeException("INVALID_TOKEN", e);
            }

            Object rolesClaim = claims.get("roles");
            if (rolesClaim == null) {
                throw new RuntimeException("TOKEN_ROLE_MISSING");
            }

            String roles = rolesClaim.toString();
            Object profileIdClaim = claims.get("profileId");
            String profileId = profileIdClaim != null ? profileIdClaim.toString() : null;
            if ((profileId == null || profileId.isBlank()) && !"ADMIN".equals(roles)) {
                throw new RuntimeException("TOKEN_PROFILE_ID_MISSING");
            }
            return chain.filter(
                    exchange.mutate()
                            .request(r -> {
                                r.headers(httpHeaders -> {
                                    httpHeaders.remove("X-Secret-Key");
                                    httpHeaders.remove("X-Profile-Id");
                                    httpHeaders.remove("X-User-Role");
                                    httpHeaders.remove("Origin");
                                    httpHeaders.remove("Access-Control-Request-Method");
                                    httpHeaders.remove("Access-Control-Request-Headers");
                                });
                                r.header("X-Secret-Key", "SECRET");
                                r.header("X-User-Role", roles);
                                if (profileId != null && !profileId.isBlank()) {
                                    r.header("X-Profile-Id", profileId);
                                }
                            })
                            .build());
        };

    }

    public static class Config {

    }

}
