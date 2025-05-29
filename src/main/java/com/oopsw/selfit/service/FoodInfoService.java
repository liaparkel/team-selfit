package com.oopsw.selfit.service;

import com.oopsw.selfit.repository.DashboardRepository;
import com.oopsw.selfit.repository.FoodInfoRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class FoodInfoService {
	private final FoodInfoRepository foodInfoRepository;
	private final DashboardRepository dashboardRepository;

}
