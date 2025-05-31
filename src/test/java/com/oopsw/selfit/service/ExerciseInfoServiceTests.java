package com.oopsw.selfit.service;

import java.util.List;
import static org.junit.jupiter.api.Assertions.*;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.oopsw.selfit.domain.ExerciseInfo;
import com.oopsw.selfit.dto.Exercise;
import com.oopsw.selfit.repository.DashboardRepository;
import com.oopsw.selfit.repository.ExerciseInfoRepository;

@SpringBootTest
public class ExerciseInfoServiceTests {

	@Autowired
	private ExerciseInfoService service;
	@Autowired
	private DashboardRepository dashboardRepository;
	@Autowired
	private ExerciseInfoRepository exerciseInfoRepository;

	// @Test
	// void testGetRawInfosByNote() {
	// 	// given: noteId=100 으로 2건 저장
	// 	ExerciseInfo ei1 = ExerciseInfo.builder()
	// 		.exerciseNoteId(100)
	// 		.exerciseId(7)
	// 		.exerciseMin(20)
	// 		.exerciseKcal(120f)
	// 		.build();
	// 	ExerciseInfo ei2 = ExerciseInfo.builder()
	// 		.exerciseNoteId(100)
	// 		.exerciseId(8)
	// 		.exerciseMin(30)
	// 		.exerciseKcal(200f)
	// 		.build();
	// 	exerciseInfoRepository.save(ei1);
	// 	exerciseInfoRepository.save(ei2);
	//
	// 	// when
	// 	List<ExerciseInfo> raws = service.getRawInfosByNote(100);
	//
	// 	// then
	//
	//
	// 	System.out.println(raws);
	// }
	//
	// @Test
	// void testGetExercisesForDate() {
	// 	int noteId   = 1;
	// 	int memberId = 1;
	// 	String date  = "2025-05-01";
	//
	// 	List<Exercise> list = service.getExercisesForDate(noteId, memberId, date);
	//
	// 	assertNotNull(list, "서비스가 null이 아닌 리스트를 반환해야 합니다");
	// 	assertFalse(list.isEmpty(), "DB에 데이터가 있다면 최소 1건 이상 반환되어야 합니다");
	//
	// 	// (선택) 어떤 필드라도 하나만 제대로 매핑됐는지 간단히 확인
	// 	Exercise ex = list.get(0);
	// 	assertEquals(date, ex.getExerciseDate(), "반환된 DTO의 날짜가 맞아야 합니다");
	// 	assertTrue(ex.getExerciseMin() > 0, "운동 분(min)은 0보다 커야 합니다");
	// 	assertNotNull(ex.getExerciseName(), "운동 이름이 null이 아니어야 합니다");
	// 	assertTrue(ex.getExerciseKcal() > 0, "소모 칼로리도 0보다 커야 합니다");
	//
	// 	// (디버그용)
	// 	System.out.println(">> getExercisesForDate 결과: " + list);
	// }




}
