import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContactDto } from './dtos/contact.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class ZohoService {
  zoho_refresh: string;
  constructor(private readonly httpService: HttpService) {
    const configService = new ConfigService();
    this.zoho_refresh = configService.get('ZOHO_REFRESH');
  }

  async getAccessToken() {
    const axios = require('axios');
    const qs = require('qs');
    const data = qs.stringify({
      refresh_token: this.zoho_refresh,
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      grant_type: 'refresh_token',
    });
    const config = {
      method: 'post',
      url: 'https://accounts.zoho.in/oauth/v2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    };

    const resp = await this.zoho_post_request(
      config.url,
      config.data,
      config.headers,
    );
    console.log('ZOHO TOKEN RESP', resp);
    return resp.data.access_token;
  }

  // https://contacts.zoho.com/api/v1/accounts/self/contacts?source=Application api to create contact

  async createContact(data: ContactDto) {
    const body = { data: [data] };

    const axios = require('axios');
    const qs = require('qs');
    const access_token = await this.getAccessToken();
    const config = {
      method: 'post',
      url: 'https://www.zohoapis.in/crm/v5/Contacts',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token,
      },
      data: body,
    };

    const resp = await this.zoho_post_request(
      config.url,
      config.data,
      config.headers,
    );

    if (resp.status == HttpStatus.OK) {
      console.log('ZOHO CONTACT CREATED', data);
    } else {
      console.log('ZOHO CONTACT FAILED', data);
    }
  }

  async zoho_post_request(url, body, headers) {
    const headersReq = headers;
    const response = this.httpService
      .post(url, body, { headers: headersReq })
      .pipe(
        map((resp) => {
          console.log('FP RESPONSE' + resp);
          console.log('FP RESPONSE' + resp.data);

          return resp.data;
        }),
      )
      .pipe(
        catchError((e) => {
          console.log('RESPONSE ERROR', e.response.data);

          if (
            e.response &&
            e.response.data &&
            e.response.data.error &&
            e.response.data.error.errors
          ) {
            console.log(e.response.data.error);
            e.response.data.error.message = '';
            e.response.data.error.errors.map((er) => {
              e.response.data.error.message +=
                er.field + ' : ' + er.message + ', ';
            });
          }

          throw new ForbiddenException('Something went wrong', e);
        }),
      );

    const result = await lastValueFrom(response);
    console.log('POST RESPONSE RESULT ', result);
    return { status: HttpStatus.OK, data: result };
  }
}
