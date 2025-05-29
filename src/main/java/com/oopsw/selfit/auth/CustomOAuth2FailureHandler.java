package com.oopsw.selfit.auth;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class CustomOAuth2FailureHandler implements AuthenticationFailureHandler {
	@Override
	public void onAuthenticationFailure(HttpServletRequest request,
		HttpServletResponse response,
		AuthenticationException exception)
		throws IOException, ServletException {

		HttpSession session = request.getSession(false);
		String email = (String)session.getAttribute("email");
		String name = (String)session.getAttribute("name");

		System.out.println("failure이동: " + email + " " + name);
		response.sendRedirect("/account/signup-oauth");
	}
}
