import { Module } from '@nestjs/common';
import { ISINLookupService } from './isinlookup.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ISINLookupService],
  exports: [ISINLookupService],
})
export class IsinlookupModule {}
