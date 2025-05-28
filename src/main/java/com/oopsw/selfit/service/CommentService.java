package com.oopsw.selfit.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.oopsw.selfit.dto.Comment;
import com.oopsw.selfit.repository.CommentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {
	private final CommentRepository commentRepository;

	public List<Comment> getComments(int boardId, int page) {
		int pageSize = 5;
		int offset = (page - 1) * pageSize;
		Map<String, Object> map = new HashMap<>();
		map.put("boardId", boardId);
		map.put("limit", pageSize);
		map.put("offset", offset);

		return commentRepository.getComments(map);
	}

	public boolean addComment(Comment comment) {
		return commentRepository.addComment(comment) > 0;
	}
}
