import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserSettingsDto } from './dtos/update-user-settings.dto';
import { Response } from 'express';
import { MpinDto } from './dtos/mpin.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const result = await this.usersService.create(createUserDto);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set_mpin')
  async set_mpin(
    @Body() setMpinDto: MpinDto,
    @Headers() headers,
    @Res() res: Response,
  ) {
    const result = await this.usersService.set_mpin(
      setMpinDto,
      headers.user.id,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update_settings')
  async update_settings(
    @Body() updateUserSettingsDto: UpdateUserSettingsDto,
    @Headers() headers,
    @Res() res: Response,
  ) {
    const result = await this.usersService.update_settings(
      updateUserSettingsDto,
      headers.user.id,
    );
    return res.status(result.status).json(result);
  }

  // @Get('/send_leads')
  // async sendleads() {
  //   let result = await this.usersService.sendDailyLeads();
  // }

  @UseGuards(JwtAuthGuard)
  @Get('/get_current_user')
  async get_current_user(@Headers() headers, @Res() res: Response) {
    const result = await this.usersService.findOneById(headers.user.id);
    let status = HttpStatus.OK;
    if (result.status != 'success') {
      status = HttpStatus.BAD_REQUEST;
    }
    return res.status(status).json(result);
  }
}
