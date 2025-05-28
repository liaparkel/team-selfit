package com.oopsw.selfit.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.oopsw.selfit.domain.CheckItem;
import com.oopsw.selfit.dto.Checklist;
import com.oopsw.selfit.repository.CheckRepository;

@Transactional
@SpringBootTest
public class CheckServiceTests {

	@Autowired
	private CheckService checkService;

	@Autowired
	private CheckRepository checkRepository;

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

	@Test
	public void testRemoveCheckItemYes() {
		// given
		CheckItem checkItem = checkRepository.save(
			CheckItem.builder()
				.checkContent("삭제 테스트")
				.isCheck(false)
				.checklistId(1L)
				.build()
		);

		Checklist dto = Checklist.builder()
			.checkId(checkItem.getCheckId().intValue())
			.build();

		// when + then
		assertDoesNotThrow(() -> checkService.removeCheckItem(dto));
	}

	@Test
	public void testRemoveCheckItemInvalid() {
		// given: 존재하지 않는 checkId 사용
		Checklist dto = Checklist.builder()
			.checkId(99999)  // 없는 ID
			.build();

		// when + then
		assertThrows(IllegalArgumentException.class, () -> checkService.removeCheckItem(dto));
	}

	@Test
	public void testSetCheckItemYes() {
		// given
		CheckItem saved = checkRepository.save(
			CheckItem.builder()
				.checkContent("수정 전")
				.isCheck(false)
				.checklistId(1L)
				.build()
		);

		Checklist dto = Checklist.builder()
			.checkId(saved.getCheckId().intValue())
			.checkContent("수정 후")
			.build();

		// when
		boolean result = checkService.setCheckItem(dto);

		// then
		assertTrue(result);
		Optional<CheckItem> updated = checkRepository.findById(saved.getCheckId());
		assertEquals("수정 후", updated.get().getCheckContent());
	}

	@Test
	public void testSetCheckItemInvalid() {
		// given
		Checklist dto = Checklist.builder()
			.checkId(99999)
			.checkContent("수정 실패")
			.build();

		// when + then
		assertThrows(IllegalArgumentException.class, () -> checkService.setCheckItem(dto));
	}

	@Test
	public void testIsCheckItemYes() {
		// given
		CheckItem savedItem = checkRepository.save(
			CheckItem.builder()
				.checkContent("토글 테스트")
				.isCheck(false)
				.checklistId(1L)
				.build()
		);

		Checklist dto = Checklist.builder()
			.checkId(savedItem.getCheckId().intValue())  // Long → int 형변환
			.build();

		// when
		boolean result = checkService.isCheckItem(dto);

		// then
		assertTrue(result);
		Optional<CheckItem> updated = checkRepository.findById(savedItem.getCheckId());
		assertEquals(true, updated.get().getIsCheck());
	}

	@Test
	public void testIsCheckItemInvalid() {
		// given
		Checklist dto = Checklist.builder()
			.checkId(99999)
			.build();

		// when + then
		assertThrows(IllegalArgumentException.class, () -> checkService.isCheckItem(dto));
	}

}
