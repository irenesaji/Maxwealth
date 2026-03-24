import { Module } from '@nestjs/common';
import { KfintechInvestorMasterFoliosService } from './kfintech_investor_master_folios.service';
import { KfintechInvestorMasterFoliosController } from './kfintech_investor_master_folios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KfintechInvestorMasterFolios } from './entities/kfintech_investor_master_folio.entity';
import { Users } from 'src/users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KfintechInvestorMasterFolios, Users])],
  controllers: [KfintechInvestorMasterFoliosController],
  providers: [KfintechInvestorMasterFoliosService],
  exports: [KfintechInvestorMasterFoliosService],
})
export class KfintechInvestorMasterFoliosModule {}
