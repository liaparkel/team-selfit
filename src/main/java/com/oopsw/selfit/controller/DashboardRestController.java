package com.oopsw.selfit.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oopsw.selfit.auth.AuthenticatedUser;
import com.oopsw.selfit.dto.Checklist;
import com.oopsw.selfit.dto.Exercise;
import com.oopsw.selfit.dto.Food;
import com.oopsw.selfit.dto.FoodApi;
import com.oopsw.selfit.dto.Member;
import com.oopsw.selfit.service.CheckService;
import com.oopsw.selfit.service.DashboardService;
import com.oopsw.selfit.service.FoodApiService;
import com.oopsw.selfit.service.ExerciseInfoService;
import com.oopsw.selfit.service.FoodInfoService;
import com.oopsw.selfit.service.MemberService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardRestController {
	private final DashboardService dashboardService;
	private final MemberService memberService;
	private final FoodInfoService foodInfoService;
	private final CheckService checkService;
	private final FoodApiService foodApiService;

	@PostMapping("/food/openSearch")
	public Mono<List<FoodApi>> openFoodSearch(@RequestBody Map<String, Object> payload) {
		String keyword = (String) payload.get("keyword");
		int pageNo   = ((Number) payload.get("pageNo")).intValue();
		int numOfRows= ((Number) payload.get("numOfRows")).intValue();
		return foodApiService.getFoodByNameLike(keyword, pageNo, numOfRows);
	}
	private final ExerciseInfoService exerciseInfoService;

	@PostMapping("/bmr")
	public int getBmr(@RequestBody Member member) {
		return dashboardService.getBmr(member.getMemberId());
	}

	@PostMapping("/food/kcal")
	public Food getIntakeKcal(@RequestBody Food food) {
		return dashboardService.getIntakeKcal(food);
	}

	@PostMapping("/exercise/kcal")
	public Exercise getExerciseKcal(@RequestBody Exercise exercise) {
		return dashboardService.getExerciseKcal(exercise);
	}

	@PostMapping("/food/kcal/year")
	public List<Food> getYearIntakeKcal(@RequestBody Map<String, Object> param) {
		HashMap<String, Object> map = new HashMap<>();
		map.put("memberId", ((Number)param.get("memberId")).intValue());
		map.put("intakeYear", ((Number)param.get("intakeYear")).intValue());

		return dashboardService.getYearIntakeKcal(map);
	}

	@PostMapping("/exercise/kcal/year")
	public List<Exercise> getYearExerciseKcal(@RequestBody Map<String, Object> param) {
		HashMap<String, Object> map = new HashMap<>();
		map.put("memberId", ((Number)param.get("memberId")).intValue());
		map.put("exerciseYear", ((Number)param.get("exerciseYear")).intValue());

		return dashboardService.getYearExerciseKcal(map);
	}

	@PostMapping("/food/list")
	public int addFoodList(@RequestBody Food food) {
		return dashboardService.addFoodList(food);
	}

	@DeleteMapping("/food/list")
	public boolean removeFoodList(@RequestBody Food food) {
		return dashboardService.removeFoodList(food);
	}

	@PostMapping("/exercise/list")
	public int addExerciseList(@RequestBody Exercise exercise) {
		return dashboardService.addExerciseList(exercise);
	}

	@DeleteMapping("/exercise/list")
	public boolean removeExerciseList(@RequestBody Exercise exercise) {
		return dashboardService.removeExerciseList(exercise);
	}

	@PostMapping("/goal")
	public String getGoal(@RequestBody Member member) {
		return dashboardService.getGoal(member.getMemberId());
	}

	@PostMapping("/food/kcal/avg/year")
	public List<Map<String, Object>> getYearIntakeAvgAll(@RequestBody Map<String, Integer> param) {
		int memberId = param.get("memberId");
		int intakeYear = param.get("intakeYear");
		return dashboardService.getYearIntakeAvgAll(memberId, intakeYear);
	}

	@PostMapping("/exercise/kcal/avg/year")
	public List<Map<String, Object>> getYearExerciseAvgAll(@RequestBody Map<String, Integer> param) {
		int memberId = param.get("memberId");
		int exerciseYear = param.get("exerciseYear");
		return dashboardService.getYearExerciseAvgAll(memberId, exerciseYear);
	}

	@PostMapping("/checklist/items")
	public List<Checklist> getCheckList(@RequestBody Checklist checklist, @AuthenticationPrincipal AuthenticatedUser loginUser) {
		checklist.setMemberId(loginUser.getMemberId());
		return dashboardService.getCheckList(checklist);
	}

	@PutMapping("/checklist/item")
	public boolean setCheckItem(@RequestBody Checklist checklist) {
		return checkService.setCheckItem(checklist);
	}

	@PutMapping("/checklist/item/check")
	public boolean setIsCheckItem(@RequestBody Checklist checklist) {
		return checkService.setIsCheckItem(checklist);
	}

	@DeleteMapping("/checklist/item")
	public boolean removeCheckItem(@RequestBody Checklist checklist) {
		return checkService.removeCheckItem(checklist);
	}

	@PostMapping("/checklist")
	public int addChecklist(@RequestBody Checklist checklist, @AuthenticationPrincipal AuthenticatedUser loginUser) {
		checklist.setMemberId(loginUser.getMemberId());
		return dashboardService.addChecklist(checklist);
	}

	@PostMapping("/checklist/item")
	public boolean addCheckItem(@RequestBody Checklist checklist) {
		return checkService.addCheckItem(checklist);
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
	public List<Food> getFoodInfos(@RequestBody Map<String, Object> foods) {
		Food food=Food.builder()
			.intakeDate((String)foods.get("intakeDate"))
			.memberId((int)foods.get("memberId"))
			.build();
		return foodInfoService.getFoodInfoList(food);
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
		Exercise e=Exercise.builder()
			.exerciseNoteId((int)exerciseInfo.get("exerciseNoteId"))
			.exerciseMin((int)exerciseInfo.get("exerciseMin"))
			.exerciseName((String)exerciseInfo.get("exerciseName"))
			.met(((Number) exerciseInfo.get("met")).floatValue())
			.build();
		exerciseInfoService.addExerciseInfo(e);
		return ResponseEntity.ok().body("OK");
	}

	@PostMapping("/exercises")
	public List<Exercise> getExerciseInfos(@RequestBody Map<String, Object> exercises) {
		Exercise exercise = Exercise.builder()
			.exerciseDate((String)exercises.get("exerciseDate"))
			.memberId((int)exercises.get("memberId"))
			.build();
		return exerciseInfoService.getExerciseInfoList(exercise);
	}

}
