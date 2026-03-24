import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { StateAndCode } from 'src/onboarding/entities/state_and_codes.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class StateAndCodeRepository extends Repository<StateAndCode> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(StateAndCode, dataSource.createEntityManager());
  }
}
