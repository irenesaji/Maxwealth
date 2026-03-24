import { Module } from '@nestjs/common';
import { AdminTaxResidencyService } from './admin_tax_residency.service';
import { AdminTaxResidencyController } from './admin_tax_residency.controller';

@Module({
  providers: [AdminTaxResidencyService],
  controllers: [AdminTaxResidencyController],
})
export class AdminTaxResidencyModule {}
