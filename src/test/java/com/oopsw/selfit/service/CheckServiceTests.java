package com.oopsw.selfit.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.oopsw.selfit.dto.Checklist;

@Transactional
@SpringBootTest
public class CheckServiceTests {

	@Autowired
	private CheckService checkService;

	@Test
	public void testAddCheckItemYes() {
		// given: 데이터 준비
		Checklist dto = Checklist.builder()
			.checklistId(1)
			.checkContent("물 마시기")
			.build();

		// when + then
		assertDoesNotThrow(() -> checkService.addCheckItem(dto));
	}

	@Test
	public void testAddCheckItemOverLimit() {
		// given: 데이터 준비
		Checklist dto = Checklist.builder()
			.checklistId(1)
			.checkContent("추가 항목")
			.build();

		// when + then
		assertThrows(IllegalStateException.class, () -> checkService.addCheckItem(dto));
	}
}
