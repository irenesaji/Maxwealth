import { Module } from '@nestjs/common';
import { FundDetailsService } from './fund_details.service';
import { FundDetailsController } from './fund_details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextDocument } from './entities/text_document.entity';
import { FundDetail } from './entities/fund_detail.entity';
import { FundDetailsRepository } from 'src/repositories/fund_details.repository';
import { TextDocumentRepository } from 'src/repositories/text_document.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TextDocument, FundDetail])],
  controllers: [FundDetailsController],
  providers: [
    FundDetailsService,
    FundDetailsRepository,
    TextDocumentRepository,
  ],
  exports: [FundDetailsService],
})
export class FundDetailsModule {}
