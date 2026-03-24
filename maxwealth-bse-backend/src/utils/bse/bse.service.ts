import { HttpService } from '@nestjs/axios';
import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';
import * as qs from 'qs';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class BseService {
  bse_token: string;
  bse_tenant_id: string;
  bse_base_url: string;
  bse_user_name: string;
  bse_password: string;
  constructor(private readonly httpService: HttpService) {
    const configService = new ConfigService();
    this.bse_user_name = configService.get('SANDBOX_USERNAME');
    this.bse_password = configService.get('SANDBOX_PASSWORD');
    this.bse_base_url = configService.get('SANDBOX_BASE_URL');
  }

  async access_token() {
    try {
      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        // "Authorisation":
      };
      const bodyRequest = {
        data: {
          username: this.bse_user_name,
          password: this.bse_password,
        },
      };
      console.log('body_req', bodyRequest);

      const response = this.httpService
        .post(this.bse_base_url + '/api/login', bodyRequest, {
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
            console.log('error in fp auth re ', e.response.data);
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

      console.log('resPNose', response);
      const result = await lastValueFrom(response);
      console.log('access_result.data', result);
      console.log('access_result', result.data);
      return { status: HttpStatus.OK, token: result.data };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async add_ucc(body: any) {
    try {
      const token: any = await this.access_token();
      console.log('took', token.token.access_token);
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        Authorization: `Bearer ${token.token.access_token}`,
      };

      const bodyRequest = {
        data: body,
      };
      console.log('BRD', bodyRequest);
      // let stringbody=JSON.stringify(bodyRequest)
      // let json_body=JSON.parse(stringbody)

      // console.log("BR1D",stringbody)
      // console.log("B2RD",json_body)

      const response = this.httpService
        .post(this.bse_base_url + '/api/v2/add_ucc', bodyRequest, {
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
            // throw new ForbiddenException();
            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      console.log('errorr', e);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async update_ucc(body) {
    try {
      const token: any = await this.access_token();
      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${token.data.access_token}`,
      };

      const bodyRequest = qs.stringify({
        data: body,
      });

      const response = this.httpService
        .post(this.bse_base_url + '/v2/update_ucc', bodyRequest, {
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
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async update_bank_details_add(body) {
    try {
      const token: any = await this.access_token();
      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${token.data.access_token}`,
      };

      const bodyRequest = qs.stringify({
        data: body,
      });

      const response = this.httpService
        .post(this.bse_base_url + '/v2/update_ucc', bodyRequest, {
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
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async update_bank_details_delete(body) {
    try {
      const token: any = await this.access_token();
      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${token.data.access_token}`,
      };

      const bodyRequest = qs.stringify({
        data: body,
      });

      const response = this.httpService
        .post(this.bse_base_url + '/v2/update_ucc', bodyRequest, {
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
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async register_nominee(body) {
    try {
      const token: any = await this.access_token();
      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${token.data.access_token}`,
      };

      const bodyRequest = qs.stringify({
        data: body,
      });

      const response = this.httpService
        .post(this.bse_base_url + '/v2/update_ucc', bodyRequest, {
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
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async update_fatca_for_holder(body) {
    try {
      const token: any = await this.access_token();
      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${token.data.access_token}`,
      };

      const bodyRequest = qs.stringify({
        data: body,
      });

      const response = this.httpService
        .post(this.bse_base_url + '/v2/update_ucc', bodyRequest, {
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
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async update_communication_address(body) {
    try {
      const token: any = await this.access_token();
      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${token.data.access_token}`,
      };

      const bodyRequest = qs.stringify({
        data: {
          member: {
            memberid: '...',
            brokercode: '...',
            subbrcode: '...',
            subbrarn: '...',
            euin: '...',
            euinflag: '...',
            partner_id: '',
          },
          clientcode: '',
          holders: [],
        },
      });

      const response = this.httpService
        .post(this.bse_base_url + '/v2/update_ucc', bodyRequest, {
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
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async update_foreign_address(body) {
    try {
      const token: any = await this.access_token();
      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${token.data.access_token}`,
      };

      const bodyRequest = qs.stringify({
        data: {
          member: {
            memberid: '...',
            brokercode: '...',
            subbrcode: '...',
            subbrarn: '...',
            euin: '...',
            euinflag: '...',
            partner_id: '',
          },
          clientcode: '',
          holders: [],
        },
      });

      const response = this.httpService
        .post(this.bse_base_url + '/v2/update_ucc', bodyRequest, {
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
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async update_depository_account_details(body) {
    try {
      const token: any = await this.access_token();
      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${token.data.access_token}`,
      };

      const bodyRequest = qs.stringify({
        data: body,
      });

      const response = this.httpService
        .post(this.bse_base_url + '/v2/update_ucc', bodyRequest, {
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
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async update_person_details(body) {
    try {
      const token: any = await this.access_token();
      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${token.data.access_token}`,
      };

      const bodyRequest = qs.stringify({
        data: body,
      });

      const response = this.httpService
        .post(this.bse_base_url + '/v2/update_ucc', bodyRequest, {
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
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async update_contact_detailsO(body) {
    try {
      const token: any = await this.access_token();
      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${token.data.access_token}`,
      };

      const bodyRequest = qs.stringify({
        data: body,
      });

      const response = this.httpService
        .post(this.bse_base_url + '/v2/update_ucc', bodyRequest, {
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
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async update_identifier_details(body) {
    try {
      const token: any = await this.access_token();
      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${token.data.access_token}`,
      };

      const bodyRequest = qs.stringify({
        data: body,
      });

      const response = this.httpService
        .post(this.bse_base_url + '/v2/update_ucc', bodyRequest, {
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
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async get_ucc(body) {
    try {
      const token: any = await this.access_token();
      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${token.data.access_token}`,
      };

      const bodyRequest = qs.stringify({
        data: body,
      });

      const response = this.httpService
        .post(this.bse_base_url + '/v2/get_ucc', bodyRequest, {
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
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async register_sip(object: any) {
    try {
      const token: any = await this.access_token;
      console.log('atoken', token);
      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${token.access_token}`,
      };

      const bodyRequest = {
        data: object,
      };

      const response = this.httpService
        .post(this.bse_base_url + '/api/sxp_register', bodyRequest, {
          headers: headersRequest,
        })
        .pipe(
          map((resp) => {
            console.log('FPRESPONSE ' + resp);
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
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async register_swp(object: any) {
    try {
      const token: any = await this.access_token;

      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${token.data.access_token}`,
      };

      const bodyRequest = object;

      const response = this.httpService
        .post(this.bse_base_url + '/v2/sxp_register', bodyRequest, {
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
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async register_stp(object: any) {
    try {
      const token: any = await this.access_token;

      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${token.data.access_token}`,
      };

      const bodyRequest = object;

      const response = this.httpService
        .post(this.bse_base_url + '/v2/sxp_register', bodyRequest, {
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
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async create_order_purchase(object: any) {
    try {
      const token: any = await this.access_token();
      console.log('token', token);
      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${token.token.access_token}`,
      };

      const bodyRequest = {
        data: {
          orders: [object],
        },
      };

      const response = this.httpService
        .post(this.bse_base_url + '/api/order_new', bodyRequest, {
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
      return { status: HttpStatus.OK, ...result };
    } catch (err) {
      console.log('error', err);
    }
  }

  async update_order() {}

  async cancel_order() {}

  async order_list() {}

  async get_order() {}

  async sxp_register() {}

  async sxp_update() {}

  async sxp_cancel() {}

  async sxp_topup() {}

  async sxp_set_pause() {}

  async sxp_list() {}

  async sxp_get() {}

  async register_mandate(object: any) {
    try {
      const token: any = await this.access_token();
      console.log('token', token);
      const headersRequest = {
        'X-STARMFv2-Trace-ID': 'ae150a56 - a554 - 4679 - a124-024b8dafe9bc',
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${token.token.access_token}`,
      };

      const bodyRequest = {
        data: object,
      };
      console.log('BBr', bodyRequest);

      const response = this.httpService
        .post(this.bse_base_url + '/api/mandate_register', bodyRequest, {
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

  async cancel_mandate() {}

  async mandate_list() {}

  async mandate_get() {}

  async nft_nominee_change() {}

  async nft_contact_change() {}

  async nft_bank_account_change() {}

  async submit_payment_aggregator() {}

  async get_payment_aggregator() {}
}
