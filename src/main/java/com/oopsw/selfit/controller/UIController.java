package com.oopsw.selfit.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UIController {

	//account
	@GetMapping("/account/login")
	public String login() {
		return "account/login";
	}

	@GetMapping("/account/signup")
	public String signup() {
		return "account/signup";
	}

	@GetMapping("/account/mypage")
	public String mypage() {
		return "account/mypage";
	}

	@GetMapping("/account/mypage-update")
	public String mypageUpdate() {
		return "account/mypage-update";
	}

	//dashboard
	@GetMapping("/dashboard")
	public String dashboard() {
		return "dashboard/dashboard";
	}

	@GetMapping("/dashboard/checklist")
	public String checklist() {
		return "dashboard/checklist";
	}

	@GetMapping("/dashboard/food")
	public String food() {
		return "dashboard/food";
	}

	@GetMapping("/dashboard/exercise")
	public String exercise() {
		return "dashboard/exercise";
	}

	@GetMapping("dashboard/kcal")
	public String kcal() {
		return "dashboard/kcal";
	}

	//board
	@GetMapping("board/list")
	public String boardList() {
		return "board/board";
	}

	@GetMapping("board/deatail")
	public String deatail() {
		return "board/boardDeatail";
	}

	@GetMapping("board/write")
	public String write() {
		return "board/boardWrite";
	}

	@GetMapping("baord/set")
	public String set() {
		return "board/boardWrite";
	}
}
