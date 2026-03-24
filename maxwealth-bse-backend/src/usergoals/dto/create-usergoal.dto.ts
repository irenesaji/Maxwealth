import {
  IsInt,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateUserGoalsDto {
  user_id: number;

  goal_id: number;

  goal_name: string;

  current_cost: number;

  current_monthly_expenses: number;

  retirement_age: number;

  life_expectancy: number;

  expected_inflation: number;

  target_year: number;

  expected_returns: number;

  created_at?: Date;

  updated_at?: Date;

  is_deleted?: number;
}
