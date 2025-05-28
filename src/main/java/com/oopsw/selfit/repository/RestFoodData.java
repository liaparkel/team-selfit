package com.oopsw.selfit.repository;

import com.oopsw.selfit.dto.FoodApi;
import com.oopsw.selfit.dto.FoodApiWrapper;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;


import reactor.core.publisher.Mono;

import java.util.List;

@Repository
public class RestFoodData {

	private final WebClient webClient;
	private final String apiKey;

	public RestFoodData(
		@Qualifier("foodApiClient") WebClient webClient,
		@Value("${food.key}") String apiKey
	) {
		this.webClient = webClient;
		this.apiKey    = apiKey;
	}

	/**
	 * 외부 API 호출 후, FoodApi 리스트만 꺼내서 반환합니다.
	 */
	public Mono<List<FoodApi>> fetchFoods(int pageNo, int numOfRows) {
		return webClient.get()
			.uri(b -> b
				.queryParam("serviceKey", apiKey)
				.queryParam("pageNo",     pageNo)
				.queryParam("numOfRows",  numOfRows)
				.queryParam("type",       "json")
				.build()
			)
			.retrieve()
			.bodyToMono(FoodApiWrapper.class)           // ① Wrapper DTO로 바로 바인딩
			.map(wrapper -> wrapper                     // ② response → body → items 꺼내기
				.getResponse()
				.getBody()
				.getItems()
			);
	}

	/**
	 * 식품명으로 단일 식품을 검색해서 가져옵니다.
	 */
	public Mono<FoodApi> fetchFoodByName(String foodName) {
		return webClient.get()
			.uri(uriBuilder -> uriBuilder
				.queryParam("serviceKey", apiKey)
				.queryParam("pageNo", 1)        // 1페이지만 조회
				.queryParam("numOfRows", 1)        // 1건만 조회
				.queryParam("type", "json")
				.queryParam("foodNm", foodName) // 검색할 식품명
				.build()
			)
			.retrieve()
			.bodyToMono(FoodApiWrapper.class)
			.flatMap(wrapper -> {
				var items = wrapper.getResponse().getBody().getItems();
				return items.isEmpty()
					? Mono.empty()
					: Mono.just(items.get(0));
			});
	}
}

