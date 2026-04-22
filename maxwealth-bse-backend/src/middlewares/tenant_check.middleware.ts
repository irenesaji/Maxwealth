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

    // Skip tenant check for certain routes
    const skipTenantRoutes = ['/api/auth', '/uploads', '/health', '/api/v1/ai', '/html-cleaner'];
    const shouldSkip = skipTenantRoutes.some(route => req.originalUrl.includes(route));
    
    if (shouldSkip) {
      console.log('Skipping tenant check for route:', req.originalUrl);
      next();
      return;
    }

    let tenant_id: string = req.headers.tenant_id
      ? req.headers.tenant_id.toString()
      : 'maxwealth'; // Default to maxwealth if not provided
    
    console.log('req.url', req.originalUrl);
    console.log('tenant_id from headers:', tenant_id);

    if (req.originalUrl.includes('postback')) {
      const tenant_url_array = req.originalUrl.split('/');
      tenant_id = tenant_url_array[tenant_url_array.length - 1].split('?')[0];
      console.log('GOT tenant from params', tenant_id);
    }

    if (!tenant_id) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'No Tenant Sent',
        },
        403,
      );
    }
    
    connection = false;

    console.log('Available configurations:', ormconfig['configurations'].map(c => c.database));
    for (const datasource of ormconfig['configurations']) {
      console.log('Checking datasource:', datasource.database, 'against:', tenant_id);
      if (datasource.database == tenant_id) {
        connection = true;
        break;
      }
    }

    if (!connection) {
      console.error(`Tenant "${tenant_id}" not found in configurations`);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `No Tenant ${tenant_id} Configured`,
        },
        403,
      );
    }

    console.log(`Tenant "${tenant_id}" validated successfully`);
    next();
  }
}
