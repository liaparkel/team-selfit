package com.oopsw.selfit.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.oopsw.selfit.dto.Comment;

@Transactional
@SpringBootTest
public class CommentRepositoryTests {

	@Autowired
	private CommentRepository commentRepository;

	@Test
	void testGetCommentsYes() {
		// given: 데이터 준비
		Map<String, Object> map = new HashMap<>();
		map.put("boardId", 1);  // 댓글이 존재할 수 있는 게시글
		map.put("limit", 10);
		map.put("offset", 0);

		// when: 실행
		List<Comment> comments = commentRepository.getComments(map);

		// then: 실행결과 체크
		assertNotNull(comments);
	}

	@Test
	void testGetCommentsInvalidBoardId() {
		// given: 데이터 준비
		Map<String, Object> map = new HashMap<>();
		map.put("boardId", -999); // 존재하지 않는 게시글
		map.put("limit", 10);
		map.put("offset", 0);

		// when: 실행
		List<Comment> comments = commentRepository.getComments(map);

		// then: 실행결과 체크
		assertNotNull(comments); // 실패 아님. 빈 리스트 가능
		assertEquals(0, comments.size());
	}

	@Test
	void testAddCommentYes() {
		// given: 데이터 준비
		Comment comment = Comment.builder()
			.commentContent("테스트 댓글입니다.")
			.commentDate(null)
			.boardId(1)
			.memberId(1)
			.build();

		// when: 실행
		int result = commentRepository.addComment(comment);

		// then: 실행결과 체크
		assertEquals(1, result);
	}
}
