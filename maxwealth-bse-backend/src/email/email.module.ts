import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserData } from 'src/data/entities/data.entity';
import { CamsInvestorMasterFoliosModule } from 'src/cams_investor_master_folios/cams_investor_master_folios.module';
import { InvestorDetailsModule } from 'src/investor-details/investor-details.module';
import { KfintechInvestorMasterFoliosModule } from 'src/kfintech_investor_master_folios/kfintech_investor_master_folios.module';
import { KfintechTransactionMasterFoliosModule } from 'src/kfintech_transaction_master_folios/kfintech_transaction_master_folios.module';
import { Fileprocess } from 'src/fileprocess/entities/fileprocess.entity';
import { EmailController } from './email.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserData, Fileprocess]),
    CamsInvestorMasterFoliosModule,
    InvestorDetailsModule,
    KfintechInvestorMasterFoliosModule,
    KfintechTransactionMasterFoliosModule,
  ],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
