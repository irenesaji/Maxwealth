import {
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateFintupleDto } from './dto/create-fintuple.dto';
import { UpdateFintupleDto } from './dto/update-fintuple.dto';
import { catchError, lastValueFrom, map } from 'rxjs';
import qs from 'qs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { Onboardingv2Service } from 'src/onboardingv2/onboardingv2.service';

@Injectable()
export class FintupleService {
  esign_base_url: string;
  esign_secret: string;
  esign_client_id: string;
  base_url: string;
  tenant_id: string;

  constructor(
    private userOnboardingRepository: UserOnboardingDetailsRepository,
    private readonly httpService: HttpService,
  ) {
    const configService = new ConfigService();

    this.base_url = configService.get('BASE_URL');
    this.esign_base_url = configService.get('ESIGN_BASE_URL');
    this.esign_client_id = configService.get('ESIGN_CLIENT_ID');
    this.esign_secret = configService.get('ESIGN_CLIENT_SECRET');
    this.tenant_id = configService.get('TENANT_ID');
  }

  async get_esign_token() {
    try {
      const headersRequest = {
        'Content-Type': 'application/json',
      };

      const bodyRequest = {
        clientId: this.esign_client_id,
        clientSecret: this.esign_secret,
      };

      console.log('Body req', bodyRequest);
      const response = this.httpService
        .post(this.esign_base_url + '/esign/auth/client/verify', bodyRequest, {
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
      console.log('Esign Token Generated', result);
      return { status: HttpStatus.OK, result };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async initiate_esign(user_id: any) {
    try {
      const token_response = await this.get_esign_token();
      console.log('Token_Resp', token_response);

      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        Authorization: 'Bearer ' + token_response.result,
      };

      const onboarding = await this.userOnboardingRepository.findOne({
        where: { user_id: user_id },
      });

      const bodyRequest = {
        pdf: onboarding.pdf_buffers,
        title: 'E-Sign',
        reason: 'Investor E-sign',
        redirectUrl: `${this.base_url}/api/fintuple/success`,
        signers: [
          {
            signerName: 'Effy',
            signerEmailAddress: 'effy@fintuple.com',
            signerMobileNumber: '+91-8056145718',
            dateOfBirth: '18-07-1998',
            gender: 'F',
            aadhaarNumber: '',
            signerPan: '',
            webHookURL: `${this.base_url}/api/fintuple/esign/${user_id}/postback/${this.tenant_id}`,
            validationReqd: '0',
            coordinates: [
              {
                x: 55,
                y: 55,
                page: 2,
              },
            ],
          },
        ],
      };
      console.log('Headers', headersRequest);
      console.log('Bodys', bodyRequest);
      const response = this.httpService
        .post(this.esign_base_url + '/esign/initiate', bodyRequest, {
          headers: headersRequest,
        })
        .pipe(
          map((resp) => {
            return resp.data;
          }),
        )
        .pipe(
          catchError((e) => {
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
      return { status: HttpStatus.OK, data: result };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async generate_consent(transaction_id: any) {
    try {
      console.log('Transaction _id', transaction_id);
      const token_response = await this.get_esign_token();
      console.log('Token_Resp', token_response);

      const headersRequest = {
        'Content-Type': 'application/x-www-form-urlencoded', // afaik this one is not needed
        Authorization: 'Bearer ' + token_response.result,
      };

      const bodyRequest = {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: 'Bearer ' + token_response.result,
      };
      console.log('Headers', headersRequest);
      console.log('Bodys', bodyRequest);
      const response = this.httpService
        .post(
          this.esign_base_url + '/esign/client/consent/' + transaction_id,
          bodyRequest,
          { headers: headersRequest },
        )
        .pipe(
          map((resp) => {
            return resp.data;
          }),
        )
        .pipe(
          catchError((e) => {
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
      return { status: HttpStatus.OK, data: result };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async get_pdf(transaction_id: any) {
    try {
      const token_response = await this.get_esign_token();
      console.log('Token_Resp', token_response);

      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        Authorization: 'Bearer ' + token_response.result,
      };

      // const bodyRequest = {
      //   "token": "Bearer " + token_response.result
      // };
      console.log('Headers', headersRequest);
      // console.log("Bodys", bodyRequest)
      const response = this.httpService
        .get(
          this.esign_base_url + '/esign/getPdf?transactionId=' + transaction_id,
          { headers: headersRequest, responseType: 'arraybuffer' },
        )
        .pipe(
          map((resp) => {
            const base64Data = Buffer.from(resp.data, 'binary').toString(
              'base64',
            );
            return base64Data;
          }),
        )
        .pipe(
          catchError((e) => {
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
      return { status: HttpStatus.OK, data: result };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async get_transaction_status(transaction_id: any) {
    try {
      const token_response = await this.get_esign_token();
      console.log('Token_Resp', token_response);

      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        Authorization: 'Bearer ' + token_response.result,
      };

      // const bodyRequest = {
      //   "token": "Bearer " + token_response.result
      // };
      console.log('Headers', headersRequest);
      // console.log("Bodys", bodyRequest)
      const response = this.httpService
        .get(
          this.esign_base_url +
            '/esign/transaction/' +
            transaction_id +
            '/status',
          { headers: headersRequest },
        )
        .pipe(
          map((resp) => {
            return resp.data;
          }),
        )
        .pipe(
          catchError((e) => {
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
      return { status: HttpStatus.OK, data: result };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async esign_postback(data, user_id) {
    try {
      console.log('Data', data);
      console.log('User_id', user_id);

      const onboarding = await this.userOnboardingRepository.findOne({
        where: { user_id: user_id.user_id },
      });
      onboarding.pdf_buffers = data.pdf;
      onboarding.status = 'esign';
      const esigned_onboarding = await this.userOnboardingRepository.save(
        onboarding,
      );
      console.log('Esigned PDF Saved Successfully', esigned_onboarding);
      return { status: HttpStatus.OK };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  dummySuccess() {
    console.log('Esign success');
    return { status: HttpStatus.OK, message: 'Success' };
  }
}
