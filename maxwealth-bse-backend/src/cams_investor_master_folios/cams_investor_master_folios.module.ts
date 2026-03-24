import { Module } from '@nestjs/common';
import { CamsInvestorMasterFoliosService } from './cams_investor_master_folios.service';
import { CamsInvestorMasterFoliosController } from './cams_investor_master_folios.controller';
import { CamsInvestorMasterFolios } from './entities/cams_investor_master_folio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { CamsTransactionDetails } from './entities/cams_transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CamsInvestorMasterFolios,
      Users,
      CamsTransactionDetails,
    ]),
  ],
  controllers: [CamsInvestorMasterFoliosController],
  providers: [CamsInvestorMasterFoliosService],
  exports: [CamsInvestorMasterFoliosService],
})
export class CamsInvestorMasterFoliosModule {}
