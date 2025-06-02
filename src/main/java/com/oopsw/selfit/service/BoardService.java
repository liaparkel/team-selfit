package com.oopsw.selfit.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.oopsw.selfit.dto.Board;
import com.oopsw.selfit.repository.BoardRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardService {
	private final BoardRepository boardRepository;

	public List<Board> getCategory() {
		return boardRepository.getCategory();
	}

	public Board getBoard(Board board) {
		return boardRepository.getBoard(board);
	}

	public List<Board> getBoards(int categoryId, String keyword, String sortOrder, int page) {
		int pageSize = 10;
		int offset = (page - 1) * pageSize;
		Map<String, Object> map = new HashMap<>();
		map.put("categoryId", categoryId);
		map.put("searchKeyword", keyword == null ? "" : keyword);
		map.put("sortOrder", sortOrder == null ? "recent" : sortOrder);
		map.put("limit", pageSize);
		map.put("offset", offset);
		return boardRepository.getBoards(map);
	}

	public Board getBoardUpdate(Board board) {
		return boardRepository.getBoardUpdate(board);
	}

	public boolean addBoard(Board board) {
		System.out.println(board);
		// 1. 유효성 검증
		if (board.getBoardTitle() == null || board.getBoardTitle().isBlank()) {
			throw new IllegalArgumentException("제목은 필수입니다.");
		}
		if (board.getBoardContent() == null || board.getBoardContent().isBlank()) {
			throw new IllegalArgumentException("내용은 필수입니다.");
		}
		if (board.getCategoryId() == 0) {
			throw new IllegalArgumentException("카테고리를 선택해주세요.");
		}

		// 2. 저장
		int result = boardRepository.addBoard(board);
		if (result <= 0) {
			throw new IllegalStateException("게시글 등록에 실패했습니다.");
		}
		return true;
	}

	public boolean toggleBookmark(Board board) {
		int count = boardRepository.getBookmarkCount(board);

		if (count == 0) {
			boardRepository.addBookmark(board);
			return true;
		} else {
			boardRepository.removeBookmark(board);
			return false;
		}
	}

	public boolean setBoard(Board board) {
		return boardRepository.setBoard(board) > 0;
	}

	public boolean removeBoard(Board board) {
		return boardRepository.removeBoard(board) > 0;
	}
}
