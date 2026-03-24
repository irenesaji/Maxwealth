
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';


config();

const configService = new ConfigService();

const tenant_list_string = configService.get('TENANTS_LIST');

const tenants_array = tenant_list_string.split(",");


var completeConfigs = {};
var typeormOptions = [];
var configurations = [];

var configuration: DataSourceOptions;

for(let tenant of tenants_array){
  tenant = tenant.trim();
  tenant = tenant.replace(/ /g,"_");

  if(tenant == "miles"){
  
  configuration = {
    "type": "mysql",
    "host": configService.get('MILES_MYSQL_HOST'),
    "port": configService.get('MILES_MYSQL_PORT'),
    "username": configService.get('MILES_MYSQL_USER'),
    "password": configService.get('MILES_MYSQL_PASSWORD'),
    "database": tenant,
    "entities": [
      "dist/**/*.entity{.ts,.js}"
    ],
    "migrations": [
      "dist/src/migration/**/*.{js,ts}"
    ],
    "synchronize": false,
    "migrationsRun": true,
    "poolSize": 10,
    "extra": {
      "connectionLimit": 10
    }
    // "subscribers": [EntitySubscriber]
    //logging: true
  };
}else{
  configuration = {
    "type": "mysql",
    "host": configService.get('MYSQL_HOST'),
    "port": configService.get('MYSQL_PORT'),
    "username": configService.get('MYSQL_USER'),
    "password": configService.get('MYSQL_PASSWORD'),
    "database": tenant,
    "entities": [
      "dist/**/*.entity{.ts,.js}"
    ],
    "migrations": [
      "dist/src/migration/**/*.{js,ts}"
    ],
    "synchronize": false,
    "migrationsRun": true,
    "poolSize": 10,
    "extra": {
      "connectionLimit": 10
    }
    // "subscribers": [EntitySubscriber]
    //logging: true
  };
}


typeormOptions.push( TypeOrmModule.forRoot(configuration));
configurations.push(configuration)

}

completeConfigs["configurations"] = configurations;
completeConfigs["typeormOptions"] = typeormOptions;



export default completeConfigs;