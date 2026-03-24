import { Module } from '@nestjs/common';
import { MastersService } from './masters.service';
import { MastersController } from './masters.controller';
import { OccupationRepository } from 'src/repositories/occupation.repository';
import { AddressTypeRepository } from 'src/repositories/address_type.repository';
import { CountryRepository } from 'src/repositories/country.repository';
import { KycAccountTypeRepository } from 'src/repositories/kyc_account_type.repository';
import { StateAndCodeRepository } from 'src/repositories/state_and_code.repository';
import { TaxResidencyRepository } from 'src/repositories/tax_residency.repository';
import { IncomeRangeRepository } from 'src/repositories/income_range.repository';

@Module({
  providers: [
    MastersService,
    OccupationRepository,
    CountryRepository,
    AddressTypeRepository,
    KycAccountTypeRepository,
    StateAndCodeRepository,
    TaxResidencyRepository,
    IncomeRangeRepository,
  ],
  controllers: [MastersController],
})
export class MastersModule {}
