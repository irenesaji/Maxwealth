import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mandates } from './entities/mandates.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { AddMandateDto } from './dtos/add-mandate.dto';
import { FintechService } from 'src/utils/fintech/fintech.service';
import { UserBankDetails } from 'src/onboarding/bank/entities/user_bank_details.entity';
import { MandatesRepository } from 'src/repositories/mandates.repository';
import { UserBankDetailsRepository } from 'src/repositories/user_bank_details.repository';
import { UsersRepository } from 'src/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { RazorpayService } from 'src/utils/razorpay/razorpay.service';
import { BseService } from 'src/utils/bse/bse.service';
import { BseMandatesDTO } from 'src/utils/bse/dtos/bse_mandate.dto';
import { BseMandatesRepository } from 'src/repositories/bse_mandates.repository';
import { format } from 'date-fns';
import { BseMandateTypeRepository } from 'src/repositories/bse.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { MandateRegistrationDto } from 'src/utils/bsev1/dto/mandate-registration.dto';
import { Bsev1Service } from 'src/utils/bsev1/bsev1.service';
import { TransactionBasketsService } from 'src/transaction_baskets/transaction_baskets.service';
import moment from 'moment';
import { parseStringPromise } from 'xml2js';
import { DOMParser } from 'xmldom';
import * as xpath from 'xpath';
import { xml } from 'cheerio/dist/commonjs/static';
import { string, number } from 'mathjs';
import { async } from 'rxjs';

@Injectable()
export class MandatesService {
  constructor(
    // @InjectRepository(Mandates)
    // private mandateRepository: Repository<Mandates>,
    // @InjectRepository(UserBankDetails)
    // private userBankDetailsRepository:Repository<UserBankDetails>,
    // @InjectRepository(Users)
    // private userRepository: Repository<Users>,

    private readonly mandateRepository: MandatesRepository,
    private readonly userBankDetailsRepository: UserBankDetailsRepository,
    private readonly userRepository: UsersRepository,
    private readonly fintechService: FintechService,
    private readonly razorpayService: RazorpayService,
    private readonly bseService: BseService,
    private readonly bseMandateRepository: BseMandatesRepository,
    private readonly bseMandateTypeRepository: BseMandateTypeRepository,
    private readonly userOnboardingRepository: UserOnboardingDetailsRepository,
    private readonly bsev1Service: Bsev1Service,
    private readonly transactionBasketService: TransactionBasketsService,
  ) {}

  // async getAll(user_id: number, tenant_id: string) {

  //     try {

  //         console.log("User ID", user_id);
  //         let user = await this.userRepository.findOneBy({ id: user_id });
  //         if (user) {
  //             console.log(user);
  //             let results = await this.mandateRepository.find({ where: { user_id: user_id }, relations: ['user_bank_detail'] });
  //             let i = 0;

  //             for (let result of results) {

  //                 let user_onboarding = await this.userOnboardingRepository.findOne({ where: { user_id: result.user_id } })
  //                 // result.paymentId = body.razorpay_payment_id;
  //                 let message = '';
  //                 // if (payment_status) {
  //                 let password = await this.bsev1Service.mandateAccesstoken()
  //                 if (password.status != HttpStatus.OK) {
  //                     return { status: HttpStatus.BAD_REQUEST, message: "Sorry something went wrong: " + password.responseString };
  //                 }
  //                 if (password.Status == "100") {
  //                     let mandate_status = await this.bsev1Service.mandateStatus(user_onboarding.fp_investor_id, result.mandate_id, password.ResponseString)
  //                     if (mandate_status.status != HttpStatus.OK) {
  //                         return { status: HttpStatus.BAD_REQUEST, message: "Sorry something went wrong: " + mandate_status.responseString };

  //                     }
  //                     if (password.Status == "100") {
  //                         if (mandate_status.MandateDetails[0].Status == 'APPROVED') {
  //                             result.status = 'approved';
  //                             message = "Mandate approved";
  //                         } else if (mandate_status.MandateDetails[0].Status == 'REJECTED') {
  //                             result.status = 'rejected';
  //                             message = "Mandate rejected.";
  //                         }
  //                         else if (mandate_status.MandateDetails[0].Status == 'UNDER PROCESSING') {
  //                             result.status = 'submitted';
  //                             message = "Mandate submitted.";
  //                         }

  //                         result = await this.mandateRepository.save(result);
  //                     }
  //                 }

  //                 // if(result.status == null && result.token_url != null){
  //                 //     let postback_url = process.env.BASE_URL + '/api/mandates/postback/'+tenant_id+'?mandate_id=' + result.id;
  //                 // let resp =  await this.fintechService.authorizeMandate(result.mandate_id,postback_url);

  //                 // if(resp.status == HttpStatus.OK){
  //                 //     result.token_url = resp.data.token_url

  //                 // }
  //                 // }

  //                 if (result.user_bank_detail.bank_name) {

  //                     const words = result.user_bank_detail.bank_name.split(" ");

  //                     for (let i = 0; i < words.length; i++) {
  //                         words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  //                     }

  //                     let bank_name = words.join("_");

  //                     result["logo_url"] = '/uploads/bank_logos/' + bank_name + '.png';
  //                     results[i] = result;
  //                 }
  //                 i++;
  //             }
  //             return { status: HttpStatus.OK, data: results };
  //         } else {
  //             console.log("no user found");
  //             return { status: HttpStatus.NOT_FOUND, message: "Sorry something user not found" };
  //         }

  //     } catch (err) {
  //         return { status: HttpStatus.BAD_REQUEST, message: "Sorry something went wrong: " + err.message };
  //     }
  // }
  //The private function subDate give you the date of the day 3 day ago from the current date
  private subDate(day: number) {
    const dates = new Date();
    dates.setDate(dates.getDate() - day);
    return dates.toISOString().split('T')[0];
  }

  async getAll(
    tenant_id: string,
    type?: string,
    page = 1,
    limit = 10,
    user_id?: number,
    bank_id?: number,
  ) {
    try {
      const query: any = { relations: ['user_bank_detail'] };
      if (bank_id) {
        let mandate_list = await this.mandateRepository.find({
          where: { user_id: user_id, bank_id: bank_id },
          relations: ['user_bank_detail'],
        });
        if (mandate_list) {
          mandate_list = mandate_list.map((result) => {
            if (result.user_bank_detail?.bank_name) {
              const words = result.user_bank_detail.bank_name
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

              const bank_name = words.join('_');
              result['logo_url'] = `/uploads/bank_logos/${bank_name}.png`;
            }
            return result;
          });
          return {
            status: HttpStatus.OK,
            data: mandate_list,
            message: 'User mandate list found',
          };
        } else {
          return {
            status: HttpStatus.NOT_FOUND,
            error: 'No mandate list found!',
          };
        }
      }
      // Add conditions based on parameters
      if (user_id) {
        query.where = { user_id };
      }

      if (type) {
        query.where = { ...query.where, status: type };
      }
      // Delete the mandates that is more than 3 days in the created state
      const delete_mandates = await this.mandateRepository
        .createQueryBuilder()
        .delete()
        .from(Mandates)
        .where('status IN (:...status) AND created_at < :date', {
          status: ['created', 'rejected'],
          date: this.subDate(3),
        })
        .execute();
      console.log(
        "Delete created 3 days ago 'created' status mandates: ",
        delete_mandates,
      );
      let results = await this.mandateRepository.find(query);

      results = results.map((result) => {
        if (result.user_bank_detail?.bank_name) {
          const words = result.user_bank_detail.bank_name
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

          const bank_name = words.join('_');
          result['logo_url'] = `/uploads/bank_logos/${bank_name}.png`;
        }
        return result;
      });

      const total = results.length;
      const paginatedResults = results.slice((page - 1) * limit, page * limit);

      return {
        status: HttpStatus.OK,
        data: paginatedResults,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Sorry, something went wrong: ' + err.message,
      };
    }
  }
  private diffDate(day1, day2) {
    const day11: any = new Date(day1);
    const day22: any = new Date(day2);

    const diff = day11 - day22;
    return Math.round(diff / (1000 * 60 * 60 * 24));
  }

  async create(addMandateDto: AddMandateDto, tenant_id: string) {
    try {
      let mandate_result, mandate_id;
      const mandate_check = await this.mandateRepository.findOne({
        where: {
          bank_id: addMandateDto.bank_id,
          mandate_type: addMandateDto.mandate_type,
        },
      });

      console.log('MANDATE CHECK', mandate_check);

      //if the mandate limit is exceed end the creation process here,
      if (
        mandate_check &&
        (mandate_check.mandate_limit === 1 ||
          mandate_check.status.toLocaleLowerCase() == 'approved')
      ) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message:
            'You have reached your mandate creation limit or mandate is already approved!',
        };
      }
      console.log(addMandateDto);
      const mandate_type = await this.bseMandateTypeRepository.findOne({
        where: { description: addMandateDto.mandate_type },
      });
      console.log('type', mandate_type);
      const mandate_code = mandate_type.code;

      if (
        !mandate_check ||
        (mandate_check.status != null &&
          mandate_check.status.toLowerCase() == 'rejected') ||
        (mandate_check.status != null &&
          mandate_check.status.toLowerCase() == 'created') ||
        (mandate_check.status != null &&
          mandate_check.status.toLowerCase() == 'failed') ||
        (mandate_check.status != null &&
          mandate_check.status.toLowerCase() == 'failure') ||
        (mandate_check.status != null &&
          mandate_check.status.toLowerCase() == 'cancelled') ||
        (mandate_check.status != null &&
          mandate_check.status.toLowerCase() == 'expired') ||
        mandate_check.token_url == null
      ) {
        const bank = await this.userBankDetailsRepository.findOne({
          where: { id: addMandateDto.bank_id },
          relations: ['user'],
        });
        const user_onboarding = await this.userOnboardingRepository.findOne({
          where: { user_id: bank.user_id },
        });
        if (bank) {
          //   const result = null;
          let mandate = new Mandates();
          if (
            !mandate_check ||
            (mandate_check.status != null &&
              mandate_check.status.toLowerCase() != 'created') ||
            (mandate_check.status.toLowerCase() == 'created' &&
              this.diffDate(
                mandate_check.created_at.toString(),
                new Date().toISOString().slice(0, 10),
              ) > 1)
          ) {
            // result =  await this.fintechService.createMandate('E_MANDATE',bank.old_fp_bank_id,addMandateDto.mandate_limit);

            // let bse_mandate = new BseMandatesDTO()
            // // bse_mandate.ucc=user_onboarding.fp_investment_account_id;
            // bse_mandate.ucc = "1002100031";
            // bse_mandate.mem_code = user_onboarding.fp_investor_id;
            // // bse_mandate.status= mandate_check.status
            // bse_mandate.src_acct = {
            //     ifsc: bank.ifsc_code,
            //     no: bank.account_number,
            //     type: bank.account_type,
            //     name: bank.account_holder_name
            // };
            // bse_mandate.dest_acct = {
            //     ifsc: bank.ifsc_code,
            //     no: bank.account_number,
            //     type: bank.account_type,
            //     name: bank.account_holder_name
            // };
            // bse_mandate.max_txn_amt = addMandateDto.mandate_limit;
            // bse_mandate.cur = "INR";
            // const date = new Date();
            // const valid_till = new Date();
            // valid_till.setFullYear(date.getFullYear() + 50);
            // // const formattedDate = date.toISOString().split('T')[0];
            // // const formattedStartDate = resetTimeToMidnight(date)
            // bse_mandate.start_date = date.toISOString().split('T')[0];
            // bse_mandate.valid_till = valid_till.toISOString().split('T')[0];
            // console.log("date", bse_mandate.start_date)
            // bse_mandate.type = mandate_code;
            // bse_mandate.mode = "ACH";
            // bse_mandate.debit_type = "maximum";
            // bse_mandate.man_2fa = 'd';
            // result = await this.bseService.register_mandate(bse_mandate)
            // console.log("mandate_result", result)
            const startdate = new Date()
              .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
              .replace(/\//g, '/');
            const enddateWithStartDate = calculateEndDate(startdate);
            console.log('enddate', enddateWithStartDate);
            const mandateDto = new MandateRegistrationDto();
            // mandateDto.client_code = "8793398857";
            mandateDto.client_code = user_onboarding.fp_investor_id;
            mandateDto.amount = addMandateDto.mandate_limit;
            mandateDto.mandate_type = mandate_code;
            mandateDto.account_number = bank.account_number;
            mandateDto.account_type = 'SB';
            mandateDto.ifsc_code = bank.ifsc_code;
            mandateDto.micr_code = '';
            mandateDto.start_date = startdate;
            mandateDto.end_date = enddateWithStartDate;
            console.log('mandateDto', mandateDto);
            const get_password =
              await this.bsev1Service.get_password_for_registration(tenant_id);
            console.log('get_password', get_password);
            const encrypted_password =
              await this.transactionBasketService.extractPassword(
                get_password.data,
              );
            console.log('encrypted_password', encrypted_password);
            const mandate_result_register =
              await this.bsev1Service.register_mandate(
                mandateDto,
                encrypted_password,
              );
            console.log('mandate_result_register', mandate_result_register);
            // console.log("encrypted_password", encrypted_password)
            mandate_result = await this.extractIdFromXML(
              mandate_result_register.data,
            );
            console.log('mandate_result', mandate_result);
            // result = mandate_result.trim();
            // const parts = result.split('|');
            // const status = parts[0] || null;
            // console.log("status", status)
            // console.log("parts", parts)
            // mandate_id = parts.length > 1 ? parts[1] : null;
            mandate_id = mandate_result.id;

            // let customer = await this.razorpayService.create_customer(bank.user);
            // console.log("Customer",customer);
            if (mandate_result.status == 100) {
              // let rzp_mandate_order = await this.razorpayService.create_mandate_order(customer.data.id, addMandateDto.mandate_type,addMandateDto.bank_id, addMandateDto.mandate_limit);
              // console.log("rzp_mandate_order",rzp_mandate_order);
              // if(rzp_mandate_order.status == HttpStatus.OK){
              //     mandate.customer_id = customer.data.id;
              mandate.bank_id = addMandateDto.bank_id;
              // mandate.mandate_id = rzp_mandate_order.data.id;
              // mandate.provider_name = "razorpay";
              mandate.user_id = bank.user.id;
              // mandate.token_url = process.env.BASE_URL + "/api/mandates/postback/payment_page/" + tenant_id + "?mandate_id=" + mandate.mandate_id;
              mandate.status = 'created';
              mandate.mandate_type = addMandateDto.mandate_type;
              mandate.mandate_limit = addMandateDto.mandate_limit;
              mandate.mandate_id = mandate_id;

              mandate = await this.mandateRepository.save(mandate);
              // bse_mandate.mandate_id = mandate.id
              // let saved_mandate = await this.bseMandateRepository.save(bse_mandate)
              // }else{
              //     return rzp_mandate_order;
              // }
            } else {
              console.log('alreay exiting bug');
              return {
                status: HttpStatus.BAD_REQUEST,
                error: mandate_result.message,
              };
            }
          } else {
            mandate = mandate_check;
          }
          // let postback_url = process.env.BASE_URL + '/api/mandates/postback/' + tenant_id + '?mandate_id=' + mandate.id;
          // // if (addMandateDto.url) {
          // //     postback_url += '&url=' + `${addMandateDto.url}`;
          // //     console.log("after url", postback_url)
          // // }

          // let resp = await this.bsev1Service.enachAuthUrl(user_onboarding.fp_investor_id, mandate.mandate_id, postback_url);
          // console.log("RESP", resp)
          // if (resp.status == HttpStatus.OK && resp.Status == "100") {
          //     mandate.token_url = resp.ResponseString
          //     mandate = await this.mandateRepository.save(mandate);
          //     console.log("MANdatesave", mandate)
          // // let resp = await this.bsev1Service.enachAuthUrl(user_onboarding.fp_investor_id, mandate.mandate_id, postback_url);
          // // console.log("RESP", resp)
          // // if (resp.status == HttpStatus.OK && resp.Status == "100") {
          // //     mandate.token_url = resp.ResponseString
          // //     mandate = await this.mandateRepository.save(mandate);
          // //     console.log("MANdatesave", mandate)

          // // } else {
          // //     console.log("authorisation failed!", resp.data)
          // //     return resp;
          // // }
          // let attempt = 0;
          // let maxAttempts = 6;
          // let resp;

          // while (attempt < maxAttempts) {
          //     attempt++;
          //     console.log(`Attempt ${attempt}: Requesting eNACH auth URL...`);

          //     resp = await this.bsev1Service.enachAuthUrl(
          //         user_onboarding.fp_investor_id,
          //         mandate.mandate_id,
          //         postback_url
          //     );
          //     console.log("RESP", resp);

          //     if (resp.status === HttpStatus.OK && resp.Status === "100") {
          //         mandate.token_url = resp.ResponseString;
          //         mandate = await this.mandateRepository.save(mandate);
          //         console.log("Mandate saved successfully", mandate);
          //         break;
          //     } else {
          //         console.log("Authorisation failed, will retry if attempts left.", resp.data);
          //         if (attempt < maxAttempts) {
          //             console.log("Waiting 500ms before retrying...");
          //             await sleep(5000);
          //         }
          //     }
          // }

          // if (resp.status !== HttpStatus.OK || resp.Status !== "100") {
          //     console.log("Authorisation ultimately failed after max attempts.", resp);
          //     return resp;
          // }

          mandate['user'] = bank.user;
          // mandate["sdk_options"] = {
          //     "razorpay": {
          //     "callback_url":process.env.BASE_URL + '/api/mandates/postback/'+tenant_id+'?mandate_id=' + mandate.id,
          //     "amount": 0,
          //     "method": 'emandate',
          //     "contact": bank.user.mobile,
          //     "order_id": mandate.mandate_id,
          //     "key": process.env.RAZORPAY_KEY_ID,
          //     "email": bank.user.email
          //     }
          // }
          return {
            status: HttpStatus.OK,
            data: mandate,
            bse_mandate_id: mandate_id,
          };
        } else {
          return {
            status: HttpStatus.NOT_FOUND,
            message: 'Sorry Bank with the given ID not found ',
          };
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Bank has a mandate already',
        };
      }
    } catch (err) {
      console.log('err', err);
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Sorry something went wrong: ' + err.message,
      };
      //                          mandate["user"] = bank.user;
      //             // mandate["token_url"] = ""; // Do not trigger authorization

      //             // mandate["sdk_options"] = {
      //             //     "razorpay": {
      //             //     "callback_url":process.env.BASE_URL + '/api/mandates/postback/'+tenant_id+'?mandate_id=' + mandate.id,
      //             //     "amount": 0,
      //             //     "method": 'emandate',
      //             //     "contact": bank.user.mobile,
      //             //     "order_id": mandate.mandate_id,
      //             //     "key": process.env.RAZORPAY_KEY_ID,
      //             //     "email": bank.user.email
      //             //     }
      //             // }
      //             return { status: HttpStatus.OK, data: mandate, bse_mandate_id: mandate_id };
      //         } else {
      //             return { status: HttpStatus.NOT_FOUND, message: "Sorry Bank with the given ID not found " };

      //         }
      //     } else {
      //         return { status: HttpStatus.BAD_REQUEST, message: "Bank has a mandate already" };

      //     }
      // } catch (err) {
      //     console.log("err", err)
      //     return { status: HttpStatus.BAD_REQUEST, message: "Sorry something went wrong: " + err.message };
      // }
    }
  }

  //autherization service
  async authorizeMandate(tenant_id: string, mandate_id: number) {
    try {
      const mandate = await this.mandateRepository.findOne({
        where: { id: mandate_id },
        relations: ['user_bank_detail', 'user_bank_detail.user'],
      });

      if (!mandate) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Mandate not found',
        };
      }

      //Check mandate status before proceeding
      if (mandate.status !== 'created') {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `Mandate is in '${mandate.status}' state. Only 'created' mandates can be authorized.`,
        };
      }

      const user_onboarding = await this.userOnboardingRepository.findOne({
        where: { user_id: mandate.user_id },
      });

      const postback_url = `${process.env.BASE_URL}/api/mandates/postback/${tenant_id}?mandate_id=${mandate.id}`;

      let attempt = 0;
      const maxAttempts = 8;
      let resp;

      while (attempt < maxAttempts) {
        attempt++;
        console.log(`Attempt ${attempt}: Requesting eNACH auth URL...`);

        resp = await this.bsev1Service.enachAuthUrl(
          user_onboarding.fp_investor_id,
          mandate.mandate_id,
          postback_url,
        );

        console.log('RESP', resp);

        if (resp.status === HttpStatus.OK && resp.Status === '100') {
          mandate.token_url = resp.ResponseString;
          const updatedMandate = await this.mandateRepository.save(mandate);

          updatedMandate['user'] = mandate.user_bank_detail?.user;
          return {
            status: HttpStatus.OK,
            data: updatedMandate,
            bse_mandate_id: mandate.mandate_id,
          };
        } else {
          console.log(
            'Authorization failed, will retry if attempts left.',
            resp.data,
          );
          if (attempt < maxAttempts) {
            await sleep(10000);
          }
        }
      }

      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Authorization ultimately failed after max attempts.',
      };
    } catch (error) {
      console.log('authorizeMandate error', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong: ' + error.message,
      };
    }
  }

  // async postback(body: any) {
  //     try {

  //         // let payment_status = this.razorpayService.validate_callback(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature, false);
  //         let mandate = await this.mandateRepository.findOneBy({ mandate_id: body.razorpay_order_id });
  //         // mandate.paymentId = body.razorpay_payment_id;
  //         let message = '';
  //         // if (payment_status) {

  //         //     let rzp_order = await this.razorpayService.get_order(body.razorpay_order_id);

  //         //     if (rzp_order.status == HttpStatus.OK) {
  //         if (body.Status == 'SUCCESS') {
  //             mandate.status = 'approved';
  //             message = "Mandate approved";
  //         } else if (body.Status == 'FAILED') {
  //             mandate.status = 'failed';
  //             message = "Mandate failed.";
  //         } else {
  //             mandate.status = 'submitted';
  //             message = "Mandate submitted.";
  //         }
  //         // } else {
  //         //     return rzp_order;
  //         // }

  //         // } else {
  //         //     mandate.status = 'failure';
  //         //     message = "Mandate failed."; //+ body.failureReason;

  //         // }
  //         // mandate.failureReason = body.failureReason;
  //         await this.mandateRepository.save(mandate);

  //         return { status: HttpStatus.OK, message: message };

  //     } catch (err) {
  //         return { status: HttpStatus.BAD_REQUEST, message: "Sorry something went wrong: " + err.message };
  //     }
  // }

  async postback(body: any) {
    try {
      // let payment_status = this.razorpayService.validate_callback(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature, false);
      const mandate = await this.mandateRepository.findOneBy({
        id: body.mandate_id,
      });
      const user_onboarding = await this.userOnboardingRepository.findOne({
        where: { user_id: mandate.user_id },
      });
      // mandate.paymentId = body.razorpay_payment_id;
      let message = '';
      // if (payment_status) {
      const password = await this.bsev1Service.mandateAccesstoken();
      if (password.status != HttpStatus.OK) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Sorry something went wrong: ' + password.responseString,
        };
      }
      if (password.Status == '100') {
        const mandate_status = await this.bsev1Service.mandateStatus(
          user_onboarding.fp_investor_id,
          mandate.mandate_id,
          password.ResponseString,
        );
        if (mandate_status.status != HttpStatus.OK) {
          return {
            status: HttpStatus.BAD_REQUEST,
            message:
              'Sorry something went wrong: ' + mandate_status.responseString,
          };
        }
        if (mandate_status.MandateDetails[0].Status == 'APPROVED') {
          mandate.status = 'approved';
          message = 'Mandate approved';
        } else if (mandate_status.MandateDetails[0].Status == 'REJECTED') {
          mandate.status = 'rejected';
          message = 'Mandate rejected.';
        } else if (
          mandate_status.MandateDetails[0].Status == 'UNDER PROCESSING'
        ) {
          mandate.status = 'submitted';
          message = 'Mandate submitted.';
        }
      }

      //     let rzp_order = await this.razorpayService.get_order(body.razorpay_order_id);

      //     if (rzp_order.status == HttpStatus.OK) {

      // } else {
      //     return rzp_order;
      // }

      // } else {
      //     mandate.status = 'failure';
      //     message = "Mandate failed."; //+ body.failureReason;

      // }
      // mandate.failureReason = body.failureReason;
      await this.mandateRepository.save(mandate);

      return { status: HttpStatus.OK, message: message };
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Sorry something went wrong: ' + err.message,
      };
    }
  }

  async getPaymentPageResult(mandate_id, tenant_id) {
    try {
      const configService = new ConfigService();
      const rz_key = configService.get('RAZORPAY_KEY_ID');
      const mandate = await this.mandateRepository.findOneBy({
        mandate_id: mandate_id,
      });
      return {
        status: HttpStatus.OK,
        ...mandate,
        postback_url:
          process.env.BASE_URL +
          '/api/mandates/postback/' +
          tenant_id +
          '?mandate_id=' +
          mandate.id,
        rzp_key: rz_key,
      };
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Sorry something went wrong: ' + err.message,
      };
    }
  }

  async mandate_registration(mandateRegistrationDto: MandateRegistrationDto) {
    try {
      let encrypted_password;
      const client_code = 'PH109941';
      const UserID = 5961101;
      const amount = 5000,
        mandate_type = 'N',
        account_number = '30191531880',
        account_type = 'SB',
        ifsc_code = 'SBIN0000362',
        micr_code = '382002101';
      const data = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmfdemo.bseindia.com/2016/01/">
       <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:Action>http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI</wsa:Action><wsa:To>https://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Secure</wsa:To></soap:Header>
        <soap:Body>
          <ns:MFAPI>
             <!--Optional:-->
             <ns:Flag>06</ns:Flag>
             <!--Optional:-->
             <ns:UserId>${UserID}</ns:UserId>
             <!--Optional:-->
             <ns:EncryptedPassword>{{MfapiPwd}}</ns:EncryptedPassword>
             <!--Optional:-->
             <ns:param>${client_code}|${amount}|${mandate_type}|${account_number}|${account_type}|${ifsc_code}|${micr_code}|30/08/2024|30/04/2064</ns:param>
          </ns:MFAPI>
        </soap:Body>
      </soap:Envelope>`;

      const register = await this.bsev1Service.register_mandate(
        data,
        encrypted_password,
      );
    } catch (err) {
      console.log('err', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  // async extractIdFromXML(xml: string): Promise<string | null>{
  //     try {
  //         // Parse the XML string
  //         // const parsed = parseStringPromise(xml, { explicitArray: false });
  //         const parsed = parseStringPromise(xml, {
  //             explicitArray: false,
  //             tagNameProcessors: [(name) => name.replace(/^.*:/, '')] // Remove namespace prefixes
  //         });
  //         console.log('Parsed XML:', JSON.stringify(parsed, null, 2));
  //         // Navigate to the desired field
  //         const result = parsed['Envelope']['Body']['MFAPIResponse']['MFAPIResult'];
  //         console.log("split", result)
  //         // Extract the ID (last part after '|')
  //         const id = result.split('|').pop();

  //         return id || null; // Return the ID or null if not found
  //     } catch (error) {
  //         console.error('Error parsing XML:', error);
  //         return null;
  //     }
  // }

  async extractIdFromXML(xml: string) {
    try {
      // Parse the XML
      const doc = new DOMParser().parseFromString(xml);

      // XPath query to fetch the MFAPIResult text
      const node = xpath.select1("//*[local-name()='MFAPIResult']", doc);

      // Ensure node is a DOM Node
      if (node && typeof node === 'object' && 'textContent' in node) {
        const result = node.textContent || '';
        console.log('Result:', result);

        // Extract the ID (last part after '|')
        // const id = result.split('|').pop();
        // return id || null; // Return the ID or null if not found
        const parts = result.split('|');
        const status = parts[0] || null;
        const message = parts[1] || null;
        const id = parts.length > 1 ? parts[2] : null;
        return { status, message, id };
        // return result;
      }

      return null; // Return null if no node is found or invalid type
    } catch (error) {
      console.error('Error parsing XML:', error);
      return null;
    }
  }
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

function resetTimeToMidnight(date: Date): Date {
  // Create a new Date object and set time to midnight
  const resetDate = new Date(date);
  resetDate.setHours(0, 0, 0, 0); // Reset the time to 00:00:00.000
  return resetDate;
}

function calculateEndDate(startdate?: string): string {
  let endDate: moment.Moment;

  if (startdate) {
    // Parse the start date
    const parsedStartDate = moment(startdate, 'DD/MM/YYYY');

    // Check if the start date is valid
    if (!parsedStartDate.isValid()) {
      throw new Error('Invalid start date format. Use DD/MM/YYYY.');
    }

    // Add 100 days to the start date
    endDate = parsedStartDate.add(30, 'years');
  } else {
    // Default to current date + 100 years
    endDate = moment().add(100, 'years');
  }

  // Format the end date as DD/MM/YYYY
  return endDate.format('DD/MM/YYYY');
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
