package com.oopsw.selfit.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.oopsw.selfit.domain.FoodInfo;
import com.oopsw.selfit.repository.DashboardRepository;
import com.oopsw.selfit.repository.FoodInfoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FoodInfoService {
	private final FoodInfoRepository foodInfoRepository;
	private final DashboardRepository dashboardRepository;

	// public List<FoodInfo> getRawInfosByNote(int noteId) {
	// 	return foodInfoRepository.findByFoodNoteId(noteId);
	// }

	// public List<Food> getFoodsForNote(int noteId, int memberId, String date) {
	// 	// 1) raw FK 목록
	// 	List<FoodInfo> infos = foodInfoRepository.findByFoodNoteId(noteId);
	// 	if (infos.isEmpty())
	// 		return List.of();
	//
	// 	// 2) distinct foodId 수집
	// 	List<Integer> foodIds = infos.stream()
	// 		.map(FoodInfo::getFoodId)
	// 		.distinct()
	// 		.toList();
	//
	// 	// 3) 배치 조회 (MyBatis IN 쿼리 또는 JPA)
	// 	List<Food> metas = dashboardRepository.getFoodsByIds(foodIds);
	// 	Map<Integer, Food> metaMap = metas.stream()
	// 		.collect(Collectors.toMap(Food::getFoodId, Function.identity()));
	//
	// 	// 4) DTO 조립
	// 	return infos.stream()
	// 		.map(fi -> {
	// 			Food m = metaMap.get(fi.getFoodId());
	// 			float intake = fi.getIntake();
	// 			double intakeKcal = m.getUnitKcal() * intake / 100.0;
	// 			return Food.builder()
	// 				.foodName(m.getFoodName())
	// 				.foodNoteId(fi.getFoodNoteId())
	// 				.unitKcal(m.getUnitKcal())
	// 				.intakeKcal((float)intakeKcal)
	// 				.intake((int)intake)
	// 				.build();
	// 		})
	// 		.toList();
	//
	// }
}
