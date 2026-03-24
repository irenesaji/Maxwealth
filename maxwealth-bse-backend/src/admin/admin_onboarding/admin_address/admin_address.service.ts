import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { UserAddressDetails } from 'src/onboarding/address/entities/user_address_details.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AdminAddressService extends TypeOrmCrudService<UserAddressDetails> {
  // constructor(@InjectRepository(UserAddressDetails) repo) {
  //   super(repo);
  // }

  constructor(@Inject('CONNECTION') dataSource) {
    const userAddressDetailsRepo = new Repository<UserAddressDetails>(
      UserAddressDetails,
      dataSource.createEntityManager(),
    );
    super(userAddressDetailsRepo);
  }
}
