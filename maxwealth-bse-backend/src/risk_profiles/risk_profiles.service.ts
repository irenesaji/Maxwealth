import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UserAnswerDto } from './dto/user_answer.dto';
import { UserRiskProfileDto } from './dto/user_risk_profile.dto';
import { RiskAnswerChoice } from './entities/risk_answer_choices.entity';
import { RiskAnswerWeightage } from './entities/risk_answer_weightages.entity';
import { RiskProfile } from './entities/risk_profiles.entity';
import { RiskProfileQuestion } from './entities/risk_profile_questions.entity';
import { RiskUserQuiz } from './entities/risk_user_quizes.entity';
import { RiskProfileQuestionRepository } from 'src/repositories/risk_profile_question.repository';
import { RiskAnswerChoiceRepository } from 'src/repositories/risk_answer_choice.repository';
import { UsersRepository } from 'src/repositories/user.repository';
import { RiskUserQuizRepository } from 'src/repositories/risk_user_quiz.repository';
import { RiskProfileRepository } from 'src/repositories/risk_profile.repository';

@Injectable()
export class RiskProfilesService {
  constructor(
    //   @InjectRepository(RiskProfileQuestion)
    //   private riskProfileQuestionRepository:Repository<RiskProfileQuestion>,
    //   @InjectRepository(RiskAnswerChoice)
    //   private riskAnswerChoiceRepository:Repository<RiskAnswerChoice>,
    //   @InjectRepository(Users)
    //   private userRepository:Repository<Users>,
    //   @InjectRepository(RiskUserQuiz)
    //   private riskUserQuizRepository:Repository<RiskUserQuiz>,
    //   @InjectRepository(RiskProfile)
    //   private riskProfileRepository:Repository<RiskProfile>,

    private riskProfileQuestionRepository: RiskProfileQuestionRepository,
    private riskAnswerChoiceRepository: RiskAnswerChoiceRepository,
    private userRepository: UsersRepository,
    private riskUserQuizRepository: RiskUserQuizRepository,
    private riskProfileRepository: RiskProfileRepository,
  ) {}

  async get_quiz() {
    try {
      const risk_profiles = await this.riskProfileQuestionRepository.find({
        where: { is_active: true },
        relations: ['risk_answer_choices'],
      });
      return { status: HttpStatus.OK, data: risk_profiles };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async record_user_answer(userAnswerDto: UserAnswerDto) {
    try {
      const risk_profile_question =
        await this.riskProfileQuestionRepository.findOneBy({
          id: userAnswerDto.risk_profile_question_id,
          is_active: true,
        });
      if (!risk_profile_question) {
        return { status: HttpStatus.NOT_FOUND, error: 'Question not found' };
      }

      const risk_answer_choice = await this.riskAnswerChoiceRepository.findOne({
        where: { id: userAnswerDto.risk_answer_choice_id },
        relations: ['risk_answer_weightage'],
      });
      if (!risk_answer_choice) {
        return {
          status: HttpStatus.NOT_FOUND,
          error: 'Answer Choice not found',
        };
      }

      const user: Users = await this.userRepository.findOneBy({
        id: userAnswerDto.user_id,
      });
      if (user == null) {
        return { status: HttpStatus.NOT_FOUND, error: 'User not found' };
      }

      let riskUserQuiz = await this.riskUserQuizRepository.findOneBy({
        user_id: userAnswerDto.user_id,
        risk_profile_question_id: risk_profile_question.id,
      });
      if (!riskUserQuiz) {
        riskUserQuiz = new RiskUserQuiz();
      }

      riskUserQuiz.user = user;
      riskUserQuiz.risk_profile_question = risk_profile_question;
      riskUserQuiz.risk_answer_choice = risk_answer_choice;
      riskUserQuiz.score = risk_answer_choice.risk_answer_weightage.weightage;

      riskUserQuiz = await this.riskUserQuizRepository.save(riskUserQuiz);

      return { status: HttpStatus.OK, data: riskUserQuiz };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async user_risk_profile(user_id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id: user_id });
      if (user) {
        const risk_profile_questions =
          await this.riskProfileQuestionRepository.find({
            where: { is_active: true },
          });
        const user_risk_profile_dto = new UserRiskProfileDto();
        user_risk_profile_dto.questions_count = risk_profile_questions.length;
        if (risk_profile_questions.length == 0) {
          return {
            status: HttpStatus.NOT_FOUND,
            error: 'No Questions Configured',
          };
        }
        const user_risk_profile_quiz_answers =
          await this.riskUserQuizRepository.find({
            where: { user_id: user.id },
          });
        user_risk_profile_dto.questions_answered_count =
          user_risk_profile_quiz_answers.length;
        if (user_risk_profile_quiz_answers.length == 0) {
          return {
            status: HttpStatus.NOT_FOUND,
            error: 'User has not taken any quiz',
          };
        }

        let total_score = 0;
        for (const user_risk_profile_quiz_answer of user_risk_profile_quiz_answers) {
          total_score += user_risk_profile_quiz_answer.score;
        }
        user_risk_profile_dto.total_score = total_score;

        const risk_profile = await this.riskProfileRepository.findOne({
          where: {
            low: LessThanOrEqual(total_score),
            high: MoreThanOrEqual(total_score),
          },
          relations: [
            'model_portfolio',
            'model_portfolio.model_portfolio_funds',
          ],
        });

        user_risk_profile_dto.risk_profile = risk_profile;

        if (risk_profile) {
          user.risk_profile_id = risk_profile.id;
          this.userRepository.save(user);

          return { status: HttpStatus.OK, data: user_risk_profile_dto };
        } else {
          return {
            status: HttpStatus.NOT_FOUND,
            error:
              'Risk Profile not configured for the total score range of ' +
              total_score,
          };
        }
      } else {
        return { status: HttpStatus.NOT_FOUND, error: 'User not found' };
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }
}
