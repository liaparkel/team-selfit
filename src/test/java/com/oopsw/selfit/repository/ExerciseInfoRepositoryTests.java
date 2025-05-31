package com.oopsw.selfit.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@SpringBootTest
class ExerciseInfoRepositoryTests {

	@Autowired
	private ExerciseInfoRepository exerciseInfoRepository;

	// @Test
	// void testRemoveExercise() {
	// 	// given
	// 	ExerciseInfo exerciseInfo = ExerciseInfo.builder()
	// 		.exerciseId(8)
	// 		.exerciseMin(20)
	// 		.exerciseKcal(150)
	// 		.exerciseNoteId(200)
	// 		.build();
	// 	ExerciseInfo saved = exerciseInfoRepository.save(exerciseInfo);
	// 	Integer id = saved.getExerciseInfoId();
	//
	// 	// when
	// 	exerciseInfoRepository.deleteById(id);
	//
	// 	// then
	// 	assertFalse(exerciseInfoRepository.existsById(id));
	//
	// }
	//
	// @Test
	// void testGetExercisesForDate() {
	// }

}


