package com.oopsw.selfit.repository;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.oopsw.selfit.dto.Comment;

@Mapper
public interface CommentRepository {
	List<Comment> getComments(Map<String, Object> map);

	int addComment(Comment comment);
}