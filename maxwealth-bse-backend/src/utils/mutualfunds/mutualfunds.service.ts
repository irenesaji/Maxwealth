import { HttpService } from '@nestjs/axios';
import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class MutualfundsService {
  mf_base_url: string;

  constructor(private readonly httpService: HttpService) {
    const configService = new ConfigService();
    this.mf_base_url = configService.get('MF_BASE_URL');
  }

  async searchFundbyName(name: string) {
    try {
      const url =
        this.mf_base_url +
        '/api/v1/mutual_funds/explore/search_plans_by_name?name=' +
        name;
      const response = await this.mf_get_request(url);

      return response;
    } catch (ex) {
      return { status: HttpStatus.BAD_REQUEST, error: ex.message };
    }
  }

  async mf_get_stylebox(isin: string) {
    try {
      const url =
        this.mf_base_url +
        '/api/v1/mutual_funds/explore/get_fund_stylebox?isin=' +
        isin;
      const response = await this.mf_get_request(url);

      return response;
    } catch (ex) {
      return { status: HttpStatus.BAD_REQUEST, data: ex.message };
    }
  }

  async fund_allocation_details(fundId: number) {
    try {
      const url =
        this.mf_base_url +
        '/api/v1/mutual_funds/mutual_funds_details/allFundsAllocationEquity?fundPlansId=' +
        fundId;
      const response = await this.mf_get_request(url);
      if (response.data && response.data.data) {
        response.data = response.data.data;
      }
      return response;
    } catch (ex) {
      return { status: HttpStatus.BAD_REQUEST, error: ex.message };
    }
  }

  async findFundsByIsins(smartfundIsinsArray) {
    try {
      const url =
        this.mf_base_url +
        '/api/v1/mutual_funds/explore/explore_mutual_funds_by_isins';
      const body = {
        pageNumber: 1,
        isins: smartfundIsinsArray,
      };

      const response = await this.mf_post_request(url, body);

      return { status: response.status, data: response.data };
    } catch (ex) {
      console.log('errror', ex);
      return { status: HttpStatus.BAD_REQUEST, error: ex.message };
    }
  }

  async findFundsByIsinsv2(smartfundIsinsArray) {
    try {
      const url =
        this.mf_base_url +
        '/api/v1/mutual_funds/explore/explore_all_mutual_funds_by_isins';
      const body = {
        pageNumber: 1,
        isins: smartfundIsinsArray,
      };

      const response = await this.mf_post_request(url, body);

      return { status: response.status, data: response.data };
    } catch (ex) {
      console.log('errror', ex);
      return { status: HttpStatus.BAD_REQUEST, error: ex.message };
    }
  }

  async filterFundsByCategoryIds(categoryIds, pagenumber) {
    try {
      const url = this.mf_base_url + '/api/v1/mutual_funds/filter/filter_funds';
      const body = {
        categoryIds: categoryIds,
        ratings: [],
        aumRange: [],
        amcIds: [],
        minSip: [],
        lockIn: 2,
        isDividend: false,
        retType: 'year5',
        retOrder: 'DESC',
        minBeta: -100,
        maxBeta: 100,
        minAlpha: -100,
        maxAlpha: 100,
        minStandardDeviation: -100,
        maxStandardDeviation: 100,
        limit: 10,
        pageNumber: pagenumber,
      };

      const response = await this.mf_post_request(url, body);

      return response;
    } catch (ex) {
      return { status: HttpStatus.BAD_REQUEST, error: ex.message };
    }
  }

  async get_systematic_validations_by_planId(fundPlansId: number) {
    try {
      const url =
        this.mf_base_url +
        '/api/v1/mutual_funds/mutual_funds_details/getSystematicValidationsByPlanId?fundPlansId=' +
        fundPlansId;
      const response = await this.mf_get_request(url);

      if (response && response.data) {
        if (response.data.data) {
          response.data = response.data.data;
        } else {
          // Handle case when 'data' is null
          console.error(
            'Error: No data returned from API for fundPlansId:',
            fundPlansId,
          );
          return {
            status: HttpStatus.NO_CONTENT,
            message: 'No data found for the provided planId.',
          };
        }
      } else {
        console.error('Error: Malformed response', response);
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Malformed API response.',
        };
      }

      return response;
    } catch (err) {
      console.error('Error fetching systematic validations:', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async getFundDetails(plan_id: number) {
    try {
      const url =
        this.mf_base_url +
        '/api/v1/mutual_funds/mutual_funds_details/get_fund_plan_by_plan_id?fundPlanId=' +
        plan_id;

      const response = await this.mf_get_request(url);
      if (response.data && response.data.data) {
        response.data = response.data.data;
      }
      return response;
    } catch (ex) {
      return { status: HttpStatus.BAD_REQUEST, error: ex.message };
    }
  }

  async getFundDetailsByIsins(isins: string[]) {
    try {
      const url =
        this.mf_base_url +
        '/api/v1/mutual_funds/mutual_funds_details/get_fund_plan_by_isins';
      const body = {
        pageNumber: 1,
        isins: isins,
      };
      const response = await this.mf_post_request(url, body);
      if (response.data && response.data.data) {
        response.data = response.data.data;
      }
      return response;
    } catch (ex) {
      return { status: HttpStatus.BAD_REQUEST, error: ex.message };
    }
  }

  async getFundNavGraph(plan_id: number, duration: number) {
    try {
      const url =
        this.mf_base_url +
        '/api/v1/mutual_funds/mutual_funds_details/get_graph_by_plan_id?fundPlanId=' +
        plan_id +
        '&duration=' +
        duration;

      const response = await this.mf_get_request(url);
      if (response.data && response.data.data) {
        response.data = response.data.data;
      }
      return response;
    } catch (ex) {
      return { status: HttpStatus.BAD_REQUEST, error: ex.message };
    }
  }

  async mf_get_request(url) {
    const headersReq = {
      'Content-Type': 'application/json', // afaik this one is not needed
    };
    const response = this.httpService
      .get(url, { headers: headersReq })
      .pipe(
        map((resp) => {
          if (typeof resp.data != 'undefined') {
            console.log('FP RESPONSE DATA' + resp.data);

            return resp.data;
          } else {
            console.log('FP RESPONSE' + resp);

            return resp;
          }
        }),
      )
      .pipe(
        catchError((e) => {
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

          throw new ForbiddenException(e.response.data.error, e.message);
        }),
      );

    const result = await lastValueFrom(response);
    console.log('RESULT', result);
    return { status: HttpStatus.OK, data: result };
  }

  async mf_post_request(url, body) {
    const headersReq = {
      'Content-Type': 'application/json', // afaik this one is not needed
    };
    const response = this.httpService
      .post(url, body, { headers: headersReq })
      .pipe(
        map((resp) => {
          // console.log("MF RESPONSE", resp);
          return resp.data;
        }),
      )
      .pipe(
        catchError((e) => {
          console.log(e);

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

          throw new ForbiddenException(e.response.data.error, e.message);
        }),
      );

    const result = await lastValueFrom(response);
    console.log(result);
    if (result.data) {
      return { status: HttpStatus.OK, data: result.data };
    } else {
      return { status: HttpStatus.OK, data: result };
    }
  }
}
