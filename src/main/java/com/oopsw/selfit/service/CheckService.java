package com.oopsw.selfit.service;

import org.springframework.stereotype.Service;

import com.oopsw.selfit.domain.CheckItem;
import com.oopsw.selfit.dto.Checklist;
import com.oopsw.selfit.repository.CheckRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CheckService {

	private final CheckRepository checkRepository;

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
}
