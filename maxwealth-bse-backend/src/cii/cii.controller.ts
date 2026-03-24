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
import { CiiService } from './cii.service';
import { CreateCostInflationIndexDto } from './dto/create-cii.dto';
import { UpdateCiiDto } from './dto/update-cii.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('api/cost_inflation')
export class CiiController {
  constructor(private readonly ciiService: CiiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Body() createCostInflationIndexDto: CreateCostInflationIndexDto,
    @Res() res: Response,
  ) {
    const result = await this.ciiService.create(createCostInflationIndexDto);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('findall')
  async findAllaccounts(@Res() res: Response) {
    const result = await this.ciiService.findAll();
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async update(
    @Query('id') id: number,
    @Body() updateCiiDto: UpdateCiiDto,
    @Res() res: Response,
  ) {
    const result = await this.ciiService.update(id, updateCiiDto);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async remove(@Query('id') id: number, @Res() res: Response) {
    const result = await this.ciiService.remove(id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('findOne')
  async findOne(@Query('id') id: number, @Res() res: Response) {
    const result = await this.ciiService.findOne(id);
    return res.status(result.status).json(result);
  }
}
