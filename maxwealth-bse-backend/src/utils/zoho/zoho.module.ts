import { Module } from '@nestjs/common';
import { ZohoService } from './zoho.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ZohoService],
  exports: [ZohoService],
})
export class ZohoModule {}
