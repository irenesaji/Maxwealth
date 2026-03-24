import { Module } from '@nestjs/common';
import { AdminGoalsService } from './admin_goals.service';
import { AdminGoalsController } from './admin_goals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from 'src/goals/entities/goals.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Goal])],
  providers: [
    AdminGoalsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AdminGoalsController],
})
export class AdminGoalsModule {}
