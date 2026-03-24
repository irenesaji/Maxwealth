import { Crud, CrudController } from '@dataui/crud';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

import {
  Body,
  Controller,
  Headers,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserNomineeDetails } from 'src/onboarding/nominee/entities/user-nominee-details.entity';
import { AdminNomineeService } from './admin_nominee.service';
import { Roles } from 'src/auth/roles.decorator';
import Role from 'src/auth/enums/roles.enum';
import { AddUserNomineeDetailsDto } from 'src/onboarding/nominee/dtos/add-user-nominee-details.dto';
import { Response } from 'express';

@Crud({
  model: {
    type: UserNomineeDetails,
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/nominee')
export class AdminNomineeController
  implements CrudController<UserNomineeDetails>
{
  constructor(public service: AdminNomineeService) {}

  @Post()
  async add_user_nominee_details(
    @Body() addUserNomineeDetailsDtoArray: Array<AddUserNomineeDetailsDto>,
    @Headers() headers,
    @Res() res: Response,
  ) {
    try {
      const result = await this.service.add_user_nominee_details(
        addUserNomineeDetailsDtoArray,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }
}
