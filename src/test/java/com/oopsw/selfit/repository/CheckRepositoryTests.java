package com.oopsw.selfit.repository;

import static org.junit.jupiter.api.Assertions.*;

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
	public void testAddCheckItemJpaYes() {
		// given
		CheckItem item = CheckItem.builder()
			.checkContent("물 마시기")
			.isCheck(false)
			.checklistId(1L)  // CHECKLIST_JPA 테이블에 1번 ID가 존재한다고 가정
			.build();

		// when
		CheckItem saved = checkRepository.save(item);

		// then
		assertNotNull(saved.getCheckId(), "저장 후 ID가 null이 아니어야 한다");
		assertEquals("물 마시기", saved.getCheckContent());
	}

	// Check_Item 삭제

	// Check_Item 상태
}
