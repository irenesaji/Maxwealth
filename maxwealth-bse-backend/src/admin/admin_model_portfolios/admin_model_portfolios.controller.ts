import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';
import { AdminModelPortfoliosService } from './admin_model_portfolios.service';
import { ModelPortfolio } from 'src/model_portfolio/entities/model_portfolios.entity';

import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import Role from 'src/auth/enums/roles.enum';

@Crud({
  model: {
    type: ModelPortfolio,
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/model_portfolios')
export class AdminModelPortfoliosController
  implements CrudController<ModelPortfolio>
{
  constructor(public service: AdminModelPortfoliosService) {}
}
