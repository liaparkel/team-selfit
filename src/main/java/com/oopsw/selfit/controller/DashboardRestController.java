package com.oopsw.selfit.controller;

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
import com.oopsw.selfit.dto.Food;
import com.oopsw.selfit.service.CheckService;
import com.oopsw.selfit.service.DashboardService;
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

	@PostMapping("/checklist/items")
	public List<Checklist> getCheckList(@RequestBody Checklist checklist) {
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
	public int addChecklist(@RequestBody Checklist checklist) {
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
			.unitKcal(((Number) food.get("unitKcal")).intValue())
			.build();
		foodInfoService.addFoodInfo(f);
		return ResponseEntity.ok().body("OK");
	}

	@PostMapping("/foods")
	public List<Food> getFoodInfos(@RequestBody Map<String, Object> foods) {
		Food food=Food.builder().intakeDate((String)foods.get("intakeDate")).memberId((int)foods.get("memberId")).build();
		return foodInfoService.getFoodInfoList(food);
	}
}
