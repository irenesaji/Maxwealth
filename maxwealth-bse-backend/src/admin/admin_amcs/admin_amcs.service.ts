import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Amc } from 'src/amcs/entities/amc.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AdminAmcsService extends TypeOrmCrudService<Amc> {
  // constructor(@InjectRepository(Goal) repo) {
  //   super(repo);
  // }

  constructor(@Inject('CONNECTION') dataSource) {
    const amcRepo = new Repository<Amc>(Amc, dataSource.createEntityManager());
    super(amcRepo);
  }
}
