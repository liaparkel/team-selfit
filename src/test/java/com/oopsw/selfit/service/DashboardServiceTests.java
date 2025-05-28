package com.oopsw.selfit.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.oopsw.selfit.dto.Exercise;
import com.oopsw.selfit.dto.Food;

@Transactional
@SpringBootTest
public class DashboardServiceTests {
	@Autowired
	DashboardService dashboardService;

	@Test
	void testGetFoodWeightYes() {
		// given
		String foodName = "우유";
		// when
		HashMap map = dashboardService.getFoodWeight(foodName);
		// then
		assertEquals("ml", map.get("unitPart"));
		assertEquals(200, map.get("numberPart"));
	}

	@Test
	void testGetFoodWeightNameNotExist() {
		// given
		String foodName = "볼펜";

		// when
		Map<String, Object> map = dashboardService.getFoodWeight(foodName);

		// than
		assertTrue(map.isEmpty());
	}

	@Test
	void testGetBmrYes() {
		// given
		int memberId = 2;
		// when
		int bmr = dashboardService.getBmr(memberId);
		// then
		assertEquals(1510, bmr);

	}

	@Test
	void testGetIntakeKcalYes() {
		// given
		Food f = Food.builder().memberId(1).intakeDate("2025-05-21").build();
		// when
		Food newf = dashboardService.getIntakeKcal(f);
		// then
		assertEquals(140, newf.getIntakeSum());
	}

	@Test
	void testGetExerciseKcalYes() {
		// given
		Exercise e = Exercise.builder().memberId(1).exerciseDate("2025-05-21").build();
		// when
		Exercise newe = dashboardService.getExerciseKcal(e);
		// then
		assertEquals(212, newe.getExerciseSum());
	}

	@Test
	void testGetYearIntakeKcalYes() {
		// given
		HashMap<String, Object> map = new HashMap<>();
		map.put("memberId", 1);
		map.put("intakeYear", "2025");
		// when
		List list = dashboardService.getYearIntakeKcal(map);
		//then
		System.out.println(list);

	}

	@Test
	void testGetIntakeDetailYes() {
		// given
		Food f = Food.builder().memberId(1).intakeDate("2025-05-01").build();
		// when
		List list = dashboardService.getIntakeDetail(f);
		// then
		assertEquals(1, list.size());
	}

	@Test
	void testGetAutoCompleteFoodYes() {
		// given
		String partWord = "유";
		// when
		List<String> result = dashboardService.getAutoCompleteFood(partWord);
		// then
		assertFalse(result.isEmpty());
	}

	@Test
	void testAddFoodListYes() {
		// given
		Food request = Food.builder().memberId(1).intakeDate("2025-06-05").build();
		// when
		boolean result = dashboardService.addFoodList(request);
		// then
		assertTrue(result);
	}

	@Test
	void testRemoveFoodListYes() {
		// given
		Food request = Food.builder().memberId(1).intakeDate("2025-06-02").build();
		// when
		boolean result = dashboardService.removeFoodList(request);
		// then
		assertTrue(result);
	}

	@Test
	void testRemoveFoodListWrongDate() {
		// given
		Food request = Food.builder().memberId(1).intakeDate("2025-06-31").build();
		// when
		boolean result = dashboardService.removeFoodList(request);
		// then
		assertFalse(result);
	}

	@Test
	void testAddFoodYes() {
		// given
		Food request = Food.builder().intake("200").intakeKcal("95").foodNoteId(2).foodId(8).build();
		// when
		boolean result = dashboardService.addFood(request);
		// then
		assertTrue(result);
	}

	@Test
	void testSetIntakeYes() {
		// given
		Food request = Food.builder().foodInfoId(2).intake("300").build();
		// when
		boolean result = dashboardService.setIntake(request);
		// then
		assertTrue(result);
	}

	@Test
	void testRemoveFoodYes() {
		// given
		int foodInfoId = 30;
		// when
		boolean result = dashboardService.removeFood(foodInfoId);
		// then
		assertTrue(result);
	}

	@Test
	void testGetAutoCompleteExerciseYes() {
		// given
		String partWord = "기";
		// when
		List<String> result = dashboardService.getAutoCompleteExercise(partWord);
		// then
		assertFalse(result.isEmpty());
	}

	@Test
	void testAddExerciseListYes() {
		// given
		Exercise request = Exercise.builder().memberId(1).exerciseDate("2025-05-21").build();
		// when
		boolean result = dashboardService.addExerciseList(request);
		// then
		assertTrue(result);
	}

	@Test
	void testRemoveExerciseListYes() {
		// given
		Exercise request = Exercise.builder().memberId(10).exerciseDate("2025-05-10").build();
		// when
		boolean result = dashboardService.removeExerciseList(request);
		// then
		assertTrue(result);
	}

	@Test
	void testAddExerciseYes() {
		// given
		Exercise request = Exercise.builder()
			.exerciseMin(40)
			.exerciseKcal("112")
			.exerciseId(6)
			.exerciseNoteId(1)
			.build();
		// when
		boolean result = dashboardService.addExercise(request);
		// then
		assertTrue(result);
	}

	@Test
	void testGetExerciseDetailYes() {
		// given
		Exercise request = Exercise.builder().memberId(1).exerciseDate("2025-05-21").build();
		// when
		List<Exercise> result = dashboardService.getExerciseDetail(request);
		// then
		System.out.println(result);
		assertFalse(result.isEmpty());
	}
}
