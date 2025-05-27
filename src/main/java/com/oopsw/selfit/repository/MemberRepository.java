package com.oopsw.selfit.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.oopsw.selfit.dto.Bookmark;
import com.oopsw.selfit.dto.LoginInfo;
import com.oopsw.selfit.dto.Member;

@Mapper
public interface MemberRepository {
	Member getMember(int memberId);

	LoginInfo getLoginInfo(String email);

	String checkExistEmail(String email);

	String checkExistNickname(String nickname);

	int setPw(int memberId, String newPw);

	int addMember(Member member);

	List<Bookmark> getBookmarks(int memberId, int limit, int offset);

	int setMember(Member newMember);

	int setMemberGoogle(Member newMember);

	int removeMember(int memberId);
}
