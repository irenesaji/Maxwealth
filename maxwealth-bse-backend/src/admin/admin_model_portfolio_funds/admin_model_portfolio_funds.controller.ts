import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';
import { ModelPortfolioFund } from 'src/model_portfolio/entities/model_portfolio_funds.entity';
import { AdminModelPortfolioFundsService } from './admin_model_portfolio_funds.service';

import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import Role from 'src/users/entities/role.enum';

@Crud({
  model: {
    type: ModelPortfolioFund,
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/model_portfolio_funds')
export class AdminModelPortfolioFundsController
  implements CrudController<ModelPortfolioFund>
{
  constructor(public service: AdminModelPortfolioFundsService) {}
}
