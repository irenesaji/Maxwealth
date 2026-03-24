import { Module } from '@nestjs/common';
import { RiskProfilesService } from './risk_profiles.service';
import { RiskProfilesController } from './risk_profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiskProfileQuestion } from './entities/risk_profile_questions.entity';
import { RiskAnswerChoice } from './entities/risk_answer_choices.entity';
import { Users } from 'src/users/entities/users.entity';
import { RiskUserQuiz } from './entities/risk_user_quizes.entity';
import { RiskProfile } from './entities/risk_profiles.entity';
import { RiskProfileQuestionRepository } from 'src/repositories/risk_profile_question.repository';
import { RiskAnswerChoiceRepository } from 'src/repositories/risk_answer_choice.repository';
import { UsersRepository } from 'src/repositories/user.repository';
import { RiskUserQuizRepository } from 'src/repositories/risk_user_quiz.repository';
import { RiskProfileRepository } from 'src/repositories/risk_profile.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RiskProfileQuestion,
      RiskAnswerChoice,
      Users,
      RiskUserQuiz,
      RiskProfile,
    ]),
  ],
  providers: [
    RiskProfilesService,
    RiskProfileQuestionRepository,
    RiskAnswerChoiceRepository,
    UsersRepository,
    RiskUserQuizRepository,
    RiskProfileRepository,
  ],
  controllers: [RiskProfilesController],
})
export class RiskProfilesModule {}
