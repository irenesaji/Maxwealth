import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FileprocessService } from './fileprocess.service';
import { CreateFileprocessDto } from './dto/create-fileprocess.dto';
import { UpdateFileprocessDto } from './dto/update-fileprocess.dto';

@Controller('fileprocess')
export class FileprocessController {
  constructor(private readonly fileprocessService: FileprocessService) {}

  @Post()
  create(@Body() createFileprocessDto: CreateFileprocessDto) {
    return this.fileprocessService.create(createFileprocessDto);
  }

  @Get()
  findAll() {
    return this.fileprocessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileprocessService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFileprocessDto: UpdateFileprocessDto,
  ) {
    return this.fileprocessService.update(+id, updateFileprocessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileprocessService.remove(+id);
  }
}
