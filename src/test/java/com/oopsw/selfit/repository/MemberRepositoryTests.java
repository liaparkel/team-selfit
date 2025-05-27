package com.oopsw.selfit.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.oopsw.selfit.dto.Bookmark;
import com.oopsw.selfit.dto.LoginInfo;
import com.oopsw.selfit.dto.Member;

@SpringBootTest
@Transactional
public class MemberRepositoryTests {

	@Autowired
	private MemberRepository memberRepository;

	@Test
	public void testGetMemberYes() {
		//given

		//when
		Member member = memberRepository.getMember(1);

		//then
		assertEquals("kim.chulsoo@example.com", member.getEmail());
	}

	@Test
	public void testGetMemberInvalid() {
		//given

		//when
		Member member = memberRepository.getMember(-1);

		//then
		assertNull(member);
	}

	@Test
	public void testGetLoginInfoYes() {
		//given

		//when
		LoginInfo info = memberRepository.getLoginInfo("park.minsu@example.com");

		//then
		assertEquals(3, info.getMemberId());
	}

	@Test
	public void testGetLoginInfoInvalid() {
		//given

		//when
		LoginInfo info = memberRepository.getLoginInfo("invalid@example.com");

		//then
		assertNull(info);
	}

	// 이메일 중복 있음 (Yes)
	@Test
	public void testCheckExistEmailYes() {
		//given
		String existingEmail = "kim.chulsoo@example.com";

		//when
		String email = memberRepository.checkExistEmail(existingEmail);

		//then
		assertEquals(existingEmail, email);
	}

	// 이메일 중복 없음 (No)
	@Test
	public void testCheckExistEmailNotExist() {
		//given
		String nonExistingEmail = "not.exist@example.com";

		//when
		String email = memberRepository.checkExistEmail(nonExistingEmail);

		//then
		assertNull(email);
	}

	// 닉네임 중복 있음 (Yes)
	@Test
	public void testCheckExistNicknameYes() {
		//given
		String existingNickname = "chulsoo";

		//when
		String nickname = memberRepository.checkExistNickname(existingNickname);

		//then
		assertEquals(existingNickname, nickname);
	}

	// 닉네임 중복 없음 (No)
	@Test
	public void testCheckExistNicknameNotExist() {
		//given
		String nonExistingNickname = "no_such_nick";

		//when
		String nickname = memberRepository.checkExistNickname(nonExistingNickname);

		//then
		assertNull(nickname);
	}

	@Test
	public void testSetPasswordYes() {
		//given

		//when
		int result = memberRepository.setPw(1, "newPassword");

		//then
		assertEquals(1, result);
	}

	@Test
	public void testAddMemberYes() {
		//given
		Member member = Member.builder()
			.email("new@example.com")
			.pw("securepass")
			.name("김아무")
			.nickname("testnick")
			.gender("남성")
			.birthday("1999-01-01")
			.height(180.0f)
			.weight(75.0f)
			.goal("건강 유지")
			.joinDate("2025-05-26")
			.memberType("일반회원")
			.profileImg("img.jpg")
			.build();

		//when
		int result = memberRepository.addMember(member);

		//then
		assertEquals(1, result);
	}
	
	@Test
	public void testGetBookmarksPagedYes() {
		//given

		//when
		List<Bookmark> list = memberRepository.getBookmarks(1, 5, 0);

		//then
		assertTrue(list.size() <= 5);
	}

	//페이지당 n개일 때 n개 이하가 잘 나오는지 확인
	@Test
	public void testGetBookmarksPagedExactLimit() {
		//given
		int limit = 2;
		int offset = 0;

		//when
		List<Bookmark> list = memberRepository.getBookmarks(1, limit, offset);

		//then
		assertNotNull(list);
		assertTrue(list.size() <= limit);
	}

	//offset이 너무 커서 결과 없는지 확인
	@Test
	public void testGetBookmarksPagedOffsetOver() {
		//given
		int offset = 9999;

		//when
		List<Bookmark> list = memberRepository.getBookmarks(1, 5, offset);

		//then
		assertNotNull(list);
		assertEquals(0, list.size()); // offset이 너무 커서 결과 없음
	}

	@Test
	public void testGetBookmarksPagedInvalidMemberId() {
		//given

		//when
		List<Bookmark> list = memberRepository.getBookmarks(-1, 5, 0);

		//then
		assertTrue(list.isEmpty());
	}

	@Test
	public void testSetMemberYes() {
		//given
		Member member = memberRepository.getMember(1);
		member.setNickname("newNickname");
		System.out.println(member);
		System.out.println(member.getPw());

		//when
		int result = memberRepository.setMember(member);

		//then
		assertEquals(1, result);
	}

	@Test
	public void testSetMemberGoogleYes() {
		//given
		Member member = memberRepository.getMember(1);
		member.setNickname("googlenick");

		//when
		int updated = memberRepository.setMemberGoogle(member);

		//then
		assertEquals(1, updated);
	}

	@Test
	public void testRemoveMemberYes() {
		//given

		//when
		int deleted = memberRepository.removeMember(1);

		//then
		assertEquals(1, deleted);
	}

	@Test
	public void testRemoveMemberInvalid() {
		//given

		//when
		int deleted = memberRepository.removeMember(-1);

		//then
		assertEquals(0, deleted);
	}

}
