import { Controller, UseGuards } from '@nestjs/common';
import { RiskProfileQuestion } from 'src/risk_profiles/entities/risk_profile_questions.entity';
import { AdminRiskProfileQuestionsService } from './admin_risk_profile_questions.service';
import { Crud, CrudController } from '@dataui/crud';

import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import Role from 'src/auth/enums/roles.enum';

@Crud({
  model: {
    type: RiskProfileQuestion,
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/risk_profile_questions')
export class AdminRiskProfileQuestionsController
  implements CrudController<RiskProfileQuestion>
{
  constructor(public service: AdminRiskProfileQuestionsService) {}
}
