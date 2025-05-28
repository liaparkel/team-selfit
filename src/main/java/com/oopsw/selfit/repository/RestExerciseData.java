package com.oopsw.selfit.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;

import com.oopsw.selfit.dto.ExerciseApi;
import com.oopsw.selfit.dto.ExerciseApiWrapper;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Repository
@RequiredArgsConstructor
public class RestExerciseData {

	private final WebClient exerciseApiClient;
	private final ApiRepository apiRepository;

	@Value("${exercise.key}")
	private String apiKey;

	public Mono<Void> addExerciseApi(int pageNo, int numOfRows) {
		return exerciseApiClient.get()
			.uri(b -> b
				.queryParam("serviceKey", apiKey)
				.queryParam("page", pageNo)     // API 요구에 맞게 파라미터명 변경
				.queryParam("perPage", numOfRows)
				.queryParam("type", "json")
				.build()
			)
			.retrieve()
			.bodyToMono(ExerciseApiWrapper.class)
			.map(ExerciseApiWrapper::getData)
			.doOnNext(this::insertIfNotExists)
			.then();
	}

	private void insertIfNotExists(List<ExerciseApi> dtos) {
		if (dtos == null || dtos.isEmpty())
			return;
		apiRepository.addExerciseApi(dtos);
	}
}


