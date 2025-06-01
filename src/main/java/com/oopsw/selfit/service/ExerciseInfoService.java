package com.oopsw.selfit.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.oopsw.selfit.domain.ExerciseInfos;
import com.oopsw.selfit.repository.DashboardRepository;
import com.oopsw.selfit.repository.ExerciseInfoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExerciseInfoService {
	private final ExerciseInfoRepository exerciseInfoRepository;
	private final DashboardRepository dashboardRepository;

	public List<ExerciseInfos> getRawInfosByNote(int noteId) {
		return exerciseInfoRepository.findByExerciseNoteId(noteId);
	}

	// public List<Exercise> getExercisesForDate(int noteId, int memberId, String date) {
	// 	// 1) STEP 1: raw info
	// 	List<ExerciseInfo> rawInfos = exerciseInfoRepository.findByExerciseNoteId(noteId);
	// 	if (rawInfos.isEmpty()) {
	// 		return List.of();
	// 	}
	//
	// 	// 2) STEP 2-1: distinct exerciseId 목록
	// 	List<Integer> exerciseIds = rawInfos.stream()
	// 		.map(ExerciseInfo::getExerciseId)
	// 		.distinct()
	// 		.toList();
	//
	// 	// 2) STEP 2-2: 한 번에 운동 메타 조회
	// 	List<Exercise> metas = dashboardRepository.getExercisesByIds(exerciseIds);
	// 	Map<Integer, Exercise> metaMap = metas.stream()
	// 		.collect(Collectors.toMap(Exercise::getExerciseId, Function.identity()));
	//
	// 	// 2) STEP 2-3: DTO 조합
	// 	return rawInfos.stream()
	// 		.map(ei -> {
	// 			Exercise m = metaMap.get(ei.getExerciseId());
	// 			return Exercise.builder()
	// 				.memberId(memberId)
	// 				.exerciseDate(date)
	// 				.exerciseName(m.getExerciseName())
	// 				.exerciseMin(ei.getExerciseMin())
	// 				.exerciseKcal((int)ei.getExerciseKcal())
	// 				.met(m.getMet())
	// 				.build();
	// 		})
	// 		.toList();
	// }
}



