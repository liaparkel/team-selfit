package com.oopsw.selfit.repository;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.oopsw.selfit.domain.FoodInfo;

@Transactional
@SpringBootTest
public class FoodInfoRepositoryTests {
	@Autowired
	private FoodInfoRepository foodInfoRepository;

	@Test
	public void testRemoveFood() {
		// given
		FoodInfo foodInfo = FoodInfo.builder()
			.intake(300F)
			.intakeKcal(1500F)
			.foodNoteId(1)
			.foodId(1)
			.build();
		FoodInfo saved = foodInfoRepository.save(foodInfo);
		Integer id = saved.getFoodInfoId();

		// when
		foodInfoRepository.deleteById(id);

		// then
		assertFalse(foodInfoRepository.existsById(id));

	}

	@Test
	public void testRemoveFoodNotExistFoodInfoId() {
		// given
		int foodInfoId = 99999;

		// when
		foodInfoRepository.deleteById(foodInfoId);

		// then
		assertFalse(foodInfoRepository.existsById(foodInfoId));
	}

}