package com.oopsw.selfit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oopsw.selfit.domain.FoodInfo;
import com.oopsw.selfit.dto.Food;

public interface FoodInfoRepository extends JpaRepository<FoodInfo, Integer> {
	//List<Food> findByFoodNoteId(int foodNoteId);
}
