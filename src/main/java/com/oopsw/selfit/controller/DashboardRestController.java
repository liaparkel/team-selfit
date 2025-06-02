package com.oopsw.selfit.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oopsw.selfit.dto.Checklist;
import com.oopsw.selfit.dto.Exercise;
import com.oopsw.selfit.dto.Food;
import com.oopsw.selfit.dto.Member;
import com.oopsw.selfit.service.CheckService;
import com.oopsw.selfit.service.DashboardService;
import com.oopsw.selfit.service.ExerciseInfoService;
import com.oopsw.selfit.service.FoodInfoService;
import com.oopsw.selfit.service.MemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardRestController {
	private final DashboardService dashboardService;
	private final MemberService memberService;
	private final FoodInfoService foodInfoService;
	private final CheckService checkService;
	private final ExerciseInfoService exerciseInfoService;

	@PostMapping("/bmr")
	public ResponseEntity<Integer> getBmr(@RequestBody Member member) {
		return ResponseEntity.ok(dashboardService.getBmr(member.getMemberId()));
	}

	@PostMapping("/food/kcal")
	public ResponseEntity<Food> getIntakeKcal(@RequestBody Food food) {
		return ResponseEntity.ok(dashboardService.getIntakeKcal(food));
	}

	@PostMapping("/exercise/kcal")
	public ResponseEntity<Exercise> getExerciseKcal(@RequestBody Exercise exercise) {
		return ResponseEntity.ok(dashboardService.getExerciseKcal(exercise));
	}

	@PostMapping("/food/kcal/year")
	public ResponseEntity<List<Food>> getYearIntakeKcal(@RequestBody Map<String, Object> param) {
		HashMap<String, Object> map = new HashMap<>();
		map.put("memberId", ((Number)param.get("memberId")).intValue());
		map.put("intakeYear", ((Number)param.get("intakeYear")).intValue());

		return ResponseEntity.ok(dashboardService.getYearIntakeKcal(map));
	}

	@PostMapping("/exercise/kcal/year")
	public ResponseEntity<List<Exercise>> getYearExerciseKcal(@RequestBody Map<String, Object> param) {
		HashMap<String, Object> map = new HashMap<>();
		map.put("memberId", ((Number)param.get("memberId")).intValue());
		map.put("exerciseYear", ((Number)param.get("exerciseYear")).intValue());

		return ResponseEntity.ok(dashboardService.getYearExerciseKcal(map));
	}

	@PostMapping("/food/list")
	public ResponseEntity<Integer> addFoodList(@RequestBody Food food) {
		return ResponseEntity.ok(dashboardService.addFoodList(food));
	}

	@DeleteMapping("/food/list")
	public ResponseEntity<Boolean> removeFoodList(@RequestBody Food food) {
		return ResponseEntity.ok(dashboardService.removeFoodList(food));
	}

	@PostMapping("/exercise/list")
	public ResponseEntity<Integer> addExerciseList(@RequestBody Exercise exercise) {
		return ResponseEntity.ok(dashboardService.addExerciseList(exercise));
	}

	@DeleteMapping("/exercise/list")
	public ResponseEntity<Boolean> removeExerciseList(@RequestBody Exercise exercise) {
		return ResponseEntity.ok(dashboardService.removeExerciseList(exercise));
	}

	@PostMapping("/goal")
	public ResponseEntity<String> getGoal(@RequestBody Member member) {
		return ResponseEntity.ok(dashboardService.getGoal(member.getMemberId()));
	}

	@PostMapping("/food/kcal/avg/year")
	public ResponseEntity<List<Map<String, Object>>> getYearIntakeAvgAll(@RequestBody Map<String, Integer> param) {
		int memberId = param.get("memberId");
		int intakeYear = param.get("intakeYear");
		return ResponseEntity.ok(dashboardService.getYearIntakeAvgAll(memberId, intakeYear));
	}

	@PostMapping("/exercise/kcal/avg/year")
	public ResponseEntity<List<Map<String, Object>>> getYearExerciseAvgAll(@RequestBody Map<String, Integer> param) {
		int memberId = param.get("memberId");
		int exerciseYear = param.get("exerciseYear");
		return ResponseEntity.ok(dashboardService.getYearExerciseAvgAll(memberId, exerciseYear));
	}

	@PostMapping("/checklist/items")
	public ResponseEntity<List<Checklist>> getCheckList(@RequestBody Checklist checklist) {
		return ResponseEntity.ok(dashboardService.getCheckList(checklist));
	}

	@PutMapping("/checklist/item")
	public ResponseEntity<Boolean> setCheckItem(@RequestBody Checklist checklist) {
		return ResponseEntity.ok(checkService.setCheckItem(checklist));
	}

	@PutMapping("/checklist/item/check")
	public ResponseEntity<Boolean> setIsCheckItem(@RequestBody Checklist checklist) {
		return ResponseEntity.ok(checkService.setIsCheckItem(checklist));
	}

	@DeleteMapping("/checklist/item")
	public ResponseEntity<Boolean> removeCheckItem(@RequestBody Checklist checklist) {
		return ResponseEntity.ok(checkService.removeCheckItem(checklist));
	}

	@PostMapping("/checklist")
	public ResponseEntity<Integer> addChecklist(@RequestBody Checklist checklist) {
		return ResponseEntity.ok(dashboardService.addChecklist(checklist));
	}

	@PostMapping("/checklist/item")
	public ResponseEntity<Boolean> addCheckItem(@RequestBody Checklist checklist) {
		return ResponseEntity.ok(checkService.addCheckItem(checklist));
	}

	@DeleteMapping("/food")
	public ResponseEntity<String> removeFoodInfo(@RequestBody Map<String, Integer> foodInfoId) {
		foodInfoService.removeFood(foodInfoId.get("foodInfoId"));
		return ResponseEntity.ok().body("OK");
	}

	@PutMapping("/food")
	public ResponseEntity<String> setIntake(@RequestBody Map<String, Integer> food) {
		foodInfoService.setIntake(food.get("foodInfoId"), food.get("newIntake"));
		return ResponseEntity.ok().body("OK");
	}

	@PostMapping("/food")
	public ResponseEntity<String> addFoodInfo(@RequestBody Map<String, Object> food) {
		Food f = Food.builder()
			.foodNoteId((int)food.get("foodNoteId"))
			.foodName((String)food.get("foodName"))
			.intake((int)food.get("intake"))
			.unitKcal(((Number)food.get("unitKcal")).intValue())
			.build();
		foodInfoService.addFoodInfo(f);
		return ResponseEntity.ok().body("OK");
	}

	@PostMapping("/foods")
	public ResponseEntity<List<Food>> getFoodInfos(@RequestBody Map<String, Object> foods) {
		Food food = Food.builder()
			.intakeDate((String)foods.get("intakeDate"))
			.memberId((int)foods.get("memberId"))
			.build();
		return ResponseEntity.ok(foodInfoService.getFoodInfoList(food));
	}

	@DeleteMapping("/exercise")
	public ResponseEntity<String> removeExerciseInfo(@RequestBody Map<String, Integer> exerciseInfoId) {
		exerciseInfoService.removeExercise(exerciseInfoId.get("exerciseInfoId"));
		return ResponseEntity.ok().body("OK");
	}

	@PutMapping("/exercise")
	public ResponseEntity<String> setExerciseMin(@RequestBody Map<String, Integer> exerciseInfo) {
		exerciseInfoService.setExerciseMin(exerciseInfo.get("exerciseInfoId"), exerciseInfo.get("newMin"));
		return ResponseEntity.ok().body("OK");
	}

	@PostMapping("/exercise")
	public ResponseEntity<String> addExerciseInfo(@RequestBody Map<String, Object> exerciseInfo) {
		Exercise e = Exercise.builder()
			.exerciseNoteId((int)exerciseInfo.get("exerciseNoteId"))
			.exerciseMin((int)exerciseInfo.get("exerciseMin"))
			.exerciseName((String)exerciseInfo.get("exerciseName"))
			.met(((Number)exerciseInfo.get("met")).floatValue())
			.build();
		exerciseInfoService.addExerciseInfo(e);
		return ResponseEntity.ok().body("OK");
	}

	@PostMapping("/exercises")
	public ResponseEntity<List<Exercise>> getExerciseInfos(@RequestBody Map<String, Object> exercises) {
		Exercise exercise = Exercise.builder()
			.exerciseDate((String)exercises.get("exerciseDate"))
			.memberId((int)exercises.get("memberId"))
			.build();
		return ResponseEntity.ok(exerciseInfoService.getExerciseInfoList(exercise));
	}

}
