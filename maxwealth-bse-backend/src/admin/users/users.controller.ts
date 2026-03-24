import { Body, Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@dataui/crud';

import { Users } from 'src/users/entities/users.entity';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import Role from 'src/auth/enums/roles.enum';
import { Response } from 'express';
@Crud({
  model: {
    type: Users,
  },
  query: {
    sort: [
      {
        field: 'id',
        order: 'DESC',
      },
    ],
    join: {
      user_onboarding_details: { eager: false }, // Fetch on demand with `?join=comments`
    },
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/users')
export class UsersController implements CrudController<Users> {
  constructor(public service: UsersService) {}

  // Override the default createOneBase method from @dataui/crud
  @Override('createOneBase')
  async createOneOverride(@ParsedRequest() req: CrudRequest, @Body() dto: any) {
    // Use the custom create method in the service
    return this.service.createOne(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user-details')
  async user_details(
    @Res() res: Response,
    @Query('sortBy') sortBy?,
    @Query('sortOrder') sortOrder?,
    @Query('page') page?,
    @Query('limit') limit?,
    @Query('isActive') isActive?,
    @Query('isBlocked') isBlocked?,
    @Query('countryCode') countryCode?,
    @Query('email') email?,
  ) {
    const result = await this.service.findUsers(
      email,
      countryCode,
      sortBy,
      sortOrder,
      page,
      limit,
      isActive,
      isBlocked,
    );
    return res.status(200).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/total_users')
  async get_total_users(
    @Res() res: Response,
    @Query('filter') filter: string,
    @Query('year') year: number,
  ) {
    const result = await this.service.get_total_users(filter, year);
    return res.status(200).json(result);
  }
}
