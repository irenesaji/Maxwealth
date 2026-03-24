import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { PhoneNumber } from 'src/onboarding/entities/phone_numbers.entity';
import Role from 'src/users/entities/role.enum';
import { AdminPhoneNumbersService } from './admin_phone_numbers.service';

@Crud({
  model: {
    type: PhoneNumber,
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/phone_numbers')
export class AdminPhoneNumbersController
  implements CrudController<PhoneNumber>
{
  constructor(public service: AdminPhoneNumbersService) {}
}
