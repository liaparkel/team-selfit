package com.oopsw.selfit.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oopsw.selfit.dto.Checklist;
import com.oopsw.selfit.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardRestController {
	private final DashboardService dashboardService;

	@PostMapping("/checklist/items")
	public List<Checklist> getCheckList(@RequestBody Checklist checklist) {
		return dashboardService.getCheckList(checklist);
	}

	// @PutMapping("/checklist/item")
	// public boolean setCheckItem(@RequestBody Checklist checklist) {
	// 	return dashboardService.setCheckItem(checklist);
	// }
	//
	// @PutMapping("/checklist/item/check")
	// public boolean setIsCheckItem(@RequestBody Checklist checklist) {
	// 	return dashboardService.setIsCheckItem(checklist);
	// }
	//
	// @DeleteMapping("/checklist/item")
	// public boolean removeCheckItem(@RequestBody Checklist checklist) {
	// 	return dashboardService.removeCheckItem(checklist);
	// }
	//
	// @PostMapping("/checklist")
	// public boolean addChecklist(@RequestBody Checklist checklist) {
	// 	return dashboardService.addChecklist(checklist);
	// }
	//
	// @PostMapping("/checklist/item")
	// public boolean addCheckItem(@RequestBody Checklist checklist) {
	// 	return dashboardService.addCheckItem(checklist);
	// }

}
