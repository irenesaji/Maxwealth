import { Module } from '@nestjs/common';
import { Bsev1Service } from './bsev1.service';
import { Bsev1Controller } from './bsev1.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [Bsev1Controller],
  providers: [Bsev1Service],
  exports: [Bsev1Service],
})
export class Bsev1Module {}
