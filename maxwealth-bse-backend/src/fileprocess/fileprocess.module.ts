import { Module } from '@nestjs/common';
import { FileprocessService } from './fileprocess.service';
import { FileprocessController } from './fileprocess.controller';

@Module({
  controllers: [FileprocessController],
  providers: [FileprocessService],
})
export class FileprocessModule {}
