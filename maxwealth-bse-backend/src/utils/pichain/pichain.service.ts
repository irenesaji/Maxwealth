import { HttpService } from '@nestjs/axios';
import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, lastValueFrom, map } from 'rxjs';
import { Pennydrops } from 'src/onboarding/bank/entities/pennydrops.entity';
import { UserBankDetails } from 'src/onboarding/bank/entities/user_bank_details.entity';
import { PennydropsRepository } from 'src/repositories/pennydrops.repository';
import { Repository } from 'typeorm';

@Injectable()
export class PichainService {
  pichain_base_url: string;
  pichain_api_key: string;
  pichain_org_id: string;
  pichain_mode: string;

  constructor(
    private readonly httpService: HttpService,
    // @InjectRepository(Pennydrops)
    // private pennyDropsRepository: Repository<Pennydrops>,

    private pennyDropsRepository: PennydropsRepository,
  ) {
    const configService = new ConfigService();
    this.pichain_base_url = configService.get('PICHAIN_BASE_URL');
    this.pichain_api_key = configService.get('PICHAIN_APIKEY');
    this.pichain_org_id = configService.get('PICHAIN_ORG_ID');
    this.pichain_mode = configService.get('PICHAIN_MODE');
  }

  async get_pan_details(pan: string) {
    try {
      const body = { pan: pan };
      const url = this.pichain_base_url + '/v3/pan_fetch_advance';
      const response = await this.post_request(url, body);
      response.data = response.data.data;
      return response;
    } catch (error) {
      return { status: HttpStatus.BAD_REQUEST, data: error.message };
    }
  }

  async post_request(url: string, body: any) {
    const headersReq = {
      'Content-Type': 'application/json', // afaik this one is not needed

      apikey: this.pichain_api_key,
      'org-id': this.pichain_org_id,
      'auth-type': this.pichain_mode,
    };
    const response = this.httpService
      .post(url, body, { headers: headersReq })
      .pipe(
        map((resp) => {
          console.log('PICHAIN RESPONSE' + resp);
          console.log('PICHAIN RESPONSE DATA ' + resp.data);

          return resp.data;
        }),
      )
      .pipe(
        catchError((e) => {
          console.log('PICHAIN ERROR RESPONSE', e);

          if (
            e.response &&
            e.response.data &&
            e.response.data.status &&
            e.response.data.status.statusMessage
          ) {
            console.log('PICHAIN Error', e.response);
            return e.response.data;
          } else {
            return {
              status: HttpStatus.BAD_REQUEST,
              data: 'Something went wrong',
            };
          }
        }),
      );

    const result = await lastValueFrom(response);
    console.log('POST RESPONSE RESULT ', result);
    if (result.code == 200) {
      return { status: HttpStatus.OK, data: result };
    } else {
      return { status: result.code, data: result };
    }
  }

  async verify_bank_penny_drop(bank_account: UserBankDetails) {
    try {
      const body = {
        account_number: bank_account.account_number,
        ifsc: bank_account.ifsc_code,
        name_match: true,
        name: bank_account.account_holder_name,
      };

      console.log('Body', body);
      const url = this.pichain_base_url + '/v1/account_verification';
      const post_response = await this.post_request(url, body);
      console.log('resp of account verification', post_response.data);
      console.log(
        'post_response.data.data.account_status',
        post_response.data.data.account_status,
      );
      console.log(
        'post_response.data.name_match',
        post_response.data.data.name_match,
      );

      if (post_response.status == HttpStatus.OK) {
        const pennyDrop = new Pennydrops();
        pennyDrop.account_number = body.account_number;
        pennyDrop.ifsc = body.ifsc;
        pennyDrop.name = bank_account.account_holder_name;
        pennyDrop.is_bank_valid =
          post_response.data.data.account_status == 'COMPLETED' ? true : false;
        pennyDrop.name_match_valid =
          post_response.data.data.name_match.match_result == 'FULL MATCH'
            ? true
            : false;
        await this.pennyDropsRepository.save(pennyDrop);
      }
      return post_response;
    } catch (error) {
      return { status: HttpStatus.BAD_REQUEST, data: error.message };
    }
  }

  async match_names(name_one: string, name_two: string) {
    try {
      const body = {
        nameBlock: {
          name1: name_one,
          name2: name_two,
        },
      };

      console.log('Body', body);
      const url = this.pichain_base_url + '/v3/name_match';
      const post_response = await this.post_request(url, body);
      console.log('resp', post_response.data);
      return post_response;
    } catch (error) {
      return { status: HttpStatus.BAD_REQUEST, data: error.message };
    }
  }
}
