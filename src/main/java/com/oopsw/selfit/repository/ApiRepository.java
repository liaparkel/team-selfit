package com.oopsw.selfit.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.oopsw.selfit.dto.ExerciseApi;
import com.oopsw.selfit.dto.FoodApi;

@Mapper
public interface ApiRepository {
	void addFoodApi(List<FoodApi> list);

	void addExerciseApi(List<ExerciseApi> list);

	int existFoodApi(String foodCode);

	int existExercise(String exerciseName, float met);

}
