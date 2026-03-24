import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { KraVerificationService } from './kra_verification.service';
import { CreateKraVerificationDto } from './dto/create-kra_verification.dto';
import { UpdateKraVerificationDto } from './dto/update-kra_verification.dto';
import { Response } from 'express';

@Controller('kra-verification')
export class KraVerificationController {
  constructor(
    private readonly kraVerificationService: KraVerificationService,
  ) {}

  @Post('get_password')
  async get_password(@Res() res: Response) {
    const result = await this.kraVerificationService.getPassword();
    return res.status(result.status).json(result);
  }

  @Post('kyc_check')
  async kyc_check(@Body() body, @Res() res: Response) {
    const result = await this.kraVerificationService.kyc_check(body);
    return res.status(result.status).json(result);
  }

  @Post('e_kyc_check')
  async ekyc_check(@Body() body, @Res() res: Response) {
    const result = await this.kraVerificationService.kyc_check_ekyc(body);
    return res.status(result.status).json(result);
  }

  @Post()
  create(@Body() createKraVerificationDto: CreateKraVerificationDto) {
    return this.kraVerificationService.create(createKraVerificationDto);
  }

  @Get()
  findAll() {
    return this.kraVerificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kraVerificationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateKraVerificationDto: UpdateKraVerificationDto,
  ) {
    return this.kraVerificationService.update(+id, updateKraVerificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kraVerificationService.remove(+id);
  }
}
