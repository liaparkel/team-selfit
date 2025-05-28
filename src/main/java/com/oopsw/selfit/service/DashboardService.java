package com.oopsw.selfit.service;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.oopsw.selfit.dto.Exercise;
import com.oopsw.selfit.dto.Food;
import com.oopsw.selfit.dto.Member;
import com.oopsw.selfit.repository.DashboardRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class DashboardService {
	private final DashboardRepository dashboardRepository;

	public HashMap<String, Object> getFoodWeight(String foodName) {
		HashMap<String, Object> map = new HashMap<>();
		String foodWeight = dashboardRepository.getFoodWeight(foodName);
		int numberPart = Integer.parseInt(foodWeight.replaceAll("[^0-9]", ""));
		String unitPart = foodWeight.replaceAll("[0-9]", "");
		map.put("numberPart", numberPart);
		map.put("unitPart", unitPart);
		return map;
	}

	public int getBmr(int memberId) {
		Member member = dashboardRepository.getBmr(memberId);

		int age = getAge(member.getBirthday());
		int bmr = -1;
		switch (member.getGender()) {
			case "남자":
				bmr = (int)((10 * member.getWeight()) + (6.25 * member.getHeight()) - (5 * age) + 5);
				break;
			case "여자":
				bmr = (int)((10 * member.getWeight()) + (6.25 * member.getHeight()) + (5 * age) - 161);
				break;
		}
		return bmr;
	}

	public int getAge(String birthday) {
		LocalDate birthDate = LocalDate.parse(birthday, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
		LocalDate today = LocalDate.now();

		// Period로 만 나이 계산
		Period period = Period.between(birthDate, today);

		return period.getYears();
	}

	public Food getIntakeKcal(Food food) {
		return dashboardRepository.getIntakeKcal(food);
	}

	public Exercise getExerciseKcal(Exercise exercise) {
		return dashboardRepository.getExerciseKcal(exercise);
	}

	public List<Food> getYearIntakeKcal(HashMap<String, Object> map) {
		return dashboardRepository.getYearIntakeKcal(map);
	}

	public List<Exercise> getYearExerciseKcal(HashMap<String, Object> map) {
		return dashboardRepository.getYearExerciseKcal(map);
	}

	public List<Food> getIntakeDetail(Food food) {
		return dashboardRepository.getIntakeDetail(food);
	}

	public List<String> getAutoCompleteFood(String partWord) {
		return dashboardRepository.getAutoCompleteFood(partWord);
	}

	public boolean addFoodList(Food food) {
		if (dashboardRepository.addFoodList(food) == 0) {
			return false;
		}
		return true;

	}

	public boolean removeFoodList(Food food) {
		if (dashboardRepository.removeFoodList(food) == 0) {
			return false;
		}
		return true;
	}

	public boolean addFood(Food food) {
		if (dashboardRepository.addFood(food) == 0) {
			return false;
		}
		return true;
	}

	public boolean setIntake(Food food) {
		if (dashboardRepository.setIntake(food) == 0) {
			return false;
		}
		return true;
	}

	public boolean removeFood(int foodInfoId) {
		if (dashboardRepository.removeFood(foodInfoId) == 0) {
			return false;
		}
		return true;
	}

	public List<String> getAutoCompleteExercise(String partWord) {
		return dashboardRepository.getAutoCompleteExercise(partWord);
	}

	public boolean addExerciseList(Exercise exercise) {
		if (dashboardRepository.addExerciseList(exercise) == 0) {
			return false;
		}
		return true;
	}

	public boolean removeExerciseList(Exercise exercise) {
		if (dashboardRepository.removeExerciseList(exercise) == 0) {
			return false;
		}
		return true;
	}

	public boolean addExercise(Exercise exercise) {
		if (dashboardRepository.addExercise(exercise) == 0) {
			return false;
		}
		return true;
	}

	public List<Exercise> getExerciseDetail(Exercise exercise) {
		return dashboardRepository.getExerciseDetail(exercise);
	}
}
