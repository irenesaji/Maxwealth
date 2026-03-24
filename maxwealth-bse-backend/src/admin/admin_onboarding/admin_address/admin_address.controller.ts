import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserAddressDetails } from 'src/onboarding/address/entities/user_address_details.entity';
import { AdminAddressService } from './admin_address.service';
import { Roles } from 'src/auth/roles.decorator';
import Role from 'src/auth/enums/roles.enum';

@Crud({
  model: {
    type: UserAddressDetails,
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/address')
export class AdminAddressController
  implements CrudController<UserAddressDetails>
{
  constructor(public service: AdminAddressService) {}
}
