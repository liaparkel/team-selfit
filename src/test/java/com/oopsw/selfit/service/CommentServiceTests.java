package com.oopsw.selfit.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.oopsw.selfit.domain.Comments;
import com.oopsw.selfit.dto.Comment;

@Transactional
@SpringBootTest
public class CommentServiceTests {

	@Autowired
	private CommentService commentService;

	@Test
	public void testGetCommentsYes() {
		// given: 데이터 준비
		Comment comment = Comment.builder()
			.commentContent("테스트 댓글")
			.boardId(1)
			.memberId(1)
			.build();
		commentService.addComment(comment);

		int boardId = 1;
		int page = 1;

		// when
		List<Comments> comments = commentService.getComments(boardId, page);

		// then
		assertNotNull(comments);
		assertTrue(comments.size() > 0);
	}

	@Test
	public void testGetCommentsInvalid() {
		// given
		int boardId = -999;
		int page = 1;

		// when
		List<Comments> comments = commentService.getComments(boardId, page);

		// then
		assertNotNull(comments); // null 아님
		assertEquals(0, comments.size());
	}

	@Test
	public void testAddCommentYes() {
		// given
		Comment comment = Comment.builder()
			.commentContent("JPA 댓글 저장 테스트")
			.boardId(1)
			.memberId(1)
			.build();

		// when
		boolean result = commentService.addComment(comment);

		// then
		assertTrue(result);
	}
}
