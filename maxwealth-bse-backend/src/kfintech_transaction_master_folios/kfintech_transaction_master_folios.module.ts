import { Module } from '@nestjs/common';
import { KfintechTransactionMasterFoliosService } from './kfintech_transaction_master_folios.service';
import { KfintechTransactionMasterFoliosController } from './kfintech_transaction_master_folios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KfintechTransactionMasterFolios } from './entities/kfintech_transaction_master_folio.entity';
import { Users } from 'src/users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KfintechTransactionMasterFolios, Users])],
  controllers: [KfintechTransactionMasterFoliosController],
  providers: [KfintechTransactionMasterFoliosService],
  exports: [KfintechTransactionMasterFoliosService],
})
export class KfintechTransactionMasterFoliosModule {}
