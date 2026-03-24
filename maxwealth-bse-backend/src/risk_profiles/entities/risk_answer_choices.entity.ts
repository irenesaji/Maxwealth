import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { RiskProfileQuestion } from './risk_profile_questions.entity';
import { RiskAnswerWeightage } from './risk_answer_weightages.entity';
import { RiskUserQuiz } from './risk_user_quizes.entity';

@Entity('risk_answer_choices')
export class RiskAnswerChoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  risk_profile_question_id: number;

  @Column()
  risk_answer_weightage_id: number;

  @ManyToOne(
    (type) => RiskProfileQuestion,
    (risk_profile_question) => risk_profile_question.risk_answer_choices,
  )
  @JoinColumn({ name: 'risk_profile_question_id' })
  risk_profile_question: RiskProfileQuestion;

  @OneToMany(
    (type) => RiskUserQuiz,
    (risk_user_quizes) => risk_user_quizes.risk_answer_choice,
  )
  @JoinColumn({ name: 'risk_answer_choice_id' })
  risk_user_quizes: RiskUserQuiz;

  @ManyToOne(
    (type) => RiskAnswerWeightage,
    (risk_answer_weightage) => risk_answer_weightage.risk_answer_choices,
  )
  @JoinColumn({ name: 'risk_answer_weightage_id' })
  risk_answer_weightage: RiskAnswerWeightage;

  @Column()
  answer: string;

  @Column({ nullable: true })
  answer_image_url: string;

  @Column({ nullable: true })
  position: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
