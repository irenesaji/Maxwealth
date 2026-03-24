import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { EmailAddress } from 'src/onboarding/entities/email_addresses.entity';
import Role from 'src/users/entities/role.enum';
import { AdminEmailsService } from './admin_emails.service';

@Crud({
  model: {
    type: EmailAddress,
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/emails')
export class AdminEmailsController implements CrudController<EmailAddress> {
  constructor(public service: AdminEmailsService) {}
}
