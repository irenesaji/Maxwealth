import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Injectable({ scope: Scope.REQUEST }) // here
export class UsersRepository extends Repository<Users> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(Users, dataSource.createEntityManager());
  }
}
