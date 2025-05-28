package com.oopsw.selfit.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;

import com.oopsw.selfit.dto.ExerciseApi;
import com.oopsw.selfit.dto.ExerciseApiWrapper;

import reactor.core.publisher.Mono;

@Repository
public class RestExerciseData {

	private final WebClient webClient;
	private final String apiKey;

	public RestExerciseData(
		@Qualifier("exerciseApiClient") WebClient webClient,
		@Value("${exercise.key}") String apiKey
	) {
		this.webClient = webClient;
		this.apiKey    = apiKey;
	}

	/**
	 * page, perPage 키와 JSON의 'data' 필드를 사용하는 예시입니다.
	 */
	public Mono<List<ExerciseApi>> fetchExercises(int page, int perPage) {
		return webClient.get()
			.uri(uriBuilder -> uriBuilder
				.queryParam("serviceKey", apiKey)
				.queryParam("page",       page)
				.queryParam("perPage",    perPage)
				.build()
			)
			.retrieve()
			.bodyToMono(ExerciseApiWrapper.class)
			.map(ExerciseApiWrapper::getData);   // wrapper.data 리스트를 꺼내 반환
	}
}

