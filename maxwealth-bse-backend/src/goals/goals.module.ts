import { Module } from '@nestjs/common';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goals.entity';
import { MutualfundsModule } from 'src/utils/mutualfunds/mutualfunds.module';
import { GoalRepository } from 'src/repositories/goal.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Goal]), MutualfundsModule],
  controllers: [GoalsController],
  providers: [GoalsService, GoalRepository],
})
export class GoalsModule {}
