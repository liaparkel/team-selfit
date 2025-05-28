package com.oopsw.selfit.repository;

import com.oopsw.selfit.dto.ExerciseApi;
import com.oopsw.selfit.dto.FoodApi;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import reactor.core.publisher.Mono;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ApiRepositoryTests {

	@Autowired
	private RestFoodData restFoodData;  // 혹은 RestData
	@Autowired
	private RestExerciseData restExerciseData;

	@Test
	void foodApiTest() {
		// 1) 외부 API에서 5개만 가져오도록 요청
		Mono<List<FoodApi>> mono = restFoodData.fetchFoods(1,100);
		List<FoodApi> list = mono.block();   // 동기 호출

		// 2) 호출 결과만 검증
		assertNotNull(list, "응답 리스트는 null 이 아니어야 합니다");
		assertFalse(list.isEmpty(), "최소 하나 이상의 항목이 있어야 합니다");

		// 3) 콘솔 출력으로 필드 바인딩 확인
		System.out.println("▶ API Fetch 결과 ▶");
		list.forEach(item -> System.out.printf(
			"foodNm=%s, enerc=%s, foodSize=%s%n",
			item.getFoodNm(), item.getEnerc(), item.getFoodSize()
		));
	}

	@Test
	void exerciseApiTest() {
		// 1) 외부 API에서 첫 페이지(perPage=100) 가져오기
		Mono<List<ExerciseApi>> mono = restExerciseData.fetchExercises(1, 100);
		List<ExerciseApi> list = mono.block();   // 동기 호출

		// 2) 호출 결과만 검증
		assertNotNull(list, "응답 리스트는 null 이 아니어야 합니다");
		assertFalse(list.isEmpty(), "최소 하나 이상의 항목이 있어야 합니다");

		// 3) 콘솔 출력으로 필드 바인딩 확인
		System.out.println("▶ Exercise API Fetch 결과 ▶");
		list.forEach(item -> System.out.printf(
			"exerciseName=%s, Met=%s%n",
			item.getExerciseName(), item.getMET()
		));

	}
	@Test
	void fetchFoodByName() {
		String foodName = "FG베이컨";

		Mono<FoodApi> mono = restFoodData.fetchFoodByName(foodName);
		FoodApi result = mono.block();

		assertNotNull(result, "반환된 FoodApi 객체는 null이 아니어야 합니다");
		assertEquals(foodName, result.getFoodNm(), "조회한 식품명이 일치해야 합니다");
		assertNotNull(result.getEnerc(), "enerc 칼로리 값이 채워져 있어야 합니다");
		System.out.println("▶ fetchFoodByName 결과 ▶ " + result);
	}


}
