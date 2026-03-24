import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';
import { RiskProfile } from 'src/risk_profiles/entities/risk_profiles.entity';
import { AdminRiskProfilesService } from './admin_risk_profiles.service';

import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import Role from 'src/users/entities/role.enum';
import { CreateRiskProfileDto } from './dto/create-risk-profile.dto';

@Crud({
  model: {
    type: RiskProfile,
  },
  dto: {
    create: CreateRiskProfileDto,
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/risk_profiles')
export class AdminRiskProfilesController
  implements CrudController<RiskProfile>
{
  constructor(public service: AdminRiskProfilesService) {}
}
