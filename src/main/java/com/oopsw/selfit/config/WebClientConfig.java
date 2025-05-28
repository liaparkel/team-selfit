package com.oopsw.selfit.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
	@Value("${food.base-url}")
	private String foodBaseUrl;

	@Value("${exercise.base-url}")
	private String exerciseBaseUrl;

	@Bean("foodApiClient")
	public WebClient openApiWebClient(WebClient.Builder builder) {
		return builder
			.baseUrl(foodBaseUrl)
			.defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
			.build();
	}

	@Bean("exerciseApiClient")
	public WebClient otherApiClient(WebClient.Builder builder) {
		return builder
			.baseUrl(exerciseBaseUrl)
			.defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
			.build();
	}
}
