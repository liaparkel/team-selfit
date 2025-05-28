package com.oopsw.selfit.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.oopsw.selfit.dto.ExerciseApi;
import com.oopsw.selfit.dto.FoodApi;

@Mapper
public interface ApiRepository {
	int addFoodApi(List<FoodApi> list);

	int addExerciseApi(List<ExerciseApi> list);
}
