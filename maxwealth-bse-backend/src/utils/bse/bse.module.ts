import { Module } from '@nestjs/common';
import { BseService } from './bse.service';
import { HttpModule } from '@nestjs/axios';
import { BseController } from './bse.controller';

@Module({
  imports: [HttpModule],
  controllers: [BseController],
  providers: [BseService],
  exports: [BseService],
})
export class BseModule {}
