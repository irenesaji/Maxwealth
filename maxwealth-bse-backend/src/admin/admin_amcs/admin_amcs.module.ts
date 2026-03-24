import { Module } from '@nestjs/common';
import { AdminAmcsController } from './admin_amcs.controller';
import { AdminAmcsService } from './admin_amcs.service';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amc } from 'src/amcs/entities/amc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Amc])],
  providers: [
    AdminAmcsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AdminAmcsController],
})
export class AdminAmcsModule {}
