package com.oopsw.selfit.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.oopsw.selfit.domain.FoodInfo;
import com.oopsw.selfit.dto.Food;
import com.oopsw.selfit.repository.DashboardRepository;
import com.oopsw.selfit.repository.FoodInfoRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class FoodInfoService {
	private final FoodInfoRepository foodInfoRepository;
	private final DashboardRepository dashboardRepository;



	public void getIntakeDetail(Food food) {

		//List<Food> foodList = new ArrayList<>();

		//List<Food> findByMemberIdAndIntakeDate(food.getMemberId(), food.getIntakeDate());
		//Food intakeDetail = Food.builder().intakeDate(food.getIntakeDate()).memberId(food.getMemberId()).foodNoteId(food.getFoodNoteId()).foodId(food.getFoodId()).build();
		// System.out.println(foodInfoRepository.findById(food.getFoodId()).get());


	}



	//private final DashboardRepository dashboardRepository;

	// public List<Food> getIntakeDetail(int memberId, String intakeDate) {
	// 	// JPA로 FoodInfo 리스트 조회
	// 	List<FoodInfo> foodInfos = foodInfoRepository.getIntakeDetail(memberId, intakeDate);
	//
	// 	// MyBatis로 조인된 정보 가져옴
	// 	Food param = Food.builder()
	// 		.memberId(memberId)
	// 		.intakeDate(intakeDate)
	// 		.build();
	// 	List<Food> joinedList = dashboardRepository.getIntakeDetail(param);
	//
	// 	// foodInfoId 기준으로 joinedList를 Map으로 수동 변환
	// 	Map<Integer, Food> joinedMap = new HashMap<>();
	// 	for (Food f : joinedList) {
	// 		joinedMap.put(f.getFoodInfoId(), f);
	// 	}
	//
	// 	// JPA 정보 + MyBatis 정보 병합해서 최종 결과 생성
	// 	List<Food> result = new ArrayList<>();
	// 	for (FoodInfo fi : foodInfos) {
	// 		Food j = joinedMap.get(fi.getFoodInfoId());
	// 		if (j == null)
	// 			continue; // 혹시 매칭 안 되는 ID는 건너뜀
	//
	// 		Food food = Food.builder()
	// 			.memberId(memberId)
	// 			.foodNoteId(fi.getFoodNoteId())
	// 			.foodInfoId(fi.getFoodInfoId())
	// 			.foodId(fi.getFoodId())
	// 			.intake((int)fi.getIntake())
	// 			.intakeKcal(fi.getIntakeKcal())
	// 			.foodName(j.getFoodName())
	// 			.unitKcal(j.getUnitKcal())
	// 			.intakeDate(j.getIntakeDate())
	// 			.build();
	//
	// 		result.add(food);
	// 	}
	//
	// 	return result;
	// }
}
