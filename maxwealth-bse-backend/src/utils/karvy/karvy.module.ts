import { Module } from '@nestjs/common';
import { KarvyService } from './karvy.service';
import { KarvyController } from './karvy.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [KarvyController],
  providers: [KarvyService],
})
export class KarvyModule {}
