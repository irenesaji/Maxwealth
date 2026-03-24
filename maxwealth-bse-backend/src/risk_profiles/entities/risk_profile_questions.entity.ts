import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { RiskAnswerChoice } from './risk_answer_choices.entity';
import { RiskUserQuiz } from './risk_user_quizes.entity';

@Entity('risk_profile_questions')
export class RiskProfileQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  question: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(
    (type) => RiskAnswerChoice,
    (risk_answer_choices) => risk_answer_choices.risk_profile_question,
  )
  @JoinColumn({ name: 'risk_profile_question_id' })
  risk_answer_choices: RiskAnswerChoice;

  @OneToMany(
    (type) => RiskUserQuiz,
    (risk_user_quizes) => risk_user_quizes.risk_profile_question,
  )
  @JoinColumn({ name: 'risk_profile_question_id' })
  risk_user_quizes: RiskUserQuiz;
}
