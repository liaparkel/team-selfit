package com.oopsw.selfit.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.oopsw.selfit.domain.FoodInfos;
import com.oopsw.selfit.dto.Food;
import com.oopsw.selfit.repository.DashboardRepository;
import com.oopsw.selfit.repository.FoodInfoRepository;

@Transactional
@SpringBootTest
public class FoodInfoServiceTests {
	@Autowired
	private FoodInfoService foodInfoService;
	@Autowired
	private DashboardRepository dashboardRepository;
	@Autowired
	private FoodInfoRepository foodInfoRepository;

	@Test
	void testRemoveFoodYes() {
		// given
		FoodInfos food = FoodInfos.builder()
			.foodNoteId(1)
			.intake(100)
			.intakeKcal(250)
			.unitKcal(250)
			.foodName("닭가슴살")
			.build();
		food = foodInfoRepository.save(food);

		// when
		boolean result = foodInfoService.removeFood(food.getFoodInfoId()); // 또는 removeFoodById(food.getFoodInfoId());

		// then
		assertTrue(result);
		assertFalse(foodInfoRepository.existsById(food.getFoodInfoId()));
	}

	@Test
	public void testSetIntakeYes() {
		FoodInfos food = FoodInfos.builder()
			.foodNoteId(1)
			.foodName("계란")
			.intake(50)
			.unitKcal(150)
			.intakeKcal(75)
			.build();
		food = foodInfoRepository.save(food);
		int foodInfoId = food.getFoodInfoId();

		// when: setIntake 호출
		boolean result = foodInfoService.setIntake(foodInfoId, 100);

		// then: true 반환 + DB에 값이 제대로 반영되었는지 확인
		assertTrue(result);
		FoodInfos updated = foodInfoRepository.findById(foodInfoId).orElseThrow();
		assertEquals(100, updated.getIntake());
		assertEquals(150, updated.getIntakeKcal());
	}

	@Test
	public void testAddFoodYes() {
		// given
		String uniqueFoodName = "테스트식품_" + System.currentTimeMillis(); // 중복 방지용

		Food foodDto = Food.builder()
			.foodName(uniqueFoodName)
			.intake(150)
			.unitKcal(130)
			.foodNoteId(1) // 존재하는 food_note_id
			.build();

		float expectedKcal = (float) foodDto.getUnitKcal() / 100f * foodDto.getIntake();

		// when
		boolean result = foodInfoService.addFood(foodDto);

		// then
		assertTrue(result);

		FoodInfos saved = foodInfoRepository.findByFoodNoteId(1).stream()
			.filter(f -> f.getFoodName().equals(uniqueFoodName))
			.findFirst()
			.orElseThrow(() -> new AssertionError("음식이 저장되지 않았습니다."));

		assertEquals(expectedKcal, saved.getIntakeKcal(), 0.01f); // 오차 허용
	}


}

