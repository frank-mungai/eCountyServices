package com.frajaytech.eCountyService.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class HttpEmailService {

    private final RestClient client;
    private final String from;
    private final boolean configured;

    public HttpEmailService(@Value("${resend.api-key:}") String apiKey,
                            @Value("${mail.from:onboarding@resend.dev}") String from) {

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(10000);

        this.client = RestClient.builder()
                .requestFactory(factory)
                .baseUrl("https://api.resend.com")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .build();
        this.from = from;
        this.configured = StringUtils.hasText(apiKey);
    }

    public boolean isConfigured() {
        return configured;
    }

    /** Throws RestClientException on network errors or non-2xx responses. */
    public void sendText(String to, String subject, String text) {
        post(Map.of(
                "from", from,
                "to", List.of(to),
                "subject", subject,
                "text", text));
    }

    /** Throws RestClientException on network errors or non-2xx responses. */
    public void sendHtml(String to, String subject, String html) {
        post(Map.of(
                "from", from,
                "to", List.of(to),
                "subject", subject,
                "html", html));
    }

    private void post(Map<String, Object> body) {
        client.post()
                .uri("/emails")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }
}