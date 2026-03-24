import { IsNotEmpty } from 'class-validator';
import { RiskProfile } from '../entities/risk_profiles.entity';
export class UserRiskProfileDto {
  user_id: number;

  questions_count: number;

  questions_answered_count: number;

  total_score: number;

  risk_profile: RiskProfile;
}
