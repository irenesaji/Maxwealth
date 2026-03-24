import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { UserBankDetails } from 'src/onboarding/bank/entities/user_bank_details.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AdminBankService extends TypeOrmCrudService<UserBankDetails> {
  // constructor(@InjectRepository(UserBankDetails) repo) {
  //   super(repo);
  // }

  constructor(@Inject('CONNECTION') dataSource) {
    const userBankDetailsRepo = new Repository<UserBankDetails>(
      UserBankDetails,
      dataSource.createEntityManager(),
    );
    super(userBankDetailsRepo);
  }
}
