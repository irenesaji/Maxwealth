import { PartialType } from '@nestjs/swagger';
import { CreateUserGoalsDto } from './create-usergoal.dto';

export class UpdateUsergoalDto extends PartialType(CreateUserGoalsDto) {}
