package com.oopsw.selfit.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.oopsw.selfit.dto.Bookmark;
import com.oopsw.selfit.dto.LoginInfo;
import com.oopsw.selfit.dto.Member;
import com.oopsw.selfit.repository.BoardRepository;
import com.oopsw.selfit.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class MemberService {

	private final MemberRepository memberRepository;
	private final BoardRepository boardRepository;
	private final BCryptPasswordEncoder encoder;

	public Member getMember(int memberId) {
		return memberRepository.getMember(memberId);
	}

	public LoginInfo getLoginInfo(String email) {
		return memberRepository.getLoginInfo(email);
	}

	public boolean checkPw(String email, String pw) {
		String encodedPw = memberRepository.getLoginInfo(email).getPw();
		return encoder.matches(pw, encodedPw);
	}

	public boolean isEmailExists(String email) {
		return memberRepository.checkExistEmail(email) != null;
	}

	public boolean isNicknameExists(String nickname) {
		return memberRepository.checkExistNickname(nickname) != null;
	}

	public boolean addMember(Member member) {

		if (!member.getMemberType().equals("DEFAULT")) {
			member.setPw(getRandomValue());
		}

		member.setPw(encoder.encode(member.getPw()));

		return memberRepository.addMember(member) > 0;
	}

	public List<Bookmark> getBookmarks(int memberId, int limit, int offset) {
		return boardRepository.getBookmarks(memberId, limit, offset);
	}

	public boolean setMember(Member newMember) {

		if (newMember.getPw() != null) {
			newMember.setPw(encoder.encode(newMember.getPw()));
			memberRepository.setPw(newMember.getMemberId(), newMember.getPw());
		}

		return memberRepository.setMember(newMember) > 0;
	}

	public boolean removeMember(int memberId) {
		return memberRepository.removeMember(memberId) > 0;
	}

	private String getRandomValue() {
		String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
		int random = (int)(Math.random() * 1_000_000);

		String randomStr = String.format("%06d", random);
		return randomStr + "_" + time;
	}
}
