import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RiskProfileQuestion } from './risk_profile_questions.entity';
import { RiskAnswerChoice } from './risk_answer_choices.entity';
import { Users } from 'src/users/entities/users.entity';
import { column } from 'mathjs';

@Entity('risk_user_quizes')
export class RiskUserQuiz {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Users, (user) => user.risk_user_quizes)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column()
  user_id: number;

  @Column()
  risk_profile_question_id: number;

  @ManyToOne(
    (type) => RiskProfileQuestion,
    (risk_profile_question) => risk_profile_question.risk_user_quizes,
  )
  @JoinColumn({ name: 'risk_profile_question_id' })
  risk_profile_question: RiskProfileQuestion;

  @ManyToOne(
    (type) => RiskAnswerChoice,
    (risk_answer_choice) => risk_answer_choice.risk_user_quizes,
  )
  @JoinColumn({ name: 'risk_answer_choice_id' })
  risk_answer_choice: RiskAnswerChoice;

  @Column()
  score: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
