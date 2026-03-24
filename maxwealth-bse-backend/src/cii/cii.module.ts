import { Module } from '@nestjs/common';
import { CiiService } from './cii.service';
import { CiiController } from './cii.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostInflationIndex } from './entities/cii.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CostInflationIndex])],
  controllers: [CiiController],
  providers: [CiiService],
})
export class CiiModule {}
