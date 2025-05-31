package com.oopsw.selfit.service;

import java.util.List;


import org.springframework.stereotype.Service;

import com.oopsw.selfit.dto.FoodApi;
import com.oopsw.selfit.repository.FoodApiRepository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class FoodApiService {
	private final FoodApiRepository foodApiRepository;

	public Mono<List<FoodApi>> getFoods(int pageNo, int numOfRows) {
		// 1) 파라미터 유효성 검사
		if (pageNo < 1 || numOfRows < 1) {
			return Mono.error(new IllegalArgumentException("pageNo, numOfRows는 1 이상이어야 합니다."));
		}

		// 2) 외부 API 호출
		return foodApiRepository.fetchFoodData(pageNo, numOfRows);
	}

}
