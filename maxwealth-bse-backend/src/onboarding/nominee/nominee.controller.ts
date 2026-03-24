import {
  Body,
  Controller,
  HttpStatus,
  Headers,
  Post,
  Res,
  UseGuards,
  Get,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AddUserNomineeDetailsDto } from './dtos/add-user-nominee-details.dto';
import { NomineeService } from './nominee.service';
import { Response } from 'express';
import { UpdateUserNomineeDetailsDto } from './dtos/update-user-nominee-details.dto';

@Controller('api/nominee')
export class NomineeController {
  constructor(private readonly nomineeService: NomineeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async add_user_nominee_details(
    @Body() addUserNomineeDetailsDtoArray: Array<AddUserNomineeDetailsDto>,
    @Headers() headers,
    @Res() res: Response,
  ) {
    try {
      const result = await this.nomineeService.add_user_nominee_details(
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

  @UseGuards(JwtAuthGuard)
  @Get()
  async get_user_nominee_details(
    @Headers() headers,
    @Res() res: Response,
    @Query('user_id') user_id,
  ) {
    try {
      console.log(headers.user);
      const result = await this.nomineeService.get_user_nominee_details(
        user_id,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update_user_nominee_details_v2(
    @Body() updateUserNomineeDetailsDto: UpdateUserNomineeDetailsDto[],
    @Headers() headers,
    @Res() res: Response,
  ) {
    try {
      const result = await this.nomineeService.update_user_nominee_details(
        headers.user.id,
        updateUserNomineeDetailsDto,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete_user_nominee_details(
    @Res() res: Response,
    @Query() query: { id: number },
  ) {
    try {
      const result = await this.nomineeService.delete(query.id);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }
}
