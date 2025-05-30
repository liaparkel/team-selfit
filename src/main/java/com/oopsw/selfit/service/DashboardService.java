package com.oopsw.selfit.service;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.oopsw.selfit.domain.CheckItem;
import com.oopsw.selfit.dto.Checklist;
import com.oopsw.selfit.dto.Exercise;
import com.oopsw.selfit.dto.Food;
import com.oopsw.selfit.dto.Member;
import com.oopsw.selfit.repository.CheckRepository;
import com.oopsw.selfit.repository.DashboardRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class DashboardService {
	private final DashboardRepository dashboardRepository;
	private final CheckRepository checkRepository;

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
		int exists = dashboardRepository.isChecklist(food.getMemberId(), food.getIntakeDate());
		isAlreadyExists(exists, "식단 기록", food.getIntakeDate());
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

	public int getUnitKcal(int foodId) {
		return dashboardRepository.getUnitKcal(foodId);
	}

	public boolean addFood(Food food) {
		validatePositive(food.getIntake(), "섭취량");
		//섭취칼로리 = (float)단위칼로리/100 * 섭취량
		food.setIntakeKcal(((float)getUnitKcal(food.getFoodId())) / 100 * food.getIntake());
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
		int exists = dashboardRepository.isChecklist(exercise.getMemberId(), exercise.getExerciseDate());
		isAlreadyExists(exists, "운동 기록", exercise.getExerciseDate());
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
		validatePositive(exercise.getExerciseMin(), "운동시간");
		//소모칼로리 = MET * 체중 * 운동시간(분) /60
		exercise.setExerciseKcal(
			dashboardRepository.getWeight(exercise.getExerciseNoteId()) *
				dashboardRepository.getMet(exercise.getExerciseId()) *
				exercise.getExerciseMin() / 60
		);

		if (dashboardRepository.addExercise(exercise) == 0) {
			return false;
		}
		return true;
	}

	public List<Exercise> getExerciseDetail(Exercise exercise) {
		return dashboardRepository.getExerciseDetail(exercise);
	}

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

	// public boolean setCheckContent(Checklist checklist) {
	// 	return dashboardRepository.setCheckContent(checklist) > 0;
	// }
	public boolean setCheckItem(Checklist checklist) {
		Optional<CheckItem> checkItem = checkRepository.findById((long)checklist.getCheckId());

		if (checkItem.isEmpty()) {
			throw new IllegalArgumentException("수정할 체크 항목이 존재하지 않습니다.");
		}
		CheckItem item = checkItem.get();
		item.setCheckContent(checklist.getCheckContent());

		checkRepository.save(item);
		return true;
	}

	// public boolean setIsCheck(Checklist checklist) {
	// 	return dashboardRepository.setIsCheck(checklist) > 0;
	// }
	public boolean setIsCheckItem(Checklist checklist) {
		Optional<CheckItem> checkItem = checkRepository.findById((long)checklist.getCheckId());

		if (checkItem.isEmpty()) {
			throw new IllegalArgumentException("존재하지 않는 체크 항목입니다.");
		}

		CheckItem item = checkItem.get();
		item.setIsCheck(!item.getIsCheck());

		checkRepository.save(item);

		return true;
	}

	// public boolean removeCheckItem(int checkId) {
	// 	return dashboardRepository.removeCheckItem(checkId) > 0;
	// }
	public boolean removeCheckItem(Checklist checklist) {
		// Optional<T>는 값이 있을 수도 없을 수도 있는 컨테이너 객체
		// 	T가 null일 수도 있으니, 직접 null 체크하지 말고 Optional로 감싸서 안전하게 써라는 의미
		Optional<CheckItem> checkItem = checkRepository.findById((long)checklist.getCheckId());

		// Optional에서 제공하는 주요 메서드
		// isPresent() → 값이 있으면 true
		// isEmpty() → 값이 없으면 true (Java 11 이상)
		// orElse(), orElseThrow() → 값이 없을 때 대처 방식
		if (checkItem.isEmpty()) {
			throw new IllegalArgumentException("존재하지 않는 체크 항목");
		}
		checkRepository.deleteById((long)checklist.getCheckId());
		return true;
	}

	public boolean addChecklist(Checklist checklist) {
		int exists = dashboardRepository.isChecklist(checklist.getMemberId(), checklist.getCheckDate());
		isAlreadyExists(exists, "체크리스트", checklist.getCheckDate());
		return dashboardRepository.addChecklist(checklist) > 0;
	}

	// public boolean addCheckItem(Checklist checklist) {
	// 	return dashboardRepository.addCheckItem(checklist) > 0;
	// }
	public boolean addCheckItem(Checklist checklist) {
		int count = checkRepository.countByChecklistId((long)checklist.getChecklistId());

		if (count >= 5) {
			// RuntimeException의 하위 클래스 어떤 상태 조건이 충족되지 않았을 때 던지는 예외
			throw new IllegalStateException("체크리스트 항목은 최대 5개까지만 등록할 수 있습니다.");
		}
		CheckItem checkItem = CheckItem.builder()
			.checkContent(checklist.getCheckContent())
			.isCheck(false)
			.checklistId((long)checklist.getChecklistId())
			.build();

		checkRepository.save(checkItem);
		return true;
	}

	public String getGoal(int memberId) {
		return dashboardRepository.getGoal(memberId);
	}

	// public List<Map<String, Object>> getYearExerciseAvgInfo(int memberId, int exerciseYear) {
	// 	Member member = dashboardRepository.getBmr(memberId);
	//
	// 	int height = (int)member.getHeight();
	// 	int weight = (int)member.getWeight();
	//
	// 	int heightMin = (height / 10) * 10;
	// 	int heightMax = heightMin + 9;
	//
	// 	int weightMin = (weight / 10) * 10;
	// 	int weightMax = weightMin + 9;
	//
	// 	Map<String, Object> param = new HashMap<>();
	// 	param.put("memberId", memberId);
	// 	param.put("gender", member.getGender());
	// 	param.put("heightMin", heightMin);
	// 	param.put("heightMax", heightMax);
	// 	param.put("weightMin", weightMin);
	// 	param.put("weightMax", weightMax);
	// 	param.put("exerciseYear", exerciseYear);
	//
	// 	return dashboardRepository.getYearExerciseAvgInfo(param);
	// }
	//
	// public List<Map<String, Object>> getYearExerciseAvgAge(int memberId, int exerciseYear) {
	// 	Member member = dashboardRepository.getBmr(memberId);
	//
	// 	String birthday = member.getBirthday();
	// 	int age = getAge(birthday);
	//
	// 	int minAge = (age / 10) * 10;
	// 	int maxAge = minAge + 9;
	//
	// 	Map<String, Object> param = new HashMap<>();
	// 	param.put("memberId", memberId);
	// 	param.put("gender", member.getGender());
	// 	param.put("minAge", minAge);
	// 	param.put("maxAge", maxAge);
	// 	param.put("exerciseYear", exerciseYear);
	//
	// 	return dashboardRepository.getYearExerciseAvgAge(param);
	// }

	public List<Map<String, Object>> getYearExerciseAvgAll(int memberId, int exerciseYear) {
		Member member = dashboardRepository.getBmr(memberId);

		String birthday = member.getBirthday();
		int age = getAge(birthday);
		int height = (int)member.getHeight();
		int weight = (int)member.getWeight();

		int minAge = (age / 10) * 10;
		int maxAge = minAge + 9;

		int heightMin = (height / 10) * 10;
		int heightMax = heightMin + 9;

		int weightMin = (weight / 10) * 10;
		int weightMax = weightMin + 9;

		Map<String, Object> param = new HashMap<>();
		param.put("memberId", memberId);
		param.put("gender", member.getGender());
		param.put("minAge", minAge);
		param.put("maxAge", maxAge);
		param.put("heightMin", heightMin);
		param.put("heightMax", heightMax);
		param.put("weightMin", weightMin);
		param.put("weightMax", weightMax);
		param.put("exerciseYear", exerciseYear);

		return dashboardRepository.getYearExerciseAvgAll(param);
	}

	// public List<Map<String, Object>> getYearIntakeAvgInfo(int memberId, int intakeYear) {
	// 	Member member = dashboardRepository.getBmr(memberId);
	//
	// 	int height = (int)member.getHeight();
	// 	int weight = (int)member.getWeight();
	//
	// 	int heightMin = (height / 10) * 10;
	// 	int heightMax = heightMin + 9;
	//
	// 	int weightMin = (weight / 10) * 10;
	// 	int weightMax = weightMin + 9;
	//
	// 	Map<String, Object> param = new HashMap<>();
	// 	param.put("memberId", memberId);
	// 	param.put("gender", member.getGender());
	// 	param.put("heightMin", heightMin);
	// 	param.put("heightMax", heightMax);
	// 	param.put("weightMin", weightMin);
	// 	param.put("weightMax", weightMax);
	// 	param.put("intakeYear", intakeYear);
	//
	// 	return dashboardRepository.getYearIntakeAvgInfo(param);
	// }
	//
	// public List<Map<String, Object>> getYearIntakeAvgAge(int memberId, int intakeYear) {
	// 	Member member = dashboardRepository.getBmr(memberId);
	//
	// 	String birthday = member.getBirthday();
	// 	int age = getAge(birthday);
	// 	int height = (int)member.getHeight();
	// 	int weight = (int)member.getWeight();
	//
	// 	int minAge = (age / 10) * 10;
	// 	int maxAge = minAge + 9;
	//
	// 	Map<String, Object> param = new HashMap<>();
	// 	param.put("memberId", memberId);
	// 	param.put("gender", member.getGender());
	// 	param.put("minAge", minAge);
	// 	param.put("maxAge", maxAge);
	// 	param.put("intakeYear", intakeYear);
	//
	// 	return dashboardRepository.getYearIntakeAvgAge(param);
	// }

	public List<Map<String, Object>> getYearIntakeAvgAll(int memberId, int intakeYear) {
		Member member = dashboardRepository.getBmr(memberId);

		String birthday = member.getBirthday();
		int age = getAge(birthday);
		int height = (int)member.getHeight();
		int weight = (int)member.getWeight();

		int minAge = (age / 10) * 10;
		int maxAge = minAge + 9;

		int heightMin = (height / 10) * 10;
		int heightMax = heightMin + 9;

		int weightMin = (weight / 10) * 10;
		int weightMax = weightMin + 9;

		Map<String, Object> param = new HashMap<>();
		param.put("memberId", memberId);
		param.put("gender", member.getGender());
		param.put("minAge", minAge);
		param.put("maxAge", maxAge);
		param.put("heightMin", heightMin);
		param.put("heightMax", heightMax);
		param.put("weightMin", weightMin);
		param.put("weightMax", weightMax);
		param.put("intakeYear", intakeYear);

		return dashboardRepository.getYearIntakeAvgAll(param);
	}

}
