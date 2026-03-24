import { Module } from '@nestjs/common';
import { AmcsService } from './amcs.service';
import { AmcsController } from './amcs.controller';
import { AmcRepository } from 'src/repositories/amc.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amc } from './entities/amc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Amc])],
  providers: [AmcsService, AmcRepository],
  controllers: [AmcsController],
})
export class AmcsModule {}
