package com.oopsw.selfit.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.oopsw.selfit.dto.Checklist;
import com.oopsw.selfit.dto.Exercise;
import com.oopsw.selfit.dto.Food;

@Transactional
@SpringBootTest
public class DashboardRepositoryTests {
	@Autowired
	private DashboardRepository dashboardRepository;

	@Test
	void testGetFoodWeightByNameYes() {
		assertEquals("200g", dashboardRepository.getFoodWeightByName("사과"));
	}
	//@@@@@@@@@@@@No
	@Test
	void testGetBmrByIdYes() {
		System.out.println(dashboardRepository.getBmrById(1));
		assertEquals(175f, dashboardRepository.getBmrById(1).getHeight());
	}
	//@@@@@@@@@@@No
	@Test
	void testGetIntakeKcalByIdDateYes() {
		Food f=dashboardRepository.getIntakeKcalByIdDate(Food.builder().memberId(1).intakeDate("2025-05-21").build());
		System.out.println(f);
		assertEquals(140, f.getIntakeSum());
	}

	@Test
	void testGetExerciseKcalByIdDateYes() {
		Exercise e = dashboardRepository.getExerciseKcalByIdDate(Exercise.builder().memberId(1).exerciseDate("2025-05-21").build());
		System.out.println(e);
		assertEquals(212, e.getExerciseSum());
	}

	@Test
	void testGetYearIntakeKcalYes() {
		HashMap<String, Object> map = new HashMap<>();
		map.put("memberId", 1);
		map.put("intakeYear", "2025");
		System.out.println(dashboardRepository.getYearIntakeKcal(map));
	}

	@Test
	void testGetYearExerciseKcalYes() {
		HashMap<String, Object> map = new HashMap<>();
		map.put("memberId", 1);
		map.put("exerciseYear", "2025");
		System.out.println(dashboardRepository.getYearExerciseKcal(map));
	}

	@Test
	void testGetIntakeDetailYes() {
		Food f=dashboardRepository.getIntakeDetail(Food.builder().memberId(1).intakeDate("2025-05-01").build());
		System.out.println(f);
	}

	@Test
	void testGetAutoCompleteFoodYes() {
		System.out.println(dashboardRepository.getAutoCompleteFood("유"));
	}

	@Test
	void testAddFoodListYes() {
		assertEquals(1, dashboardRepository.addFoodList(Food.builder().memberId(1).intakeDate("2025-06-05").build()));
	}

	@Test
	void testRemoveFoodListYes() {
		assertEquals(1, dashboardRepository.removeFoodList(Food.builder().memberId(1).intakeDate("2025-06-02").build()));
	}

	@Test
	void testAddFoodYes() {
		assertEquals(1, dashboardRepository.addFood(Food.builder().intake("200").intakeKcal("95").foodNoteId(2).foodId(8).build()));
	}

	@Test
	void testGetFoodYes() {
		Food f=dashboardRepository.getFood(Food.builder().memberId(1).intakeDate("2025-05-01").foodInfoId(1).build());
		System.out.println(f);
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
	void testGetIntakeKcalYes() {
		System.out.println(dashboardRepository.getIntakeKcal(Exercise.builder().memberId(1).exerciseDate("2025-05-01").build()));
	}

	@Test
	void testGetAutoCompleteExerciseYes() {
		System.out.println(dashboardRepository.getAutoCompleteExercise("기"));
	}
	@Test
	void testAddExerciseListYes() {
		assertEquals(1, dashboardRepository.addExerciseList(Exercise.builder().memberId(1).exerciseDate("2025-06-05").build()));
	}

	@Test
	void testremoveExerciseListYes() {
		assertEquals(1, dashboardRepository.removeExerciseList(Exercise.builder().memberId(10).exerciseDate("2025-05-10").build()));
	}

	@Test
	void testAddExerciseYes() {
		assertEquals(1, dashboardRepository.addExercise(Exercise.builder().exerciseMin(40).exerciseKcal("112").exerciseId(6).exerciseNoteId(1).build()));
	}

	@Test
	void testGetExerciseDetailYes() {
		Exercise e=dashboardRepository.getExerciseDetail(Exercise.builder().memberId(1).exerciseDate("2025-05-01").exerciseInfoId(1).build());
		System.out.println(e);
	}

	@Test
	void testSetExerciseMinYes() {
		assertEquals(1, dashboardRepository.setExerciseMin(Exercise.builder().exerciseInfoId(2).exerciseMin(300).build()));
	}

	@Test
	void testRemoveExerciseYes() {
		assertEquals(1, dashboardRepository.removeExercise(1));
	}

	@Test
	void testGetCheckListYes() {
		System.out.println(dashboardRepository.getCheckList(Checklist.builder().memberId(1).checkDate("2025-05-01").build()));
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
		assertEquals(1, dashboardRepository.addChecklist(Checklist.builder().memberId(1).checkDate("2025-06-07").build()));
	}

	@Test
	void testAddCheckItem() {
		assertEquals(1, dashboardRepository.addCheckItem(Checklist.builder().checkContent("물 마시기").isCheck(0).checklistId(1).build()));
	}

	@Test
	void testGetGoalYes() {
		System.out.println(dashboardRepository.getGoal(2));
	}

}
