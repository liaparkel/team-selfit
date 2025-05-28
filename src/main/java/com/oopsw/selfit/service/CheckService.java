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

	public Checklist addCheckItem(Checklist checklist) {
		CheckItem checkItem = checkRepository.save(
			CheckItem.builder()
				.checkContent(checklist.getCheckContent())
				.isCheck(false)
				.checklistId((long)checklist.getChecklistId())
				.build()
		);

		return Checklist.builder()
			.checkId(checkItem.getCheckId().intValue())
			.checkContent(checkItem.getCheckContent())
			.isCheck(checkItem.getIsCheck() ? 1 : 0)
			.checklistId(checkItem.getChecklistId().intValue())
			.build();
	}
}
