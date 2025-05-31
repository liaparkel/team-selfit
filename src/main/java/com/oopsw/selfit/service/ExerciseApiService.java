package com.oopsw.selfit.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.oopsw.selfit.dto.ExerciseApi;
import com.oopsw.selfit.repository.ExerciseApiRepository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class ExerciseApiService {
	private final ExerciseApiRepository exerciseApiRepository;

	public Mono<List<ExerciseApi>> getExercises(int pageNo, int numOfRows) {
		if (pageNo < 1 || numOfRows < 1) {
			return Mono.error(new IllegalArgumentException("pageNo와 numOfRows는 1 이상이어야 합니다."));
		}
		return exerciseApiRepository.fetchExerciseData(pageNo, numOfRows);
	}

	public Mono<List<ExerciseApi>> getExercisesByName(String exerciseName, int pageNo, int numOfRows) {
		// 1) 입력값 검증
		if (exerciseName == null || exerciseName.isBlank()) {
			return Mono.error(new IllegalArgumentException("exerciseName을 반드시 입력해야 합니다."));
		}
		if (pageNo < 1 || numOfRows < 1) {
			return Mono.error(new IllegalArgumentException("pageNo와 numOfRows는 1 이상이어야 합니다."));
		}


		// 2) repository 호출
		return exerciseApiRepository.fetchExerciseDataByName(exerciseName, pageNo, numOfRows);
	}
}

