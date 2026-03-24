import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockedIp } from '../../users/entities/blocked_ips.entity';
import * as TypeORM from 'typeorm';
import ormconfig from '../../../typeOrmCon.config';
import { AppService } from 'src/app.service';

@Injectable()
export class IpBlockService {
  constructor() {} // private readonly blockedIpRepository: BlockedIpRepository

  async blockIp(ip: string, tenant_id): Promise<void> {
    // Check if IP is already blocked
    console.log('try this outttt');
    const connection: TypeORM.DataSource = await this.get_datasource(tenant_id);
    console.log('try this outttt 1');

    const existing = await connection
      .getRepository(BlockedIp)
      .findOneBy({ ip: ip });

    console.log('try this outttt 2', existing);

    if (!existing) {
      console.log('try this outttt 3');

      const blockedIp = new BlockedIp();
      blockedIp.ip = ip;
      await connection.getRepository(BlockedIp).save(blockedIp);
    }
  }

  async isBlocked(ip: string, tenant_id): Promise<boolean> {
    console.log('OYE OYE');
    const connection: TypeORM.DataSource = await this.get_datasource(tenant_id);
    const blockedIp = await connection
      .getRepository(BlockedIp)
      .findOneBy({ ip });
    return !!blockedIp;
  }

  async get_datasource(tenant) {
    let connection: any;
    let connectionOfPool: TypeORM.DataSource;
    for (const datasource of ormconfig['configurations']) {
      console.log('datasource ss', datasource.database);
      console.log('datasource tt', tenant);

      if (datasource.database == tenant) {
        // console.log("CONECTED",AppService.dbConnectionPool[tenant]);
        connectionOfPool = AppService.dbConnectionPool[tenant]; // this is mindstacks static variable

        if (connectionOfPool && connectionOfPool.isInitialized) {
          connection = connectionOfPool;
          console.log('already INITIALISED BRO');
        } else {
          connection = await new TypeORM.DataSource(datasource);
          await connection.initialize();

          AppService.dbConnectionPool[tenant] = connection;

          console.log(' INITIALISED BRO');
        }

        break;
      }
    }
    return connection;
  }
}
