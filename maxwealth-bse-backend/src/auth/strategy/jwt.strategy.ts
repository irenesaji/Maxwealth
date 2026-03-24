import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import * as TypeORM from 'typeorm';
import { UsersRepository } from 'src/repositories/user.repository';
import ormconfig from '../../../typeOrmCon.config';
import { AppService } from 'src/app.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    console.log('try auth obj');
    // console.log(payload);
    console.log('try Payload', payload);
    const tenant_id = req.headers['tenant_id'];

    if (typeof tenant_id == 'undefined') {
      throw new UnauthorizedException();
    }

    const connection: TypeORM.DataSource = await this.get_datasource(tenant_id);
    console.log('try this outttt 1');

    const user = await connection
      .getRepository(Users)
      .findOne({ where: { id: payload.user.id } });

    console.log('useKK', user);

    if (user && user.is_blocked == true) {
      console.log('BBIT', user);
      throw new UnauthorizedException();
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return { payload };
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
