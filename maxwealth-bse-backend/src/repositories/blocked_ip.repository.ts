import { Inject, Injectable, Scope } from '@nestjs/common';
import { BlockedIp } from 'src/users/entities/blocked_ips.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class BlockedIpRepository extends Repository<BlockedIp> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BlockedIp, dataSource.createEntityManager());
  }
}
