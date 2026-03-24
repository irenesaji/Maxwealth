import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController, Override } from '@dataui/crud';
import { Goal } from 'src/goals/entities/goals.entity';
import { AdminGoalsService } from './admin_goals.service';

import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import Role from 'src/auth/enums/roles.enum';

@Crud({
  model: {
    type: Goal,
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/goals')
export class AdminGoalsController implements CrudController<Goal> {
  constructor(public service: AdminGoalsService) {}
}
