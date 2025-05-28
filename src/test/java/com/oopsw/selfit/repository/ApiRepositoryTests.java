package com.oopsw.selfit.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;


import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ApiRepositoryTests {

	@Autowired
	private RestFoodData restFoodData;
	@Autowired
	private RestExerciseData restExerciseData;
	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Test
	void addFoodApi() {
		jdbcTemplate.update("DELETE FROM FOOD WHERE FOOD_ID > 10");

		// 실제 API 호출 (pageNo=1, numOfRows=5)
		restFoodData.addFoodApi(1, 100).block();

		// --- 3) DB에 새로운 행이 들어왔는지 확인 ---
		Integer total = jdbcTemplate.queryForObject(
			"SELECT COUNT(*) FROM FOOD", Integer.class);
		// 초기 샘플 10건 이후에 최소 1건이 더 추가됐어야 함
		assertTrue(total > 10, "총 행 수가 10보다 커야 합니다");

		// 옵션: 방금 들어온 데이터 중 하나를 직접 조회해 보기
		String code = jdbcTemplate.queryForObject(
			"SELECT FOOD_NAME FROM FOOD ORDER BY FOOD_ID DESC LIMIT 1",
			String.class);
		System.out.println("가장 마지막에 삽입된 식품명: " + code);
	}

	@Test
	void addExerciseApi() {
		jdbcTemplate.update("DELETE FROM EXERCISE WHERE EXERCISE_ID > 10");

		// 실제 API 호출 (pageNo=1, numOfRows=5)
		restExerciseData.addExerciseApi(1, 100).block();

		// --- 3) DB에 새로운 행이 들어왔는지 확인 ---
		Integer total = jdbcTemplate.queryForObject(
			"SELECT COUNT(*) FROM EXERCISE", Integer.class);
		// 초기 샘플 10건 이후에 최소 1건이 더 추가됐어야 함
		assertTrue(total > 10, "총 행 수가 10보다 커야 합니다");

		// 옵션: 방금 들어온 데이터 중 하나를 직접 조회해 보기
		String code = jdbcTemplate.queryForObject(
			"SELECT EXERCISE_NAME FROM EXERCISE ORDER BY EXERCISE_NAME DESC LIMIT 1",
			String.class);
		System.out.println("가장 마지막에 삽입된 운동명: " + code);
	}

}




