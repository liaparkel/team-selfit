package com.oopsw.selfit.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.oopsw.selfit.domain.FoodInfos;
import com.oopsw.selfit.dto.Food;
import com.oopsw.selfit.repository.DashboardRepository;
import com.oopsw.selfit.repository.FoodInfoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FoodInfoService {
	private final FoodInfoRepository foodInfoRepository;
	private final DashboardRepository dashboardRepository;

	public boolean removeFood(int foodInfoId) {
		if(foodInfoRepository.existsById(foodInfoId)) {
			foodInfoRepository.deleteById(foodInfoId);
			return true;
		}
		return false;
	}

	public boolean setIntake(int foodInfoId, int newIntake) {
		if(foodInfoRepository.existsById(foodInfoId)) {
			Optional<FoodInfos> foodInfo = foodInfoRepository.findById(foodInfoId);
			foodInfo.get().setIntake(newIntake);
			int unitKcal = foodInfo.get().getUnitKcal();
			foodInfo.get().setIntakeKcal((float)unitKcal/100f*(foodInfo.get().getIntake()));
			foodInfoRepository.save(foodInfo.get());

			return true;
		}
		return false;

	}

	public boolean addFood(Food food) {
		// 수동 매핑: DTO → Entity
		FoodInfos entity = FoodInfos.builder()
			.foodNoteId(food.getFoodNoteId())
			.foodName(food.getFoodName())
			.intake(food.getIntake())
			.unitKcal(food.getUnitKcal())
			.intakeKcal((float) food.getUnitKcal() / 100f * food.getIntake())
			.build();

		// 저장
		return foodInfoRepository.save(entity) != null;
	}
	// 	//섭취칼로리 = (float)단위칼로리/100 * 섭취량
	// 	food.setIntakeKcal(((float)getUnitKcal(food.getFoodId())) / 100 * food.getIntake());
	// 	if (dashboardRepository.addFood(food) == 0) {
	// 		return false;
	// 	}
	// 	return true;
	// }

}
