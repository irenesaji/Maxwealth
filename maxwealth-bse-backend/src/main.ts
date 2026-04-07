import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { join } from 'path';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import rateLimit from 'express-rate-limit';
// import { IpBlockService } from './utils/ip_block/ip_block.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // const ipBlockService = app.get(IpBlockService);
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow server-to-server and CLI requests that do not send Origin.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`), false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'tenant_id'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      // forbidNonWhitelisted: true,
      // transform: true,
      exceptionFactory: (errors) => {
        const firstError = errors[0];
        const firstConstraintKey = Object.keys(firstError.constraints)[0];
        const message = firstError.constraints[firstConstraintKey];

        return new BadRequestException({
          code: 0,
          message,
        });
      },
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // app.use(
  //   rateLimit({
  //     windowMs:  1 * 60 * 1000, // 1 minutes
  //     max: 50,  // Limit each IP to 100 requests per windowMs
  //     message: 'Too many requests, please try again later.', // Message sent when rate limit is exceeded
  //     handler: async (req, res) => {
  //       let tenantId = req.headers['tenant_id'];
  //       const ip = req.ip;
  //       if (!tenantId) {
  //         if(req.originalUrl.includes("postback")){
  //           let tenant_url_array = req.originalUrl.split("/")

  //             tenantId = tenant_url_array[tenant_url_array.length - 1].split("?")[0];
  //             console.log("GOT tenant from params",tenantId);
  //         }else{
  //           console.log(`Request from IP ${ip} does not have a tenant_id.`);
  //           res.status(400).json({ error: 'Tenant ID is required.' });
  //         }
  //       }

  // // Or req.headers['x-forwarded-for'] for proxied requests
  //       await ipBlockService.blockIp(ip,tenantId); // Block the IP in the database
  //       res.status(429).send('Too many requests, you have been blocked. Please contact support.');
  //     },
  //   }),
  // );

  //   // Middleware to block requests from blocked IPs
  //   app.use(async (req, res, next) => {
  //     const ip = req.ip; // Or req.headers['x-forwarded-for'] for proxied requests
  //     let tenantId = req.headers['tenant_id'] ;
  //     if (!tenantId) {
  //       if(req.originalUrl.includes("postback")){
  //         let tenant_url_array = req.originalUrl.split("/")

  //           tenantId = tenant_url_array[tenant_url_array.length - 1].split("?")[0];
  //           console.log("GOT tenant from params",tenantId);
  //       }else{
  //         console.log(`Request from IP ${ip} does not have a tenant_id.`);
  //         res.status(400).json({ error: 'Tenant ID is required.' });
  //       }
  //     }
  //     else{
  //       if (await ipBlockService.isBlocked(ip,req.headers.tenant_id)) {
  //         res.status(403).send('Your IP has been blocked. Please contact support');
  //       } else {
  //         next();
  //       }
  //     }
  //   });

  const config = new DocumentBuilder()
    .setTitle('Fintech example')
    .setDescription('The Fintech API description')
    .setVersion('1.0')
    .addTag('fintech')
    .setExternalDoc('Postman Collection', '/docs-json')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(3021);
}
bootstrap();
