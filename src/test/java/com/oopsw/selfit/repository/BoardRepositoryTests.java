package com.oopsw.selfit.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.oopsw.selfit.dto.Board;

@Transactional
@SpringBootTest
public class BoardRepositoryTests {

	@Autowired
	private BoardRepository boardRepository;

	@Test
	public void testGetCategoryYes() {
		// given : 데이터 준비

		// when: 실행
		List<Board> categories = boardRepository.getCategory();

		// then: 실행결과 체크
		assertNotNull(categories);
		assertTrue(categories.size() > 0);
	}

	@Test
	public void testGetBoardYes() {
		// given: 데이터 준비
		Board board = Board.builder().boardId(1).build();

		// when: 실행
		Board result = boardRepository.getBoard(board);

		// then: 실행결과 체크
		assertNotNull(result);
		assertEquals(1, result.getBoardId());
	}

	@Test
	public void testGetBoardInvalidId() {
		// given: 데이터 준비
		Board board = Board.builder().boardId(-999).build();

		// when: 실행
		Board result = boardRepository.getBoard(board);

		// then: 실행결과 체크
		assertNull(result);
	}

	@Test
	public void testGetBoardsYes() {
		// given: 데이터 준비
		Map<String, Object> params = new HashMap<>();
		params.put("categoryId", 1);
		params.put("searchKeyword", "");
		params.put("sortOrder", "recent");
		params.put("limit", 10);
		params.put("offset", 0);

		// when: 실행
		List<Board> boards = boardRepository.getBoards(params);

		// then: 실행결과 체크
		assertNotNull(boards);
	}

	@Test
	void testGetBoardUpdateYes() {
		// given: 데이터 준비
		Board board = Board.builder().boardId(1).build();

		// when: 실행
		Board result = boardRepository.getBoardUpdate(board);

		// then: 실행결과 체크
		assertNotNull(result);
		assertNotNull(result.getBoardTitle());
		assertNotNull(result.getCategoryName());
	}

	@Test
	void testGetBoardUpdateInvalid() {
		// given: 데이터 준비
		Board board = Board.builder().boardId(-999).build();

		// when: 실행
		Board result = boardRepository.getBoardUpdate(board);

		// then: 실행결과 체크
		assertNull(result);
	}

	@Test
	public void testAddBoardYes() {
		// given: 데이터 준비
		Board board = Board.builder()
			.boardTitle("테스트 제목")
			.boardContent("테스트 내용")
			.viewCount(0)
			.createdDate(null)
			.boardImg("test.jpg")
			.categoryId(1)
			.memberId(1)
			.build();

		// when: 실행
		int result = boardRepository.addBoard(board);

		// then: 실행결과 체크
		assertEquals(1, result);
	}

	@Test
	void testAddBookmarkYes() {
		// given: 데이터 준비
		Board board = Board.builder()
			.boardId(1)
			.memberId(1)
			.build();

		// when: 실행
		int inserted = boardRepository.addBookmark(board);

		// then: 실행결과 체크
		assertEquals(1, inserted);
	}

	@Test
	public void testUpdateBoardYes() {
		// given: 데이터 준비
		Board board = Board.builder()
			.boardId(1)
			.boardTitle("수정된 제목")
			.boardContent("수정된 내용")
			.boardImg("updated.jpg")
			.categoryId(1)
			.build();

		// when: 실행
		int result = boardRepository.setBoard(board);

		// then: 실행결과 체크
		assertEquals(1, result);
	}

	@Test
	public void testUpdateBoardInvalidId() {
		// given: 데이터 준비
		Board board = Board.builder()
			.boardId(-999)
			.boardTitle("수정 실패")
			.boardContent("내용")
			.boardImg("img.jpg")
			.categoryId(1)
			.build();

		// when: 실행
		int result = boardRepository.setBoard(board);

		// then: 실행결과 체크
		assertEquals(0, result);
	}

	@Test
	public void testRemoveBoardYes() {
		// given: 데이터 준비
		Board board = Board.builder().boardId(1).build();

		// when: 실행
		int result = boardRepository.removeBoard(board);

		// then: 실행결과 체크
		assertEquals(1, result);
	}

	@Test
	public void testRemoveBoardInvalid() {
		// given: 데이터 준비
		Board board = Board.builder().boardId(-999).build();

		// when: 실행
		int result = boardRepository.removeBoard(board);

		// then: 실행결과 체크
		assertEquals(0, result);
	}
}
