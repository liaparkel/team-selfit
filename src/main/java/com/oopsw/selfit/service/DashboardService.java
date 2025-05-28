package com.oopsw.selfit.service;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Service;

import com.oopsw.selfit.dto.Checklist;
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

	// 윤호님 코드 예정
	public boolean setExerciseMin(Exercise exercise) {
		validatePositive(exercise.getExerciseMin(), "운동 시간");
		return dashboardRepository.setExerciseMin(exercise) > 0;
	}

	public boolean removeExercise(int exerciseInfoId) {
		return dashboardRepository.removeExercise(exerciseInfoId) > 0;
	}

	public List<Checklist> getCheckList(Checklist checklist) {
		return dashboardRepository.getCheckList(checklist);
	}

	public boolean setCheckContent(Checklist checklist) {
		return dashboardRepository.setCheckContent(checklist) > 0;
	}

	public boolean setIsCheck(Checklist checklist) {
		return dashboardRepository.setIsCheck(checklist) > 0;
	}

	public boolean removeCheckItem(int checkId) {
		return dashboardRepository.removeCheckItem(checkId) > 0;
	}

	public boolean addChecklist(Checklist checklist) {
		int exists = dashboardRepository.isChecklist(checklist.getMemberId(), checklist.getCheckDate());
		isAlreadyExists(exists, "체크리스트", checklist.getCheckDate());
		return dashboardRepository.addChecklist(checklist) > 0;
	}

	public boolean addCheckItem(Checklist checklist) {
		return dashboardRepository.addCheckItem(checklist) > 0;
	}

	public String getGoal(int memberId) {
		return dashboardRepository.getGoal(memberId);
	}

	public void validatePositive(int value, String fieldName) {
		if (value <= 0) {
			throw new IllegalArgumentException(fieldName + "은(는) 0보다 커야 합니다.");
		}
	}

	public void isAlreadyExists(int exists, String type, String date) {
		if (exists > 0) {
			throw new IllegalStateException("이미 해당 날짜에 " + type + "이(가) 존재합니다: " + date);
		}
	}

}
