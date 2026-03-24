import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { KarvyService } from './karvy.service';
import { CreateKarvyDto } from './dto/create-karvy.dto';
import { UpdateKarvyDto } from './dto/update-karvy.dto';

@Controller('karvy')
export class KarvyController {
  constructor(private readonly karvyService: KarvyService) {}

  @Post()
  create(@Body() createKarvyDto: CreateKarvyDto) {
    return this.karvyService.create(createKarvyDto);
  }

  @Get()
  findAll() {
    return this.karvyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.karvyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKarvyDto: UpdateKarvyDto) {
    return this.karvyService.update(+id, updateKarvyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.karvyService.remove(+id);
  }
}
