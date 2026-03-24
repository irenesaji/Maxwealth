import { Crud, CrudController } from '@dataui/crud';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

import { UserBankDetails } from 'src/onboarding/bank/entities/user_bank_details.entity';
import { AdminBankService } from './admin_bank.service';
import { Controller, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import Role from 'src/auth/enums/roles.enum';

@Crud({
  model: {
    type: UserBankDetails,
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/bank')
export class AdminBankController implements CrudController<UserBankDetails> {
  constructor(public service: AdminBankService) {}
}
