package com.oopsw.selfit.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;

import com.oopsw.selfit.dto.Checklist;
import com.oopsw.selfit.dto.Exercise;
import com.oopsw.selfit.dto.Food;
import com.oopsw.selfit.dto.Member;

@Transactional
@SpringBootTest
public class DashboardRepositoryTests {
	@Autowired
	private DashboardRepository dashboardRepository;

	@Test
	void testGetFoodWeightYes() {
		// given
		String foodName = "사과";

		// when
		String foodWeight = dashboardRepository.getFoodWeight(foodName);

		// than
		assertEquals("200g", foodWeight);
	}

	@Test
	void testGetFoodWeightNameNotExist() {
		// given
		String foodName = "볼펜";

		// when
		String foodWeight = dashboardRepository.getFoodWeight(foodName);

		// than
		assertNull(foodWeight);
	}

	@Test
	void testGetBmrYes() {
		// given
		int memberId = 1;

		// when
		Member member = dashboardRepository.getBmr(memberId);

		// than
		assertEquals("남자", member.getGender());
		assertEquals("2000-05-21", member.getBirthday());
		assertEquals(175f, member.getHeight());
		assertEquals(70f, member.getWeight());
	}

	@Test
	void testGetBmrNotExistMemberId() {
		// given
		int memberId = 9999;

		// when
		Member member = dashboardRepository.getBmr(memberId);

		// than
		assertNull(member);
	}

	@Test
	void testGetIntakeKcalYes() {
		// given
		Food request = Food.builder().memberId(1).intakeDate("2025-05-21").build();

		// when
		Food result = dashboardRepository.getIntakeKcal(request);

		// than
		assertEquals(140, result.getIntakeSum());
	}

	@Test
	void testGetIntakeKcalNotExistMemberId() {
		// given
		Food request = Food.builder().memberId(9999).intakeDate("2025-05-21").build();

		// when
		Food result = dashboardRepository.getIntakeKcal(request);

		// than
		assertNull(result);
	}

	@Test
	void testGetExerciseKcalYes() {
		// given
		Exercise request = Exercise.builder().memberId(1).exerciseDate("2025-05-21").build();

		// when
		Exercise result = dashboardRepository.getExerciseKcal(request);

		// than
		assertEquals(212, result.getExerciseSum());
	}

	@Test
	void testGetExerciseKcalNotExistMemberId() {
		// given
		Exercise request = Exercise.builder().memberId(9999).exerciseDate("2025-05-21").build();

		// when
		Exercise result = dashboardRepository.getExerciseKcal(request);

		// than
		assertNull(result);
	}

	@Test
	void testGetYearIntakeKcalYes() {
		// given
		HashMap<String, Object> map = new HashMap<>();
		map.put("memberId", 1);
		map.put("intakeYear", "2025");

		// when
		List<Food> result = dashboardRepository.getYearIntakeKcal(map);

		// then
		assertFalse(result.isEmpty());
	}

	@Test
	void testGetYearIntakeKcalNotExistMemberId() {
		// given
		HashMap<String, Object> map = new HashMap<>();
		map.put("memberId", 9999);
		map.put("intakeYear", "2025");

		// when
		List<Food> result = dashboardRepository.getYearIntakeKcal(map);

		// then
		assertTrue(result.isEmpty());
	}

	@Test
	void testGetYearExerciseKcalYes() {
		// given
		HashMap<String, Object> map = new HashMap<>();
		map.put("memberId", 1);
		map.put("exerciseYear", "2025");

		// when
		List<Exercise> result = dashboardRepository.getYearExerciseKcal(map);

		// then
		assertFalse(result.isEmpty());
	}

	@Test
	void testGetYearExerciseKcalNotExistMemberId() {
		// given
		HashMap<String, Object> map = new HashMap<>();
		map.put("memberId", 9999);
		map.put("exerciseYear", "2025");

		// when
		List<Exercise> result = dashboardRepository.getYearExerciseKcal(map);

		// then
		assertTrue(result.isEmpty());
	}

	@Test
	void testGetIntakeDetailYes() {
		// given
		Food request = Food.builder().memberId(1).intakeDate("2025-05-21").build();

		// when
		List<Food> result = dashboardRepository.getIntakeDetail(request);

		// then
		assertFalse(result.isEmpty());
	}

	@Test
	void testGetIntakeDetailNotExistMemberId() {
		// given
		Food request = Food.builder().memberId(9999).intakeDate("2025-05-21").build();

		// when
		List<Food> result = dashboardRepository.getIntakeDetail(request);

		// then
		assertTrue(result.isEmpty());
	}

	@Test
	void testGetAutoCompleteFoodYes() {
		// given
		String partWord = "유";

		// when
		List<String> result = dashboardRepository.getAutoCompleteFood(partWord);

		// then
		assertFalse(result.isEmpty());
	}

	@Test
	void testGetAutoCompleteFoodInvalidKeyword() {
		// given
		String partWord = "selfit";

		// when
		List<String> result = dashboardRepository.getAutoCompleteFood(partWord);

		// then
		assertTrue(result.isEmpty());
	}

	@Test
	void testAddFoodListYes() {
		// given
		Food request = Food.builder().memberId(1).intakeDate("2025-06-05").build();

		// when
		int result = dashboardRepository.addFoodList(request);

		// then
		assertEquals(1, result);
	}

	@Test
	void testAddFoodListNotExistMemberId() {
		// given
		Food request = Food.builder().memberId(9999).intakeDate("2025-06-05").build();

		// when & then
		assertThrows(DataIntegrityViolationException.class, () -> {
			dashboardRepository.addFoodList(request);
		});    //SQLIntegrityConstraintViolationException을 Spring이 자동 변환
	}

	@Test
	void testRemoveFoodListYes() {
		// given
		Food request = Food.builder().memberId(1).intakeDate("2025-06-02").build();

		// when
		int result = dashboardRepository.removeFoodList(request);

		// then
		assertEquals(1, result);
	}

	@Test
	void testRemoveFoodListNotExistMemberId() {
		// given
		Food request = Food.builder().memberId(9999).intakeDate("2025-06-02").build();

		// when
		int result = dashboardRepository.removeFoodList(request);

		// then
		assertEquals(0, result);
	}

	@Test
	void testAddFoodYes() {
		assertEquals(1,
			dashboardRepository.addFood(Food.builder().intake("200").intakeKcal("95").foodNoteId(2).foodId(8).build()));
	}

	@Test
	void testSetIntakeYes() {
		assertEquals(1, dashboardRepository.setIntake(Food.builder().foodInfoId(2).intake("300").build()));
	}

	@Test
	void testRemoveFoodYes() {
		assertEquals(1, dashboardRepository.removeFood(30));
	}

	@Test
	void testGetAutoCompleteExerciseYes() {
		System.out.println(dashboardRepository.getAutoCompleteExercise("기"));
	}

	@Test
	void testAddExerciseListYes() {
		assertEquals(1,
			dashboardRepository.addExerciseList(Exercise.builder().memberId(1).exerciseDate("2025-06-05").build()));
	}

	@Test
	void testremoveExerciseListYes() {
		assertEquals(1,
			dashboardRepository.removeExerciseList(Exercise.builder().memberId(10).exerciseDate("2025-05-10").build()));
	}

	@Test
	void testAddExerciseYes() {
		assertEquals(1, dashboardRepository.addExercise(
			Exercise.builder().exerciseMin(40).exerciseKcal("112").exerciseId(6).exerciseNoteId(1).build()));
	}

	// @Test
	// void testGetExerciseDetailYes() {
	// 	Exercise e = dashboardRepository.getExerciseDetail(
	// 		Exercise.builder().memberId(1).exerciseDate("2025-05-01").exerciseInfoId(1).build());
	// 	System.out.println(e);
	// }

	@Test
	void testSetExerciseMinYes() {
		assertEquals(1,
			dashboardRepository.setExerciseMin(Exercise.builder().exerciseInfoId(2).exerciseMin(300).build()));
	}

	@Test
	void testRemoveExerciseYes() {
		assertEquals(1, dashboardRepository.removeExercise(1));
	}

	@Test
	void testGetCheckListYes() {
		System.out.println(
			dashboardRepository.getCheckList(Checklist.builder().memberId(1).checkDate("2025-05-01").build()));
	}

	@Test
	void testSetCheckContent() {
		assertEquals(1, dashboardRepository.setCheckContent(Checklist.builder().checkId(2).checkContent("수정").build()));
	}

	@Test
	void testSetIsCheck() {
		assertEquals(1, dashboardRepository.setIsCheck(Checklist.builder().isCheck(1).checkId(2).build()));
	}

	@Test
	void testRemoveCheckItem() {
		assertEquals(1, dashboardRepository.removeCheckItem(2));
	}

	@Test
	void testAddChecklist() {
		assertEquals(1,
			dashboardRepository.addChecklist(Checklist.builder().memberId(1).checkDate("2025-06-07").build()));
	}

	@Test
	void testAddCheckItem() {
		assertEquals(1, dashboardRepository.addCheckItem(
			Checklist.builder().checkContent("물 마시기").isCheck(0).checklistId(1).build()));
	}

	@Test
	void testGetGoalYes() {
		System.out.println(dashboardRepository.getGoal(2));
	}

}
