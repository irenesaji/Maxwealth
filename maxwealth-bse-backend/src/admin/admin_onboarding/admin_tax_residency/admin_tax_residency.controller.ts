import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { TaxResidency } from 'src/onboarding/entities/tax_residency.entity';
import { AdminTaxResidencyService } from './admin_tax_residency.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import Role from 'src/users/entities/role.enum';

@Crud({
  model: {
    type: TaxResidency,
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/tax_residencies')
export class AdminTaxResidencyController
  implements CrudController<TaxResidency>
{
  constructor(public service: AdminTaxResidencyService) {}
}
