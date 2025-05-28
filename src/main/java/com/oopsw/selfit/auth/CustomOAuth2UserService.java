package com.oopsw.selfit.auth;

import java.util.Map;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.oopsw.selfit.dto.LoginInfo;
import com.oopsw.selfit.repository.MemberRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

	private final MemberRepository memberRepository;
	private final HttpSession session;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oAuth2User = super.loadUser(userRequest);
		String registrationId = userRequest.getClientRegistration().getRegistrationId(); // google, etc.
		String userNameAttributeName = userRequest.getClientRegistration()
			.getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

		Map<String, Object> attributes = oAuth2User.getAttributes();
		System.out.println(attributes);
		
		String email = (String)attributes.get("email");

		LoginInfo loginInfo = memberRepository.getLoginInfo(email);
		if (loginInfo == null) {
			throw new OAuth2AuthenticationException("NEED_REGISTRATION");
		}

		User user = User.builder()
			.memberId(loginInfo.getMemberId())
			.email(email)
			.pw(loginInfo.getPw())
			.build();

		return new CustomOAuth2User(user, attributes);
	}
}