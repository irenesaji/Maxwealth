import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateKarvyDto } from './dto/create-karvy.dto';
import { UpdateKarvyDto } from './dto/update-karvy.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class KarvyService {
  url: string;
  constructor(private readonly httpService: HttpService) {
    const configService = new ConfigService();
    this.url = configService.get('KFINTECH_URL');
  }

  async encrypt_2fa(object: any) {
    try {
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        'Content-Type': 'application/json',
        'client-id': 'miles_uat',
        'client-secret': '2RZ6tzLznrH3FXf5bTFOA==',
        ENCRYPTION_SALT: 'Kfintech-2FA@2024',
        // "Authorization": `Bearer ${token.token.access_token}`
      };

      const bodyRequest = {
        ARN: 'ARN-280456',
        pan: object.pan, //"DIPPP6907R",
        folio: object.folio,
      };
      console.log('BBr', bodyRequest);

      const response = this.httpService
        .post(`${this.url}/dev/public/encrypt`, bodyRequest, {
          headers: headersRequest,
        })
        .pipe(
          map((resp) => {
            console.log('FRESPONSEP ' + resp);
            return resp.data;
          }),
        )
        .pipe(
          catchError((e) => {
            console.log('error in fp auth ', e);
            if (e.response && e.response.data && e.response.data.error) {
              console.log('Les', e.response.data.error);
              e.response.data.error.message = '';
              e.response.data.error.errors.map((er) => {
                e.response.data.error.message +=
                  er.field + ' : ' + er.message + '. ';
              });
            }

            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log('result', result);
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      console.log('error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async channel_2fa(encryptedData, iv) {
    try {
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        'Content-Type': 'application/json',
        'client-id': 'miles_uat',
        'client-secret': '2RZ6tzLznrH3FXf5bTFOA==',
        ENCRYPTION_SALT: 'Kfintech-2FA@2024',
        // "Authorization": `Bearer ${token.token.access_token}`
      };

      const bodyRequest = {
        encryptedData: encryptedData,
        iv: iv,
      };
      console.log('BBr', bodyRequest);

      const response = this.httpService
        .post(`${this.url}/dev/api/2fa-channel`, bodyRequest, {
          headers: headersRequest,
        })
        .pipe(
          map((resp) => {
            console.log('FRESPONSEP ' + resp);
            return resp.data;
          }),
        )
        .pipe(
          catchError((e) => {
            console.log('error in fp auth ', e);
            if (e.response && e.response.data && e.response.data.error) {
              console.log('Les', e.response.data.error);
              e.response.data.error.message = '';
              e.response.data.error.errors.map((er) => {
                e.response.data.error.message +=
                  er.field + ' : ' + er.message + '. ';
              });
            }

            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log('result', result);
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      console.log('error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async decrypt(encryptedData, iv) {
    try {
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        'Content-Type': 'application/json',
        'client-id': 'miles_uat',
        'client-secret': '2RZ6tzLznrH3FXf5bTFOA==',
        ENCRYPTION_SALT: 'Kfintech-2FA@2024',
        // "Authorization": `Bearer ${token.token.access_token}`
      };

      const bodyRequest = {
        encryptedData: encryptedData,
        iv: iv,
      };
      console.log('BBr', bodyRequest);

      const response = this.httpService
        .post(`${this.url}/dev/public/decrypt`, bodyRequest, {
          headers: headersRequest,
        })
        .pipe(
          map((resp) => {
            console.log('FRESPONSEP ' + resp);
            return resp.data;
          }),
        )
        .pipe(
          catchError((e) => {
            console.log('error in fp auth ', e);
            if (e.response && e.response.data && e.response.data.error) {
              console.log('Les', e.response.data.error);
              e.response.data.error.message = '';
              e.response.data.error.errors.map((er) => {
                e.response.data.error.message +=
                  er.field + ' : ' + er.message + '. ';
              });
            }

            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log('result', result);
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      console.log('error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  create(createKarvyDto: CreateKarvyDto) {
    return 'This action adds a new karvy';
  }

  findAll() {
    return `This action returns all karvy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} karvy`;
  }

  update(id: number, updateKarvyDto: UpdateKarvyDto) {
    return `This action updates a #${id} karvy`;
  }

  remove(id: number) {
    return `This action removes a #${id} karvy`;
  }
}
