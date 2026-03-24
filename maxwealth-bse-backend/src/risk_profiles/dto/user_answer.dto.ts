import { IsNotEmpty } from 'class-validator';
export class UserAnswerDto {
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  risk_profile_question_id: number;

  @IsNotEmpty()
  risk_answer_choice_id: number;
}
