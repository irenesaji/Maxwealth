import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsergoalsService } from './usergoals.service';
import { UpdateUsergoalDto } from './dto/update-usergoal.dto';
import { Response } from 'express';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import Role from 'src/users/entities/role.enum';
import { CrossRoleGuard } from 'src/auth/guard/cross-role.guard';
import { CreateUserGoalsDto } from './dto/create-usergoal.dto';

@Controller('/api/usergoals')
export class UsergoalsController {
  constructor(private readonly usergoalsService: UsergoalsService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Post()
  async create(
    @Body() createUsergoalDto: CreateUserGoalsDto,
    @Res() res: Response,
  ) {
    const result = await this.usergoalsService.create(createUsergoalDto);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get()
  async findAllGoals(@Res() res: Response, @Query('user_id') user_id: number) {
    const result = await this.usergoalsService.findAll(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Patch()
  async update(
    @Query('id') id: number,
    @Body() updateUsergoalDto: UpdateUsergoalDto,
    @Res() res: Response,
  ) {
    const result = await this.usergoalsService.update(id, updateUsergoalDto);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Delete()
  async remove(@Query('id') id: number, @Res() res: Response) {
    const result = await this.usergoalsService.remove(id);
    return res.status(result.status).json(result);
  }

  @Get('findOne')
  async findOne(@Query('id') id: number, @Res() res: Response) {
    const result = await this.usergoalsService.findOne(id);
    return res.status(result.status).json(result);
  }
}
