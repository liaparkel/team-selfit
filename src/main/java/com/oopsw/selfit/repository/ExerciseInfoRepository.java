package com.oopsw.selfit.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oopsw.selfit.domain.ExerciseInfo;

public interface ExerciseInfoRepository extends JpaRepository<ExerciseInfo, Integer> {
	List<ExerciseInfo> findByExerciseNoteId(int exerciseNoteId);

}
