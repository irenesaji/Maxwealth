import { Module } from '@nestjs/common';
// import { Msg91Service } from './msg91.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  // providers: [Msg91Service],
  // exports:[Msg91Service]
})
export class Msg91Module {}
