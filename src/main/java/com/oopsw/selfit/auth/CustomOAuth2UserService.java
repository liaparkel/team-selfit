package com.oopsw.selfit.auth;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.oopsw.selfit.dto.LoginInfo;
import com.oopsw.selfit.dto.Member;
import com.oopsw.selfit.repository.MemberRepository;
import com.oopsw.selfit.service.MemberService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
	private final MemberService memberService;
	private final BCryptPasswordEncoder encoder;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oAuth2User = super.loadUser(userRequest);
		String registrationId = userRequest.getClientRegistration().getRegistrationId(); // google, etc.
		String userNameAttributeName = userRequest.getClientRegistration()
			.getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

		Map<String, Object> attributes = oAuth2User.getAttributes();
		System.out.println(attributes);

		String email = (String)attributes.get("email");
		int memberId;

		if (!memberService.isEmailExists(email)) { //회원가입 안한 상태
			Member member = generateMember(attributes);
			memberService.addMember(member);
			memberId = member.getMemberId();
			System.out.println("회원가입됨");
			System.out.println("memberId: " + memberId);
		} else { //이미 해당 이메일로 회원가입을 했다면
			memberId = memberService.getLoginInfo(email).getMemberId();
			System.out.println("회원가입했었음");
		}

		User user = User.builder()
			.memberId(memberId)
			.email(email)
			.build();

		return new CustomOAuth2User(user, attributes);
	}

	private Member generateMember(Map<String, Object> attributes) {
		String email = (String)attributes.get("email");
		String encodedPw = encoder.encode(getRandomValue());
		String name = (String)attributes.get("name");
		String nickname = getUniqueNickname((String)attributes.get("sub"));
		String profileImg = (String)attributes.get("picture");

		return Member.builder().email(email)
			.pw(encodedPw)
			.name(name)
			.nickname(nickname)
			.profileImg(profileImg)
			.memberType("GOOGLE")
			.build();
	}

	private String getUniqueNickname(String sub) {
		String base = "GOOGLE";
		int hash = Math.abs(sub.hashCode()) % 100000;
		String nickname = "GOOGLE" + hash;
		while (memberService.isNicknameExists(nickname)) {
			hash = (hash + 1) % 100000; // 충돌 시 해시값 변경
			nickname = base + hash;
		}

		return nickname;
	}

	private String getRandomValue() {
		String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
		int random = (int)(Math.random() * 1_000_000);

		String randomStr = String.format("%06d", random);
		return randomStr + "_" + time;
	}
}