import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
@Injectable()
export class AppService {
  static dbConnectionPool: {} = {};

  getHello(): string {
    return 'Hello World!';
  }

  // getdbConnectionPool(tenant){
  //   console.log("get tenant",tenant);
  //   console.log(this.dbConnectionPool[tenant]);
  //   console.log(this.dbConnectionPool);

  //   if(this.dbConnectionPool[tenant]){

  //     return this.dbConnectionPool[tenant];
  //   }else{
  //     return false;
  //   }
  // }

  // setdbConnectionPool(tenant,datasource){
  //   console.log("set this.dbConnectionPool", this.dbConnectionPool);
  //   this.dbConnectionPool[tenant] = datasource;
  //   console.log("done set this.dbConnectionPool", this.dbConnectionPool);

  // }
}
