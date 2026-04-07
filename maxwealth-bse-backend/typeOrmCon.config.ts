
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';


config();

const configService = new ConfigService();

const tenant_list_string = configService.get('TENANTS_LIST') || 'maxwealth';

const tenants_array = tenant_list_string
  .split(',')
  .map((tenant) => tenant.trim())
  .filter((tenant) => tenant.length > 0);


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
    "connectorPackage": "mysql2",
    "host": configService.get('MILES_MYSQL_HOST') || '127.0.0.1',
    "port": Number(configService.get('MILES_MYSQL_PORT') || 3306),
    "username": configService.get('MILES_MYSQL_USER') || 'root',
    "password": configService.get('MILES_MYSQL_PASSWORD') || '',
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
    "connectorPackage": "mysql2",
    "host": configService.get('MYSQL_HOST') || '127.0.0.1',
    "port": Number(configService.get('MYSQL_PORT') || 3306),
    "username": configService.get('MYSQL_USER') || 'root',
    "password": configService.get('MYSQL_PASSWORD') || '',
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