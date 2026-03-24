import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { RiskAnswerChoice } from './risk_answer_choices.entity';

@Entity('risk_answer_weightages')
export class RiskAnswerWeightage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  weightage: number;

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
    (risk_answer_choices) => risk_answer_choices.risk_answer_weightage,
  )
  @JoinColumn({ name: 'risk_answer_weightage_id' })
  risk_answer_choices: RiskAnswerChoice;
}
