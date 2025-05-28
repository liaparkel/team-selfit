package com.oopsw.selfit.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.oopsw.selfit.dto.Comment;

@Transactional
@SpringBootTest
public class CommentServiceTests {

	@Autowired
	private CommentService commentService;

	@Test
	public void testGetCommentsYes() {
		// given: 데이터 준비
		int boardId = 1;
		int page = 1;

		// when: 실행
		List<Comment> comments = commentService.getComments(boardId, page);

		// then: 실행결과 체크
		assertNotNull(comments);
		assertTrue(comments.size() > 0);
	}

	@Test
	public void testGetCommentsInvalid() {
		// given: 데이터 준비
		int boardId = -999;
		int page = 1;

		// when: 실행
		List<Comment> comments = commentService.getComments(boardId, page);

		// then: 실행결과 체크
		assertNotNull(comments);
		assertEquals(0, comments.size());
	}

	@Test
	public void testAddCommentYes() {
		// given: 데이터 준비
		Comment comment = Comment.builder()
			.commentContent("테스트 댓글입니다.")
			.commentDate(null)
			.boardId(1)
			.memberId(1)
			.build();

		// when: 실행
		boolean result = commentService.addComment(comment);

		// then: 실행결과 체크
		assertTrue(result);

	}
}
