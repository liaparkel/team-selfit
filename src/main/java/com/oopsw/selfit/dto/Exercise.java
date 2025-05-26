package com.oopsw.selfit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Exercise {
	private int exerciseNoteId;
	private int exerciseId;
	private String exerciseName;
	private int exerciseMin;
	private String exerciseKcal;
	private float met;
	private String exerciseDate;
}
