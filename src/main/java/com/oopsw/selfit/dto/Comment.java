package com.oopsw.selfit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Comment {
	private int memberId;
	private int boardId;
	private int commentId;
	private String commentDate;
	private String commentContent;
	private String nickName;
}
