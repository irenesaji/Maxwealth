import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { DematAccount } from 'src/onboarding/entities/demat_account.entity';
import { AdminDematAccountsService } from './admin_demat_accounts.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import Role from 'src/users/entities/role.enum';

@Crud({
  model: {
    type: DematAccount,
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/demat_accounts')
export class AdminDematAccountsController
  implements CrudController<DematAccount>
{
  constructor(public service: AdminDematAccountsService) {}
}
