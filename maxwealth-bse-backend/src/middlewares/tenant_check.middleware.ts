import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createConnection } from 'net';
import { DataSource, getConnection } from 'typeorm';
import ormconfig from '../../typeOrmCon.config';
import { forEach } from 'mathjs';

@Injectable()
export class TenantCheckMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    let connection: boolean;

    // console.log('Request...',req.headers);
    let tenant_id: string = req.headers.tenant_id
      ? req.headers.tenant_id.toString()
      : null;
    console.log('req.url', req.originalUrl);

    if (req.originalUrl.includes('postback')) {
      const tenant_url_array = req.originalUrl.split('/');

      tenant_id = tenant_url_array[tenant_url_array.length - 1].split('?')[0];
      console.log('GOT tenant from params', tenant_id);
    }

    if (!tenant_id && tenant_id != '' && !req.originalUrl.includes('uploads')) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'No Tenant Sent',
        },
        403,
      );
    }
    connection = false;

    for (const datasource of ormconfig['configurations']) {
      // console.log("datasource ss",datasource);
      if (datasource.database == tenant_id) {
        connection = true;

        // connection = new DataSource(datasource);
        break;
      }
    }

    if (!connection && !req.originalUrl.includes('uploads')) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'No Tenant ' + tenant_id + ' Configured',
        },
        403,
      );
    }

    next();
  }
}
