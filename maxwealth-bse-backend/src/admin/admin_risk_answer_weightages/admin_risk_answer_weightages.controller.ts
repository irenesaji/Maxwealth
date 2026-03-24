import { Controller, UseGuards } from '@nestjs/common';
import { RiskAnswerWeightage } from 'src/risk_profiles/entities/risk_answer_weightages.entity';
import { AdminRiskAnswerWeightagesService } from './admin_risk_answer_weightages.service';
import { Crud, CrudController } from '@dataui/crud';

import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import Role from 'src/auth/enums/roles.enum';

@Crud({
  model: {
    type: RiskAnswerWeightage,
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/risk_answer_weightages')
export class AdminRiskAnswerWeightagesController
  implements CrudController<RiskAnswerWeightage>
{
  constructor(public service: AdminRiskAnswerWeightagesService) {}
}
