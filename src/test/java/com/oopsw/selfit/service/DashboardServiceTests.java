package com.oopsw.selfit.service;
import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.oopsw.selfit.dto.Exercise;
import com.oopsw.selfit.dto.Food;
import com.oopsw.selfit.dto.Member;
import com.oopsw.selfit.repository.DashboardRepository;

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

}
