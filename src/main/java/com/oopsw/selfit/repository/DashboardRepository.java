package com.oopsw.selfit.repository;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.oopsw.selfit.dto.Checklist;
import com.oopsw.selfit.dto.Exercise;
import com.oopsw.selfit.dto.Food;
import com.oopsw.selfit.dto.Member;

@Mapper
public interface DashboardRepository {
	String getFoodWeightByName(String foodName);
	Member getBmrById(int memberId);
	Food getIntakeKcalByIdDate(Food food);
	Exercise getExerciseKcalByIdDate(Exercise exercise);
	List<Food> getYearIntakeKcal(HashMap<String, Object> map);
	List<Exercise> getYearExerciseKcal(HashMap<String, Object> map);
	Food getIntakeDetail(Food food);
	List<String> getAutoCompleteFood(String partWord);
	int addFoodList(Food food);
	int removeFoodList(Food food);
	int addFood(Food food);
	Food getFood(Food food);
	int setIntake(Food food);
	int removeFood(int foodInfoId);
	List<Exercise> getIntakeKcal(Exercise exercise);
	List<Food> getAutoCompleteExercise(String partWord);
	int addExerciseList(Exercise exercise);
	int removeExerciseList(Exercise exercise);
	int addExercise(Exercise exercise);
	Exercise getExerciseDetail(Exercise exercise);
	int setExerciseMin(Exercise exercise);
	int removeExercise(int exerciseInfoId);
	List<Checklist> getCheckList(Checklist checklist);
	int setCheckContent(Checklist checklist);
	int setIsCheck(Checklist checklist);
	int removeCheckItem(int checkId);
	int addChecklist(Checklist checklist);
	int addCheckItem(Checklist checklist);
	String getGoal(int memberId);
}
