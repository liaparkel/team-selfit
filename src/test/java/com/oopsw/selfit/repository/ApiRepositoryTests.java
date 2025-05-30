package com.oopsw.selfit.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest
class ApiRepositoryTests {

	@Autowired
	private RestFoodData restFoodData;
	@Autowired
	private RestExerciseData restExerciseData;


	@Test
	void addFoodApi() {
		// 실제 API 호출
		restFoodData.addFoodApi(1, 200).block();

	}

	@Test
	void addExerciseApi() {
		// 2) 첫 번째 API 호출 (+ 저장)
		restExerciseData.addExerciseApi(1, 376).block();

	}

}




