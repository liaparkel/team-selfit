package com.oopsw.selfit.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.oopsw.selfit.dto.Board;
import com.oopsw.selfit.dto.Comment;
import com.oopsw.selfit.service.BoardService;
import com.oopsw.selfit.service.CommentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/board")
public class BoardRestController {

	private final BoardService boardService;
	private final CommentService commentService;

	@GetMapping("/list")
	public ResponseEntity<List<Board>> getBoards(@RequestParam int page,
		@RequestParam int categoryId,
		@RequestParam(defaultValue = "") String keyword,
		@RequestParam(defaultValue = "recent") String sortOrder) {

		log.info("getBoards - page: {}, categoryId: {}, keyword: {}, sortOrder: {}", page, categoryId, keyword,
			sortOrder);
		List<Board> boards = boardService.getBoards(categoryId, keyword, sortOrder, page);
		return ResponseEntity.ok(boards);

	}

	@GetMapping("detail/{boardId}")
	public ResponseEntity<Board> getBoard(@PathVariable int boardId) {
		log.info("getBoard - boardId: {}", boardId);

		Board board = Board.builder()
			.boardId(boardId)
			.build();

		Board result = boardService.getBoard(board);
		return ResponseEntity.ok(result);
	}

	@GetMapping("/detail")
	public ResponseEntity<List<Comment>> getCommnets(@RequestParam int boardId, @RequestParam int page) {
		log.info("getCommnets - boardId: {}, page: {}", boardId, page);

		List<Comment> comments = commentService.getComments(boardId, page);
		return ResponseEntity.ok(comments);
	}

	@PostMapping("/add")
	public ResponseEntity<String> addBoard(@RequestBody Board board) {
		log.info("addBoard - board: {}", board);
		boardService.addBoard(board);
		return ResponseEntity.ok("게시글 등록 성공");
	}
}
