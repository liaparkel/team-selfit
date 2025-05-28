package com.oopsw.selfit.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;

import com.oopsw.selfit.dto.Checklist;
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

		// when & then
		assertThrows(NullPointerException.class, () -> {
			Map<String, Object> map = dashboardService.getFoodWeight(foodName);
		});
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
		// then
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
	// 윤호님 코드 예정
	@Test
	void testSetExerciseMinYes() {
		// given
		Exercise request = Exercise.builder().exerciseInfoId(2).exerciseMin(300).build();

		// when
		boolean result = dashboardService.setExerciseMin(request);

		// then
		assertTrue(result);
	}

	@Test
	void testSetExerciseMinNotExistExerciseInfoId() {
		// given
		Exercise request = Exercise.builder().exerciseInfoId(99999).exerciseMin(300).build();

		// when
		boolean result = dashboardService.setExerciseMin(request);

		// then
		assertFalse(result);
	}

	@Test
	void testSetExerciseMinZero() {
		// given
		Exercise request = Exercise.builder().exerciseInfoId(2).exerciseMin(0).build();

		// when & then
		assertThrows(IllegalArgumentException.class, () -> {
			dashboardService.setExerciseMin(request);
		});
	}

	@Test
	void testRemoveExerciseYes() {
		// given
		int exerciseInfoId = 1;

		// when
		boolean result = dashboardService.removeExercise(exerciseInfoId);

		// then
		assertTrue(result);
	}

	@Test
	void testRemoveExerciseNotExistExerciseInfoId() {
		// given
		int exerciseInfoId = 99999;

		// when
		boolean result = dashboardService.removeExercise(exerciseInfoId);

		// then
		assertFalse(result);
	}

	@Test
	void testGetCheckListYes() {
		// given
		Checklist request = Checklist.builder().memberId(1).checkDate("2025-05-01").build();

		// when
		List<Checklist> result = dashboardService.getCheckList(request);

		// then
		assertFalse(result.isEmpty());
	}

	@Test
	void testGetCheckListNotExistMemberId() {
		// given
		Checklist request = Checklist.builder().memberId(99999).checkDate("2025-05-01").build();

		// when
		List<Checklist> result = dashboardService.getCheckList(request);

		// then
		assertTrue(result.isEmpty());
	}

	@Test
	void testGetCheckListNotExistCheckDate() {
		// given
		Checklist request = Checklist.builder().memberId(99999).checkDate("9999-05-01").build();

		// when
		List<Checklist> result = dashboardService.getCheckList(request);

		// then
		assertTrue(result.isEmpty());
	}

	@Test
	void testSetCheckContentYes() {
		// given
		Checklist request = Checklist.builder().checkId(2).checkContent("수정").build();

		// when
		boolean result = dashboardService.setCheckContent(request);

		// then
		assertTrue(result);
	}

	@Test
	void testSetCheckContentNotExistCheckId() {
		// given
		Checklist request = Checklist.builder().checkId(99999).checkContent("수정").build();

		// when
		boolean result = dashboardService.setCheckContent(request);

		// then
		assertFalse(result);
	}

	@Test
	void testSetIsCheckYes() {
		// given
		Checklist request = Checklist.builder().checkId(2).isCheck(1).build();

		// when
		boolean result = dashboardService.setIsCheck(request);

		// then
		assertTrue(result);
	}

	@Test
	void testSetIsCheckNotExistCheckId() {
		// given
		Checklist request = Checklist.builder().checkId(99999).isCheck(1).build();

		// when
		boolean result = dashboardService.setIsCheck(request);

		// then
		assertFalse(result);
	}

	@Test
	void testRemoveCheckItemYes() {
		// given
		int checkId = 2;

		// when
		boolean result = dashboardService.removeCheckItem(checkId);

		// then
		assertTrue(result);
	}

	@Test
	void testRemoveCheckItemNotExistCheckId() {
		// given
		int checkId = 99999;

		// when
		boolean result = dashboardService.removeCheckItem(checkId);

		// then
		assertFalse(result);
	}

	@Test
	void testAddChecklistYes() {
		// given
		Checklist request = Checklist.builder().memberId(1).checkDate("2025-06-07").build();

		// when
		boolean result = dashboardService.addChecklist(request);

		// then
		assertTrue(result);
	}

	@Test
	void testAddChecklistNotExistMemberId() {
		// given
		Checklist request = Checklist.builder().memberId(99999).checkDate("2025-06-07").build();

		// when & then
		assertThrows(DataIntegrityViolationException.class, () -> {
			dashboardService.addChecklist(request);
		});
	}

	@Test
	void testAddChecklistDuplicateDate() {
		// given
		Checklist request = Checklist.builder().memberId(2).checkDate("2025-05-02").build();

		// when & then
		assertThrows(IllegalStateException.class, () -> {
			dashboardService.addChecklist(request);
		});
	}

	@Test
	void testAddCheckItemYes() {
		// given
		Checklist request = Checklist.builder().checkContent("물 마시기").isCheck(0).checklistId(1).build();

		// when
		boolean result = dashboardService.addCheckItem(request);

		// then
		assertTrue(result);
	}

	@Test
	void testAddCheckItemNotExistChecklistId() {
		// given
		Checklist request = Checklist.builder().checkContent("물 마시기").isCheck(0).checklistId(99999).build();

		// when & then
		assertThrows(DataIntegrityViolationException.class, () -> {
			dashboardService.addCheckItem(request);
		});
	}

	@Test
	void testGetGoalYes() {
		// given
		int memberId = 1;

		// when
		String result = dashboardService.getGoal(memberId);

		// then
		assertEquals("유지", result);
	}

	@Test
	void testGetGoalNotExistMemberId() {
		// given
		int memberId = 99999;

		// when
		String result = dashboardService.getGoal(memberId);

		// then
		assertNull(result);
	}

	@Test
	void testGetGoalNotEqualGoal() {
		// given
		int memberId = 1;

		// when
		String result = dashboardService.getGoal(memberId);

		// then
		assertNotEquals("감량", result);
	}

}
