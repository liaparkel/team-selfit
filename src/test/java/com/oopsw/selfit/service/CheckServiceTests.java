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
	public void testAddCheckItem() {
		// given: 체크리스트 ID가 1번이라고 가정 (DB에 반드시 있어야 함)
		Checklist checklistDto = Checklist.builder()
			.checklistId(1)  // FK (checklist 테이블에 1번 ID가 있어야 함)
			.checkContent("물 마시기")
			.build();

		// when
		Checklist savedDto = checkService.addCheckItem(checklistDto);

		// then
		assertEquals("물 마시기", savedDto.getCheckContent());

	}
}
