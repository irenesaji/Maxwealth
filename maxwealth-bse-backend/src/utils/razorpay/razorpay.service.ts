import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { RazorpayPennyDropRepository } from 'src/repositories/razorpay_penny_drop.repository';
import { RazorpayPennyDropDto } from './dtos/razorpay_penny_drop.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { getSimilarity } from 'calculate-string-similarity';
import { RazorpayPennyDrops } from './entities/razorpay_penny_drops.entity';
import { Not } from 'typeorm';
import { PaymentDto } from './dtos/payment.dto';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { MutualfundsService } from '../mutualfunds/mutualfunds.service';
import { RzpOrder } from './entities/rzp_orders.entity';
import { RzpTransfersRepository } from 'src/repositories/rzp_transfers.repository';
import { RzpOrdersRepository } from 'src/repositories/rzp_orders.repository';
import { RzpTransfer } from './entities/rzp_transfer.entity';
import { Users } from 'src/users/entities/users.entity';
// import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import moment from 'moment';
import { UserBankDetailsRepository } from 'src/repositories/user_bank_details.repository';
import { RzpCustomer } from './entities/rzp_customers.entity';
import { RzpCustomerRepository } from 'src/repositories/rzp_customer.repository';

@Injectable()
export class RazorpayService {
  auth: any = {};
  auth_tpv: any = {};

  razorpay_base_url: string;
  razorpay_secure_account: string;

  constructor(
    private readonly httpService: HttpService,
    private razorpayPennyDropRepository: RazorpayPennyDropRepository,
    private purchaseRepository: PurchaseRepository,
    private rzpOrdersRepository: RzpOrdersRepository,
    private rzpTransfersRepository: RzpTransfersRepository,
    private rzpCustomerRepository: RzpCustomerRepository,
    private userBankDetailsRepository: UserBankDetailsRepository,
    private readonly mutualFundService: MutualfundsService,
  ) {
    const configService = new ConfigService();
    this.auth['username'] = configService.get('RAZORPAY_KEY_ID');
    this.auth['password'] = configService.get('RAZORPAY_KEY_SECRET');

    this.auth_tpv['username'] = configService.get('TPV_RAZORPAY_KEY_ID');
    this.auth_tpv['password'] = configService.get('TPV_RAZORPAY_KEY_SECRET');

    this.razorpay_base_url = configService.get('RAZORPAY_API');
    this.razorpay_secure_account = configService.get('RAZORPAY_SECURE_ACCOUNT');
  }

  async get_order(order_id: string) {
    try {
      const instance = new Razorpay({
        key_id: this.auth['username'],
        key_secret: this.auth['password'],
      });

      const order = await instance.orders.fetch(order_id);
      console.log('rzp order fetch', order);
      return { status: HttpStatus.OK, data: order };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async create_customer(user: Users) {
    try {
      const instance = new Razorpay({
        key_id: this.auth['username'],
        key_secret: this.auth['password'],
      });
      let rzp_customer = new RzpCustomer();
      rzp_customer = await this.rzpCustomerRepository.findOneBy({
        contact: user.mobile,
      });

      if (!rzp_customer) {
        const customers = await instance.customers.all({});

        const existingCustomer = customers.items.find(
          (c) => c.email === user.email || c.contact === user.mobile,
        );
        if (existingCustomer) {
          // If a customer exists with matching email or mobile, return that customer
          let rzp_customer = new RzpCustomer();
          console.log('existingCustomer', existingCustomer);
          rzp_customer.contact = existingCustomer.contact.toString();
          rzp_customer.name = existingCustomer.name;
          rzp_customer.email = existingCustomer.email;
          // rzp_customer.contact = existingCustomer.contact.toString();
          rzp_customer.notes = existingCustomer.notes;
          rzp_customer.id = existingCustomer.id;
          rzp_customer = await this.rzpCustomerRepository.save(rzp_customer);
          // return existingCustomer;
          return { status: HttpStatus.OK, data: rzp_customer };
        } else {
          const customer = await instance.customers.create({
            name: user.full_name,
            contact: user.mobile,
            email: user.email,
            fail_existing: 0,
          });
          console.log('CUSTOMER check', customer);

          rzp_customer.contact = customer.contact.toString();
          rzp_customer.name = customer.name;
          rzp_customer.email = customer.email;
          // rzp_customer.contact = customer.contact.toString();
          rzp_customer.notes = customer.notes;
          rzp_customer.id = customer.id;
          rzp_customer = await this.rzpCustomerRepository.save(rzp_customer);
        }
      }
      return { status: HttpStatus.OK, data: rzp_customer };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err };
    }
  }

  async create_mandate_order(
    customer_id: string,
    mandate_type: string,
    bank_account_id: number,
    mandate_limit: number,
  ) {
    try {
      const instance = new Razorpay({
        key_id: this.auth['username'],
        key_secret: this.auth['password'],
      });
      const bank = await this.userBankDetailsRepository.findOneBy({
        id: bank_account_id,
      });
      const expiresAt = moment().add(30, 'years').unix();
      const order = await instance.orders.create({
        amount: 0,
        currency: 'INR',
        payment_capture: true,
        method: 'emandate',
        customer_id: customer_id,
        // receipt: "Receipt No. " + customer_id + " " +  bank_account_id,
        // notes: {
        //     notes_key_1: "Beam me up Scotty",
        // },
        token: {
          auth_type: 'netbanking',
          max_amount: mandate_limit * 100,
          expire_at: expiresAt,
          // notes: {
          //   notes_key_1: "Tea, Earl Grey, Hot",
          //   notes_key_2: "Tea, Earl Grey… decaf."
          // },
          bank_account: {
            beneficiary_name: bank.account_holder_name,
            account_number: bank.account_number,
            account_type: 'savings',
            ifsc_code: bank.ifsc_code,
          },
        },
      });

      return { status: HttpStatus.OK, data: order };
    } catch (err) {
      console.log('err', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  validate_callback(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    is_tpv = true,
  ): boolean {
    try {
      // let razorpay = new Razorpay({
      //     key_id: this.auth_tpv['username'],
      //     key_secret: this.auth_tpv['password'],
      //   });
      let key = this.auth_tpv['password'];
      if (is_tpv == false) {
        key = this.auth['password'];
      }

      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', key)
        .update(body)
        .digest('hex');

      return expectedSignature === razorpaySignature;
    } catch (err) {
      console.log('catch error', err);
      return false;
    }
  }

  async get_fund_details(isin: string[]) {
    try {
      const fundDetails: any = await this.mutualFundService.findFundsByIsins(
        isin,
      );
      console.log('FUND DETAILS', fundDetails);
      return fundDetails;
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async check_validation(razor_pay_penny_drop_dto: RazorpayPennyDropDto) {
    try {
      // use razor pay just to check validation of bank accounts
      const razorpayPennyDrop = await this.razorpayPennyDropRepository.find({
        where: {
          ifsc: razor_pay_penny_drop_dto.ifsc,
          account_number: razor_pay_penny_drop_dto.account_number,
          status: Not('pending'),
        },
      });
      if (razorpayPennyDrop.length > 0) {
        if (razorpayPennyDrop[0].account_status == 'valid') {
          const name_similarity = getSimilarity(
            razorpayPennyDrop[0].registered_name,
            razor_pay_penny_drop_dto.name,
          );
          return {
            status: HttpStatus.OK,
            data: { account_status: 'valid', name_similarity: name_similarity },
          };
        } else {
          // if invalid
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Account is not valid.',
          };
        }
      } else {
        let razorpayPennyDropEntity = new RazorpayPennyDrops();
        const razorpayPennyDrop = await this.razorpayPennyDropRepository.find({
          where: {
            ifsc: razor_pay_penny_drop_dto.ifsc,
            account_number: razor_pay_penny_drop_dto.account_number,
            status: 'pending',
          },
        });

        if (razorpayPennyDrop.length > 0) {
          razorpayPennyDropEntity = razorpayPennyDrop[0];
        } else {
          razorpayPennyDropEntity.account_number =
            razor_pay_penny_drop_dto.account_number;
          razorpayPennyDropEntity.status = 'pending';
          razorpayPennyDropEntity.name = razor_pay_penny_drop_dto.name;
          razorpayPennyDropEntity.ifsc = razor_pay_penny_drop_dto.ifsc;
          razorpayPennyDropEntity = await this.razorpayPennyDropRepository.save(
            razorpayPennyDropEntity,
          );
        }
        const url = this.razorpay_base_url + '/v1/fund_accounts/validations';
        const body = {
          source_account_number: this.razorpay_secure_account,
          validation_type: 'optimized',
          reference_id: razorpayPennyDropEntity.id,
          fund_account: {
            account_type: 'bank_account',
            bank_account: {
              name: razor_pay_penny_drop_dto.name,
              ifsc: razor_pay_penny_drop_dto.ifsc,
              account_number: razor_pay_penny_drop_dto.account_number,
            },
            contact: {
              name: razor_pay_penny_drop_dto.name,
            },
          },
        };
        const response = await this.post_request(url, body);
        if (response.status == HttpStatus.OK) {
          razorpayPennyDropEntity.razorpay_id = response.data.id;
          razorpayPennyDropEntity.status = response.data.status;
          razorpayPennyDropEntity.account_status =
            response.data.validation_results.account_status;
          razorpayPennyDropEntity.registered_name =
            response.data.validation_results.registered_name;
          razorpayPennyDropEntity = await this.razorpayPennyDropRepository.save(
            razorpayPennyDropEntity,
          );
          if (response.data.validation_results.registered_name != null) {
            const name_similarity = getSimilarity(
              response.data.validation_results.registered_name,
              razor_pay_penny_drop_dto.name,
            );
            return {
              status: HttpStatus.OK,
              data: {
                account_status: response.data.validation_results.account_status,
                name_similarity: name_similarity,
              },
            };
          } else {
            return {
              status: HttpStatus.OK,
              data: {
                account_status: response.data.validation_results.account_status,
                name_similarity: null,
              },
            };
          }
        } else {
          return response;
        }
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async initiatePayment(payment_obj: PaymentDto, tenant_id: string) {
    try {
      const configService = new ConfigService();
      const initiate_order_json = {};
      let total = 0;
      const split_totals_isins = {};
      const split_totals_amcIds = {};
      let transaction_basket_id: number;
      let user_id: number;
      let user: Users;

      const isins = [];
      if (payment_obj.amc_order_ids.length == 0) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error:
            'no purchases orders sent, kindly recheck the orders and the user OTP consents',
        };
      }

      for (const purchase_id of payment_obj.amc_order_ids) {
        const purchase = await this.purchaseRepository.findOne({
          where: { id: purchase_id },
          relations: ['transaction_basket_item', 'user'],
        });

        total += Number(purchase.amount);
        console.log('total', total);
        console.log('purchase.amount', purchase.amount);

        console.log('split_totals_isins', split_totals_isins);
        isins.push(purchase.scheme);
        if (split_totals_isins[purchase.scheme]) {
          split_totals_isins[purchase.scheme] += purchase.amount;
        } else {
          split_totals_isins[purchase.scheme] = purchase.amount;
        }
        console.log('split_totals_isins after', split_totals_isins);

        user_id = purchase.user_id;
        user = purchase.user;
        transaction_basket_id =
          purchase.transaction_basket_item.transaction_basket_id;
      }

      const fundDetails = await this.get_fund_details(isins);

      if (fundDetails.status == HttpStatus.OK) {
        for (const fund of fundDetails.data) {
          split_totals_amcIds[fund.amcId] = split_totals_isins[fund.isinCode];
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: fundDetails.error };
      }

      initiate_order_json['amount'] = total * 100;
      initiate_order_json['currency'] = 'INR';
      initiate_order_json['receipt'] = transaction_basket_id.toString();
      initiate_order_json['method'] = payment_obj.method.toLowerCase();
      initiate_order_json['bank_account'] = {
        account_number: payment_obj.bank_account.account_number,
        name: payment_obj.bank_account.account_holder_name,
        ifsc: payment_obj.bank_account.ifsc_code,
      };

      const transfers = [];

      for (const key in split_totals_amcIds) {
        if (split_totals_amcIds.hasOwnProperty(key)) {
          const amcId = key;
          const total = Number(split_totals_amcIds[key]);

          const transfer = {};

          if (!configService.get(amcId + '_AMC_LINKED_ACCOUNT')) {
            return {
              status: HttpStatus.BAD_REQUEST,
              error: 'RZP linked account not connected',
            };
          }

          transfer['account'] = configService.get(
            amcId + '_AMC_LINKED_ACCOUNT',
          );
          transfer['amount'] = total * 100;
          transfer['currency'] = 'INR';
          transfer['notes'] = {
            amcId: amcId,
          };
          transfer['on_hold'] = 0;

          transfers.push(transfer);
        }
      }

      initiate_order_json['transfers'] = transfers;

      const url = this.razorpay_base_url + '/v1/orders';

      const response = await this.post_request(url, initiate_order_json, true);

      let rzp_order = new RzpOrder();
      rzp_order.amount = response.data.amount;
      rzp_order.amount_due = response.data.amount_due;
      rzp_order.amount_paid = response.data.amount_paid;
      rzp_order.attempts = response.data.attempts;
      rzp_order.created_at = response.data.created_at;
      rzp_order.currency = response.data.currency;
      rzp_order.entity = response.data.entity;
      rzp_order.id = response.data.id;
      rzp_order.receipt = response.data.receipt;
      rzp_order.status = response.data.status;
      rzp_order.user_id = user_id;
      rzp_order.transaction_basket_id = transaction_basket_id;

      rzp_order = await this.rzpOrdersRepository.save(rzp_order);

      for (const transfer of response.data.transfers) {
        let rzp_transfer = new RzpTransfer();
        rzp_transfer.amount = transfer.amount;
        rzp_transfer.amount_reversed = transfer.amount_reversed;
        rzp_transfer.created_at = transfer.created_at;
        rzp_transfer.currency = transfer.currency;
        rzp_transfer.entity = transfer.entity;
        rzp_transfer.error = transfer.error;
        rzp_transfer.id = transfer.id;
        rzp_transfer.linked_account_notes = transfer.linked_account_notes;
        rzp_transfer.notes = transfer.notes;
        rzp_transfer.on_hold = transfer.on_hold;
        rzp_transfer.on_hold_until = transfer.on_hold_until;
        rzp_transfer.processed_at = transfer.processed_at;
        rzp_transfer.rzp_order_id = rzp_order.id;
        rzp_transfer.recipient = transfer.recipient;
        rzp_transfer.recipient_details = transfer.recipient_details;
        rzp_transfer.recipient_settlement_id = transfer.recipient_settlement_id;
        rzp_transfer.source = transfer.source;
        rzp_transfer.status = transfer.status;
        rzp_transfer = await this.rzpTransfersRepository.save(rzp_transfer);
      }

      console.log('RZP resp', response);
      let payment_method = {};
      if (payment_obj.method.toLowerCase() == 'netbanking') {
        payment_method = {
          wallet: false,
          netbanking: true,
          card: false,
          upi: false,
        };
      } else {
        payment_method = {
          wallet: false,
          netbanking: false,
          card: false,
          upi: true,
        };
      }

      return {
        status: HttpStatus.OK,
        data: {
          token_url:
            process.env.BASE_URL +
            '/api/transaction-baskets/postback/payment_page/' +
            tenant_id +
            '?id=' +
            rzp_order.id,
          id: rzp_order.id,
          sdk_options: {
            razorpay: {
              callback_url: payment_obj.payment_postback_url,
              amount: rzp_order.amount_due,
              method: payment_method,
              contact: user.mobile,
              order_id: rzp_order.id,
              key: process.env.TPV_RAZORPAY_KEY_ID,
              email: user.email,
            },
          },
        },
      };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async post_request(url, body, is_auth_tpv = false) {
    console.log('bodyboy', body);
    console.log('thisauth', this.auth);

    const headersReq = {
      'Content-Type': 'application/json', // afaik this one is not needed
    };
    let auth = this.auth;
    if (is_auth_tpv) {
      auth = this.auth_tpv;
    }

    const response = this.httpService
      .post(url, body, { headers: headersReq, auth: auth })
      .pipe(
        map((resp) => {
          console.log('FP RESPONSE' + resp);
          console.log('FP RESPONSE' + resp.data);

          return resp.data;
        }),
      )
      .pipe(
        catchError((e) => {
          console.log(' POST ERROR');

          console.log('kays', e.response);

          throw new ForbiddenException(e.response, e.message);
        }),
      );

    const result = await lastValueFrom(response);
    console.log('POST RESPONSE RESULT ', result);
    return { status: HttpStatus.OK, data: result };
  }
}
