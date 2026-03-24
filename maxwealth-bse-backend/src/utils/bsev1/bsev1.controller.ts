import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Bsev1Service } from './bsev1.service';
import { CreateBsev1Dto } from './dto/create-bsev1.dto';
import { UpdateBsev1Dto } from './dto/update-bsev1.dto';
import { Response } from 'express';

@Controller('bsev1')
export class Bsev1Controller {
  constructor(private readonly bsev1Service: Bsev1Service) {}

  @Post('/password')
  async get_password(@Res() res: Response) {
    const result = await this.bsev1Service.get_password();
    return res.status(result.status).json(result);
  }

  @Get()
  findAll() {
    return this.bsev1Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bsev1Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBsev1Dto: UpdateBsev1Dto) {
    return this.bsev1Service.update(+id, updateBsev1Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bsev1Service.remove(+id);
  }

  @Post('/child_order_password')
  async child_order_password(@Res() res: Response) {
    const result = await this.bsev1Service.password_child();
    return res.status(result.status).json(result);
  }
}
