package com.oopsw.selfit.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.bind.annotation.GetMapping;

import com.google.gson.Gson;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final Gson gson = new Gson();

	//account
	@GetMapping("/account/login")
	public String login() {
		return "account/login";
	}

	@GetMapping("/account/signup")

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable());
		http
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/board/list").permitAll()
				.requestMatchers(HttpMethod.POST, "/api/account/member").permitAll()
				.requestMatchers("/account/login").permitAll()
				.requestMatchers("/account/signup").permitAll()
				.requestMatchers("/board/**").hasRole("USER")
				.requestMatchers("/dashboard/**").hasRole("USER")
				.requestMatchers("/account/**").hasRole("USER")
				.requestMatchers("/api/account/member/**").hasRole("USER")
				.anyRequest().permitAll()
			);

		http.formLogin(form -> form
			.loginPage("/account/login")
			.loginProcessingUrl("/api/account/login-process")
			.usernameParameter("loginId")
			.passwordParameter("loginPassword")
			.defaultSuccessUrl("/dashboard/dashboard")
			.successHandler(successHandler())
			.failureHandler(failureHandler())
			.permitAll()
		);

		http.logout(logout -> logout
			.logoutUrl("/account/logout")
			.logoutSuccessUrl("/account/login")
			.invalidateHttpSession(true)
			.clearAuthentication(true)
			.deleteCookies("JSESSIONID")
		);

		return http.build();

	}

	@Bean
	public AuthenticationSuccessHandler successHandler() {
		return (request, response, authentication) -> {
			response.setStatus(HttpServletResponse.SC_OK);
			response.setContentType("application/json;charset=UTF-8");

			Map<String, Object> result = new HashMap<>();
			result.put("message", "로그인 성공");
			result.put("status", 200);

			gson.toJson(result, response.getWriter());
		};
	}

	@Bean
	public AuthenticationFailureHandler failureHandler() {
		return (request, response, exception) -> {
			String loginId = request.getParameter("loginId"); // 사용자가 입력한 로그인 ID
			System.out.println(loginId);
			System.out.println(request.getParameter("loginPassword"));
			System.out.println(exception.getMessage());

			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json;charset=UTF-8");

			Map<String, Object> error = new HashMap<>();
			error.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
			error.put("status", 401);
			gson.toJson(error, response.getWriter());
		};
	}

}