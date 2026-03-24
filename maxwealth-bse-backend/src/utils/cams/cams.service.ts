import { HttpService } from '@nestjs/axios';
import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import qs from 'qs';
import * as fs from 'fs';
import { catchError, lastValueFrom, map } from 'rxjs';
import * as Buffer from 'buffer';
import FormData from 'form-data';
import { CamsEncryptDecryptService } from '../cams_encrypt_decrypt/cams_encrypt_decrypt.service';

@Injectable()
export class CamsService {
  uat_url: string;
  cams_base_url: string;
  cams_client_code: string;
  cams_client_id: string;
  cams_secret: string;
  cams_user_id: string;
  cams_password: string;
  tenant_id: string;
  cams_encryption_key: string;
  cams_encryption_iv: string;
  digilocker_client_id: string;
  digilocker_client_secret: string;
  digilocker_base_url: string;
  server_base_url: string;
  cams_production_url: string;

  constructor(
    private readonly encryptDecryptService: CamsEncryptDecryptService,
    private readonly httpService: HttpService,
  ) {
    const configService = new ConfigService();

    this.cams_base_url = configService.get('CAMSKRA_LIVEURL');
    this.digilocker_base_url = configService.get('DIGILOCKER_BASE_URL');
    this.cams_user_id = configService.get('CAMSKRA_USER_ID');
    this.cams_password = configService.get('CAMSKRA_PASSWORD');
    this.cams_client_id = configService.get('CAMSKRA_CLIENT_ID');
    this.cams_secret = configService.get('CAMSKRA_CLIENT_SECRET');
    this.cams_encryption_key = configService.get('CAMSKRA_ENCRYPTION_KEY');
    this.cams_encryption_iv = configService.get('CAMSKRA_ENCRYPTION_IV');
    this.cams_client_code = configService.get('CAMSKRA_CLIENT_CODE');
    this.digilocker_client_id = configService.get('DIGILOCKER_CLIENT_ID');
    this.digilocker_client_secret = configService.get(
      'DIGILOCKER_CLIENT_SECRET',
    );
    this.tenant_id = configService.get('TENANT_ID');
    this.uat_url = configService.get('UAT_URL');
    this.server_base_url = configService.get('SERVER_BASE_URL');
    this.cams_production_url = configService.get('CAMS_PRODUCTION_URL');
  }

  async get_cams_token() {
    try {
      const basicAuth = `${this.cams_client_id}:${this.cams_secret}`;
      const encodedAuth = Buffer.Buffer.from(basicAuth).toString('base64');

      const headersRequest = {
        tenant_id: this.tenant_id,
        clientId: this.cams_client_id,
        secretKey: this.cams_secret,
        'Content-Type': 'application/json',
        Authorization: `Basic ${encodedAuth}`,
      };

      const bodyRequest = {
        clientCode: this.cams_client_code,
        grant_type: 'client_credentials',
        scope: 'KRA',
      };

      console.log('Base Url', this.cams_base_url);
      console.log('Body Request', bodyRequest);
      const response = this.httpService
        .post(`${this.cams_base_url}/restAuth/api/v1/getToken`, bodyRequest, {
          headers: headersRequest,
        })
        .pipe(
          map((resp) => {
            console.log('CAMS Response ' + resp);
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
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      console.log('Error in Fetching CAMS Token', e);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch CAMS Token',
      };
    }
  }

  async check_kyc(pan: string) {
    try {
      const token_response = await this.get_cams_token();
      if (token_response.status == 200) {
        const headersRequest = {
          'Content-Type': 'application/json',
          tenant_id: this.tenant_id,
          clientId: this.cams_client_id,
          Authorization: 'Bearer ' + token_response.accessToken,
        };
        console.log('Headers', headersRequest);

        const body = {
          pan: pan,
        };
        console.log('Body', body);

        const encrypted =
          await this.encryptDecryptService.encryptStringToBytesAES(
            JSON.stringify(body),
            this.cams_encryption_key,
            this.cams_encryption_iv,
          );
        console.log('Encrypted', encrypted);

        const bodyRequest = {
          data: encrypted.data,
        };
        console.log('Body Request', bodyRequest);
        console.log('Base Url', this.cams_base_url);

        const response = this.httpService
          .post(
            `${this.cams_base_url}/CAMSWS_KRA/KRA_API/verifyPAN`,
            bodyRequest,
            { headers: headersRequest },
          )
          .pipe(
            map((resp) => {
              console.log('CAMS Response ' + resp);
              return resp.data;
            }),
          )
          .pipe(
            catchError((e) => {
              console.log('Error in Fetching CAMS KYC', e);
              if (e.response && e.response.data && e.response.data.error) {
                console.log('recs', e.response.data.error);
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
        console.log('mes', result);

        const decrypted =
          await this.encryptDecryptService.decryptStringFromBytesAES(
            result.data,
            this.cams_encryption_key,
            this.cams_encryption_iv,
          );
        console.log('Decrypted', decrypted);

        return { status: HttpStatus.OK, data: decrypted.data };
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Something went wrong with our third party integrations please wait and try again',
        };
      }
    } catch (e) {
      console.log('Error in Fetching CAMS', e);
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async digilocker(body: any, web = false) {
    try {
      const encrypt = await this.encryptDecryptService.digilocker_encrypt(body);
      console.log('Encrypt', encrypt);
      if (encrypt.status == 400) {
        return { status: HttpStatus.BAD_REQUEST, message: encrypt.message };
      }

      console.log('Entering Digilocker');

      let return_url;
      if (web == true) {
        return_url =
          this.server_base_url +
          '/api/cams/web/digilocker/' +
          body.user_id +
          '/postback/' +
          this.tenant_id;
      } else {
        return_url =
          this.server_base_url +
          '/api/cams/digilocker/' +
          body.user_id +
          '/postback/' +
          this.tenant_id;
      }

      const formData = new FormData();
      formData.append(
        'Param',
        JSON.stringify({
          ClientID: this.digilocker_client_id,
          ClientSecret: this.digilocker_client_secret,
          ReturnURL: return_url,
          Key: encrypt.key,
          Data: encrypt.data,
          Hash: encrypt.hash,
        }),
      );

      console.log('Form Data', formData);

      const headersRequest = {
        ...formData.getHeaders(), // Important for `multipart/form-data`
        tenant_id: this.tenant_id,
      };

      console.log('Headers', headersRequest);
      console.log('Form Data', formData);
      const url = `${this.digilocker_base_url}/CAMSDigiLocker/CDLHome/HomeScreen`;
      console.log('URL', url);

      const response = this.httpService
        .post(url, formData, { headers: headersRequest })
        .pipe(
          map((resp) => {
            console.log('Digilocker Response', resp);
            return resp.data;
          }),
          catchError((e) => {
            console.log('Error in Fetching Digilocker Data', e);
            if (e.response && e.response.data && e.response.data.error) {
              console.log('recs', e.response.data.error);
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
      console.log('Response Message', result);

      return { status: HttpStatus.OK, data: result };
    } catch (e) {
      console.log('Error in Fetching CAMS Digilocker:', e);
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async fetch_user_mobile(object: any) {
    try {
      // let token: any = await this.access_token();
      // console.log("token", token)
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        'Content-Type': 'application/json',
        // "Authorization": `Bearer ${token.token.access_token}`
      };

      const bodyRequest = {
        Contact_Details_Request: {
          AMCCode: object.amc,
          ApplicationID: object.application_id,
          Password: object.password,
          Folio_No: object.folio,
          PAN: object.pan,
        },
      };
      console.log('BBr', bodyRequest);

      const response = this.httpService
        .post(
          `${this.cams_production_url}/CAMSWS_RD/Services_DIST/Contact_Details`,
          bodyRequest,
          { headers: headersRequest },
        )
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

  async download_pan(pan: string, dob?: Date) {
    try {
      const token_response = await this.get_cams_token();
      if (token_response.status == 200) {
        const headersRequest = {
          'Content-Type': 'application/json',
          tenant_id: this.tenant_id,
          clientId: this.cams_client_id,
          Authorization: 'Bearer ' + token_response.accessToken,
        };
        console.log('Headers', headersRequest);

        const encrypt = {
          pan: pan,
        };
        console.log('Encrypt', encrypt);

        const encrypted =
          await this.encryptDecryptService.encryptStringToBytesAES(
            JSON.stringify(encrypt),
            this.cams_encryption_key,
            this.cams_encryption_iv,
          );
        console.log('Encrypted', encrypted);

        const bodyRequest = {
          data: encrypted.data,
        };
        console.log('Body Request', bodyRequest);

        const response = this.httpService
          .post(
            `${this.cams_base_url}/CAMSWS_KRA/KRA_API/downloadPAN`,
            bodyRequest,
            { headers: headersRequest },
          )
          .pipe(
            map((resp) => {
              console.log('CAMS Response ' + resp);
              return resp.data;
            }),
          )
          .pipe(
            catchError((e) => {
              console.log('Error in Fetching CAMS KYC', e);
              if (e.response && e.response.data && e.response.data.error) {
                console.log('recs', e.response.data.error);
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
        console.log('mes', result);

        const decrypted =
          await this.encryptDecryptService.decryptStringFromBytesAES(
            result.data,
            this.cams_encryption_key,
            this.cams_encryption_iv,
          );
        console.log('Decrypted', decrypted);

        return { status: HttpStatus.OK, data: decrypted.data };
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Something went wrong with our third party integrations please wait and try again',
        };
      }
    } catch (e) {
      console.log('Error in Fetching CAMS KYC', e);
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async upload_pan(body: any) {
    try {
      const token_response = await this.get_cams_token();
      if (token_response.status == 200) {
        const headersRequest = {
          'Content-Type': 'application/json',
          tenant_id: this.tenant_id,
          clientId: this.cams_client_id,
          Authorization: 'Bearer ' + token_response.accessToken,
        };
        console.log('Headers', headersRequest);

        console.log('Encrypt body', body);

        const encrypted =
          await this.encryptDecryptService.encryptStringToBytesAES(
            JSON.stringify(body),
            this.cams_encryption_key,
            this.cams_encryption_iv,
          );
        console.log('Encrypted', encrypted);

        const bodyRequest = {
          data: encrypted.data,
        };
        console.log('Body Request', bodyRequest);

        const response = this.httpService
          .post(
            `${this.cams_base_url}/CAMSWS_KRA/KRA_API/uploadPAN`,
            bodyRequest,
            { headers: headersRequest },
          )
          .pipe(
            map((resp) => {
              console.log('CAMS Response ' + resp);
              return resp.data;
            }),
          )
          .pipe(
            catchError((e) => {
              console.log('Error in Fetching CAMS KYC', e);
              if (e.response && e.response.data && e.response.data.error) {
                console.log('recs', e.response.data.error);
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
        console.log('mes', result);

        const decrypted =
          await this.encryptDecryptService.decryptStringFromBytesAES(
            result.data,
            this.cams_encryption_key,
            this.cams_encryption_iv,
          );
        console.log('Decrypted', decrypted);

        return { status: HttpStatus.OK, data: decrypted.data };
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Something went wrong with our third party integrations please wait and try again',
        };
      }
    } catch (e) {
      console.log('Error in Fetching CAMS KYC', e);
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async digilocker_postback(data, user_id) {
    try {
      console.log('Entering Digilocker Postback');
      console.log('Data', data);
      const jsonData = JSON.parse(data.param);
      console.log('Json Data', jsonData);
      console.log('Dataa Key', jsonData.Key);
      console.log('Data data', jsonData.Data);
      console.log('Data hash', jsonData.Hash);

      const decrypt = await this.encryptDecryptService.digilocker_decrypt(
        jsonData.Data,
        jsonData.Key,
        jsonData.Hash,
        user_id,
      );
      console.log('Decrypt', decrypt);
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'sorry something went wrong ' + err.message,
      };
    }
  }

  dummySuccess() {
    return { status: HttpStatus.OK, message: 'Success' };
  }

  convertPdfToBase64(fileBuffer: Buffer) {
    console.log('Buffer', fileBuffer);
    console.log('FileBuffer', fileBuffer.toString('base64'));
    return { status: HttpStatus.OK, data: fileBuffer.toString('base64') }; // Convert file buffer to Base64
  }
}
