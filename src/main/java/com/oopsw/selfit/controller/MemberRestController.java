package com.oopsw.selfit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.oopsw.selfit.auth.CustomUserDetails;
import com.oopsw.selfit.dto.Bookmark;
import com.oopsw.selfit.dto.Member;
import com.oopsw.selfit.service.MemberService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/account")
public class MemberRestController {

	private static final int PAGE_LIMIT = 5;
	private static Gson gson = new Gson();
	private final MemberService memberService;

	@GetMapping("/member")
	public ResponseEntity<Member> getMember(@AuthenticationPrincipal CustomUserDetails userDetails) {
		return ResponseEntity.ok(memberService.getMember(userDetails.getMemberId()));
	}

	@PostMapping("/member")
	public ResponseEntity<Map<String, Boolean>> addMember(@RequestBody Member member) {
		return ResponseEntity.ok(Map.of("success", memberService.addMember(member)));
	}

	@PutMapping("/member")
	public ResponseEntity<Boolean> setMember(@RequestBody Member member) {
		return ResponseEntity.ok(memberService.setMember(member));
	}

	@DeleteMapping("/member")
	public ResponseEntity<Boolean> removeMember(@AuthenticationPrincipal CustomUserDetails userDetails) {
		return ResponseEntity.ok(memberService.removeMember(userDetails.getMemberId()));
	}

	@PostMapping("/check-email")
	public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestBody String jsonData) {
		String email = gson.fromJson(jsonData, JsonObject.class)
			.get("email")
			.getAsString();

		return ResponseEntity.ok(Map.of("result", memberService.isEmailExists(email)));
	}

	@PostMapping("/check-nickname")
	public ResponseEntity<Map<String, Boolean>> checkNickname(@RequestBody String jsonData) {
		String nickname = gson.fromJson(jsonData, JsonObject.class)
			.get("nickname")
			.getAsString();

		return ResponseEntity.ok(Map.of("result", memberService.isNicknameExists(nickname)));
	}

	@PostMapping("/member/check-pw")
	public ResponseEntity<Boolean> checkPw(@AuthenticationPrincipal CustomUserDetails userDetails,
		@RequestBody String pw) {
		String email = userDetails.getUsername();
		return ResponseEntity.ok(memberService.checkPw(email, pw));
	}

	@GetMapping("/member/bookmarks")
	public ResponseEntity<List<Bookmark>> getBookmarks(@AuthenticationPrincipal CustomUserDetails userDetails,
		@RequestBody int offset) {
		return ResponseEntity.ok(memberService.getBookmarks(userDetails.getMemberId(), PAGE_LIMIT, offset));
	}

}
