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
		return boardRepository.addBoard(board) > 0;
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
