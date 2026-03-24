import { Inject, Injectable, Scope } from '@nestjs/common';
import { Country } from 'src/onboarding/entities/countries.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class CountryRepository extends Repository<Country> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(Country, dataSource.createEntityManager());
  }
}
