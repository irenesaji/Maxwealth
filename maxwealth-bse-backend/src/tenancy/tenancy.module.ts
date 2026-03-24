import { Global, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import * as TypeORM from 'typeorm';
import ormconfig from '../../typeOrmCon.config';
import { AppService } from 'src/app.service';

const connectionFactory = {
  provide: 'CONNECTION',
  scope: Scope.REQUEST,
  useFactory: async (req) => {
    let tenant = req.headers.tenant_id;

    if (req.originalUrl.includes('postback')) {
      const tenant_url_array = req.originalUrl.split('/');

      tenant = tenant_url_array[tenant_url_array.length - 1].split('?')[0];
      console.log('GOT tenant from params', tenant);
    }

    let connection: any;
    let connectToDatabase: any;
    let connectionOfPool: TypeORM.DataSource;
    for (const datasource of ormconfig['configurations']) {
      // console.log("datasource ss",datasource.database);
      if (datasource.database == tenant) {
        // console.log("CONECTED",AppService.dbConnectionPool[tenant]);
        connectionOfPool = AppService.dbConnectionPool[tenant]; // this is mindstacks static variable

        connectToDatabase = async () => {
          if (connectionOfPool && connectionOfPool.isInitialized) {
            connection = connectionOfPool;
            console.log('already INITIALISED BRO');
          } else {
            connection = await new TypeORM.DataSource(datasource);
            await connection.initialize();

            AppService.dbConnectionPool[tenant] = connection;

            console.log(' INITIALISED BRO');
          }
          return connection;
        };

        break;
      }
    }
    return connectToDatabase();
  },
  inject: [REQUEST],
};

@Global()
@Module({
  providers: [connectionFactory],
  exports: ['CONNECTION'],
})
export class TenancyModule {}
