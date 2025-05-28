package com.oopsw.selfit.repository;

import com.oopsw.selfit.dto.FoodApi;
import com.oopsw.selfit.dto.FoodApiWrapper;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class RestFoodData {

	private final WebClient foodApiClient;
	private final ApiRepository apiRepository;

	@Value("${food.key}")
	private String apiKey;

	public Mono<Void> addFoodApi(int pageNo, int numOfRows) {
		return foodApiClient.get()
			.uri(uriBuilder -> uriBuilder
				.queryParam("serviceKey", apiKey)
				.queryParam("pageNo", pageNo)
				.queryParam("numOfRows", numOfRows)
				.queryParam("type", "json")
				.build()
			)
			.retrieve()
			.bodyToMono(FoodApiWrapper.class)
			.map(wrapper -> wrapper.getResponse().getBody().getItems())
			.doOnNext(this::insertIfNotExists)
			.then();
	}

	private void insertIfNotExists(List<FoodApi> dtos) {
		if (dtos == null || dtos.isEmpty()) {
			return;
		}
		// API 에서 받은 DTO 리스트를 곧바로 MyBatis 매퍼로 전달
		apiRepository.addFoodApi(dtos);
	}
}