package com.oopsw.selfit.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

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

}