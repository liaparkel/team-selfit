package com.oopsw.selfit.auth;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.oopsw.selfit.dto.LoginInfo;
import com.oopsw.selfit.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final MemberRepository memberRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		LoginInfo loginInfo = memberRepository.getLoginInfo(email);
		
		User user = User.builder()
			.memberId(loginInfo.getMemberId())
			.email(email)
			.pw(loginInfo.getPw())
			.build();

		return new CustomUserDetails(user);
	}
}
