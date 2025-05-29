package com.oopsw.selfit.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.oopsw.selfit.domain.CheckItem;

@Transactional
@SpringBootTest
public class CheckRepositoryTests {
	@Autowired
	private CheckRepository checkRepository;

	// Check_Item 등록
	@Test
	public void testAddCheckItemYes() {
		// given
		CheckItem item = CheckItem.builder()
			.checkContent("창훈이 10kg 빼기")
			.isCheck(false)
			.checklistId(7L)  // CHECKLIST_JPA 테이블에 1번 ID가 존재한다고 가정
			.build();

		// when
		CheckItem saved = checkRepository.save(item);

		// then
		assertNotNull(saved.getCheckId(), "저장 후 ID가 null이 아니어야 한다");
		assertEquals("창훈이 10kg 빼기", saved.getCheckContent());
	}

	// Check_Item 삭제
	@Test
	public void testRemoveCheckItemYes() {
		// given
		Long checkId = 7L;

		// when
		checkRepository.deleteById(checkId);

		// then
		Optional<CheckItem> result = checkRepository.findById(checkId);
		assertFalse(result.isPresent(), "삭제 후 해당 체크 항목은 없어야 한다");
	}

	@Test
	public void testRemoveCheckItemInvalid() {
		// given
		Long invalidCheckId = -1L;

		// when
		assertDoesNotThrow(() -> checkRepository.deleteById(invalidCheckId));

		// then
		Optional<CheckItem> result = checkRepository.findById(invalidCheckId);
		assertFalse(result.isPresent(), "존재하지 않는 ID를 삭제해도 예외는 없어야 하고, 결과도 없어야 한다");
	}

	// Check_Item 수정
	@Test
	public void testSetCheckItemYes() {
		// given
		Long checkId = 7L;
		Optional<CheckItem> itemOpt = checkRepository.findById(checkId);
		assertTrue(itemOpt.isPresent(), "수정할 체크 항목이 존재해야 함");

		CheckItem item = itemOpt.get();
		item.setCheckContent("수정");

		// when
		checkRepository.save(item);

		// then
		CheckItem updated = checkRepository.findById(checkId).orElseThrow();
		assertEquals("수정", updated.getCheckContent(), "체크 내용이 '수정'으로 바뀌어야 함");
	}

	@Test
	public void testSetCheckItemInvalid() {
		// given
		Long invalidCheckId = -1L;
		Optional<CheckItem> itemOpt = checkRepository.findById(invalidCheckId);

		// when & then
		assertFalse(itemOpt.isPresent(), "존재하지 않는 체크 항목이어야 한다");

		// 존재하지 않기 때문에 save 전까지는 동작하지 않음. 실제 수정은 생략함.
	}

	// Check_Item 상태 토글
	@Test
	public void testIsCheckItemYes() {
		// given
		Long checkId = 7L;

		// when
		Optional<CheckItem> itemOpt = checkRepository.findById(checkId);
		assertTrue(itemOpt.isPresent(), "체크 항목이 존재해야 함");

		CheckItem checkItem = itemOpt.get();
		Boolean oldStatus = checkItem.getIsCheck();

		checkItem.setIsCheck(!oldStatus);
		checkRepository.save(checkItem);

		// then
		CheckItem updated = checkRepository.findById(checkId).get();
		assertEquals(!oldStatus, updated.getIsCheck());
	}

	@Test
	public void testIsCheckItemInvalid() {
		// given
		Long checkId = 7L;

		// when
		Optional<CheckItem> itemOpt = checkRepository.findById(checkId);
		assertTrue(itemOpt.isPresent(), "체크 항목이 존재해야 함");

		CheckItem checkItem = itemOpt.get();
		Boolean oldStatus = checkItem.getIsCheck();

		checkItem.setIsCheck(!oldStatus);
		checkRepository.save(checkItem);

		// then
		CheckItem updated = checkRepository.findById(checkId).get();
		assertEquals(!oldStatus, updated.getIsCheck());
	}
}
