package com.oopsw.selfit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oopsw.selfit.domain.FoodInfo;

public interface FoodInfoRepository extends JpaRepository<FoodInfo, Integer> {
	List<FoodInfo> findByFoodNoteId(int foodNoteId);
}
