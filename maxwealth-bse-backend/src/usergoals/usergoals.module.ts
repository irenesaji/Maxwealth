import { Module } from '@nestjs/common';
import { UsergoalsService } from './usergoals.service';
import { UsergoalsController } from './usergoals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGoals } from './entities/usergoal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserGoals])],
  controllers: [UsergoalsController],
  providers: [UsergoalsService],
})
export class UsergoalsModule {}
