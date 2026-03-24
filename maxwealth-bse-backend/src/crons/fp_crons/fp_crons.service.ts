import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { UserReturnsHistory } from 'src/portfolio/entities/user_returns_history.entity';
// import { FintechService } from 'src/utils/fintech/fintech.service';
import {
  Between,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { startOfDay, endOfDay } from 'date-fns';
import { UserSmartReturnsHistory } from 'src/portfolio/entities/user_smart_returns_history.entity';
import { TransactionBasketItems } from 'src/transaction_baskets/entities/transaction_basket_items.entity';
import { forEach } from 'mathjs';
import { Purchase } from 'src/transaction_baskets/entities/purchases.entity';
// import { Msg91Service } from 'src/utils/msg91/msg91.service';
import axios from 'axios';
import msg91 from 'msg91';
import { ConfigService } from '@nestjs/config';
import { FpLumpsumDTO } from 'src/transaction_baskets/dtos/fp_lumpsum.dto';
import { SmartSipConfiguration } from 'src/smartsip_config/entities/smart_sip_configurations.entity';
import { MutualfundsService } from 'src/utils/mutualfunds/mutualfunds.service';
import { SmartSipFunds } from 'src/smartsip_config/entities/smart_sip_funds.entity';
import { TransactionBaskets } from 'src/transaction_baskets/entities/transaction_baskets.entity';
import * as qs from 'qs';
import * as TypeORM from 'typeorm';
import ormconfig from '../../../typeOrmCon.config';
import { AppService } from 'src/app.service';
import { EnablexService } from 'src/utils/enablex/enablex.service';
import { SmsConfiguration } from 'src/users/entities/sms_configuration.entity';
import { Amc } from 'src/amcs/entities/amc.entity';
import { KfintechInvestorMasterFoliosService } from 'src/kfintech_investor_master_folios/kfintech_investor_master_folios.service';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { Users } from 'src/users/entities/users.entity';
import { UserAddressDetails } from 'src/onboarding/address/entities/user_address_details.entity';
import { UserBankDetails } from 'src/onboarding/bank/entities/user_bank_details.entity';
import { UserNomineeDetails } from 'src/onboarding/nominee/entities/user-nominee-details.entity';
import { KycStatusDetail } from 'src/onboarding/entities/kyc_status_details.entity';
import { EmailService } from 'src/email/email.service';
import { Occupation } from 'src/onboarding/entities/occupations.entity';
import { MfPurchasePlan } from 'src/transaction_baskets/entities/mf_purchase_plan.entity';
import { RzpOrder } from 'src/utils/razorpay/entities/rzp_orders.entity';
import { TransactionReports } from 'src/investor-details/entities/transaction-details.entity';
import { Source } from 'src/investor-details/entities/sources.entity';
import { BseXSipOrder } from 'src/transaction_baskets/entities/bsev1_xsip_order.entity';
import { Redemption } from 'src/transaction_baskets/entities/redemptions.entity';
import { SwitchFunds } from 'src/transaction_baskets/entities/switch_funds.entity';
import {
  AggregatedScheme,
  Scheme,
} from 'src/transactions/types/transaction.types';
import { UserReturnsHistoryVerison2 } from 'src/portfolio/entities/user_return_history_v2.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CostInflationIndex } from 'src/transactions/entities/cii.entity';
import { FundDetail } from 'src/fund_details/entities/fund_detail.entity';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { Buffer } from 'buffer';
import * as crypto from 'crypto';
import * as path from 'path';
import { CapitalGainDto } from 'src/portfolio/dtos/capitalgain.dto';
import { CapitalGainReport } from 'src/portfolio/entities/capital_gain_reports.entity';
import { CamsService } from 'src/utils/cams/cams.service';
import { months } from 'moment';
import { Raw } from 'typeorm';
@Injectable()
export class FpCronsService {
  customerSupportNumber: string;
  tenant_list: string;
  configService: any;
  broke_code: any;
  mf_base_url: string;
  filepath: string;
  private readonly digilocker_aes_key: Buffer;
  private readonly digilocker_aes_iv: Buffer;
  private digilocker_public_key: string;
  private our_public_key: string;
  private our_private_key: string;
  private digilocker_user_id: string;
  private digilocker_password: string;
  private intermediary_code: string;
  private node_options: string;
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
    // @InjectRepository(UserOnboardingDetails)
    // private onboardingRepository: Repository<UserOnboardingDetails>,
    // @InjectRepository(UserReturnsHistory)
    // private userReturnsHistoryRepository : Repository<UserReturnsHistory>,
    // @InjectRepository(UserSmartReturnsHistory)
    // private userSmartReturnsHistoryRepository : Repository<UserSmartReturnsHistory>,
    // @InjectRepository(TransactionBasketItems)
    // private transactionBasketItemsRepository: Repository<TransactionBasketItems>,
    // @InjectRepository(TransactionBaskets)
    // private transactionBasketsRepository: Repository<TransactionBaskets>,
    // @InjectRepository(SmartSipConfiguration)
    // private smartSipConfigurationRepository: Repository<SmartSipConfiguration>,
    // @InjectRepository(SmartSipFunds)
    // private smartSipFundsRepository: Repository<SmartSipFunds>,

    // @InjectRepository(Purchase)
    // private purchasesRepository: Repository<Purchase>,
    // @InjectRepository(Amc)
    // private amcsRepo: Repository<Amc>,
    // @InjectRepository(Users)
    // private usersRepo: Repository<Users>,
    // @InjectRepository(UserAddressDetails)
    // private addressRepo: Repository<UserAddressDetails>,
    // @InjectRepository(UserBankDetails)
    // private userbankRepo: Repository<UserBankDetails>,
    // @InjectRepository(UserNomineeDetails)
    // private userNomineeRepo: Repository<UserNomineeDetails>,
    // @InjectRepository(KycStatusDetail)
    // private kycDetailsRepo: Repository<KycStatusDetail>,

    private readonly httpService: HttpService,
    // private readonly camsService: CamsService,
    private readonly emailService: EmailService,
    private readonly transactionsService: TransactionsService,

    // private fintechService: FintechService,
    // private msg91Service: Msg91Service,
    private mutualfundsService: MutualfundsService, // private kfintechInvestorMasterFoliosService: KfintechInvestorMasterFoliosService // private readonly enablexService: EnablexService,
  ) {
    this.configService = new ConfigService();
    this.customerSupportNumber = this.configService.get(
      'CUSTOMER_SUPPORT_NUMBER',
    );
    this.tenant_list = this.configService.get('TENANTS_LIST');
    this.mf_base_url = this.configService.get('MF_BASE_URL');
    this.broke_code = this.configService.get('BROK_CD');
    this.filepath = this.configService.get('FILE_PATH');
    this.digilocker_aes_key = Buffer.from(
      process.env.DIGILOCKER_AES_KEY,
      'base64',
    );
    this.digilocker_aes_iv = Buffer.from(
      process.env.DIGILOCKER_AES_IV,
      'base64',
    );
    this.digilocker_public_key = process.env.DIGILOCKER_PUBLIC_KEY;
    this.our_public_key = process.env.DIGILOCKER_CLIENT_PUBLIC_KEY;
    this.our_private_key = process.env.DIGILOCKER_CLIENT_PRIVATE_KEY;
    this.digilocker_user_id = process.env.DIGILOCKER_USER_ID;
    this.digilocker_password = process.env.DIGILOCKER_PASSWORD;
    this.intermediary_code = process.env.INTERMEDIARY_ID;
    this.node_options = process.env.NODE_OPTIONS;
    this.cams_base_url = process.env.CAMSKRA_LIVEURL;
    this.digilocker_base_url = process.env.DIGILOCKER_BASE_URL;
    this.cams_user_id = process.env.CAMSKRA_USER_ID;
    this.cams_password = process.env.CAMSKRA_PASSWORD;
    this.cams_client_id = process.env.CAMSKRA_CLIENT_ID;
    this.cams_secret = process.env.CAMSKRA_CLIENT_SECRET;
    this.cams_encryption_key = process.env.CAMSKRA_ENCRYPTION_KEY;
    this.cams_encryption_iv = process.env.CAMSKRA_ENCRYPTION_IV;
    this.cams_client_code = process.env.CAMSKRA_CLIENT_CODE;
    this.digilocker_client_id = process.env.DIGILOCKER_CLIENT_ID;
    this.digilocker_client_secret = process.env.DIGILOCKER_CLIENT_SECRET;
    this.tenant_id = process.env.TENANT_ID;
    this.uat_url = process.env.UAT_URL;
    this.server_base_url = process.env.SERVER_BASE_URL;
    this.cams_production_url = process.env.CAMS_PRODUCTION_URL;
  }

  async get_datasource(tenant) {
    let connection: any;
    let connectionOfPool: TypeORM.DataSource;
    for (const datasource of ormconfig['configurations']) {
      console.log('datasource ss', datasource.database);
      console.log('datasource tt', tenant);

      if (datasource.database == tenant) {
        // console.log("CONECTED",AppService.dbConnectionPool[tenant]);
        connectionOfPool = AppService.dbConnectionPool[tenant]; // this is mindstacks static variable

        if (connectionOfPool && connectionOfPool.isInitialized) {
          connection = connectionOfPool;
          console.log('already INITIALISED BRO');
        } else {
          connection = await new TypeORM.DataSource(datasource);
          await connection.initialize();

          AppService.dbConnectionPool[tenant] = connection;

          console.log(' INITIALISED BRO');
        }

        break;
      }
    }
    return connection;
  }

  // async get_fp_token(maxwealth_tenant_id) {

  //     try {

  //         let fp_base_url = this.configService.get(maxwealth_tenant_id.toUpperCase() + "_FINTECH_BASE_URL");

  //         let fp_secret = this.configService.get(maxwealth_tenant_id.toUpperCase() + "_FINTECH_SECRET_KEY");
  //         let fp_client_id = this.configService.get(maxwealth_tenant_id.toUpperCase() + "_FINTECH_CLIENT_ID");
  //         let fp_tenant_id = this.configService.get(maxwealth_tenant_id.toUpperCase() + "_FINTECH_TENANT_ID");
  //         let fp_email = this.configService.get(maxwealth_tenant_id.toUpperCase() + "_FINTECH_EMAIL");
  //         let fp_password = this.configService.get(maxwealth_tenant_id.toUpperCase() + "_FINTECH_PASSWORD");

  //         let tenant_id = maxwealth_tenant_id;

  //         const headersRequest = {
  //             // afaik this one is not needed
  //             'x-tenant-id': fp_tenant_id,
  //             "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  //         };

  //         const bodyRequest = qs.stringify({
  //             "client_id": fp_client_id,
  //             "client_secret": fp_secret,
  //             "grant_type": "client_credentials"
  //         });

  //         console.log("this.fp_tenant_id", bodyRequest);
  //         var response = this.httpService.post(fp_base_url + '/v2/auth/' + fp_tenant_id + '/token', bodyRequest, { headers: headersRequest }).pipe(
  //             map((resp) => {
  //                 console.log("FRESPONSEP " + resp);
  //                 return resp.data;
  //             }),
  //         ).pipe(
  //             catchError((e) => {
  //                 console.log("error in fp auth ", e);
  //                 if (e.response && e.response.data && e.response.data.error) {
  //                     console.log(e.response.data.error);
  //                     e.response.data.error.message = "";
  //                     e.response.data.error.errors.map((er) => { e.response.data.error.message += er.field + " : " + er.message + ". " });

  //                 }

  //                 throw new ForbiddenException(e.response.data.error, e.message);
  //             }),
  //         );

  //         var result = await lastValueFrom(response);
  //         console.log(result);
  //         return { status: HttpStatus.OK, ...result };
  //     } catch (e) {

  //         return { status: HttpStatus.BAD_REQUEST, error: "Could not fetch FP Token" };
  //     }

  // }
  // async create_purchase(maxwealth_tenant_id, fp_lumpsum_dto) {
  //     try {
  //         let fp_base_url = this.configService.get(maxwealth_tenant_id.toUpperCase() + "_FINTECH_BASE_URL");
  //         let fp_tenant_id = this.configService.get(maxwealth_tenant_id.toUpperCase() + "_FINTECH_TENANT_ID");

  //         let token_response = await this.get_fp_token(maxwealth_tenant_id);
  //         if (token_response.status == 200) {
  //             let url = fp_base_url + '/v2/mf_purchases';
  //             let body = fp_lumpsum_dto;
  //             console.log("URL", url);
  //             console.log("Body", body);

  //             return await this.fp_post_request(fp_tenant_id, url, token_response.access_token, body);
  //         } else {
  //             return token_response;
  //         }
  //     } catch (e) {
  //         return { status: HttpStatus.BAD_REQUEST, error: e.message };
  //     }
  // }

  // async get_mf_purchase(maxwealth_tenant_id, purchase_id: string) {
  //     try {
  //         let fp_base_url = this.configService.get(maxwealth_tenant_id.toUpperCase() + "_FINTECH_BASE_URL");
  //         let fp_tenant_id = this.configService.get(maxwealth_tenant_id.toUpperCase() + "_FINTECH_TENANT_ID");

  //         let token_response = await this.get_fp_token(maxwealth_tenant_id);
  //         if (token_response.status == 200) {
  //             let url = fp_base_url + '/v2/mf_purchases/' + purchase_id;

  //             let res = await this.fp_get_request(fp_tenant_id, url, token_response.access_token);

  //             return res;
  //         } else {
  //             return token_response;
  //         }
  //     } catch (err) {
  //         return { status: HttpStatus.BAD_REQUEST, error: err.message };
  //     }
  // }

  // async fetch_kyc(maxwealth_tenant_id, kycId: string) {
  //     try {
  //         console.log("KYC ID : ", kycId);
  //         let fp_base_url = this.configService.get(maxwealth_tenant_id.toUpperCase() + "_FINTECH_BASE_URL");
  //         let fp_tenant_id = this.configService.get(maxwealth_tenant_id.toUpperCase() + "_FINTECH_TENANT_ID");

  //         let token_response = await this.get_fp_token(maxwealth_tenant_id);
  //         if (token_response.status == 200) {
  //             const headersRequest = {
  //                 'Content-Type': 'application/json', // afaik this one is not needed
  //                 'x-tenant-id': fp_tenant_id,
  //                 "Authorization": "Bearer " + token_response.access_token
  //             };

  //             var response = this.httpService.get(fp_base_url + '/v2/kyc_requests/' + kycId, { headers: headersRequest }).pipe(
  //                 map((resp) => {
  //                     return resp.data;
  //                 }),
  //             ).pipe(
  //                 catchError((e) => {
  //                     if (e.response && e.response.data && e.response.data.error) {
  //                         console.log(e.response.data.error);
  //                         e.response.data.error.message = "";
  //                         e.response.data.error.errors.map((er) => { e.response.data.error.message += er.field + " : " + er.message + ". " });

  //                     }

  //                     throw new ForbiddenException(e.response.data.error, e.message);
  //                 }),
  //             );

  //             var result = await lastValueFrom(response);
  //             console.log(result);
  //             return { status: HttpStatus.OK, data: result };
  //         }
  //     } catch (e) {
  //         return { status: HttpStatus.BAD_REQUEST, error: "Sorry something went wrong, " + e.message };
  //     }
  // }

  // async get_investment_account_wise_returns(maxwealth_tenant_id: string, fp_investment_account_id: string) {
  //     try {
  //         let fp_base_url = this.configService.get(maxwealth_tenant_id.toUpperCase() + "_FINTECH_BASE_URL");
  //         let fp_tenant_id = this.configService.get(maxwealth_tenant_id.toUpperCase() + "_FINTECH_TENANT_ID");

  //         let token_response = await this.get_fp_token(maxwealth_tenant_id);
  //         if (token_response.status == 200) {
  //             let url = fp_base_url + '/v2/transactions/reports/investment_account_wise_returns';
  //             let body = { "mf_investment_account": fp_investment_account_id };
  //             return await this.fp_post_request(fp_tenant_id, url, token_response.access_token, body);
  //         } else {
  //             return token_response;
  //         }
  //     } catch (err) {
  //         return { status: HttpStatus.BAD_REQUEST, error: err.message };
  //     }
  // }

  // async get_holdings_report(maxwealth_tenant_id: string, old_investment_account_id: number, folios = "", as_on = "") {
  //     try {
  //         let token_response = await this.get_fp_token(maxwealth_tenant_id);
  //         let fp_base_url = this.configService.get(maxwealth_tenant_id.toUpperCase() + "_FINTECH_BASE_URL");
  //         let fp_tenant_id = this.configService.get(maxwealth_tenant_id.toUpperCase() + "_FINTECH_TENANT_ID");

  //         if (token_response.status == 200) {
  //             let url = fp_base_url + '/api/oms/investment_accounts/' + old_investment_account_id.toString() + '/holdings?';
  //             if (folios != "") {
  //                 url += 'folios=' + folios;
  //                 if (as_on != "") {
  //                     url += "&as_on=" + as_on;
  //                 }
  //             }
  //             else if (as_on != "") {
  //                 url += "as_on=" + as_on;
  //             }

  //             console.log("URL OF HOLDING REPORT", url);
  //             let res = await this.fp_get_request(fp_tenant_id, url, token_response.access_token);

  //             return res;
  //         } else {
  //             return token_response;
  //         }
  //     } catch (err) {
  //         return { status: HttpStatus.BAD_REQUEST, error: err.message };
  //     }
  // }

  // async fp_get_request(fp_tenant_id, url, token) {

  //     const headersReq = {
  //         'Content-Type': 'application/json', // afaik this one is not needed
  //         'x-tenant-id': fp_tenant_id,
  //         "Authorization": "Bearer " + token
  //     };
  //     var response = this.httpService.get(url, { headers: headersReq }).pipe(
  //         map((resp) => {
  //             if (typeof resp.data != 'undefined') {
  //                 console.log("FP RESPONSE DATA" + resp.data);

  //                 return resp.data;

  //             } else {
  //                 console.log("FP RESPONSE" + resp);

  //                 return resp;
  //             }
  //         }),
  //     ).pipe(
  //         catchError((e) => {

  //             if (e.response && e.response.data && e.response.data.error && e.response.data.error.errors) {
  //                 console.log(e.response.data.error);
  //                 e.response.data.error.message = "";
  //                 e.response.data.error.errors.map((er) => { e.response.data.error.message += er.field + " : " + er.message + ". " });

  //             }

  //             throw new ForbiddenException(e.response.data.error, e.message);
  //         }),
  //     );

  //     var result = await lastValueFrom(response);
  //     console.log("RESULT", result);
  //     return { status: HttpStatus.OK, data: result };

  // }
  // async fp_post_request(fp_tenant_id, url, token, body) {

  //     const headersReq = {
  //         'Content-Type': 'application/json', // afaik this one is not needed
  //         'x-tenant-id': fp_tenant_id,
  //         "Authorization": "Bearer " + token
  //     };
  //     var response = this.httpService.post(url, body, { headers: headersReq }).pipe(
  //         map((resp) => {
  //             console.log("FP RESPONSE" + resp);
  //             console.log("FP RESPONSE" + resp.data);

  //             return resp.data;
  //         }),
  //     ).pipe(
  //         catchError((e) => {
  //             console.log("FP POST ERROR");

  //             console.log(e.response);

  //             if (e.response && e.response.data && e.response.data.error && e.response.data.error.errors) {
  //                 console.log(e.response.data.error);
  //                 e.response.data.error.message = "";
  //                 e.response.data.error.errors.map((er) => { e.response.data.error.message += er.field + " : " + er.message + ". " });

  //             } else if (e.response && e.response.data && e.response.data.errors) {
  //                 e.response.data['error'] = e.response.data.errors;
  //                 console.log(e.response.data.errors);
  //                 e.response.data.error.message = "";

  //                 let keys = Object.keys(e.response.data.errors);
  //                 for (let key of keys) {
  //                     console.log("KEY --> " + key + " : ", e.response.data.errors[key]);
  //                     e.response.data.errors[key].map((er) => { e.response.data.error.message += key + " : " + er.toString() + ". " });
  //                 }

  //             }

  //             throw new ForbiddenException(e.response.data.error, e.message);
  //         }),
  //     );

  //     var result = await lastValueFrom(response);
  //     console.log("POST RESPONSE RESULT ", result);
  //     return { status: HttpStatus.OK, data: result };

  // }

  // @Cron(CronExpression.EVERY_5_HOURS, { name: 'run_holdings_creation' })
  @Cron(CronExpression.EVERY_DAY_AT_11PM, { name: 'run_holdings_creation' })
  async holdingDataSync() {
    try {
      console.log('CRON UPDATE EVERY MINS', this.tenant_list);
      console.log('STARTED CRON - run_holdings_creation ');

      const tenants_array = this.tenant_list.split(',');
      for (const maxwealth_tenant_id of tenants_array) {
        const connection: TypeORM.DataSource = await this.get_datasource(
          maxwealth_tenant_id,
        );

        // let all_onboarded = await connection.getRepository(UserOnboardingDetails).find({ where: { fp_investment_account_old_id: Not(IsNull()) } })
        const all_onboarded = await connection
          .getRepository(UserOnboardingDetails)
          .find({ where: { is_onboarding_complete: true } });
        console.log('ALL ONBOARDED', all_onboarded.length);
        for (const onboarding of all_onboarded) {
          const date = new Date();
          const today_date = date.toISOString().split('T')[0];
          let userReturns = new UserReturnsHistory();

          const is_exist_return = await connection
            .getRepository(UserReturnsHistory)
            .find({
              where: {
                user_id: onboarding.user_id,
                date: Between(startOfDay(date), endOfDay(date)),
              },
            });
          console.log('IS EXIST ' + is_exist_return.length);
          if (is_exist_return.length > 0) {
            userReturns = is_exist_return[0];
          }
          // let response = await this.get_investment_account_wise_returns(maxwealth_tenant_id, onboarding.fp_investment_account_id);
          const response = await this.investment_account_wise_returns(
            onboarding.user_id.toString(),
          );
          console.log('investment_RESPONSE', response);
          if (response.status == HttpStatus.OK) {
            userReturns.user_id = onboarding.user_id;
            userReturns.date = date;
            userReturns.invested_amount = response.data[0].invested_amount
              ? response.data[0].invested_amount
              : 0;
            userReturns.current_value = Number(response.data[0].current_value)
              ? Number(response.data[0].current_value)
              : 0;
            userReturns.unrealized_gain = Number(
              response.data[0].unrealized_gain,
            )
              ? Number(response.data[0].unrealized_gain)
              : 0;
            userReturns.absolute_return = Number(
              response.data[0].absolute_return,
            )
              ? Number(response.data[0].absolute_return)
              : 0;
            userReturns.cagr = Number(response.data[0].cagr)
              ? Number(response.data[0].cagr)
              : 0;
            // userReturns.xirr = Number(response.data[0].xirr) ? Number(response.data[0].xirr) : 0;
            // userReturns.addjusted_value = Number(response.data[0].a) ? Number(response.data[0].current_value) : 0;

            connection.getRepository(UserReturnsHistory).save(userReturns);
          }
          // if (response.status == HttpStatus.OK) {
          //     userReturns.user_id = onboarding.user_id;
          //     userReturns.date = date;
          //     userReturns.invested_amount = response.data.data.rows.length > 0 ? response.data.data.rows[0][1] : 0;
          //     userReturns.current_value = response.data.data.rows.length > 0 ? response.data.data.rows[0][2] : 0;
          //     userReturns.current_value = response.data.data.rows.length > 0 ? response.data.data.rows[0][2] : 0;
          //     userReturns.unrealized_gain = response.data.data.rows.length > 0 ? response.data.data.rows[0][3] : 0;
          //     userReturns.absolute_return = response.data.data.rows.length > 0 ? response.data.data.rows[0][4] : 0;
          //     userReturns.cagr = response.data.data.rows.length > 0 ? response.data.data.rows[0][5] : 0;
          //     userReturns.xirr = response.data.data.rows.length > 0 ? response.data.data.rows[0][6] : 0;
          //     userReturns.addjusted_value = response.data.data.rows.length > 0 ? response.data.data.rows[0][2] : 0;

          //     connection.getRepository(UserReturnsHistory).save(userReturns);
          // }
        }
      }
    } catch (err) {
      console.log('FP CRON --- HOLDINGS UPDATE WENT WRONG -- ' + err.message);
    }
  }

  async investment_account_wise_returns(
    accountId: string,
    traded_on_to?: string,
    page?: number,
    limit?: number,
  ) {
    console.log('Original accountId:', accountId);
    const tenants_array = this.tenant_list.split(',');
    for (const maxwealth_tenant_id of tenants_array) {
      const connection: TypeORM.DataSource = await this.get_datasource(
        maxwealth_tenant_id,
      );
      const currentInvestedAmount =
        await this.getCurrentInvestedAmountbasedOnScheme(accountId);
      console.log('Current Invested Amount', currentInvestedAmount);

      // Handle "null" string explicitly
      if (
        accountId === 'null' ||
        accountId === null ||
        accountId === undefined
      ) {
        accountId = null;
      }
      console.log('Processed accountId:', accountId);

      const tradedOnDate = traded_on_to
        ? new Date(traded_on_to).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      const queryBuilder = await connection
        .getRepository(TransactionReports)
        .createQueryBuilder('transaction_reports')
        .select('transaction_reports.isin', 'isin')
        .addSelect('transaction_reports.user_id', 'investment_account_id')
        .addSelect('MAX(transaction_reports.rta_scheme_name)', 'scheme_name');

      if (accountId) {
        console.log('Applying accountId filter with value:', accountId);
        queryBuilder.where('transaction_reports.user_id = :accountId', {
          accountId,
        });
      }

      queryBuilder.groupBy(
        'transaction_reports.isin, transaction_reports.user_id',
      );

      if (traded_on_to) {
        queryBuilder.andWhere(
          'transaction_reports.traded_on <= :traded_on_to',
          { traded_on_to },
        );
      }

      const schemes: Scheme[] = await queryBuilder.getRawMany();
      console.log('Transaction Reports:', schemes);

      // Extract the ISIN codes from the schemes
      const isin = schemes.map((scheme) => scheme.isin);
      console.log('ISIN', isin);

      // Fetch fund details for the ISINs
      const fund: any = await this.mutualfundsService.getFundDetailsByIsins(
        isin,
      );
      console.log('Funds', fund);
      // if (fund.)

      // Initialize an object to aggregate schemes by investment account
      const aggregatedSchemes: Record<string, AggregatedScheme> = {};

      // Aggregate data for each scheme
      for (const scheme of schemes) {
        const funds = fund.data.find((item) => item.isinCode === scheme.isin);

        if (!aggregatedSchemes[scheme.investment_account_id]) {
          aggregatedSchemes[scheme.investment_account_id] = {
            investment_account_id: scheme.investment_account_id,
            invested_amount: 0,
            current_value: 0,
            units: 0,
            unrealized_gain: 0,
            user: { id: '', name: '', email: '', mobile: '', role: '' },
          };
        }

        const current_invested = currentInvestedAmount.data.find(
          (item) => item.isin === scheme.isin,
        )?.invested_amount;
        console.log('Current Invested', current_invested);
        const current_units = currentInvestedAmount.data.find(
          (item) => item.isin === scheme.isin,
        )?.units;
        console.log('Current Units', current_units);
        const currentValue = current_units * (funds?.nav || 0);

        // Aggregate values for each investment account
        aggregatedSchemes[scheme.investment_account_id].invested_amount +=
          parseFloat(current_invested as any);
        aggregatedSchemes[scheme.investment_account_id].current_value +=
          currentValue;
        aggregatedSchemes[scheme.investment_account_id].units += parseFloat(
          current_units as any,
        );
        aggregatedSchemes[scheme.investment_account_id].unrealized_gain +=
          currentValue - parseFloat(current_invested as any);
      }

      console.log('Aggregated Schemes', aggregatedSchemes);
      // Map aggregated schemes to a more readable format
      const mappedSchemes = Object.values(aggregatedSchemes).map((scheme) => ({
        investment_account_id: scheme.investment_account_id,
        invested_amount: scheme.invested_amount,
        current_value: scheme.current_value.toFixed(4),
        unrealized_gain: scheme.unrealized_gain.toFixed(4),
        absolute_return:
          scheme.invested_amount === 0
            ? 0
            : ((scheme.unrealized_gain / scheme.invested_amount) * 100).toFixed(
                4,
              ),
        cagr:
          scheme.invested_amount === 0
            ? 0
            : (scheme.current_value / scheme.invested_amount).toFixed(4),

        // xirr: Add XIRR if needed
      }));

      console.log('Mapped schemes', mappedSchemes);
      // Get the total count of records
      const totalCount = mappedSchemes.length;
      console.log('Total Count of Transactions:', totalCount);

      // Apply pagination AFTER all calculations
      let paginatedSchemes = mappedSchemes;
      if (page != null && limit != null) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        paginatedSchemes = mappedSchemes.slice(startIndex, endIndex);
      }

      console.log('Paginated data', paginatedSchemes);
      // let excelfilepath = await this.generateExcelforInvestmentAccount(paginatedSchemes)

      // Return the paginated result with metadata
      return {
        status: HttpStatus.OK,
        data: paginatedSchemes,
        // excelDownloadLink: excelfilepath,
        meta: {
          total: totalCount,
          totalPages: limit ? Math.ceil(totalCount / limit) : 1,
          currentPage: page || 1,
        },
      };
    }
  }

  async getCurrentInvestedAmountbasedOnScheme(
    investmentAccountId?: string,
    scheme?: string[],
    asOn?: string,
  ) {
    const tenants_array = this.tenant_list.split(',');
    for (const maxwealth_tenant_id of tenants_array) {
      const connection: TypeORM.DataSource = await this.get_datasource(
        maxwealth_tenant_id,
      );

      const EPSILON = 1e-10; // Small value to handle floating-point precision issues
      const whereClause: any = {};

      if (investmentAccountId) {
        whereClause.user_id = investmentAccountId;

        if (!scheme) {
          const result = await connection
            .getRepository(TransactionReports)
            .find({
              where: { user_id: parseInt(investmentAccountId) },
              select: ['isin'],
            });

          console.log('Results', result);

          scheme = [...new Set(result.map((record) => record.isin))];
          console.log('Folio Numbers', scheme);
        }
      }

      if (scheme && scheme.length > 0) {
        whereClause.isin = In(scheme);
      }

      if (asOn) {
        whereClause.traded_on = LessThanOrEqual(asOn);
      }

      const transactions = await connection
        .getRepository(TransactionReports)
        .find({
          where: whereClause,
          order: {
            traded_on: 'ASC',
            traded_at: 'ASC',
          },
        });
      console.log('Transactions', transactions);

      const transactionsByFolio = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.isin]) {
          acc[transaction.isin] = [];
        }
        acc[transaction.isin].push(transaction);
        return acc;
      }, {} as Record<string, TransactionReports[]>);

      console.log('Transactions by Folio', transactionsByFolio);

      const folioInvestments: {
        isin: string;
        invested_amount: number;
        units: number;
      }[] = [];

      for (const [isin, folioTransactions] of Object.entries(
        transactionsByFolio,
      )) {
        const transactionsByISIN = folioTransactions.reduce(
          (acc, transaction) => {
            if (!acc[transaction.isin]) {
              acc[transaction.isin] = [];
            }
            acc[transaction.isin].push(transaction);
            return acc;
          },
          {} as Record<string, TransactionReports[]>,
        );

        for (const [isin, isinTransactions] of Object.entries(
          transactionsByISIN,
        )) {
          let investedAmount = 0;
          let currentUnits = 0;

          for (const transaction of isinTransactions) {
            const type = transaction.type;
            const transactionUnits = Number(transaction.units) || 0;
            const transactionAmount = Number(transaction.amount) || 0;

            if (
              [
                'purchase',
                'switch in',
                'transfer in',
                'bonus',
                'switch over in',
                'systematic investment',
                'dividend reinvestment',
                'lateral shift in',
                'ticob',
              ]
                .map((t) => t.toLowerCase())
                .some((t) => type.toLowerCase().includes(t))
            ) {
              currentUnits += transactionUnits;
              investedAmount += transactionAmount;
            } else if (
              ['redemption', 'switch out', 'transfer out', 'lateral shift out']
                .map((t) => t.toLowerCase())
                .some((t) => type.toLowerCase().includes(t))
            ) {
              const source = await connection.getRepository(Source).findOne({
                where: {
                  transaction_report_id: transaction.id,
                },
                relations: ['source_transaction'],
              });

              if (source) {
                const sourceUnits =
                  Number(source.source_transaction.units) || 0;
                const redemptionRatio =
                  sourceUnits !== 0 ? transactionUnits / sourceUnits : 0;

                const purchaseTransaction = isinTransactions.find(
                  (t) => t.id === source.source_transaction_id,
                );

                if (purchaseTransaction) {
                  const purchaseAmount =
                    Number(purchaseTransaction.amount) || 0;
                  investedAmount -= purchaseAmount * redemptionRatio;
                }
              }

              currentUnits -= transactionUnits;
              if (currentUnits < EPSILON) {
                currentUnits = 0;
                investedAmount = 0;
              }
            }
          }

          currentUnits = Math.max(0, currentUnits);
          investedAmount = Math.max(0, investedAmount);

          // Avoid floating-point precision errors
          if (Math.abs(currentUnits) < EPSILON) {
            currentUnits = 0;
          }
          if (Math.abs(investedAmount) < EPSILON) {
            investedAmount = 0;
          }

          folioInvestments.push({
            isin,
            invested_amount: Number(investedAmount.toFixed(4)),
            units: Number(currentUnits.toFixed(4)),
          });
        }
      }

      return { status: HttpStatus.OK, data: folioInvestments };
    }
  }

  // @Cron(CronExpression.EVERY_5_HOURS, { name: 'run_kyc_update' })
  // // @Cron(CronExpression.EVERY_MINUTE, { name: 'run_kyc_update'})
  // async kycDataSync() {
  //     try {
  //         const tenants_array = this.tenant_list.split(",");
  //         for (let maxwealth_tenant_id of tenants_array) {
  //             let connection: TypeORM.DataSource = await this.get_datasource(maxwealth_tenant_id);

  //             let onboardings = await connection.getRepository(UserOnboardingDetails).find({ where: { fp_kyc_status: Not(In(['successful', 'rejected'])) } })
  //             // for (let onb of onboardings) {
  //             //     let fp_kyc_obj = await this.fetch_kyc(maxwealth_tenant_id, onb.kyc_id);
  //             //     if (fp_kyc_obj.status == HttpStatus.OK) {
  //             //         let body = fp_kyc_obj.data;
  //             //         onb.fp_kyc_status = body.status;
  //             //         onb.fp_kyc_reject_reasons = JSON.stringify(body.verification);
  //             //         onb.successful_at = body.successful_at;
  //             //         onb.rejected_at = body.rejected_at;

  //             //         await await connection.getRepository(UserOnboardingDetails).save(onb);

  //             //     } else {
  //             //         console.log("FP KYC FETCH FAILED FP KYC ID: ", onb.kyc_id)
  //             //     }
  //             // }
  //         }
  //     } catch (err) {
  //         console.log("FP CRON --- KYC UPDATE WENT WRONG -- " + err.message);
  //     }
  // }

  // @Cron(CronExpression.EVERY_5_HOURS, { name: 'purchases_sync' })
  // // @Cron(CronExpression.EVERY_MINUTE, { name: 'purchases_sync'})
  // async purchasesSync() {
  //     try {
  //         const tenants_array = this.tenant_list.split(",");
  //         for (let maxwealth_tenant_id of tenants_array) {
  //             let connection: TypeORM.DataSource = await this.get_datasource(maxwealth_tenant_id);

  //             let purchases = await connection.getRepository(Purchase).find({ where: [{ state: 'pending' }, { state: 'submitted' }, { state: 'confirmed' }] })
  //             for (let purchase of purchases) {
  //                 let fp_purchase_obj = await this.get_mf_purchase(maxwealth_tenant_id, purchase.fp_id);
  //                 if (fp_purchase_obj.status == HttpStatus.OK) {
  //                     let body = fp_purchase_obj.data;
  //                     purchase.old_id = body.old_id;
  //                     purchase.state = body.state;
  //                     purchase.folio_number = body.folio_number;
  //                     purchase.cancelled_at = body.cancelled_at;
  //                     purchase.completed_at = body.completed_at;
  //                     purchase.failed_at = body.failed_at;
  //                     purchase.reversed_at = body.reversed_at;
  //                     purchase.submitted_at = body.submitted_at;
  //                     purchase.succeeded_at = body.succeeded_at;
  //                     purchase.scheduled_on = body.scheduled_on;
  //                     purchase.traded_on = body.traded_on;
  //                     purchase.allotted_units = body.allotted_units;
  //                     purchase.traded_on = body.traded_on
  //                     purchase.purchased_price = body.purchased_price;
  //                     purchase.retried_at = body.retried_at;
  //                     purchase.confirmed_at = body.confirmed_at;
  //                     purchase.failure_code = body.failure_code;
  //                     purchase.euin = body.euin;
  //                     purchase.activated_at = body.activated_at;
  //                     purchase.folio_number = body.folio_number;
  //                     purchase.created_at = body.created_at;
  //                     purchase.euin = body.euin;
  //                     purchase.scheme = body.scheme;
  //                     purchase.plan = body.plan;
  //                     await connection.getRepository(Purchase).save(purchase);

  //                 } else {
  //                     console.log("FP Purchase FETCH FAILED FP ID: ", purchase.fp_id)
  //                 }
  //             }
  //         }
  //     } catch (err) {
  //         console.log("FP CRON --- purchases UPDATE WENT WRONG -- " + err.message);
  //     }
  // }

  // @Cron(CronExpression.EVERY_5_HOURS, { name: 'run_smart_holdings_creation' })
  // // @Cron(CronExpression.EVERY_MINUTE, { name: 'run_holdings_creation'})
  // async smartSipHoldingDataSync() {
  //     try {

  //         console.log("STARTED CRON - run_holdings_creation ");
  //         console.log("STARTED CRON - run_holdings_creation ");

  //         const tenants_array = this.tenant_list.split(",");
  //         for (let maxwealth_tenant_id of tenants_array) {
  //             let connection: TypeORM.DataSource = await this.get_datasource(maxwealth_tenant_id);

  //             let smartsip_basket_items = await connection.getRepository(TransactionBasketItems).find({ where: { transaction_type: 'smart_sip', folio_number: Not(IsNull()) } })

  //             for (let smartsip_basket_item of smartsip_basket_items) {

  //                 let date = new Date();
  //                 let today_date = date.toISOString().split('T')[0];
  //                 let userReturns = new UserReturnsHistory();

  //                 let is_exist_return = await connection.getRepository(UserSmartReturnsHistory).find({ where: { transaction_basket_id: smartsip_basket_item.id, date: Between(startOfDay(date), endOfDay(date)) } })
  //                 console.log("IS EXIST " + is_exist_return.length);
  //                 if (is_exist_return.length > 0) {
  //                     userReturns = is_exist_return[0];
  //                 }
  //                 let onboarding = await connection.getRepository(UserOnboardingDetails).findOne({ where: { user_id: smartsip_basket_item.user_id } })

  //                 let response = await this.get_holdings_report(maxwealth_tenant_id, onboarding.fp_investment_account_old_id, smartsip_basket_item.folio_number, today_date);

  //                 if (response.status == HttpStatus.OK) {

  //                     if (response.data.folios.length > 0 && response.data.folios[0].schemes.length > 0) {
  //                         let scheme = response.data.folios[0].schemes[0];
  //                         userReturns.user_id = smartsip_basket_item.user_id;
  //                         userReturns.date = date;
  //                         userReturns.invested_amount = scheme.invested_value.amount;
  //                         userReturns.current_value = scheme.market_value.amount;
  //                         let holding_units = scheme.holdings.units;
  //                         let holding_amount = holding_units * scheme.nav.value;

  //                         userReturns.unrealized_gain = holding_amount - userReturns.invested_amount;
  //                         userReturns.absolute_return = userReturns.current_value - userReturns.invested_amount;

  //                         userReturns.cagr = 0;
  //                         userReturns.xirr = 0;
  //                         userReturns.addjusted_value = 0;

  //                         await connection.getRepository(UserReturnsHistory).save(userReturns);
  //                         console.log("FP CRON --- HOLDINGS UPDATE DONE for a row-- ");

  //                     }

  //                 }

  //             }
  //         }

  //     } catch (err) {
  //         console.log("FP CRON --- HOLDINGS UPDATE WENT WRONG -- " + err.message);
  //     }
  // }

  // @Cron(CronExpression.EVERY_DAY_AT_5PM, { name: 'check_sip_date' })
  // // @Cron(CronExpression.EVERY_MINUTE, { name: 'run_holdings_creation'})
  // async checkSIPDate() {
  //     try {
  //         const tenants_array = this.tenant_list.split(",");
  //         for (let maxwealth_tenant_id of tenants_array) {
  //             let connection: TypeORM.DataSource = await this.get_datasource(maxwealth_tenant_id);
  //             let sipTransactionItems = await connection.getRepository(TransactionBasketItems).find({ where: [{ transaction_type: 'sip', status: 'active' }, { transaction_type: 'smart_sip', status: 'active' }] })
  //             for (let sip of sipTransactionItems) {
  //                 let purchases = await connection.getRepository(Purchase).find({ where: { plan: sip.fp_sip_id } });
  //                 let last_purchase: Purchase = null;
  //                 if (purchases.length > 0) {
  //                     last_purchase = purchases[purchases.length - 1];
  //                     if (last_purchase.remaining_installments > 0) {
  //                         let next_installment_date = last_purchase.next_installment_date;
  //                         //check if next_installment_date is within 3 days
  //                         let today = new Date();
  //                         let next_installment_date_obj = new Date(next_installment_date);
  //                         let diff = next_installment_date_obj.getTime() - today.getTime();
  //                         let diff_days = diff / (1000 * 3600 * 24);
  //                         if (diff_days <= 3) {
  //                             //send whatsapp
  //                             let user_onboarding = await connection.getRepository(UserOnboardingDetails).findOne({ where: { user_id: sip.user_id }, relations: ['user'] })
  //                             // let whatsappTemplateId = "sip_installment_reminder";
  //                             // let variables = [
  //                             //     {
  //                             //         "type": "text",
  //                             //         "text": last_purchase.amount.toString()
  //                             //     },
  //                             //     {
  //                             //         "type": "text",
  //                             //         "text": last_purchase.next_installment_date
  //                             //     },
  //                             //     {
  //                             //         "type": "text",
  //                             //         "text": last_purchase.scheme
  //                             //     },
  //                             //     {
  //                             //         "type": "text",
  //                             //         "text": last_purchase.next_installment_date
  //                             //     }
  //                             // ]
  //                             // let response = await this.msg91Service.sendWhatsapp(user_onboarding.user.mobile, whatsappTemplateId, variables);
  //                             // console.log("RESPONSE FROM SEND WHATSAPP " + JSON.stringify(response));

  //                             /********************************************************* */

  //                             // if (diff_days == 3) {

  //                             //     let emailTemplateId = "mfinstalmentreminder";

  //                             //     let emailVariables = {};

  //                             //     let response = await this.msg91Service.sendEmail(emailTemplateId, user_onboarding.user.email, emailVariables);

  //                             //     console.log("RESPONSE FROM SEND MAIL " + JSON.stringify(response));

  //                             // }

  //                             /********************************************************* */

  //                             let send = await this.hasEnablex(connection);

  //                             if (send) {
  //                                 let data = await this.enablexFindOne("enablex", connection);
  //                                 let info = {
  //                                     "var1": last_purchase.scheme,
  //                                     "var2": last_purchase.amount.toString(),
  //                                     "var3": last_purchase.next_installment_date.toString()
  //                                 }
  //                                 this.enablexServiceSendSMS(user_onboarding.user.mobile, data.keys_json.from, data.keys_json.campaign_id.service, data.keys_json.type, data.keys_json.template_id.sip_reminder, info)
  //                             } else {
  //                                 let sms_variables = {
  //                                     SIPAmount: last_purchase.amount.toString(),
  //                                     DueDate: last_purchase.next_installment_date.toString(),
  //                                     MutualFundName: last_purchase.scheme
  //                                 };

  //                                 let sms_template_id = "651c0dd9d6fc054667386922";

  //                                 let sms = msg91.getSMS();

  //                                 let smsresp = sms.send(sms_template_id, { 'mobile': "+91" + user_onboarding.user.mobile, ...sms_variables });

  //                             }

  //                         }
  //                     }
  //                 }
  //             }
  //         }
  //     } catch (err) {
  //         console.log("FP CRON --- checkSIPDateSync WENT WRONG -- " + err.message);
  //     }
  // }

  // async hasEnablex(connection: TypeORM.DataSource) {

  //     const enablex = await connection.getRepository(SmsConfiguration).find();
  //     if (enablex.length == 0) {
  //         return false;
  //     } else {
  //         let e = enablex.some(enable => enable.provider === 'enablex');
  //         if (e) {
  //             return e;
  //         } else {
  //             return false;
  //         }
  //     }
  // }

  // async enablexFindOne(provider: string, connection: TypeORM.DataSource) {
  //     return await connection.getRepository(SmsConfiguration).findOne({ where: { provider } })
  // }

  // async enablexServiceSendSMS(phoneNumber: string, from: string, campaign_id: number, type: string, template_id: string, data: any): Promise<void> {
  //     const appId = this.configService.get('ENABLEX_APP_ID');
  //     const appKey = this.configService.get('ENABLEX_APP_KEY');
  //     const apiUrl = 'https://api.enablex.io/sms/v1/messages/';
  //     // const templateId = this.configService.get<string>('ENABLEX_TEMPLATE_ID');
  //     // const from;
  //     // const sms;
  //     console.log(appId, "fijddjof", appKey)
  //     console.log("sms")
  //     const headers = {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Basic ${Buffer.from(`${appId}:${appKey}`).toString('base64')}`,
  //     };
  //     console.log(headers)
  //     const body = {
  //         "to": [`+91${phoneNumber}`],
  //         "template_id": template_id,  // Replace with the actual template ID provided by EnableX
  //         "campaign_id": campaign_id,
  //         "from": from,
  //         "type": type,
  //         "data": data

  //     };
  //     console.log(body)

  //     await axios.post(apiUrl, body, {
  //         headers: headers,
  //     })
  //         .then(response => {
  //             console.log('SMS sent successfully:', response.data);
  //         })
  //         .catch(error => {
  //             console.error('Error sending SMS:', error.response?.data || error.message);
  //         });
  // }

  // /************************************************************* */

  // @Cron(CronExpression.EVERY_DAY_AT_5PM, { name: 'check_no_mandate_sip_date' })
  // // @Cron(CronExpression.EVERY_MINUTE, { name: 'run_holdings_creation'})
  // async checkNoMandateSIPDate() {
  //     try {
  //         const tenants_array = this.tenant_list.split(",");
  //         for (let maxwealth_tenant_id of tenants_array) {
  //             let connection: TypeORM.DataSource = await this.get_datasource(maxwealth_tenant_id);

  //             let sipTransactionItems = await connection.getRepository(TransactionBasketItems).find({ where: { transaction_type: 'no_mandate_sip', status: 'active' } })
  //             for (let sip of sipTransactionItems) {
  //                 let purchases = await connection.getRepository(Purchase).find({ where: { transaction_basket_item_id: sip.id } });
  //                 let last_purchase: Purchase = null;
  //                 if (purchases.length > 0) {
  //                     last_purchase = purchases[purchases.length - 1];
  //                     if (last_purchase.remaining_installments > 0) {
  //                         let next_installment_date = last_purchase.next_installment_date;
  //                         //check if next_installment_date is within 3 days
  //                         let today = new Date();
  //                         let next_installment_date_obj = new Date(next_installment_date);
  //                         let diff = next_installment_date_obj.getTime() - today.getTime();
  //                         let diff_days = diff / (1000 * 3600 * 24);
  //                         if (diff_days <= 3) {
  //                             //send whatsapp
  //                             let user_onboarding = await connection.getRepository(UserOnboardingDetails).findOne({ where: { user_id: sip.user_id }, relations: ['user'] })
  //                             let whatsappTemplateId = "no_mandate_sip_reminder";
  //                             let variables = [
  //                                 {
  //                                     "type": "text",
  //                                     "text": last_purchase.amount.toString()
  //                                 },
  //                                 {
  //                                     "type": "text",
  //                                     "text": last_purchase.next_installment_date
  //                                 },
  //                                 {
  //                                     "type": "text",
  //                                     "text": last_purchase.scheme
  //                                 },
  //                                 {
  //                                     "type": "text",
  //                                     "text": last_purchase.next_installment_date
  //                                 }
  //                             ]
  //                             // let response = await this.msg91Service.sendWhatsapp(user_onboarding.user.mobile, whatsappTemplateId, variables);
  //                             // console.log("RESPONSE FROM SEND WHATSAPP " + JSON.stringify(response));

  //                             /********************************************************* */

  //                             // if (diff_days == 3) {

  //                             //     let emailTemplateId = "mfinstalmentreminder";

  //                             //     let emailVariables = {};

  //                             //     let response = await this.msg91Service.sendEmail(emailTemplateId, user_onboarding.user.email, emailVariables);

  //                             //     console.log("RESPONSE FROM SEND MAIL " + JSON.stringify(response));

  //                             // }

  //                             /********************************************************* */

  //                             let sms_variables = {
  //                                 Amount: last_purchase.amount.toString(),
  //                                 RecipientsName: user_onboarding.user.full_name,
  //                                 CustomerSupportPhoneNumber: this.customerSupportNumber.toString()
  //                             };

  //                             let sms_template_id = "651c0d32d6fc0539a7782e42";

  //                             let sms = msg91.getSMS();

  //                             //

  //                             let smsresp = sms.send(sms_template_id, { 'mobile': "+91" + user_onboarding.user.mobile, ...sms_variables });

  //                             /************************************************************************************************************** */
  //                             // create no mandate instalment at fp and in purchases db level
  //                             let transaction_basket_item = sip;
  //                             let fp_lumpsum_dto = new FpLumpsumDTO();
  //                             fp_lumpsum_dto.amount = transaction_basket_item.amount;
  //                             if (transaction_basket_item.folio_number) {
  //                                 fp_lumpsum_dto.folio_number = transaction_basket_item.folio_number;
  //                             }
  //                             // fp_lumpsum_dto.user_ip = ip;
  //                             fp_lumpsum_dto.scheme = transaction_basket_item.fund_isin;
  //                             // fp_lumpsum_dto.server_ip = server_ip;
  //                             fp_lumpsum_dto.mf_investment_account = user_onboarding.fp_investment_account_id;
  //                             let fp_create_purchase = await this.create_purchase(maxwealth_tenant_id, fp_lumpsum_dto);
  //                             if (fp_create_purchase.status == HttpStatus.OK) {

  //                                 let purchase = new Purchase();
  //                                 fp_create_purchase.data["fp_id"] = fp_create_purchase.data.id;
  //                                 fp_create_purchase.data["user_id"] = transaction_basket_item.user_id;

  //                                 fp_create_purchase.data["transaction_basket_item_id"] = transaction_basket_item.id;
  //                                 console.log("TRANDSACTION OBJ", fp_create_purchase);
  //                                 delete fp_create_purchase.data.id;
  //                                 purchase = fp_create_purchase.data;

  //                                 const currentDate = new Date();

  //                                 // Define the day you want to set (1 to 31)
  //                                 const installment_day = transaction_basket_item.installment_day; // Change this to your desired day

  //                                 // Set the day for the current date
  //                                 currentDate.setDate(installment_day);

  //                                 currentDate.setDate(currentDate.getDate() + 30);

  //                                 // // Format the date as "yyyy-mm-dd"
  //                                 // const year = currentDate.getFullYear();
  //                                 // const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so we add 1 and pad with leading zeros if needed.
  //                                 // const day = String(currentDate.getDate()).padStart(2, '0'); // Pad with leading zeros if needed.

  //                                 // const formattedDate = `${year}-${month}-${day}`;

  //                                 purchase.next_installment_date = currentDate;
  //                                 purchase = await connection.getRepository(Purchase).save(purchase);

  //                                 console.log("CREATION OF NO MANDATE SIP Successful", fp_create_purchase.error);

  //                             } else {
  //                                 console.log("CREATION OF NO MANDATE SIP FAILED", fp_create_purchase.error);
  //                             }

  //                         }
  //                     }
  //                 }
  //             }
  //         }
  //     } catch (err) {
  //         console.log("FP CRON --- checkSIPDateSync WENT WRONG -- " + err.message);
  //     }
  // }

  // @Cron(CronExpression.EVERY_DAY_AT_5PM, { name: 'check_no_mandate_sip_date' })
  // // @Cron(CronExpression.EVERY_MINUTE, { name: 'run_holdings_creation'})
  // async checkSmartSIPThresholds() {
  //     try {
  //         // fetch the Smart SIP configurations
  //         // loop through smart SIP configurations
  //         // fetch the current plan PE SCORE
  //         // as per the configurations fetch the sip ratio
  //         // update sip ratio in the smart sip table
  //         // update sip ratio of on going sips at fintech, skip instructions if required
  //         // check if switch is necessary as per the configuration fetched in the range
  //         // if yes then check for redeemable units for that folio and create the switch transaction basket

  //         //fetch the Smart SIP configurations
  //         const tenants_array = this.tenant_list.split(",");
  //         for (let maxwealth_tenant_id of tenants_array) {
  //             let connection: TypeORM.DataSource = await this.get_datasource(maxwealth_tenant_id);

  //             let smart_sips = await connection.getRepository(SmartSipFunds).find();

  //             let smart_sip_configuration = await connection.getRepository(SmartSipConfiguration).findOne({
  //                 order: { id: 'DESC' }
  //             })

  //             if (smart_sips.length > 0) {

  //                 if (!smart_sip_configuration) {
  //                     console.log("FP CRON --- checkSMARTSync WENT WRONG -- No smart sip config found ");
  //                 }

  //                 let stylebox_resp = await this.mutualfundsService.mf_get_stylebox(smart_sip_configuration.track_fund_isin);
  //                 if (stylebox_resp.status = HttpStatus.OK) {
  //                     let pe_obj = stylebox_resp.data;
  //                     let smart_sip_configuration_matched = await connection.getRepository(SmartSipConfiguration).findOne({ where: { attribute_range_start: LessThanOrEqual(pe_obj.pescore), attribute_range_end: MoreThanOrEqual(pe_obj.pescore) } })
  //                     if (smart_sip_configuration_matched) {
  //                         await connection.getRepository(SmartSipFunds).createQueryBuilder()
  //                             .update(SmartSipFunds)
  //                             .set({ debt_scheme_allocation: smart_sip_configuration_matched.debt_scheme_allocation, equity_scheme_allocation: smart_sip_configuration_matched.equity_scheme_allocation }) // Define the columns and their new values
  //                             .execute();

  //                         let transaction_baskets = await connection.getRepository(TransactionBaskets).find({ where: { is_smart_sip: true }, relations: ['transaction_basket_items'] });

  //                         for (let transaction_basket of transaction_baskets) {

  //                             let items_count = transaction_basket.transaction_basket_items.length;
  //                             let equity_transaction_basket_item;
  //                             let debt_transaction_basket_item;
  //                             let scheme = await connection.getRepository(SmartSipFunds).findOne({ where: { debt_scheme_isin: transaction_basket.transaction_basket_items[0].fund_isin } });

  //                             if (items_count == 1) {

  //                                 if (scheme) {
  //                                     debt_transaction_basket_item = transaction_basket.transaction_basket_items[0];
  //                                     if (smart_sip_configuration_matched.equity_scheme_allocation > 0) {
  //                                         // need to create the missing one

  //                                     }
  //                                 } else {
  //                                     equity_transaction_basket_item = transaction_basket.transaction_basket_items[0];
  //                                     if (smart_sip_configuration_matched.debt_scheme_allocation > 0) {
  //                                         // need to create the missing one

  //                                     }
  //                                 }

  //                             } else if (items_count == 2) {
  //                                 if (scheme) {
  //                                     debt_transaction_basket_item = transaction_basket.transaction_basket_items[0];
  //                                     equity_transaction_basket_item = transaction_basket.transaction_basket_items[1];

  //                                 } else {
  //                                     debt_transaction_basket_item = transaction_basket.transaction_basket_items[1];
  //                                     equity_transaction_basket_item = transaction_basket.transaction_basket_items[0];
  //                                 }

  //                             }

  //                             //  check if there is a need to stop the skip instructions for both funds
  //                             //- if there is a stop instruction and percentage greater than zero then cancel the stop instruction

  //                             // check if there is a need to create the skip instrictions for both the funds

  //                             // create the amount change in ongoing funds

  //                             // if(transaction_basket_item.status == 'active'){
  //                             //     if(scheme){
  //                             //         if(smart_sip_configuration_matched.debt_scheme_allocation > 0){
  //                             //             let update_amount =
  //                             //             await this.
  //                             //             // if its stopped then start

  //                             //         }else{
  //                             //             //stop the
  //                             //         }
  //                             //     }else{
  //                             //         scheme = await this.smartSipFundsRepository.findOne({where:{equity_scheme_isin:transaction_basket_item.fund_isin}});
  //                             //     }
  //                             // }

  //                         }

  //                     } else {
  //                         console.log("FP CRON --- checkSMARTSync WENT WRONG -- No Stylebox PE Matched ");
  //                     }
  //                 } else {
  //                     console.log("FP CRON --- checkSMARTSync WENT WRONG -- No Stylebox PE found ");
  //                 }

  //             } else {

  //                 console.log("FP CRON --- checkSMARTSync WENT WRONG -- No smart sips found ");

  //             }
  //         }

  //     } catch (err) {Scheme Dataa
  //         console.log("FP CRON --- checkSMARTSync WENT WRONG -- " + err.message);
  //     }
  // }

  // async update_sip_amount() {

  // }

  // // async create_sip(transaction_basket:TransactionBaskets,amount,isin){
  // //     let new_transaction_basket_item =  new TransactionBasketItems();
  // //     new_transaction_basket_item.transaction_basket_id = transaction_basket.id;

  // // }

  // // async update_purchase_plans(){
  // //     try{
  // //         // /v2/mf_purchase_plans
  // //     }catch(err){

  // //     }

  // // }

  // @Cron(CronExpression.EVERY_DAY_AT_5AM, { name: "clear_all_cache" })
  // async clear_all_cache() {
  //     try {
  //         const headersRequest = {
  //             'Content-Type': 'application/json', // afaik this one is not needed
  //         };
  //         await this.httpService.get("https://api.maxwealth.money/api/v1/mutual_funds/discover/clearAllCaches", { headers: headersRequest }).pipe(
  //             map((resp) => {
  //                 console.log("working", resp.status)
  //                 return resp.data;
  //             }),
  //         ).pipe(
  //             catchError((e) => {
  //                 if (e.response && e.response.data && e.response.data.error) {
  //                     console.log(e.response.data.error);
  //                     e.response.data.error.message = "";
  //                     e.response.data.error.errors.map((er) => { e.response.data.error.message += er.field + " : " + er.message + ". " });

  //                 }

  //                 throw new ForbiddenException(e.response.data.error, e.message);
  //             }),
  //         );
  //         console.log("worked")

  //     } catch (err) {
  //         console.log("FP CRON --- clear cache WENT WRONG -- " + err.message);
  //     }
  // }

  @Cron(CronExpression.EVERY_2_HOURS, { name: 'read_excel_file' })
  async handleCron() {
    console.log('Checking for new emails every 10 seconds...');
    await this.emailService.readEmails();
  }

  @Cron(CronExpression.EVERY_2_HOURS, { name: 'check_kyc' })
  async checkkyc() {
    console.log('CRON UPDATE EVERY MIN', this.tenant_list);
    console.log('STARTED CRON - run_holdings_creation');

    const tenants_array = this.tenant_list.split(',');

    for (const maxwealth_tenant_id of tenants_array) {
      const connection: TypeORM.DataSource = await this.get_datasource(
        maxwealth_tenant_id,
      );
      const all_onboarded = await connection
        .getRepository(UserOnboardingDetails)
        .find({
          where: { status: 'kyc_review' },
        });

      console.log('Onboarded', all_onboarded);

      for (const onboarding of all_onboarded) {
        console.log('Processing user', onboarding.user_id);
        const result = await this.check_kyc(onboarding.pan);
        console.log('result 1', result);

        const selectedKra = 'camskra'; // Default to camskra
        if (result.status == 200) {
          if (result?.data?.verifyPanResponse[selectedKra] == '07') {
            onboarding.status = 'kyc_completed';
            await connection
              .getRepository(UserOnboardingDetails)
              .save(onboarding);
            console.log('userOboardingDetail inside', onboarding);
          } else if (
            result?.data?.verifyPanResponse[selectedKra] == '04' ||
            result?.data?.verifyPanResponse[selectedKra] == '02'
          ) {
            onboarding.status = 'kyc_rejected';
            await connection
              .getRepository(UserOnboardingDetails)
              .save(onboarding);
            console.log('userOboardingDetail inside', onboarding);
          }
        }
      }
    }
  }

  async get_cams_token() {
    try {
      const basicAuth = `${this.cams_client_id}:${this.cams_secret}`;
      const encodedAuth = Buffer.from(basicAuth).toString('base64');

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

        const encrypted = await this.encryptStringToBytesAES(
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

        const decrypted = await this.decryptStringFromBytesAES(
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

  async encryptStringToBytesAES(
    plainText: string | object,
    base64Key: string,
    base64IV: string,
  ) {
    try {
      // Ensure the plainText is a string
      if (typeof plainText === 'object') {
        plainText = JSON.stringify(plainText); // Convert object to string if it's an object
      }

      if (!plainText || plainText.length <= 0) {
        throw new Error('plainText must be a non-empty string');
      }

      // Validate base64Key and base64IV
      if (!base64Key || base64Key.length <= 0) {
        throw new Error('Key is required');
      }
      if (!base64IV || base64IV.length <= 0) {
        throw new Error('IV is required');
      }

      // Decode base64 key and IV
      const key = Buffer.from(base64Key, 'base64');
      const iv = Buffer.from(base64IV, 'base64');

      // Ensure key and IV lengths are correct
      if (key.length !== 32) {
        throw new Error(
          'Invalid key length. Key must be 32 bytes for AES-256-CBC.',
        );
      }
      if (iv.length !== 16) {
        throw new Error(
          'Invalid IV length. IV must be 16 bytes for AES-256-CBC.',
        );
      }

      // Create the cipher and encrypt the plainText
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      cipher.setAutoPadding(true);

      let encrypted = cipher.update(plainText, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      // Return the encrypted data in the required format
      return {
        status: HttpStatus.OK,
        data: encrypted, // The base64 encrypted data
        encryptFlag: 'Y',
      };
    } catch (error) {
      return { status: HttpStatus.BAD_REQUEST, data: error.message };
    }
  }

  async decryptStringFromBytesAES(
    encryptedText: string,
    base64Key: string,
    base64IV: string,
  ) {
    try {
      // Validate encryptedText
      if (!encryptedText || encryptedText.length <= 0) {
        throw new Error('Encrypted text is required');
      }

      // Validate base64Key and base64IV
      if (!base64Key || base64Key.length <= 0) {
        throw new Error('Key is required');
      }
      if (!base64IV || base64IV.length <= 0) {
        throw new Error('IV is required');
      }

      // Decode base64 key and IV
      const key = Buffer.from(base64Key, 'base64');
      const iv = Buffer.from(base64IV, 'base64');

      // Ensure key and IV lengths are correct
      if (key.length !== 32) {
        throw new Error(
          'Invalid key length. Key must be 32 bytes for AES-256-CBC.',
        );
      }
      if (iv.length !== 16) {
        throw new Error(
          'Invalid IV length. IV must be 16 bytes for AES-256-CBC.',
        );
      }

      // Create the decipher and decrypt the encryptedText
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      decipher.setAutoPadding(true); // Ensures automatic padding is handled

      let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      // Check if decrypted text is a JSON string (original was an object)
      try {
        return { status: HttpStatus.OK, data: JSON.parse(decrypted) };
      } catch {
        // If it fails, return plain text
        return { status: HttpStatus.OK, data: decrypted };
      }
    } catch (error) {
      console.error('Decryption error:', error); // Log the error for debugging
      return { status: HttpStatus.BAD_REQUEST, data: error.message };
    }
  }

  // @Cron(CronExpression.EVERY_DAY_AT_3AM, { name: 'run_holdings_creation_version_2' })
  async holdingDataSync_v3() {
    try {
      console.log('CRON UPDATE EVERY MIN', this.tenant_list);
      console.log('STARTED CRON - run_holdings_creation');

      const tenants_array = this.tenant_list.split(',');

      for (const maxwealth_tenant_id of tenants_array) {
        const connection: TypeORM.DataSource = await this.get_datasource(
          maxwealth_tenant_id,
        );
        const all_onboarded = await connection
          .getRepository(UserOnboardingDetails)
          .find({
            // where: { fp_investment_account_old_id: Not(IsNull()) },
            where: { fp_investment_account_old_id: 4 },
          });

        for (const onboarding of all_onboarded) {
          // let onboarding = all_onboarded[0]
          console.log('Processing user', onboarding.user_id);

          const date = new Date();
          // const todayDay = date.getDay();

          // let yesterdays_date = new Date(date);
          // let dayBeforeYesterdays_date = new Date(date);

          // // Adjust based on weekday
          // if (todayDay === 0 || todayDay === 1) {
          //     yesterdays_date.setDate(date.getDate() - (todayDay === 0 ? 2 : 3));
          //     dayBeforeYesterdays_date.setDate(date.getDate() - (todayDay === 0 ? 3 : 4));
          // } else if (todayDay === 2) {
          //     yesterdays_date.setDate(date.getDate() - 1);
          //     dayBeforeYesterdays_date.setDate(date.getDate() - 3);
          // } else {
          //     yesterdays_date.setDate(date.getDate() - 1);
          //     dayBeforeYesterdays_date.setDate(date.getDate() - 2);
          // }

          // const formattedDate_yesterday = this.formatDate(yesterdays_date);
          // const formattedDate_dayBeforeYesterday = this.formatDate(dayBeforeYesterdays_date);

          // console.log("Yesterday's Date:", formattedDate_yesterday);
          // console.log("Day Before Yesterday's Date:", formattedDate_dayBeforeYesterday);

          const holdings =
            await this.transactionsService.generateHoldingsReport(
              null,
              onboarding.user_id.toString(),
            );
          console.log('Holdings', holdings);
          if (holdings.status !== 200) {
            console.log('No holdings for user:', onboarding.user_id);
            continue;
          }

          const folios = holdings['result'] || [];
          let value_day_before_yesterday = 0;
          let value_yesterday = 0;
          let invested_amount = 0;

          for (const folio of folios) {
            const schemes = folio?.schemes || [];

            for (const scheme of schemes) {
              try {
                const navResponse = await this.getGraphByIsin(scheme['isin']);

                const navYesterday = navResponse['data'][0]?.nav || 0;
                const navDayBefore = navResponse['data'][1]?.nav || 0;
                const units = scheme['holdings'].units || 0;

                value_day_before_yesterday += navDayBefore * units;
                value_yesterday += navYesterday * units;
                invested_amount += scheme['invested_value']?.amount || 0;
              } catch (err) {
                console.log(
                  `Error fetching NAV for scheme ${scheme['isin']}, skipping.`,
                  err.message,
                );
              }
            }
          }

          const day_change = value_yesterday - value_day_before_yesterday;
          const day_change_percentage =
            value_day_before_yesterday === 0
              ? 0
              : (day_change / value_day_before_yesterday) * 100;

          const total_returns = value_yesterday - invested_amount;
          const total_returns_percentage =
            invested_amount === 0 ? 0 : (total_returns / invested_amount) * 100;

          console.log(
            `User ${onboarding.user_id} — Invested: ${invested_amount}, Day Change: ${day_change}, Day Change %: ${day_change_percentage}, Total Returns: ${total_returns}, Total Returns %: ${total_returns_percentage}`,
          );

          const userReturns = new UserReturnsHistoryVerison2();
          userReturns.user_id = onboarding.user_id;
          userReturns.day_change_amount = day_change;
          userReturns.day_change_percentage = day_change_percentage;
          userReturns.total_returns = total_returns;
          userReturns.total_returns_percentage = total_returns_percentage;
          userReturns.date = date;
          userReturns.invested_amount = invested_amount;
          userReturns.current_value = invested_amount + total_returns;

          // Save returns with retry
          await this.retryAsyncOperation(async () => {
            const savedReturns = await connection
              .getRepository(UserReturnsHistoryVerison2)
              .save(userReturns);
            console.log('User Returns saved', savedReturns);
          });
        }
      }
      return { status: HttpStatus.OK };
    } catch (err) {
      console.log('Error:', err);
      console.log('FP CRON --- HOLDINGS UPDATE WENT WRONG -- ' + err.message);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_5AM, {
    name: 'run_holdings_creation_version_2',
  })
  async holdingDataSync_v4() {
    try {
      console.log('CRON UPDATE EVERY MIN', this.tenant_list);
      console.log('STARTED CRON - run_holdings_creation');

      const tenants_array = this.tenant_list.split(',');

      for (const maxwealth_tenant_id of tenants_array) {
        const connection: TypeORM.DataSource = await this.get_datasource(
          maxwealth_tenant_id,
        );
        const all_onboarded = await connection
          .getRepository(UserOnboardingDetails)
          .find({
            where: { fp_investment_account_old_id: Not(IsNull()) },
          });

        for (const onboarding of all_onboarded) {
          console.log('Processing user', onboarding.user_id);

          const date = new Date();
          // const todayDay = date.getDay();

          // let yesterdays_date = new Date(date);
          // let dayBeforeYesterdays_date = new Date(date);

          // // Adjust based on weekday
          // if (todayDay === 0 || todayDay === 1) {
          //     yesterdays_date.setDate(date.getDate() - (todayDay === 0 ? 2 : 3));
          //     dayBeforeYesterdays_date.setDate(date.getDate() - (todayDay === 0 ? 3 : 4));
          // } else if (todayDay === 2) {
          //     yesterdays_date.setDate(date.getDate() - 1);
          //     dayBeforeYesterdays_date.setDate(date.getDate() - 3);
          // } else {
          //     yesterdays_date.setDate(date.getDate() - 1);
          //     dayBeforeYesterdays_date.setDate(date.getDate() - 2);
          // }

          // const formattedDate_yesterday = this.formatDate(yesterdays_date);
          // const formattedDate_dayBeforeYesterday = this.formatDate(dayBeforeYesterdays_date);

          // console.log("Yesterday's Date:", formattedDate_yesterday);
          // console.log("Day Before Yesterday's Date:", formattedDate_dayBeforeYesterday);

          const holdings =
            await this.transactionsService.generateHoldingsReport(
              null,
              onboarding.user_id.toString(),
            );
          console.log('Holdings', holdings);
          if (holdings.status !== 200) {
            console.log('No holdings for user:', onboarding.user_id);
            continue;
          }

          const folios = holdings['result'] || [];
          let value_day_before_yesterday = 0;
          let value_yesterday = 0;
          let invested_amount = 0;

          for (const folio of folios) {
            const schemes = folio?.schemes || [];

            for (const scheme of schemes) {
              try {
                const navResponse = await this.getGraphByIsin(scheme['isin']);

                const navYesterday = navResponse['data'][0]?.nav || 0;
                const navDayBefore = navResponse['data'][1]?.nav || 0;
                const units = scheme['holdings'].units || 0;

                value_day_before_yesterday += navDayBefore * units;
                value_yesterday += navYesterday * units;
                invested_amount += scheme['invested_value']?.amount || 0;
              } catch (err) {
                console.log(
                  `Error fetching NAV for scheme ${scheme['isin']}, skipping.`,
                  err.message,
                );
              }
            }
          }

          const day_change = value_yesterday - value_day_before_yesterday;
          const day_change_percentage =
            value_day_before_yesterday === 0
              ? 0
              : (day_change / value_day_before_yesterday) * 100;

          const total_returns = value_yesterday - invested_amount;
          const total_returns_percentage =
            invested_amount === 0 ? 0 : (total_returns / invested_amount) * 100;

          console.log(
            `User ${onboarding.user_id} — Invested: ${invested_amount}, Day Change: ${day_change}, Day Change %: ${day_change_percentage}, Total Returns: ${total_returns}, Total Returns %: ${total_returns_percentage}`,
          );

          const response =
            await this.transactionsService.investment_account_wise_returns(
              onboarding.user_id.toString(),
            );
          console.log('New Holdings', response);

          const previous_response = await connection
            .getRepository(UserReturnsHistoryVerison2)
            .findOne({
              where: { user_id: onboarding.user_id },
              order: { date: 'DESC' },
            });

          const currentValueChange =
            Number(response.data[0].current_value) -
            previous_response.current_value;
          const investedAmountChange =
            response.data[0].invested_amount -
            previous_response.invested_amount;

          const day_change_new = currentValueChange - investedAmountChange;
          const day_change_percentage_new =
            (day_change_new / previous_response.current_value) * 100;

          const userReturns = new UserReturnsHistoryVerison2();
          userReturns.user_id = onboarding.user_id;
          userReturns.day_change_amount = day_change_new;
          userReturns.day_change_percentage = day_change_percentage_new;
          userReturns.total_returns = Number(response.data[0].unrealized_gain);
          userReturns.total_returns_percentage = Number(
            response.data[0].absolute_return,
          );
          userReturns.date = date;
          userReturns.invested_amount = response.data[0].invested_amount;
          userReturns.current_value = Number(response.data[0].current_value);

          // Save returns with retry
          await this.retryAsyncOperation(async () => {
            const savedReturns = await connection
              .getRepository(UserReturnsHistoryVerison2)
              .save(userReturns);
            console.log('User Returns saved', savedReturns);
          });
        }
      }
      return { status: HttpStatus.OK };
    } catch (err) {
      console.log('Error:', err);
      console.log('FP CRON --- HOLDINGS UPDATE WENT WRONG -- ' + err.message);
    }
  }

  async getGraphByIsin(isin) {
    try {
      const url =
        this.mf_base_url +
        '/api/v1/mutual_funds/mutual_funds_details/getGraphByIsin?isin=' +
        isin +
        '&duration=2';

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

  // ✅ Date Formatter
  formatDate(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  // ✅ Retry Function
  async retryAsyncOperation(
    operation: () => Promise<any>,
    retries = 3,
    delay = 500,
  ): Promise<any> {
    while (retries > 0) {
      try {
        return await operation();
      } catch (err) {
        retries--;
        console.warn(`Operation failed. Retries left: ${retries}`, err.message);
        if (retries === 0) {
          console.error('Final failure, moving on.');
          return null;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, { name: "capital_gains" })
  // async capital_gains() {
  //     try {

  //         const tenants_array = this.tenant_list.split(',');

  //         for (let maxwealth_tenant_id of tenants_array) {
  //             let connection: TypeORM.DataSource = await this.get_datasource(
  //                 maxwealth_tenant_id,
  //             );

  //             // for (let user of users) {

  //             const today = new Date().toISOString().split('T')[0];
  //             const queryBuilder = await connection
  //                 .getRepository(Source)
  //                 .createQueryBuilder('sources')
  //                 .leftJoinAndSelect('sources.transactionReport', 'transactionReport')
  //                 .leftJoinAndSelect('transactionReport.users', 'user')
  //                 .leftJoinAndSelect('sources.source_transaction', 'source_transaction');

  //             const user_id = 26;

  //             queryBuilder.where('transactionReport.user_id = :user_id', { user_id });

  //             // Create a date object for today
  //             const now = new Date(); // This is already in local timezone (IST in your case)

  //             console.log("Current date:", now.toISOString().split('T')[0]);

  //             // THE KEY ISSUE: When creating dates with year, month, day constructor
  //             // JavaScript creates dates at MIDNIGHT local time, but then toISOString()
  //             // converts to UTC, which can cause date shifts when the timezone is east of UTC

  //             // SOLUTION: Create the dates with hours set to 12 (noon) to avoid date shifting
  //             // across timezone boundaries

  //             // 1️⃣ Set traded_on_from to the 1st day of the previous month
  //             const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 12, 0, 0);
  //             const traded_on_from = firstDayPrevMonth.toISOString().split('T')[0];

  //             // 2️⃣ Set traded_on_to to the last day of the previous month
  //             const lastDayPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 12, 0, 0);
  //             const traded_on_to = lastDayPrevMonth.toISOString().split('T')[0];

  //             console.log("Traded on From:", traded_on_from);
  //             console.log("Traded on To:", traded_on_to);

  //             queryBuilder.andWhere('transactionReport.traded_on >= :traded_on_from', { traded_on_from });
  //             queryBuilder.andWhere('transactionReport.traded_on <= :traded_on_to', { traded_on_to });

  //             const transactions = await queryBuilder.getMany();

  //             console.log('Transactions', transactions);
  //             const isin = transactions
  //                 .filter(scheme => scheme.transactionReport.isin && scheme.transactionReport.isin.length > 0) // Ensure scheme.isin exists and is not empty
  //                 .map(scheme => scheme.transactionReport.isin);

  //             // Filter out invalid ISINs (empty or whitespace only)
  //             const validIsins = isin.filter(item => item && item.trim() !== '');

  //             console.log("Valid ISINs", validIsins);

  //             // If no valid ISINs are found, log a message but don't return an error
  //             if (!validIsins.length) {
  //                 console.log("No valid ISINs found.");
  //             } else {
  //                 console.log("All valid ISINs:", validIsins);
  //             }

  //             console.log("Total Count of Valid Schemes:", validIsins.length);

  //             let fund: any = await this.mutualfundsService.getFundDetailsByIsins(isin);
  //             console.log("Funds", fund);

  //             // Get the total count of transactions to calculate total pages
  //             const totalCount = await queryBuilder.getCount();
  //             console.log('Total Count of Transactions:', totalCount);

  //             // Calculate capital gains for each transaction
  //             let result = [];
  //             for (const txn of transactions) {
  //                 const year = new Date(txn.purchased_on).getFullYear(); // Extract purchase year
  //                 const cii = await connection
  //                     .getRepository(CostInflationIndex)
  //                     .findOne({ where: { financial_year: year } });
  //                 let ciiValue = cii.cost_inflation_index;
  //                 console.log("CiiValue", ciiValue);

  //                 // let exitload = fund?.data?.find(data => data.isin === txn.transactionReport.isin)?.exitload
  //                 let fundDetail = await connection
  //                     .getRepository(FundDetail)
  //                     .findOne({ where: { isin: txn.transactionReport.isin } });
  //                 let exitload: any = fundDetail?.exitLoad
  //                 exitload = Number(exitload)
  //                 console.log("Exitload exitload", exitload);
  //                 if (exitload == null) {
  //                     exitload = 0
  //                 }

  //                 let exitloadforCalculation = (1 - exitload / 100);
  //                 console.log("Exit Load For Calculation", exitloadforCalculation);

  //                 const indexedCost = txn.purchased_at * (ciiValue / 100); // Adjust based on real formula

  //                 // Grandfathering logic
  //                 const grandfatherDate = new Date('2018-01-31');
  //                 const isGrandfathered = new Date(txn.purchased_on) <= grandfatherDate;
  //                 let grandFatheringNav = 0;
  //                 let taxableCapitalGains = 0;

  //                 if (isGrandfathered) {
  //                     // Fetch NAV as of January 31, 2018
  //                     const grandFatheringNav = await this.fetchNAVFromThirdParty(txn.transactionReport.isin, '2018-01-31');

  //                     // const nav2018 = txn.purchased_at

  //                     const acquisitionCost = txn.purchased_at * txn.units;
  //                     const fairMarketValue = grandFatheringNav * txn.units;
  //                     const actualSellValue = txn.transactionReport.traded_at * txn.units;

  //                     // Taxable gain considering grandfathering
  //                     taxableCapitalGains = Math.max(0, actualSellValue - Math.max(acquisitionCost, fairMarketValue));
  //                 } else {
  //                     // Non-grandfathered gains
  //                     taxableCapitalGains = txn.transactionReport.traded_at * txn.units - indexedCost;
  //                 }

  //                 result.push({
  //                     folio_number: txn.transactionReport.folio_number,
  //                     isin: txn.transactionReport.isin,
  //                     scheme_name: fund.data.find(f => f.isinCode === txn.transactionReport.isin)?.schemeName || txn.transactionReport.rta_scheme_name,
  //                     type: txn.transactionReport.type,
  //                     amount: (txn.source_transaction.units * txn.transactionReport.traded_at) * exitloadforCalculation,
  //                     units: txn.source_transaction.units,
  //                     traded_on: txn.transactionReport.traded_on,
  //                     traded_at: txn.transactionReport.traded_at,
  //                     source_days_held: txn.days_held,
  //                     source_purchased_on: txn.purchased_on,
  //                     source_purchased_at: txn.purchased_at,
  //                     source_actual_gain: txn.gain,
  //                     source_taxable_gain: txn.gain,
  //                     grand_fathering: isGrandfathered,
  //                     grand_fathering_nav: grandFatheringNav,
  //                     indexed_cost_of_acquisition: indexedCost.toFixed(4),
  //                     indexed_capital_gains: taxableCapitalGains.toFixed(4),
  //                     user: txn.transactionReport.users
  //                 });
  //             }

  //             console.log("Resulttt", result)
  //             let excelDownloadLink = await this.generateExcelforCapitalGains(result)
  //             let saveCapitalgains = new CapitalGainDto()
  //             saveCapitalgains.user_id = 26
  //             // saveCapitalgains.user_id = user.id
  //             const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  //             const month = lastMonthDate.getMonth() + 1; // 1-12
  //             const year = lastMonthDate.getFullYear();
  //             saveCapitalgains.month = month
  //             saveCapitalgains.year = year
  //             saveCapitalgains.report_url = excelDownloadLink
  //             const save_capital_gain = await connection
  //                 .getRepository(CapitalGainReport).save(saveCapitalgains)
  //             console.log("Capital Gains saved")

  //             // }
  //         }
  //         // Return paginated result with metadata
  //         return { status: HttpStatus.OK };

  //     } catch (ex) {
  //         return { status: HttpStatus.BAD_REQUEST, error: ex.message };
  //     }

  // }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {
    name: 'capital_gains',
  })
  async capital_gains() {
    try {
      const tenants_array = this.tenant_list.split(',');

      for (const maxwealth_tenant_id of tenants_array) {
        const connection: TypeORM.DataSource = await this.get_datasource(
          maxwealth_tenant_id,
        );

        // Step 1: Get all users who have transactions
        const usersWithTransactions = await connection
          .getRepository(TransactionReports)
          .createQueryBuilder('transactionReport')
          .select('DISTINCT transactionReport.user_id', 'user_id')
          .getRawMany();

        console.log(
          `Found ${usersWithTransactions.length} users with transactions`,
        );

        // Process each user one by one
        for (const userObj of usersWithTransactions) {
          const user_id = userObj.user_id;
          console.log(`Processing capital gains for user_id: ${user_id}`);

          // Step 2: Find the user's first transaction date
          const firstTransactionQuery = await connection
            .getRepository(TransactionReports)
            .createQueryBuilder('transactionReport')
            .where('transactionReport.user_id = :user_id', { user_id })
            .orderBy('transactionReport.traded_on', 'ASC')
            .limit(1);

          const firstTransaction = await firstTransactionQuery.getOne();

          if (!firstTransaction) {
            console.log(`No transactions found for user ${user_id}`);
            continue; // Skip to next user if no transactions
          }

          console.log(
            `First transaction date for user ${user_id}: ${firstTransaction.traded_on}`,
          );

          // Step 3: Find the months we already have capital gain reports for
          const existingReports = await connection
            .getRepository(CapitalGainReport)
            .createQueryBuilder('capitalGain')
            .where('capitalGain.user_id = :user_id', { user_id })
            .getMany();

          // Create a map of existing reports for quick lookup
          const existingReportMap = {};
          existingReports.forEach((report) => {
            // Create a key in format 'YYYY-MM'
            const key = `${report.year}-${report.month
              .toString()
              .padStart(2, '0')}`;
            existingReportMap[key] = true;
          });

          console.log(
            `User ${user_id} has ${
              Object.keys(existingReportMap).length
            } existing reports`,
          );

          // Step 4: Generate a list of all months from first transaction to current date
          const firstTradeDate = new Date(firstTransaction.traded_on);
          const currentDate = new Date();

          // Set hours to noon to avoid timezone issues
          firstTradeDate.setHours(12, 0, 0, 0);

          // Start from the first day of the month of the first transaction
          const startDate = new Date(
            firstTradeDate.getFullYear(),
            firstTradeDate.getMonth(),
            1,
            12,
            0,
            0,
          );

          // Loop through all months from first transaction until now
          let processingDate = new Date(startDate);

          while (processingDate <= currentDate) {
            const year = processingDate.getFullYear();
            const month = processingDate.getMonth() + 1; // 1-12
            const monthKey = `${year}-${month.toString().padStart(2, '0')}`;

            // Check if a report already exists for this month and user in the database
            const existingReport = await connection
              .getRepository(CapitalGainReport)
              .createQueryBuilder('capitalGain')
              .where('capitalGain.user_id = :user_id', { user_id })
              .andWhere('capitalGain.month = :month', { month })
              .andWhere('capitalGain.year = :year', { year })
              .getOne();

            if (existingReport) {
              console.log(
                `Skipping month ${monthKey} for user ${user_id} - report already exists in database`,
              );

              // Move to next month
              processingDate = new Date(
                processingDate.getFullYear(),
                processingDate.getMonth() + 1,
                1,
                12,
                0,
                0,
              );
              continue;
            }

            console.log(
              `Processing capital gains for user ${user_id}, month: ${monthKey}`,
            );

            // Set date range for this month
            const monthStart = new Date(year, month - 1, 1, 12, 0, 0);
            const monthEnd = new Date(year, month, 0, 12, 0, 0); // Last day of the month

            const traded_on_from = monthStart.toISOString().split('T')[0];
            const traded_on_to = monthEnd.toISOString().split('T')[0];

            console.log(`Date range: ${traded_on_from} to ${traded_on_to}`);

            // Query transactions for this month
            const queryBuilder = await connection
              .getRepository(Source)
              .createQueryBuilder('sources')
              .leftJoinAndSelect(
                'sources.transactionReport',
                'transactionReport',
              )
              .leftJoinAndSelect('transactionReport.users', 'user')
              .leftJoinAndSelect(
                'sources.source_transaction',
                'source_transaction',
              )
              .where('transactionReport.user_id = :user_id', { user_id })
              .andWhere('transactionReport.traded_on >= :traded_on_from', {
                traded_on_from,
              })
              .andWhere('transactionReport.traded_on <= :traded_on_to', {
                traded_on_to,
              });

            const transactions = await queryBuilder.getMany();

            if (transactions.length === 0) {
              console.log(
                `No transactions found for user ${user_id} in month ${monthKey}`,
              );

              // Move to next month
              processingDate = new Date(
                processingDate.getFullYear(),
                processingDate.getMonth() + 1,
                1,
                12,
                0,
                0,
              );
              continue;
            }

            console.log(
              `Found ${transactions.length} transactions for user ${user_id} in month ${monthKey}`,
            );

            // Extract ISINs
            const isin = transactions
              .filter(
                (scheme) =>
                  scheme.transactionReport.isin &&
                  scheme.transactionReport.isin.length > 0,
              )
              .map((scheme) => scheme.transactionReport.isin);

            // Filter out invalid ISINs
            const validIsins = [
              ...new Set(isin.filter((item) => item && item.trim() !== '')),
            ];

            if (!validIsins.length) {
              console.log(
                `No valid ISINs found for user ${user_id} in month ${monthKey}`,
              );

              // Move to next month
              processingDate = new Date(
                processingDate.getFullYear(),
                processingDate.getMonth() + 1,
                1,
                12,
                0,
                0,
              );
              continue;
            }

            // Get fund details
            const fund: any =
              await this.mutualfundsService.getFundDetailsByIsins(validIsins);

            // Calculate capital gains for each transaction
            const result = [];
            for (const txn of transactions) {
              const purchaseYear = new Date(txn.purchased_on).getFullYear(); // Extract purchase year
              const cii = await connection
                .getRepository(CostInflationIndex)
                .findOne({ where: { financial_year: purchaseYear } });

              const ciiValue = cii?.cost_inflation_index || 100; // Default to 100 if not found

              // Get fund details and exit load
              const fundDetail = await connection
                .getRepository(FundDetail)
                .findOne({ where: { isin: txn.transactionReport.isin } });

              const exitload = fundDetail?.exitLoad
                ? Number(fundDetail.exitLoad)
                : 0;
              const exitloadforCalculation = 1 - exitload / 100;

              const indexedCost = txn.purchased_at * (ciiValue / 100);

              // Grandfathering logic
              const grandfatherDate = new Date('2018-01-31');
              const isGrandfathered =
                new Date(txn.purchased_on) <= grandfatherDate;
              let grandFatheringNav = 0;
              let taxableCapitalGains = 0;

              if (isGrandfathered) {
                // Fetch NAV as of January 31, 2018
                grandFatheringNav = await this.fetchNAVFromThirdParty(
                  txn.transactionReport.isin,
                  '2018-01-31',
                );

                const acquisitionCost = txn.purchased_at * txn.units;
                const fairMarketValue = grandFatheringNav * txn.units;
                const actualSellValue =
                  txn.transactionReport.traded_at * txn.units;

                // Taxable gain considering grandfathering
                taxableCapitalGains = Math.max(
                  0,
                  actualSellValue - Math.max(acquisitionCost, fairMarketValue),
                );
              } else {
                // Non-grandfathered gains
                taxableCapitalGains =
                  txn.transactionReport.traded_at * txn.units - indexedCost;
              }

              result.push({
                folio_number: txn.transactionReport.folio_number,
                isin: txn.transactionReport.isin,
                scheme_name:
                  fund?.data?.find(
                    (f) => f.isinCode === txn.transactionReport.isin,
                  )?.schemeName || txn.transactionReport.rta_scheme_name,
                type: txn.transactionReport.type,
                amount:
                  txn.source_transaction.units *
                  txn.transactionReport.traded_at *
                  exitloadforCalculation,
                units: txn.source_transaction.units,
                traded_on: txn.transactionReport.traded_on,
                traded_at: txn.transactionReport.traded_at,
                source_days_held: txn.days_held,
                source_purchased_on: txn.purchased_on,
                source_purchased_at: txn.purchased_at,
                source_actual_gain: txn.gain,
                source_taxable_gain: txn.gain,
                grand_fathering: isGrandfathered,
                grand_fathering_nav: grandFatheringNav,
                indexed_cost_of_acquisition: indexedCost.toFixed(4),
                indexed_capital_gains: taxableCapitalGains.toFixed(4),
                user: txn.transactionReport.users,
              });
            }

            // Generate Excel and save report
            const excelDownloadLink = await this.generateExcelforCapitalGains(
              result,
            );

            // Create new capital gains record
            const saveCapitalgains = new CapitalGainDto();
            saveCapitalgains.user_id = user_id;
            saveCapitalgains.month = month;
            saveCapitalgains.year = year;
            saveCapitalgains.report_url = excelDownloadLink;

            // Double-check again before saving to avoid race conditions
            const finalCheck = await connection
              .getRepository(CapitalGainReport)
              .createQueryBuilder('capitalGain')
              .where('capitalGain.user_id = :user_id', { user_id })
              .andWhere('capitalGain.month = :month', { month })
              .andWhere('capitalGain.year = :year', { year })
              .getOne();

            if (!finalCheck) {
              try {
                const save_capital_gain = await connection
                  .getRepository(CapitalGainReport)
                  .save(saveCapitalgains);

                console.log(
                  `Capital gains report saved for user ${user_id}, month ${monthKey}`,
                );
              } catch (err) {
                // Handle duplicate key error or other issues
                console.error(
                  `Error saving capital gains for user ${user_id}, month ${monthKey}:`,
                  err.message,
                );
              }
            } else {
              console.log(
                `Skipping save - report already exists for user ${user_id}, month ${monthKey}`,
              );
            }

            // Move to next month
            processingDate = new Date(
              processingDate.getFullYear(),
              processingDate.getMonth() + 1,
              1,
              12,
              0,
              0,
            );
          }
        }
      }

      return { status: HttpStatus.OK };
    } catch (ex) {
      console.error('Error in capital_gains:', ex);
      return { status: HttpStatus.BAD_REQUEST, error: ex.message };
    }
  }

  @Cron(CronExpression.EVERY_YEAR, { name: 'capital_gains_yearly' })
  async capital_gains_yearly() {
    try {
      const tenants_array = this.tenant_list.split(',');

      for (const maxwealth_tenant_id of tenants_array) {
        const connection: TypeORM.DataSource = await this.get_datasource(
          maxwealth_tenant_id,
        );

        // Get all users who have transactions
        const usersWithTransactions = await connection
          .getRepository(TransactionReports)
          .createQueryBuilder('transactionReport')
          .select('DISTINCT transactionReport.user_id', 'user_id')
          .getRawMany();

        console.log(
          `Found ${usersWithTransactions.length} users with transactions`,
        );

        for (const userObj of usersWithTransactions) {
          const user_id = userObj.user_id;
          console.log(`Processing capital gains for user_id: ${user_id}`);

          const firstTransaction = await connection
            .getRepository(TransactionReports)
            .createQueryBuilder('transactionReport')
            .where('transactionReport.user_id = :user_id', { user_id })
            .orderBy('transactionReport.traded_on', 'ASC')
            .limit(1)
            .getOne();

          if (!firstTransaction) {
            console.log(`No transactions found for user ${user_id}`);
            continue;
          }

          console.log(
            `First transaction date for user ${user_id}: ${firstTransaction.traded_on}`,
          );

          const firstTradeDate = new Date(firstTransaction.traded_on);
          const currentDate = new Date();

          // Set hours to noon to avoid timezone issues
          firstTradeDate.setHours(12, 0, 0, 0);
          const startDate = new Date(
            firstTradeDate.getFullYear(),
            0,
            1,
            12,
            0,
            0,
          );
          let processingDate = new Date(startDate);

          while (processingDate.getFullYear() <= currentDate.getFullYear()) {
            const year = processingDate.getFullYear();

            // Check if report already exists
            const existingReport = await connection
              .getRepository(CapitalGainReport)
              .createQueryBuilder('capitalGain')
              .where('capitalGain.user_id = :user_id', { user_id })
              .andWhere('capitalGain.month = 0')
              .andWhere('capitalGain.year = :year', { year })
              .getOne();

            console.log('Existing Report', existingReport);

            if (existingReport) {
              console.log(
                `Skipping year ${year} for user ${user_id} - report already exists`,
              );
              processingDate = new Date(
                processingDate.getFullYear() + 1,
                0,
                1,
                12,
                0,
                0,
              );
              continue;
            }

            console.log(
              `Processing capital gains for user ${user_id}, year: ${year}`,
            );

            const traded_on_from = `${year}-01-01`;
            const traded_on_to = `${year}-12-31`;

            const queryBuilder = await connection
              .getRepository(Source)
              .createQueryBuilder('sources')
              .leftJoinAndSelect(
                'sources.transactionReport',
                'transactionReport',
              )
              .leftJoinAndSelect('transactionReport.users', 'user')
              .leftJoinAndSelect(
                'sources.source_transaction',
                'source_transaction',
              )
              .where('transactionReport.user_id = :user_id', { user_id })
              .andWhere(
                'transactionReport.traded_on BETWEEN :traded_on_from AND :traded_on_to',
                { traded_on_from, traded_on_to },
              );

            const transactions = await queryBuilder.getMany();

            if (transactions.length === 0) {
              console.log(
                `No transactions found for user ${user_id} in year ${year}`,
              );
              processingDate = new Date(
                processingDate.getFullYear() + 1,
                0,
                1,
                12,
                0,
                0,
              );
              continue;
            }

            console.log(
              `Found ${transactions.length} transactions for user ${user_id} in year ${year}`,
            );

            const isin = transactions
              .filter(
                (s) =>
                  s.transactionReport.isin &&
                  s.transactionReport.isin.length > 0,
              )
              .map((s) => s.transactionReport.isin);

            const validIsins = [
              ...new Set(isin.filter((item) => item && item.trim() !== '')),
            ];

            if (!validIsins.length) {
              console.log(
                `No valid ISINs found for user ${user_id} in year ${year}`,
              );
              processingDate = new Date(
                processingDate.getFullYear() + 1,
                0,
                1,
                12,
                0,
                0,
              );
              continue;
            }

            const fund: any =
              await this.mutualfundsService.getFundDetailsByIsins(validIsins);

            const result = [];

            for (const txn of transactions) {
              const purchaseYear = new Date(txn.purchased_on).getFullYear();
              const cii = await connection
                .getRepository(CostInflationIndex)
                .findOne({ where: { financial_year: purchaseYear } });

              const ciiValue = cii?.cost_inflation_index || 100;

              const fundDetail = await connection
                .getRepository(FundDetail)
                .findOne({ where: { isin: txn.transactionReport.isin } });

              const exitload = fundDetail?.exitLoad
                ? Number(fundDetail.exitLoad)
                : 0;
              const exitloadFactor = 1 - exitload / 100;

              const indexedCost = txn.purchased_at * (ciiValue / 100);

              const grandfatherDate = new Date('2018-01-31');
              const isGrandfathered =
                new Date(txn.purchased_on) <= grandfatherDate;
              let grandFatheringNav = 0;
              let taxableCapitalGains = 0;

              if (isGrandfathered) {
                grandFatheringNav = await this.fetchNAVFromThirdParty(
                  txn.transactionReport.isin,
                  '2018-01-31',
                );

                const acquisitionCost = txn.purchased_at * txn.units;
                const fairMarketValue = grandFatheringNav * txn.units;
                const actualSellValue =
                  txn.transactionReport.traded_at * txn.units;

                taxableCapitalGains = Math.max(
                  0,
                  actualSellValue - Math.max(acquisitionCost, fairMarketValue),
                );
              } else {
                taxableCapitalGains =
                  txn.transactionReport.traded_at * txn.units - indexedCost;
              }

              result.push({
                folio_number: txn.transactionReport.folio_number,
                isin: txn.transactionReport.isin,
                scheme_name:
                  fund?.data?.find(
                    (f) => f.isinCode === txn.transactionReport.isin,
                  )?.schemeName || txn.transactionReport.rta_scheme_name,
                type: txn.transactionReport.type,
                amount:
                  txn.source_transaction.units *
                  txn.transactionReport.traded_at *
                  exitloadFactor,
                units: txn.source_transaction.units,
                traded_on: txn.transactionReport.traded_on,
                traded_at: txn.transactionReport.traded_at,
                source_days_held: txn.days_held,
                source_purchased_on: txn.purchased_on,
                source_purchased_at: txn.purchased_at,
                source_actual_gain: txn.gain,
                source_taxable_gain: txn.gain,
                grand_fathering: isGrandfathered,
                grand_fathering_nav: grandFatheringNav,
                indexed_cost_of_acquisition: indexedCost.toFixed(4),
                indexed_capital_gains: taxableCapitalGains.toFixed(4),
                user: txn.transactionReport.users,
              });
            }

            const excelDownloadLink = await this.generateExcelforCapitalGains(
              result,
            );

            const saveCapitalgains = new CapitalGainDto();
            saveCapitalgains.user_id = user_id;
            saveCapitalgains.month = 0;
            saveCapitalgains.year = year;
            saveCapitalgains.report_url = excelDownloadLink;

            const month = 0;

            const finalCheck = await connection
              .getRepository(CapitalGainReport)
              .findOne({
                where: {
                  user_id: user_id,
                  year: year,
                  month: Raw((alias) => `${alias} = 0 OR ${alias} IS NULL`),
                },
              });

            console.log('Final check', finalCheck);

            if (!finalCheck) {
              try {
                await connection
                  .getRepository(CapitalGainReport)
                  .save(saveCapitalgains);
                console.log(
                  `Capital gains report saved for user ${user_id}, year ${year}`,
                );
              } catch (err) {
                console.error(
                  `Error saving capital gains for user ${user_id}, year ${year}:`,
                  err.message,
                );
              }
            } else {
              console.log(
                `Skipping save - report already exists for user ${user_id}, year ${year}`,
              );
            }

            processingDate = new Date(
              processingDate.getFullYear() + 1,
              0,
              1,
              12,
              0,
              0,
            );
          }
        }
      }

      return { status: HttpStatus.OK };
    } catch (ex) {
      console.error('Error in capital_gains yearly report:', ex);
      return { status: HttpStatus.BAD_REQUEST, error: ex.message };
    }
  }

  async generateExcelforCapitalGains(folios: any[]): Promise<string> {
    try {
      // Define the column headings
      const headers = {
        'Folio Number': '',
        ISIN: '',
        'Scheme Name': '',
        Type: '',
        Amount: '',
        Units: '',
        'Traded On': '',
        'Traded At': '',
        'Days Held': '',
        'Purchased On': '',
        'Purchased At': '',
        'Actual Gain': '',
        'Taxable Gain': '',
        Grandfathered: '',
        'Grandfathering NAV': '',
        'Indexed Cost of Acquisition': '',
        'Indexed Capital Gains': '',
      };

      // Create rows - use headers only if folios is empty
      const rows =
        folios && folios.length > 0
          ? folios.map((folio) => ({
              'Folio Number': folio.folio_number || '',
              ISIN: folio.isin || '',
              'Scheme Name': folio.scheme_name || '',
              Type: folio.type || '',
              Amount: folio.amount || 0,
              Units: folio.units || 0,
              'Traded On': folio.traded_on || '',
              'Traded At': folio.traded_at || 0,
              'Days Held': folio.source_days_held || 0,
              'Purchased On': folio.source_purchased_on || '',
              'Purchased At': folio.source_purchased_at || 0,
              'Actual Gain': folio.source_actual_gain || 0,
              'Taxable Gain': folio.source_taxable_gain || 0,
              Grandfathered: folio.grand_fathering || '',
              'Grandfathering NAV': folio.grand_fathering_nav || 0,
              'Indexed Cost of Acquisition':
                folio.indexed_cost_of_acquisition || 0,
              'Indexed Capital Gains': folio.indexed_capital_gains || 0,
            }))
          : [headers]; // Use just headers if no data

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Capital Gains');

      // Prepare directory
      const directory = path.join(`${this.filepath}`, 'uploads');
      const downloaddirectory = path.join(directory, 'downloads');

      if (!fs.existsSync(downloaddirectory)) {
        fs.mkdirSync(downloaddirectory, { recursive: true });
      }

      // Generate file name and path
      const uniqueFileName = `Capital_Gains_${Date.now()}.xlsx`;
      const filePath = path.join(downloaddirectory, uniqueFileName);

      // Write file
      XLSX.writeFile(workbook, filePath);

      // Verify file was written
      if (!fs.existsSync(filePath)) {
        throw new Error('Failed to write Excel file');
      }

      return `${process.env.BASE_URL}/uploads/downloads/${uniqueFileName}`;
    } catch (err) {
      console.error('Error generating Excel file:', err);
      throw new Error(`Failed to generate Excel file: ${err.message}`);
    }
  }

  async fetchNAVFromThirdParty(isin: string, date: string) {
    const apiUrl = `${this.mf_base_url}/api/v1/mutual_funds/mutual_funds_details/getNavByIsinAndDate?isin=${isin}&date=${date}`;

    console.log(`Attempting to fetch NAV for ISIN: ${isin} on Date: ${date}`);
    console.log(`API URL: ${apiUrl}`);

    try {
      const response = await axios.get(apiUrl);
      console.log('API Response:', response.data);

      if (response.data && response.data.nav) {
        console.log(`NAV fetched successfully: ${response.data.nav}`);
        return response.data.nav;
      } else {
        console.error(`NAV not found for ISIN: ${isin} on Date: ${date}`);
        throw new Error('NAV data not found for the specified ISIN and date');
      }
    } catch (error) {
      console.error('Error occurred while fetching NAV:', error.message);
      throw error;
    }
  }

  // // @Cron(CronExpression.EVERY_6_HOURS, {name: "Finding fund details"})
  // async findAllFunds() {
  //     try {
  //         const tenants_array = this.tenant_list.split(",");
  //         for (let maxwealth_tenant_id of tenants_array) {

  //             let connection: TypeORM.DataSource = await this.get_datasource(maxwealth_tenant_id);
  //             console.log("executed")
  //             // let all_onboarded = await connection.getRepository(UserOnboardingDetails).find({ where: { fp_investment_account_old_id: Not(IsNull()) } })
  //             let purchases = await connection.getRepository(Purchase).find({ where: { state: Not('failed'), submitted_at: null } });
  //             let purchasesWithIsins = []
  //             for (let purchase of purchases) {
  //                 purchasesWithIsins.push(purchase.scheme)
  //             }
  //             let fundDetails = await this.mutualfundsService.findFundsByIsins(purchasesWithIsins);
  //             let fundDetailsMap = {};
  //             for (let fund of fundDetails.data) {
  //                 fundDetailsMap[fund.isinCode] = fund;
  //             }

  //             // console.log("purchases", purchases)

  //             let xmlData
  //             let user, user_onboarding, user_address, user_bank, user_nominee
  //             let purchase_id, trxn_date, hours, minutes, seconds, formattedTime, units, amount, folio_no, scheme_code, transaction_basket_items, kyc_details, brok_code, reinv_tag, occ_code, sub_transaction_type, sip_rgdt, sip_rfno, inst_no, log_wt, trxn_mode, sip_new
  //             for (let purchase of purchases) {
  //                 user = await connection.getRepository(Users).findOne({ where: { id: purchase.user_id } })
  //                 console.log("user_id", user.id)
  //                 user_onboarding = await connection.getRepository(UserOnboardingDetails).findOne({ where: { user_id: user.id } })
  //                 console.log("onb", user_onboarding)
  //                 let occupation = await connection.getRepository(Occupation).find()
  //                 console.log("occupation", occupation)
  //                 for (let occ of occupation) {
  //                     if (occ.karvy_occupation_identifier === user_onboarding.occupation) {
  //                         occ_code = occ.karvy_occupation_code
  //                         console.log("occ_code", occ_code)
  //                     }
  //                 }
  //                 user_address = await connection.getRepository(UserAddressDetails).findOne({ where: { user_id: user.id } })
  //                 console.log("add", user_address)
  //                 console.log("add1", user_address.line_1)
  //                 user_bank = await connection.getRepository(UserBankDetails).findOne({ where: { user_id: user.id } })
  //                 console.log("bank", user_bank)
  //                 user_nominee = await connection.getRepository(UserNomineeDetails).findOne({ where: { user_id: user.id } })
  //                 console.log("nom", user_nominee)
  //                 if (purchase.folio_number) {
  //                     reinv_tag = 'Y'
  //                 } else {
  //                     reinv_tag = 'Z'
  //                 }

  //                 if (purchase.plan && purchase.plan != null) {
  //                     sub_transaction_type = 'S';
  //                 } else {
  //                     sub_transaction_type = 'N';
  //                 }

  //                 if (purchase.plan && purchase.plan != null) {
  //                     trxn_mode = 'S'
  //                 } else {
  //                     trxn_mode = 'W'
  //                 }

  //                 let mf_purchase_plan = await connection.getRepository(MfPurchasePlan).findOne({ where: { id: purchase.plan } })
  //                 sip_rgdt = mf_purchase_plan.start_date
  //                 sip_rfno = mf_purchase_plan.id
  //                 inst_no = (mf_purchase_plan.number_of_installments - mf_purchase_plan.remaining_installments) + 1

  //                 if (purchase.plan && purchase.plan != null) {
  //                     if (inst_no == 1) {
  //                         sip_new = 'N'
  //                     } else {
  //                         sip_new = 'E'
  //                     }
  //                 } else {
  //                     sip_new = null
  //                 }
  //                 purchase_id = purchase.id
  //                 trxn_date = new Date(purchase.created_at)
  //                 hours = trxn_date.getHours();
  //                 minutes = trxn_date.getMinutes();
  //                 seconds = trxn_date.getSeconds();
  //                 units = purchase.allotted_units
  //                 amount = purchase.amount
  //                 folio_no = purchase.folio_number
  //                 brok_code = this.broke_code
  //                 // console.log("brok_code", brok_code)
  //                 scheme_code = purchase.scheme
  //                 kyc_details = await connection.getRepository(KycStatusDetail).findOne({ where: { user_id: user.id, user_onboarding_detail_id: user_onboarding.id } })
  //                 console.log("kyc", kyc_details)
  //                 transaction_basket_items = await connection.getRepository(TransactionBasketItems).findOne({ where: { user_id: user.id } })

  //                 console.log("bask", transaction_basket_items)
  //                 formattedTime = `${hours}:${minutes}:${seconds}`;

  //                 let transaction_basket = await connection.getRepository(TransactionBaskets).findOne({ where: { user_id: user.id } })
  //                 let basket_items = await connection.getRepository(TransactionBasketItems).findOne({ where: { transaction_basket_id: transaction_basket.id } })
  //                 let razorpay_orders = await connection.getRepository(RzpOrder).findOne({ where: { transaction_basket_id: transaction_basket.id } })

  //                 log_wt = new Date();
  //                 let fund = fundDetailsMap[purchase.scheme];
  //                 let amc = await connection.getRepository(Amc).findOne({ where: { amcId: fund.amcId } })
  //                 console.log("rta", amc);

  //                 if (amc.rta == 'karvy') {
  //                     xmlData = await this.kfintechInvestorMasterFoliosService.buildXML(amc.rta_amc_code, brok_code, user.user_code, purchase_id, purchase_id, folio_no, scheme_code, user_onboarding.full_name, user_address.line_1, user_address.line_2, user_address.line_3, user_address.city, user_address.pincode, user.mobile, trxn_date, formattedTime, units, amount, user_onboarding.date_of_birth, user_onboarding.guardian_name, user_onboarding.pan, user.email, user_bank.account_number, user_bank.account_type, user_bank.bank_name, user_bank.branch_name, user_bank.bank_city, reinv_tag, occ_code, sub_transaction_type, transaction_basket_items.payment_method, user_nominee.name, user_nominee.relationship, user_onboarding.guardian_pan, user_onboarding.gender, sip_rgdt, user_bank.ifsc_code, user_nominee.allocation_percentage, sip_rfno, mf_purchase_plan.number_of_installments, mf_purchase_plan.frequency, mf_purchase_plan.start_date, mf_purchase_plan.end_date, inst_no, user_nominee.date_of_birth, user_nominee.guardian_name, purchase.euin, user_onboarding.guardian_date_of_birth, log_wt, transaction_basket_items.fund_isin, sip_new, mf_purchase_plan.amount, amc.deposit_bank_name, amc.deposit_account_no, razorpay_orders.created_at, razorpay_orders.id, trxn_mode)
  //                 }

  //                 // fundDetails = await this.mutualfundsService.findFundsByIsins(purchasesWithIsins)
  //                 // console.log("purchaseswithIsins", purchasesWithIsins)
  //                 // return fundDetails
  //             }
  //             // let xmlData
  //             // if (purchasesWithIsins.length > 0) {

  //             // console.log("fundDetails", fundDetails);
  //             // for (let fund of fundDetails.data) {
  //             //     console.log("fund", fund)
  //             //     // console.log("fund",fund.data.amcId)

  //             // }
  //             // }
  //             return { status: HttpStatus.OK, fundDetails: fundDetails, xml: xmlData }
  //         }
  //     } catch (err) {
  //         console.log("FP CRON --- finding fund details WENT WRONG -- " + err.message);
  //     }
  // }

  @Cron(CronExpression.EVERY_HOUR, { name: 'update_sources' })
  async updateSourceDirect() {
    try {
      const tenants_array = this.tenant_list.split(',');
      for (const maxwealth_tenant_id of tenants_array) {
        const connection: TypeORM.DataSource = await this.get_datasource(
          maxwealth_tenant_id,
        );
        // Fetch transactions sorted by trade date
        const transactions = await connection
          .getRepository(TransactionReports)
          .find({
            where: { is_processed: false },
            order: { traded_on: 'ASC' },
          });

        // Separate transactions into purchases and redemptions
        const purchaseTransactions = transactions.filter(
          (t) =>
            !t.type.toLowerCase().includes('redemption') &&
            !t.type.toLowerCase().includes('switch out') &&
            !t.type.toLowerCase().includes('lateral shift out'),
        );

        const redemptionTransactions = transactions.filter(
          (t) =>
            t.type.toLowerCase().includes('redemption') ||
            t.type.toLowerCase().includes('switch out') ||
            t.type.toLowerCase().includes('lateral shift out'),
        );

        console.log('Purchase transactions:', purchaseTransactions);
        console.log('Redemption transactions:', redemptionTransactions);

        // Add `unitsLeft` field to purchase transactions
        const purchaseUnitsLeft = purchaseTransactions.map((p) => ({
          ...p,
          unitsLeft: p.units_left !== null ? p.units_left : p.units,
        }));

        const results = await Promise.all(
          redemptionTransactions.map(async (redemption) => {
            const {
              folio_number,
              isin,
              units: redeemedUnits,
              amount: redemptionAmount,
              traded_on: redemptionDate,
            } = redemption;

            let remainingUnits = redeemedUnits;
            let realizedGains = 0;
            const redemptionSources = [];

            console.log(`\nProcessing Redemption ID: ${redemption.id}`);
            console.log(
              `Redeemed Units: ${redeemedUnits}, Redemption Amount: ${redemptionAmount}`,
            );

            for (const purchase of purchaseUnitsLeft) {
              // Ensure purchases are from the same folio and ISIN, and are older than the redemption
              if (
                purchase.folio_number !== folio_number ||
                purchase.isin !== isin ||
                purchase.traded_on > redemptionDate
              ) {
                continue;
              }

              // Stop if remaining units are fully redeemed
              if (remainingUnits <= 0) break;

              let unitsFromPurchase = Math.min(
                purchase.unitsLeft,
                remainingUnits,
              );
              if (unitsFromPurchase < 1e-10) {
                unitsFromPurchase = 0;
              }
              const gain =
                (redemption.traded_at - purchase.traded_at) * unitsFromPurchase;
              realizedGains += gain;

              redemptionSources.push({
                sourceTransactionId: purchase.id,
                units: unitsFromPurchase,
                gain,
                purchasedAt: purchase.traded_at,
                purchasedOn: purchase.traded_on,
              });

              console.log(`Matching Purchase ID: ${purchase.id}`);
              console.log(
                `Units from Purchase: ${unitsFromPurchase}, Gain: ${gain}`,
              );
              console.log(`Accumulated Realized Gains: ${realizedGains}`);

              purchase.unitsLeft -= unitsFromPurchase;
              remainingUnits -= unitsFromPurchase;

              // Update purchase units left and processed status in the database
              await connection
                .getRepository(TransactionReports)
                .update(purchase.id, {
                  units_left: Number(purchase.unitsLeft.toFixed(4)),
                });

              if (purchase.unitsLeft <= 0.0001) {
                await connection
                  .getRepository(TransactionReports)
                  .update(purchase.id, { is_processed: true });
              }
            }

            // Log if no purchases are left to fulfill the redemption
            if (remainingUnits > 0) {
              console.log(
                `No purchases left to fulfill redemption for Folio: ${folio_number}`,
              );
            }

            // Mark redemption as processed
            await connection
              .getRepository(TransactionReports)
              .update(redemption.id, { is_processed: true });

            const cost = redemptionAmount - realizedGains;
            const averageCost = cost / redeemedUnits;

            console.log(
              `Total Realized Gains for Redemption ID ${
                redemption.id
              }: ${realizedGains.toFixed(4)}`,
            );
            console.log(
              `Cost for Redemption ID ${redemption.id}: ${cost.toFixed(4)}`,
            );
            console.log(
              `Average Cost for Redemption ID ${
                redemption.id
              }: ${averageCost.toFixed(4)}`,
            );

            return {
              redemptionTransactionId: redemption.id,
              realizedGains: realizedGains.toFixed(4),
              cost: cost.toFixed(4),
              averageCost: averageCost.toFixed(4),
              redemptionDate,
              sources: redemptionSources,
            };
          }),
        );

        // Prepare and save source DTOs
        const sourcedtos = results.flatMap((result) =>
          result.sources.map((source) => ({
            transaction_report_id: result.redemptionTransactionId,
            gain: source.gain,
            units: source.units,
            days_held: Math.floor(
              (new Date(result.redemptionDate).getTime() -
                new Date(source.purchasedOn).getTime()) /
                (1000 * 60 * 60 * 24),
            ),
            purchased_at: source.purchasedAt,
            purchased_on: source.purchasedOn
              ? new Date(source.purchasedOn)
              : null,
            source_transaction_id: source.sourceTransactionId,
          })),
        );

        for (const dto of sourcedtos) {
          console.log('DTO:', dto);
          if (Number(dto.units) > 0) {
            await connection.getRepository(Source).save(dto);
          }
        }

        return { status: HttpStatus.OK, result: results };
      }
    } catch (err) {
      console.error('Error:', err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  // @Cron(CronExpression.EVERY_DAY_AT_7PM, { name: "update_sip_purchase_order" })
  // async updateSipPurchaseOrders() {
  //     try {
  //         const tenants_array = this.tenant_list.split(",");
  //         for (let maxwealth_tenant_id of tenants_array) {
  //             let connection: TypeORM.DataSource = await this.get_datasource(maxwealth_tenant_id);
  //             let user_id = this.configService.get(maxwealth_tenant_id.toUpperCase() + '_USERID')
  //             let member_id = this.configService.get(maxwealth_tenant_id.toUpperCase() + '_MEMBERID')
  //             let password = this.configService.get(maxwealth_tenant_id.toUpperCase() + '_PASSWORD')
  //             let euin = this.configService.get(maxwealth_tenant_id.toUpperCase() + '_EUIN')

  //             let sipTransactionItems = await connection.getRepository(TransactionBasketItems).find({ where: { transaction_type: 'sip', status: 'active' } })
  //             for (let sip of sipTransactionItems) {
  //                 let current_date = new Date();
  //                 let onboardingDetails = await connection.getRepository(UserOnboardingDetails).findOne({ where: { user_id: sip.user_id } })
  //                 if (sip.next_installment_date.toDateString() === current_date.toDateString()) {
  //                     let purchase = new Purchase();
  //                     purchase.confirmed_at = new Date();

  //                     console.log("transaction_basket_item", sip)

  //                     purchase.amount = sip.amount;

  //                     if (sip.folio_number) {
  //                         purchase.folio_number = sip.folio_number;
  //                     }
  //                     console.log("mfpurchase", sip.mf_purchase_plan)
  //                     purchase.plan = sip.mf_purchase_plan.id;
  //                     // purchase.user_ip = ip;
  //                     purchase.scheme = sip.fund_isin;
  //                     // purchase.server_ip = server_ip;

  //                     purchase.user_id = sip.user_id;

  //                     purchase.transaction_basket_item_id = sip.id;
  //                     purchase.folio_number = sip.folio_number;
  //                     purchase.state = 'confirmed';
  //                     purchase.scheme = sip.fund_isin;
  //                     purchase.gateway = "rta";
  //                     purchase.initiated_by = "investor";

  //                     let password_body = {
  //                         "MemberId": member_id,
  //                         "PassKey": password,
  //                         "Password": password,
  //                         "RequestType": "CHILDORDER",
  //                         "UserId": user_id
  //                     }
  //                     let child_order_password = await this.child_order_password(maxwealth_tenant_id, password_body)
  //                     console.log("child_order_password", child_order_password)
  //                     // let get_password = await this.bsev1Service.get_password()
  //                     // let encrypted_password = await this.extractPassword(get_password.data)
  //                     let date = new Date();
  //                     let formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  //                         .toUpperCase()
  //                         .replace(',', '')
  //                     let child_order = {
  //                         ClientCode: onboardingDetails.fp_investor_id,
  //                         Date: formattedDate,
  //                         EncryptedPassword: child_order_password.data.ResponseString,
  //                         MemberCode: member_id,
  //                         RegnNo: sip.fp_sip_id,
  //                         SystematicPlanType: "XSIP"
  //                     }
  //                     let c_order_result = await this.child_order_request(maxwealth_tenant_id, child_order)
  //                     console.log("c_order_result", c_order_result)

  //                     if (c_order_result.data.status == 100) {
  //                         let length = c_order_result.data.ChildOrderDetails.length
  //                         let order = new BseXSipOrder()
  //                         order.order_no = c_order_result.data.ChildOrderDetails[length - 1].OrderNumber;
  //                         order.scheme_code = c_order_result.data.ChildOrderDetails[length - 1].BSESchemeCode
  //                         order.member_id = c_order_result.data.ChildOrderDetails[length - 1].MemberCode
  //                         order.client_code = c_order_result.data.ChildOrderDetails[length - 1].ClientCode
  //                         order.user_id = user_id
  //                         order.int_ref_no = c_order_result.data.ChildOrderDetails[length - 1].IntRefNo
  //                         order.transaction_mode = c_order_result.data.ChildOrderDetails[length - 1].BuySell
  //                         order.dp_trans_mode = c_order_result.data.ChildOrderDetails[length - 1].DPTxnType
  //                         order.installment_amount = c_order_result.data.ChildOrderDetails[length - 1].Amount
  //                         order.folio_no = c_order_result.data.ChildOrderDetails[length - 1].FolioNo
  //                         order.first_order_flag = c_order_result.data.ChildOrderDetails[length - 1].FirstOrderTodayFlag
  //                         order.mandate_id = parseInt(sip.payment_source)
  //                         order.sub_br_code = c_order_result.data.ChildOrderDetails[length - 1].SubBrokerCode
  //                         order.euin = c_order_result.data.ChildOrderDetails[length - 1].EUINNumber
  //                         order.euin_flag = c_order_result.data.ChildOrderDetails[length - 1].EUINFlag
  //                         order.xsip_reg_id = parseInt(sip.fp_sip_id)
  //                         order.bse_remarks = c_order_result.data.Message
  //                         order.transaction_basket_item_id = sip.id
  //                         await connection.getRepository(BseXSipOrder).save(order)

  //                         purchase.fp_id = c_order_result.data.ChildOrderDetails[length - 1].OrderNumber
  //                         purchase.order_number = c_order_result.data.ChildOrderDetails[length - 1].OrderNumber
  //                         purchase = await connection.getRepository(Purchase).save(purchase);
  //                     }
  //                 }
  //             }
  //         }

  //     } catch (err) {
  //         console.error("Error:", err.message);
  //         return { status: HttpStatus.BAD_REQUEST, error: err.message };
  //     }
  // }

  // @Cron(CronExpression.EVERY_DAY_AT_7PM, { name: "update_swp_redemption_order" })
  // async updateSwpRedemptionOrders() {
  //     try {
  //         const tenants_array = this.tenant_list.split(",");
  //         for (let maxwealth_tenant_id of tenants_array) {
  //             let connection: TypeORM.DataSource = await this.get_datasource(maxwealth_tenant_id);
  //             let user_id = this.configService.get(maxwealth_tenant_id.toUpperCase() + '_USERID')
  //             let member_id = this.configService.get(maxwealth_tenant_id.toUpperCase() + '_MEMBERID')
  //             let password = this.configService.get(maxwealth_tenant_id.toUpperCase() + '_PASSWORD')
  //             let euin = this.configService.get(maxwealth_tenant_id.toUpperCase() + '_EUIN')

  //             let swpTransactionItems = await connection.getRepository(TransactionBasketItems).find({ where: { transaction_type: 'swp', status: 'active' } })
  //             for (let swp of swpTransactionItems) {
  //                 let current_date = new Date();
  //                 let onboardingDetails = await connection.getRepository(UserOnboardingDetails).findOne({ where: { user_id: swp.user_id } })
  //                 if (swp.next_installment_date.toDateString() === current_date.toDateString()) {
  //                     let redemption = new Redemption();
  //                     redemption.confirmed_at = new Date();

  //                     console.log("transaction_basket_item", swp)

  //                     redemption.amount = swp.amount;

  //                     if (swp.folio_number) {
  //                         redemption.folio_number = swp.folio_number;
  //                     }
  //                     console.log("mfredemption", swp.mf_redemption_plan)
  //                     redemption.plan = swp.mf_redemption_plan.id;
  //                     // redemption.user_ip = ip;
  //                     redemption.scheme = swp.fund_isin;
  //                     // redemption.server_ip = server_ip;

  //                     redemption.user_id = swp.user_id;

  //                     redemption.transaction_basket_item_id = swp.id;
  //                     redemption.folio_number = swp.folio_number;
  //                     redemption.state = 'confirmed';
  //                     redemption.scheme = swp.fund_isin;
  //                     redemption.gateway = "rta";
  //                     redemption.initiated_by = "investor";

  //                     let password_body = {
  //                         "MemberId": member_id,
  //                         "PassKey": password,
  //                         "Password": password,
  //                         "RequestType": "CHILDORDER",
  //                         "UserId": user_id
  //                     }
  //                     let child_order_password = await this.child_order_password(maxwealth_tenant_id, password_body)
  //                     console.log("child_order_password", child_order_password)
  //                     // let get_password = await this.bsev1Service.get_password()
  //                     // let encrypted_password = await this.extractPassword(get_password.data)
  //                     let date = new Date();
  //                     let formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  //                         .toUpperCase()
  //                         .replace(',', '')
  //                     let child_order = {
  //                         ClientCode: onboardingDetails.fp_investor_id,
  //                         Date: formattedDate,
  //                         EncryptedPassword: child_order_password.data.ResponseString,
  //                         MemberCode: member_id,
  //                         RegnNo: swp.fp_swp_id,
  //                         SystematicPlanType: "SWP"
  //                     }
  //                     let c_order_result = await this.child_order_request(maxwealth_tenant_id, child_order)
  //                     console.log("c_order_result", c_order_result)

  //                     if (c_order_result.data.status == 100) {
  //                         let length = c_order_result.data.ChildOrderDetails.length
  //                         let order = new BseXSipOrder()
  //                         order.order_no = c_order_result.data.ChildOrderDetails[length - 1].OrderNumber;
  //                         order.scheme_code = c_order_result.data.ChildOrderDetails[length - 1].BSESchemeCode
  //                         order.member_id = c_order_result.data.ChildOrderDetails[length - 1].MemberCode
  //                         order.client_code = c_order_result.data.ChildOrderDetails[length - 1].ClientCode
  //                         order.user_id = user_id
  //                         order.int_ref_no = c_order_result.data.ChildOrderDetails[length - 1].IntRefNo
  //                         order.transaction_mode = c_order_result.data.ChildOrderDetails[length - 1].BuySell
  //                         order.dp_trans_mode = c_order_result.data.ChildOrderDetails[length - 1].DPTxnType
  //                         order.installment_amount = c_order_result.data.ChildOrderDetails[length - 1].Amount
  //                         order.folio_no = c_order_result.data.ChildOrderDetails[length - 1].FolioNo
  //                         order.first_order_flag = c_order_result.data.ChildOrderDetails[length - 1].FirstOrderTodayFlag
  //                         order.mandate_id = parseInt(swp.payment_source)
  //                         order.sub_br_code = c_order_result.data.ChildOrderDetails[length - 1].SubBrokerCode
  //                         order.euin = c_order_result.data.ChildOrderDetails[length - 1].EUINNumber
  //                         order.euin_flag = c_order_result.data.ChildOrderDetails[length - 1].EUINFlag
  //                         order.xsip_reg_id = parseInt(swp.fp_swp_id)
  //                         order.bse_remarks = c_order_result.data.Message
  //                         order.transaction_basket_item_id = swp.id
  //                         await connection.getRepository(BseXSipOrder).save(order)

  //                         redemption.fp_id = c_order_result.data.ChildOrderDetails[length - 1].OrderNumber
  //                         redemption = await connection.getRepository(Redemption).save(redemption);
  //                     }
  //                 }
  //             }
  //         }

  //     } catch (err) {
  //         console.error("Error:", err.message);
  //         return { status: HttpStatus.BAD_REQUEST, error: err.message };
  //     }
  // }

  // @Cron(CronExpression.EVERY_DAY_AT_7PM, { name: "update_syp_switch_order" })
  // async updateStpSwitchOrders() {
  //     try {
  //         const tenants_array = this.tenant_list.split(",");
  //         for (let maxwealth_tenant_id of tenants_array) {
  //             let connection: TypeORM.DataSource = await this.get_datasource(maxwealth_tenant_id);
  //             let user_id = this.configService.get(maxwealth_tenant_id.toUpperCase() + '_USERID')
  //             let member_id = this.configService.get(maxwealth_tenant_id.toUpperCase() + '_MEMBERID')
  //             let password = this.configService.get(maxwealth_tenant_id.toUpperCase() + '_PASSWORD')
  //             let euin = this.configService.get(maxwealth_tenant_id.toUpperCase() + '_EUIN')

  //             let stpTransactionItems = await connection.getRepository(TransactionBasketItems).find({ where: { transaction_type: 'stp', status: 'active' } })
  //             for (let stp of stpTransactionItems) {
  //                 let current_date = new Date();
  //                 let onboardingDetails = await connection.getRepository(UserOnboardingDetails).findOne({ where: { user_id: stp.user_id } })
  //                 if (stp.next_installment_date.toDateString() === current_date.toDateString()) {
  //                     let switch_funds = new SwitchFunds();
  //                     switch_funds.confirmed_at = new Date();

  //                     console.log("transaction_basket_item", stp)

  //                     switch_funds.amount = stp.amount;

  //                     if (stp.folio_number) {
  //                         switch_funds.folio_number = stp.folio_number;
  //                     }
  //                     console.log("mfswitch_funds", stp.fp_stp_id)
  //                     switch_funds.plan = stp.fp_stp_id;
  //                     // switch_funds.user_ip = ip;
  //                     switch_funds.switch_in_scheme = stp.fund_isin;
  //                     switch_funds.switch_out_scheme = stp.to_fund_isin;
  //                     // switch_funds.server_ip = server_ip;

  //                     switch_funds.user_id = stp.user_id;

  //                     switch_funds.transaction_basket_item_id = stp.id;
  //                     switch_funds.folio_number = stp.folio_number;
  //                     switch_funds.state = 'confirmed';
  //                     // switch_funds.scheme = stp.fund_isin;
  //                     switch_funds.gateway = "rta";
  //                     switch_funds.initiated_by = "investor";

  //                     let password_body = {
  //                         "MemberId": member_id,
  //                         "PassKey": password,
  //                         "Password": password,
  //                         "RequestType": "CHILDORDER",
  //                         "UserId": user_id
  //                     }
  //                     let child_order_password = await this.child_order_password(maxwealth_tenant_id, password_body)
  //                     console.log("child_order_password", child_order_password)
  //                     // let get_password = await this.bsev1Service.get_password()
  //                     // let encrypted_password = await this.extractPassword(get_password.data)
  //                     let date = new Date();
  //                     let formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  //                         .toUpperCase()
  //                         .replace(',', '')
  //                     let child_order = {
  //                         ClientCode: onboardingDetails.fp_investor_id,
  //                         Date: formattedDate,
  //                         EncryptedPassword: child_order_password.data.ResponseString,
  //                         MemberCode: member_id,
  //                         RegnNo: stp.fp_stp_id,
  //                         SystematicPlanType: "STP"
  //                     }
  //                     let c_order_result = await this.child_order_request(maxwealth_tenant_id, child_order)
  //                     console.log("c_order_result", c_order_result)

  //                     if (c_order_result.data.status == 100) {
  //                         let length = c_order_result.data.ChildOrderDetails.length
  //                         let order = new BseXSipOrder()
  //                         order.order_no = c_order_result.data.ChildOrderDetails[length - 1].OrderNumber;
  //                         order.scheme_code = c_order_result.data.ChildOrderDetails[length - 1].BSESchemeCode
  //                         order.member_id = c_order_result.data.ChildOrderDetails[length - 1].MemberCode
  //                         order.client_code = c_order_result.data.ChildOrderDetails[length - 1].ClientCode
  //                         order.user_id = user_id
  //                         order.int_ref_no = c_order_result.data.ChildOrderDetails[length - 1].IntRefNo
  //                         order.transaction_mode = c_order_result.data.ChildOrderDetails[length - 1].BuySell
  //                         order.dp_trans_mode = c_order_result.data.ChildOrderDetails[length - 1].DPTxnType
  //                         order.installment_amount = c_order_result.data.ChildOrderDetails[length - 1].Amount
  //                         order.folio_no = c_order_result.data.ChildOrderDetails[length - 1].FolioNo
  //                         order.first_order_flag = c_order_result.data.ChildOrderDetails[length - 1].FirstOrderTodayFlag
  //                         order.mandate_id = parseInt(stp.payment_source)
  //                         order.sub_br_code = c_order_result.data.ChildOrderDetails[length - 1].SubBrokerCode
  //                         order.euin = c_order_result.data.ChildOrderDetails[length - 1].EUINNumber
  //                         order.euin_flag = c_order_result.data.ChildOrderDetails[length - 1].EUINFlag
  //                         order.xsip_reg_id = parseInt(stp.fp_stp_id)
  //                         order.bse_remarks = c_order_result.data.Message
  //                         order.transaction_basket_item_id = stp.id
  //                         await connection.getRepository(BseXSipOrder).save(order)

  //                         switch_funds.fp_id = c_order_result.data.ChildOrderDetails[length - 1].OrderNumber
  //                         switch_funds = await connection.getRepository(SwitchFunds).save(switch_funds);
  //                     }
  //                 }
  //             }
  //         }

  //     } catch (err) {
  //         console.error("Error:", err.message);
  //         return { status: HttpStatus.BAD_REQUEST, error: err.message };
  //     }
  // }

  // async child_order_password(maxwealth_tenant_id, object: any) {
  //     try {
  //         let bse_base_url = this.configService.get(maxwealth_tenant_id.toUpperCase() + '_BSEV1_BASE_URL')
  //         const headersRequest = {

  //             "Content-Type": "application/json",

  //         }

  //         let bodyRequest = {
  //             "MemberId": object.MemberId,
  //             "PassKey": object.PassKey,
  //             "Password": object.Password,
  //             "RequestType": object.RequestType,
  //             "UserId": object.UserId
  //         }
  //         console.log("childOrder_body", bodyRequest)

  //         var response = this.httpService.post(`${bse_base_url}/StarMFWebService/StarMFWebService.svc/GetPasswordForChildOrder`, bodyRequest, { headers: headersRequest }).pipe(
  //             map((resp) => {
  //                 console.log("FRESPONSEP " + resp);
  //                 return resp.data;
  //             }),
  //         ).pipe(
  //             catchError((e) => {
  //                 console.log("error in fp auth ", e);
  //                 if (e.response && e.response.data && e.response.data.error) {
  //                     console.log("Les", e.response.data.error);
  //                     e.response.data.error.message = "";
  //                     e.response.data.error.errors.map((er) => { e.response.data.error.message += er.field + " : " + er.message + ". " });

  //                 }

  //                 throw new ForbiddenException(e.response.data.error, e.message);
  //             }),
  //         );

  //         var result = await lastValueFrom(response);
  //         console.log("resultttt", result);
  //         return { status: HttpStatus.OK, data: result };

  //     } catch (err) {
  //         console.log("error", err)
  //         return { status: HttpStatus.BAD_REQUEST, error: err.message }
  //     }
  // }

  // async child_order_request(maxwealth_tenant_id, object: any) {
  //     try {
  //         let bse_base_url = this.configService.get(maxwealth_tenant_id.toUpperCase() + '_BSEV1_BASE_URL')
  //         const headersRequest = {

  //             "Content-Type": "application/json",

  //         }

  //         let bodyRequest = {
  //             "ClientCode": object.ClientCode,
  //             "Date": object.Date,
  //             "EncryptedPassword": object.EncryptedPassword,
  //             "MemberCode": object.MemberCode,
  //             "RegnNo": object.RegnNo,
  //             "SystematicPlanType": object.SystematicPlanType
  //         }
  //         console.log("childOrder_req", bodyRequest)

  //         var response = this.httpService.post(`${bse_base_url}/StarMFWebService/StarMFWebService.svc/ChildOrderDetails`, bodyRequest, { headers: headersRequest }).pipe(
  //             map((resp) => {
  //                 console.log("FRESPONSEP " + resp);
  //                 return resp.data;
  //             }),
  //         ).pipe(
  //             catchError((e) => {
  //                 console.log("error in fp auth ", e);
  //                 if (e.response && e.response.data && e.response.data.error) {
  //                     console.log("Les", e.response.data.error);
  //                     e.response.data.error.message = "";
  //                     e.response.data.error.errors.map((er) => { e.response.data.error.message += er.field + " : " + er.message + ". " });

  //                 }

  //                 throw new ForbiddenException(e.response.data.error, e.message);
  //             }),
  //         );

  //         var result = await lastValueFrom(response);
  //         console.log("resultttt", result);
  //         return { status: HttpStatus.OK, data: result };

  //     } catch (err) {
  //         console.log("error", err)
  //         return { status: HttpStatus.BAD_REQUEST, error: err.message }
  //     }
  // }

  async get_fp_token(maxwealth_tenant_id) {
    try {
      const fp_base_url = this.configService.get(
        maxwealth_tenant_id.toUpperCase() + '_FINTECH_BASE_URL',
      );

      const fp_secret = this.configService.get(
        maxwealth_tenant_id.toUpperCase() + '_FINTECH_SECRET_KEY',
      );
      const fp_client_id = this.configService.get(
        maxwealth_tenant_id.toUpperCase() + '_FINTECH_CLIENT_ID',
      );
      const fp_tenant_id = this.configService.get(
        maxwealth_tenant_id.toUpperCase() + '_FINTECH_TENANT_ID',
      );
      const fp_email = this.configService.get(
        maxwealth_tenant_id.toUpperCase() + '_FINTECH_EMAIL',
      );
      const fp_password = this.configService.get(
        maxwealth_tenant_id.toUpperCase() + '_FINTECH_PASSWORD',
      );

      const tenant_id = maxwealth_tenant_id;

      const headersRequest = {
        // afaik this one is not needed
        'x-tenant-id': fp_tenant_id,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      };

      const bodyRequest = qs.stringify({
        client_id: fp_client_id,
        client_secret: fp_secret,
        grant_type: 'client_credentials',
      });

      console.log('this.fp_tenant_id', bodyRequest);
      const response = this.httpService
        .post(
          fp_base_url + '/v2/auth/' + fp_tenant_id + '/token',
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
              console.log(e.response.data.error);
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

  async fp_get_request(fp_tenant_id, url, token) {
    const headersReq = {
      'Content-Type': 'application/json', // afaik this one is not needed
      'x-tenant-id': fp_tenant_id,
      Authorization: 'Bearer ' + token,
    };
    console.log('kksf', url);
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
                er.field + ' : ' + er.message + '. ';
            });
          }

          throw new ForbiddenException(e.response.data.error, e.message);
        }),
      );

    const result = await lastValueFrom(response);
    console.log('RESULT', result);
    return { status: HttpStatus.OK, data: result };
  }
}
