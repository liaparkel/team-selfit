package com.oopsw.selfit.controller.advice;

import java.net.BindException;
import java.sql.SQLSyntaxErrorException;
import java.time.LocalDateTime;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import jakarta.servlet.http.HttpServletRequest;

// @RestControllerAdvice
public class RestControllerExceptionHandler {

	@ExceptionHandler({MethodArgumentNotValidException.class, BindException.class,
		HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class,
		IllegalArgumentException.class, NullPointerException.class, UsernameNotFoundException.class})
	public ResponseEntity<CustomErrorResponse> handleBadRequest(Exception e, HttpServletRequest request) {
		CustomErrorResponse response = CustomErrorResponse.builder()
			.path(request.getRequestURI())
			.message(e.getMessage())
			.timestamp(LocalDateTime.now())
			.build();
		return ResponseEntity.badRequest().body(response);
	}

	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	public ResponseEntity<CustomErrorResponse> handleMethodNotAllowed(Exception e, HttpServletRequest request) {
		CustomErrorResponse response = CustomErrorResponse.builder()
			.path(request.getRequestURI())
			.message(e.getMessage())
			.timestamp(LocalDateTime.now())
			.build();
		return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(response);
	}

	@ExceptionHandler(DataAccessException.class)
	public ResponseEntity<CustomErrorResponse> handleDataAccessError(Exception e, HttpServletRequest request) {
		CustomErrorResponse response = CustomErrorResponse.builder()
			.path(request.getRequestURI())
			.message("데이터베이스 오류")
			.timestamp(LocalDateTime.now())
			.build();
		return ResponseEntity.internalServerError().body(response);
	}

	@ExceptionHandler(SQLSyntaxErrorException.class)
	public ResponseEntity<CustomErrorResponse> handleSqlSyntaxError(Exception e, HttpServletRequest request) {
		CustomErrorResponse response = CustomErrorResponse.builder()
			.path(request.getRequestURI())
			.message("sql구문 오류")
			.timestamp(LocalDateTime.now())
			.build();
		return ResponseEntity.internalServerError().body(response);
	}

}
