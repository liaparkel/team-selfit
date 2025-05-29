package com.oopsw.selfit.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.oopsw.selfit.domain.Comments;
import com.oopsw.selfit.dto.Board;
import com.oopsw.selfit.dto.Comment;
import com.oopsw.selfit.repository.BoardRepository;
import com.oopsw.selfit.repository.CommentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {
	private final CommentRepository commentRepository;
	private final BoardRepository boardRepository;

	public List<Comments> getComments(int boardId, int page) {
		int pageSize = 5;
		Pageable pageable = PageRequest.of(page - 1, pageSize); // 1페이지부터 시작하려면 -1
		return commentRepository.findByBoardIdOrderByCommentCreatedDateDesc((long)boardId, pageable);
	}

	public boolean addComment(Comment comment) {
		// 게시글 존재 여부 확인
		Board board = Board.builder()
			.boardId(comment.getBoardId())
			.build();

		if (boardRepository.getBoard(board) == null) {
			throw new IllegalArgumentException("존재하지 않는 게시글입니다.");
		}
		// 댓글 저장
		Comments entity = Comments.builder()
			.commentContent(comment.getCommentContent())
			.boardId((long)comment.getBoardId())
			.memberId((long)comment.getMemberId())
			.build();

		commentRepository.save(entity);
		return true;
	}
}
