package com.oopsw.selfit.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.oopsw.selfit.dto.Bookmark;
import com.oopsw.selfit.dto.LoginInfo;
import com.oopsw.selfit.dto.Member;

@Mapper
public interface MemberRepository {
	Member getMember(@Param("memberId") int memberId);

	LoginInfo getLoginInfo(@Param("email") String email);

	String checkExistEmail(@Param("email") String email);

	String checkExistNickname(@Param("nickname") String nickname);

	int setPw(@Param("memberId") int memberId, @Param("newPw") String newPw);

	int addMember(Member member);

	List<Bookmark> getBookmarks(@Param("memberId") int memberId);

	List<Bookmark> getBookmarksPaged(@Param("memberId") int memberId, @Param("limit") int limit,
		@Param("offset") int offset);

	int setMember(Member newMember);

	int setMemberGoogle(Member newMember);

	int removeMember(@Param("memberId") int memberId);
}
