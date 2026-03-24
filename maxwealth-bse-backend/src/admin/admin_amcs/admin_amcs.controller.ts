import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController, Override } from '@dataui/crud';
import { AdminAmcsService } from './admin_amcs.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import Role from 'src/auth/enums/roles.enum';
import { Amc } from 'src/amcs/entities/amc.entity';

@Crud({
  model: {
    type: Amc,
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/amcs')
export class AdminAmcsController implements CrudController<Amc> {
  constructor(public service: AdminAmcsService) {}
}
