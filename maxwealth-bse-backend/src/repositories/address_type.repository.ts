import { Inject, Injectable, Scope } from '@nestjs/common';
import { AddressType } from 'src/onboarding/entities/address_types.entity';
import { Country } from 'src/onboarding/entities/countries.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class AddressTypeRepository extends Repository<AddressType> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(AddressType, dataSource.createEntityManager());
  }
}
