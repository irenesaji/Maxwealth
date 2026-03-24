import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';
import { RiskAnswerChoice } from 'src/risk_profiles/entities/risk_answer_choices.entity';
import { AdminRiskAnswerChoicesService } from './admin_risk_answer_choices.service';

import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import Role from 'src/auth/enums/roles.enum';

@Crud({
  model: {
    type: RiskAnswerChoice,
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/risk_answer_choices')
export class AdminRiskAnswerChoicesController
  implements CrudController<RiskAnswerChoice>
{
  constructor(public service: AdminRiskAnswerChoicesService) {}
}
