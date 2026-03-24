import { Module } from '@nestjs/common';
import { PichainService } from './pichain.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pennydrops } from 'src/onboarding/bank/entities/pennydrops.entity';
import { PennydropsRepository } from 'src/repositories/pennydrops.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Pennydrops]), HttpModule],
  providers: [PichainService, PennydropsRepository],
  exports: [PichainService],
})
export class PichainModule {}
