import { HttpStatus, Injectable } from '@nestjs/common';
import { AddressTypeRepository } from 'src/repositories/address_type.repository';
import { CountryRepository } from 'src/repositories/country.repository';
import { IncomeRangeRepository } from 'src/repositories/income_range.repository';
import { KycAccountTypeRepository } from 'src/repositories/kyc_account_type.repository';
import { OccupationRepository } from 'src/repositories/occupation.repository';
import { StateAndCodeRepository } from 'src/repositories/state_and_code.repository';
import { TaxResidencyRepository } from 'src/repositories/tax_residency.repository';

@Injectable()
export class MastersService {
  constructor(
    private occupationRepository: OccupationRepository,
    private countryRepository: CountryRepository,
    private addressTypeRepository: AddressTypeRepository,
    private incomeRangeRepository: IncomeRangeRepository,
    private kycAccountTypeRepository: KycAccountTypeRepository,
    private statesAndCodeRepository: StateAndCodeRepository,
    private taxResidenciesRepository: TaxResidencyRepository,
  ) {}

  async get_occupations() {
    try {
      const result = await this.occupationRepository.find();
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }
  async get_countries() {
    try {
      const result = await this.countryRepository.find();
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_address_types() {
    try {
      const result = await this.addressTypeRepository.find();
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_income_ranges() {
    try {
      const result = await this.incomeRangeRepository.find();
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_kyc_account_types() {
    try {
      const result = await this.kycAccountTypeRepository.find();
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_states() {
    try {
      const result = await this.statesAndCodeRepository.find();
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_tax_residencies() {
    try {
      const result = await this.taxResidenciesRepository.find();
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }
}
