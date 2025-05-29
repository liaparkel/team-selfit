package com.oopsw.selfit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oopsw.selfit.domain.FoodInfo;

public interface FoodInfoRepository extends JpaRepository<FoodInfo, Integer> {
	// List<FoodInfo> getIntakeDetail(int memberId, String intakeDate);
}
