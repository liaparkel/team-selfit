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
	private int memberId;
	private int foodNoteId;
	private int foodInfoId;
	private int foodId;
	private String foodName;
	private String intake;
	private String unitKcal;
	private String intakeKcal;
	private String foodWeight;
	private String intakeDate;
	private Integer intakeSum; //섭취칼로리 합

}
