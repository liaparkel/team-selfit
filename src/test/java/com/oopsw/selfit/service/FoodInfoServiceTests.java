package com.oopsw.selfit.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.oopsw.selfit.repository.DashboardRepository;
import com.oopsw.selfit.repository.FoodInfoRepository;

@SpringBootTest
public class FoodInfoServiceTests {
	@Autowired
	private FoodInfoService foodInfoService;
	@Autowired
	private DashboardRepository dashboardRepository;
	@Autowired
	private FoodInfoRepository foodInfoRepository;
	// @Test
	// void testGetRawInfosByNote() {
	// 	// given: noteId=200 으로 2건 저장
	// 	FoodInfo fi1 = FoodInfo.builder()
	// 		.foodNoteId(5)
	// 		.foodId(10)
	// 		.intake(100)
	// 		.intakeKcal(120f)
	// 		.build();
	// 	FoodInfo fi2 = FoodInfo.builder()
	// 		.foodNoteId(6)
	// 		.foodId(20)
	// 		.intakeKcal(150f)
	// 		.intake(100)
	// 		.build();
	// 	foodInfoRepository.save(fi1);
	// 	foodInfoRepository.save(fi2);
	//
	// 	// when
	// 	List<FoodInfo> raws = foodInfoService.getRawInfosByNote(5);
	//
	// 	// then
	// 	assertNotNull(raws, "rawInfos는 null이 아니어야 합니다");
	//
	//
	// 	System.out.println(raws);
	// }
	//
	// @Test
	// void testGetFoodsForDate() {
	// 	// 이 noteId, memberId, date값은 실제 DB에 맞춰 조정하세요
	// 	int noteId   = 1;
	// 	int memberId = 1;
	// 	String date  = "2025-05-01";
	//
	// 	// (선택) 메타 데이터가 없으면 미리 dashboardRepository를 이용해 insert 하시거나,
	// 	// 실제 DB에 사전에 Food 테이블 샘플 데이터가 들어있어야 합니다.
	//
	// 	// when
	// 	List<Food> list = foodInfoService.getFoodsForNote(noteId, memberId, date);
	//
	// 	// then
	// 	assertNotNull(list, "서비스가 null을 리턴하면 안 됩니다");
	// 	assertFalse(list.isEmpty(), "테스트용 데이터가 들어있다면 빈 리스트가 아니어야 합니다");
	//
	//
	//
	// 	// (디버그용 출력)
	// 	System.out.println("getFoodsForDate 결과: " + list);
	// }
}
