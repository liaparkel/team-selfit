package com.oopsw.selfit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Food {
	private int foodNoteId;
	private int foodId;
	private String foodName;
	private String intake;
	private String intakeKcal;
	private String foodWeight;
	private String intakeDate;
}
