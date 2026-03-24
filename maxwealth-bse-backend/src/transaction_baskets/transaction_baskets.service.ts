import { HttpService } from '@nestjs/axios';
import { ConsoleLogger, HttpStatus, Injectable } from '@nestjs/common';
import { FintechService } from 'src/utils/fintech/fintech.service';
import { CreateTransactionBasketDTO } from './dtos/create_transaction_baskets.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionBaskets } from './entities/transaction_baskets.entity';
import { In, IsNull, Like, MoreThan, Not, Repository } from 'typeorm';
import { FpLumpsumDTO } from './dtos/fp_lumpsum.dto';
import { TransactionBasketItems } from './entities/transaction_basket_items.entity';
import { Purchase } from './entities/purchases.entity';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { Users } from 'src/users/entities/users.entity';
import { UserBankDetails } from 'src/onboarding/bank/entities/user_bank_details.entity';
import { FpSipDTO } from './dtos/fp_sip.dto';
import { FpRedemptionDTO } from './dtos/fp_redemption.dto';
import { Redemption } from './entities/redemptions.entity';
import { FpSwitchFundDTO } from './dtos/fp_switch_fund.dto';
import { SwitchFunds } from './entities/switch_funds.entity';
import { FpSwpDTO } from './dtos/fp_swp.dto';
import { FpStpDTO } from './dtos/fp_stp.dto';
import { MutualfundsService } from 'src/utils/mutualfunds/mutualfunds.service';
import { ConfigService, registerAs } from '@nestjs/config';
import { SmartSipFunds } from 'src/smartsip_config/entities/smart_sip_funds.entity';
import msg91 from 'msg91';
import moment from 'moment';
import { TransactionBasketsRepository } from 'src/repositories/transaction_baskets.repository';
import { TransactionBasketItemsRepository } from 'src/repositories/transaction_basket_item.repository';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { RedemptionRepository } from 'src/repositories/redemption.repository';
import { UsersRepository } from 'src/repositories/user.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { SwitchFundsRepository } from 'src/repositories/switch_fund.repository';
import { UserBankDetailsRepository } from 'src/repositories/user_bank_details.repository';
import { SmartSipFundsRepository } from 'src/repositories/smart_sip_funds.repository';
import { EnablexService } from 'src/utils/enablex/enablex.service';
import { RiskProfileRepository } from 'src/repositories/risk_profile.repository';
import { GoalRepository } from 'src/repositories/goal.repository';
import { RazorpayService } from 'src/utils/razorpay/razorpay.service';
import { PaymentDto } from 'src/utils/razorpay/dtos/payment.dto';
import { SignzyService } from 'src/utils/signzy/signzy.service';
import { RzpOrdersRepository } from 'src/repositories/rzp_orders.repository';
import { MfSwitchPlan } from './entities/mf_switch_plan.entity';
import { MfSwitchPlanRepository } from 'src/repositories/mf_switch_plan.repository';
import { MfRedemptionPlanRepository } from 'src/repositories/mf_redemption_plan.repository';
import { MfPurchasePlanRepository } from 'src/repositories/mf_purchase_plan.repository';
import { MfRedemptionPlan } from './entities/mf_redemption_plan.entity';
import { MfPurchasePlan } from './entities/mf_purchase_plan.entity';
import { BseService } from 'src/utils/bse/bse.service';
import { RegisterSipDto } from './dtos/register_sip.dto';
import { AmcRepository } from 'src/repositories/amc.repository';
import { BseFrequency } from 'src/utils/bse/entities/bse_frequency.entity';
import { BseFrequencyRepository } from 'src/repositories/bse_frequency.repository';
import { OrderNewPurchaseDTO } from './dtos/order_new_purchase.dto';
import { InvestorDTO } from './dtos/investor.dto';
import { OrderInfoDto } from './dtos/order_info.dto';
import { MemDetailsDTO } from './dtos/mem_details.sdto';
import { InfoDto } from './dtos/info.dto';
import { MandatesRepository } from 'src/repositories/mandates.repository';
import { FundDetailsRepository } from 'src/repositories/fund_details.repository';
import { Bsev1Service } from 'src/utils/bsev1/bsev1.service';
import { parseStringPromise } from 'xml2js';
import { BseXSipRegister } from './entities/bsev1_xsip_register.entity';
import { BseXSipRegisterRepository } from 'src/repositories/bse_xsip_register.repository';
import { BseSwpRegister } from './entities/bsev1_swp_register.entity';
import { BseSwpRegisterRepository } from 'src/repositories/bse_swp_register.repository';
import { BseStpRegisterRepository } from 'src/repositories/bse_stp_register.repository';
import { BseStpRegister } from './entities/bsev1_stp_register.entity';
import { CamsService } from 'src/utils/cams/cams.service';
import { KarvyService } from 'src/utils/karvy/karvy.service';
import { Bsev1EmandateBankCodeRepository } from 'src/repositories/bsev1_emandate_bank_code.repository';
import { Bsev1UpiBankCodeRepository } from 'src/repositories/bsev1_upi_bank_code.repository';
import { BseXSipOrder } from './entities/bsev1_xsip_order.entity';
import { BseXSipOrderRepository } from 'src/repositories/bsev1_xsip_order.repository';
import { Min } from 'class-validator';
import { BseSwitchOrder } from './entities/bsev1_switch_order.entity';
import { BseSwitchOrderRepository } from 'src/repositories/bsev1_switch_order.repository';
import { BsePurchaseRedemOrderRepository } from 'src/repositories/bsev1_purchase_order.repository';
import { BsePurchaseRedemptionOrder } from './entities/bsev1_purchase_order.entity';
import { all } from 'axios';
import { UniqueReferenceNoRepository } from 'src/repositories/unique_reference_no.repository';
import { UniqueReferenceNo } from './entities/unique_reference_no.entity';
import { DOMParser } from 'xmldom';
import * as xpath from 'xpath';
import { ModelPortfolioRepository } from 'src/repositories/model_portfolio.repository';
@Injectable()
export class TransactionBasketsService {
  benchmark_fund_id: number;
  msg_apikey: string;
  mf_base_url: string;
  base_url: string;
  member: string;
  user_id: string;
  member_id: string;
  password: string;
  euin: string;
  cams_application_id: string;
  cams_password: string;

  constructor(
    // @InjectRepository(TransactionBaskets)
    // private transactionBasketRepository: Repository<TransactionBaskets> ,
    // @InjectRepository(TransactionBasketItems)
    // private transactionBasketItemRepository: Repository<TransactionBasketItems> ,
    // @InjectRepository(Purchase)
    // private purchaseRepository: Repository<Purchase> ,
    // @InjectRepository(Redemption)
    // private redemptionRepository: Repository<Redemption>,
    // @InjectRepository(Users)
    // private userRepository: Repository<Users>,
    // @InjectRepository(UserOnboardingDetails)
    // private userOnboardingDetailRepository: Repository<UserOnboardingDetails> ,
    // @InjectRepository(SwitchFunds)
    // private switchRepository: Repository<SwitchFunds>,
    // @InjectRepository(UserBankDetails)
    // private userBankDetailsRepository: Repository<UserBankDetails> ,
    // @InjectRepository(SmartSipFunds)
    // private smartSipFundsRepository: Repository<SmartSipFunds> ,

    private transactionBasketRepository: TransactionBasketsRepository,
    private transactionBasketItemRepository: TransactionBasketItemsRepository,
    private purchaseRepository: PurchaseRepository,
    private redemptionRepository: RedemptionRepository,
    private userRepository: UsersRepository,
    private userOnboardingDetailRepository: UserOnboardingDetailsRepository,
    private switchRepository: SwitchFundsRepository,
    private userBankDetailsRepository: UserBankDetailsRepository,
    private smartSipFundsRepository: SmartSipFundsRepository,
    private riskProfileRepositoyry: RiskProfileRepository,
    private goalsRepository: GoalRepository,
    private rzpOrderRepository: RzpOrdersRepository,
    private mfSwitchPlanRepository: MfSwitchPlanRepository,
    private mfRedemptionPlanRepository: MfRedemptionPlanRepository,
    private mfPurchasePlanRepository: MfPurchasePlanRepository,
    private amcRepository: AmcRepository,
    private bseFrequencyRepo: BseFrequencyRepository,
    private mandatesRepository: MandatesRepository,
    private funddetailRepository: FundDetailsRepository,
    private xsipRegisterRepo: BseXSipRegisterRepository,
    private swpRegisterRepo: BseSwpRegisterRepository,
    private stpRegisterRepo: BseStpRegisterRepository,
    private xsipOrderRepo: BseXSipOrderRepository,
    private switchOrderRepo: BseSwitchOrderRepository,
    private purchaseOrderRepo: BsePurchaseRedemOrderRepository,
    private uniqueReferenceNoRepo: UniqueReferenceNoRepository,
    private bsev1EmandateBankCodeRepository: Bsev1EmandateBankCodeRepository,
    private bsev1UpiBankCodeRepository: Bsev1UpiBankCodeRepository,
    private modelPortfolioRepository: ModelPortfolioRepository,

    private readonly razorpayService: RazorpayService,
    private readonly signzyService: SignzyService,
    private readonly fintechService: FintechService,
    private readonly mfService: MutualfundsService,
    private enablexService: EnablexService,
    private readonly mutualFundService: MutualfundsService,
    private readonly bseService: BseService,
    private readonly bsev1Service: Bsev1Service,
    private readonly camsService: CamsService,
    private readonly karvyService: KarvyService,
  ) {
    const configService = new ConfigService();
    this.benchmark_fund_id = configService.get('BENCHMARK_FUND_ID');
    this.msg_apikey = configService.get('MSG_APIKEY');

    this.mf_base_url = configService.get('MF_BASE_URL');
    this.base_url = configService.get('BASE_URL');
    this.member = configService.get('SANDBOX_MEMBER_CODE');
    this.member_id = configService.get('MEMBERID');
    this.password = configService.get('PASSWORD');
    this.user_id = configService.get('USERID');
    this.euin = configService.get('EUIN');
    this.cams_application_id = configService.get('CAMS_APPLICATION_ID');
    this.cams_password = configService.get('CAMS_PASSWORD');

    try {
      // msg91.initialize({ authKey: this.msg_apikey });
      console.log('replace comment by msg91 initialize');
    } catch (ex) {
      console.log(ex);
    }
  }

  async get_mf_fund_details(isin: string) {
    try {
      const fundDetails: any = await this.mfService.findFundsByIsins([isin]);
      console.log('FUND DETAILS', fundDetails);
      if (fundDetails.status == HttpStatus.OK) {
        return {
          fund_plan_id: fundDetails.data[0].planId,
          fund_name: fundDetails.data[0].schemeName,
          logo_url: fundDetails.data[0].amcLogoUrl,
          amcId: fundDetails.data[0].amcId,
        };
      } else {
        return { fund_plan_id: '', fund_name: '', logo_url: '', amcId: '' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async getFpFund(isin: string) {
    try {
      // let fundDetail = await this.fintechService.getFpFund(isin);
      const fund_details = await this.mutualFundService.getFundDetailsByIsins([
        isin,
      ]);
      console.log('fund_details', fund_details);
      const fund = fund_details['data'];
      console.log('fund data', fund);
      const plan_id = fund[0].planId;

      const systematic_validation =
        await this.mutualFundService.get_systematic_validations_by_planId(
          plan_id,
        );
      console.log('systematic_validation', systematic_validation);
      console.log('systematic_validation data', systematic_validation['data']);
      if (systematic_validation['data'] == null) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: systematic_validation['data']['message'],
        };
      }
      // let fundDetail = {
      //     "minInitialInvestment": 1000,
      //     "purchaseAllowed": true,
      //     "redemptionAllowed": true,
      //     "switchOutAllowed": true,
      //     "switchInAllowed": true,
      //     "sip_allowed": true,
      //     "swp_allowed": true,
      //     "stp_out_allowed": true,
      //     "stp_in_allowed": true,
      //     "sip_frequency_specific_data": {
      //         "monthly": {
      //             "dates": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]",
      //             "min_installment_amount": 1000.0,
      //             "max_installment_amount": 99999999.0,
      //             "amount_multiples": 100.0,
      //             "min_installments": 6
      //         },
      //         "quarterly": {
      //             "dates": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]",
      //             "min_installment_amount": 10000.0,
      //             "max_installment_amount": 99999999.0,
      //             "min_installments": 3,
      //             "amount_multiples": 1000
      //         },
      //         "half_yearly": {
      //             "dates": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]",
      //             "min_installment_amount": 10000.0,
      //             "max_installment_amount": 99999999.0,
      //             "min_installments": 3,
      //             "amount_multiples": 1000
      //         },
      //         "yearly": {
      //             "dates": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]",
      //             "min_installment_amount": 10000.0,
      //             "max_installment_amount": 99999999.0,
      //             "min_installments": 3,
      //             "amount_multiples": 1000
      //         }
      //     },
      //     "swp_frequency_specific_data": {
      //         "monthly": {
      //             "dates": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]",
      //             "min_installment_amount": 1000.0,
      //             "max_installment_amount": 99999999.0,
      //             "min_installments": 6,
      //             "amount_multiples": 100.0
      //         },
      //         "quarterly": {
      //             "dates": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]",
      //             "min_installment_amount": 10000.0,
      //             "max_installment_amount": 99999999.0,
      //             "min_installments": 3,
      //             "amount_multiples": 100.0
      //         },
      //         "half_yearly": {
      //             "dates": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]",
      //             "min_installment_amount": 10000.0,
      //             "max_installment_amount": 99999999.0,
      //             "min_installments": 3,
      //             "amount_multiples": 1000
      //         },
      //         "yearly": {
      //             "dates": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]",
      //             "min_installment_amount": 10000.0,
      //             "max_installment_amount": 99999999.0,
      //             "min_installments": 3,
      //             "amount_multiples": 1000
      //         }
      //     },
      //     "stp_frequency_specific_data": {
      //         "monthly": {
      //             "dates": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]",
      //             "min_installment_amount": 1000.0,
      //             "max_installment_amount": 99999999.0,
      //             "min_installments": 6,
      //             "amount_multiples": 100.0
      //         },
      //         "quarterly": {
      //             "dates": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]",
      //             "min_installment_amount": 1000.0,
      //             "max_installment_amount": 99999999.0,
      //             "min_installments": 6,
      //             "amount_multiples": 100.0
      //         },
      //         "half_yearly": {
      //             "dates": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]",
      //             "min_installment_amount": 10000.0,
      //             "max_installment_amount": 99999999.0,
      //             "min_installments": 3,
      //             "amount_multiples": 1000
      //         },
      //         "yearly": {
      //             "dates": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]",
      //             "min_installment_amount": 10000.0,
      //             "max_installment_amount": 99999999.0,
      //             "min_installments": 3,
      //             "amount_multiples": 1000
      //         }
      //     }
      // };

      // console.log("please", fundDetail);
      const result = await this.transformData(
        systematic_validation['data'],
        isin,
        plan_id,
      );
      console.log('systematic', systematic_validation);
      console.log('resultttt', result);
      console.log('plan_id', plan_id);
      const fundDetail = result;
      console.log('please', fundDetail);
      return { status: HttpStatus.OK, data: fundDetail };
    } catch (err) {
      console.log('error', err);
      return { status: HttpStatus.BAD_REQUEST, message: err.message };
    }
  }

  async getFpFundForSmartsip(isin: string) {
    try {
      const smartsip = await this.smartSipFundsRepository.findOne({
        where: { equity_scheme_isin: isin },
      });
      if (smartsip) {
        const equityfundDetail = await this.fintechService.getFpFund(
          smartsip.equity_scheme_isin,
        );
        const debtfundDetail = await this.fintechService.getFpFund(
          smartsip.debt_scheme_isin,
        );

        if (
          equityfundDetail.status == HttpStatus.OK &&
          debtfundDetail.status == HttpStatus.OK
        ) {
          const equity_min_instalment =
            equityfundDetail.data.min_initial_investment;
          const debt_min_instalment =
            equityfundDetail.data.min_initial_investment;
          const min_initial_investment =
            equity_min_instalment + debt_min_instalment;

          equityfundDetail.data.min_initial_investment = min_initial_investment;

          return equityfundDetail;
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Sorry no smart sips not found in FP',
          };
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Sorry no smart sip with this id found',
        };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async getBenchmarkMfFundDetail() {
    try {
      const fundDetail = await this.mfService.getFundDetails(
        this.benchmark_fund_id,
      );
      console.log('please', fundDetail);
      return fundDetail;
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, message: err.message };
    }
  }

  async createBasketOrder(
    createTransactionBasketDTO: CreateTransactionBasketDTO,
    ip,
    server_ip,
  ) {
    try {
      if (createTransactionBasketDTO.transaction_basket_items.length > 0) {
        let all_redemption;
        if (createTransactionBasketDTO.is_redemption_full) {
          all_redemption = true;
        } else {
          all_redemption = false;
        }
        const completed_status =
          await this.signzyService.getIsOnboardingComplete(
            createTransactionBasketDTO.user_id,
          );
        const onboardingDetails =
          await this.userOnboardingDetailRepository.findOneBy({
            user_id: createTransactionBasketDTO.user_id,
          });
        const user_bank = await this.userBankDetailsRepository.findOne({
          where: { user_id: createTransactionBasketDTO.user_id },
        });
        console.log('mandate,,transaction', createTransactionBasketDTO);
        if (onboardingDetails.is_onboarding_complete) {
          const user = await this.userRepository.findOneBy({
            id: createTransactionBasketDTO.user_id,
          });
          const transaction_basket_items_response = {};
          createTransactionBasketDTO.status = 'initiated';
          const transaction_basket =
            await this.transactionBasketRepository.save({
              total_amount: createTransactionBasketDTO.total_amount,
              user_id: createTransactionBasketDTO.user_id,
              status: createTransactionBasketDTO.status,
              consent_email: user.email,
              consent_isd_code: '+91',
              consent_mobile: user.mobile,
              is_smart_sip: createTransactionBasketDTO.is_smart_sip,
              model_portfolio_id: createTransactionBasketDTO.model_portfolio_id,
              is_euin: createTransactionBasketDTO.is_euin,
            });
          if (
            createTransactionBasketDTO.is_smart_sip &&
            createTransactionBasketDTO.transaction_basket_items.length == 1
          ) {
            const smart_sip = await this.smartSipFundsRepository.findOne({
              where: [
                {
                  debt_scheme_isin:
                    createTransactionBasketDTO.transaction_basket_items[0]
                      .fund_isin,
                },
                {
                  equity_scheme_isin:
                    createTransactionBasketDTO.transaction_basket_items[0]
                      .fund_isin,
                },
              ],
            });
            let scheme_to_be_created;
            if (
              smart_sip.debt_scheme_isin ==
              createTransactionBasketDTO.transaction_basket_items[0].fund_isin
            ) {
              scheme_to_be_created = smart_sip.equity_scheme_isin;
            } else {
              scheme_to_be_created = smart_sip.debt_scheme_isin;
            }
            const new_transaction_basket_item =
              createTransactionBasketDTO.transaction_basket_items[0];
            new_transaction_basket_item.fund_isin = scheme_to_be_created;
            new_transaction_basket_item.is_payment = false;

            const fund_detail = await this.getFpFund(scheme_to_be_created);

            if (fund_detail.status == HttpStatus.OK) {
              new_transaction_basket_item.amount =
                fund_detail.data.sip_frequency_specific_data.monthly.min_installment_amount;
              createTransactionBasketDTO.transaction_basket_items.push(
                new_transaction_basket_item,
              );
            } else {
              console.log('NO SMART SIP DATA FOUND');
            }
          }

          for (let transaction_basket_item of createTransactionBasketDTO.transaction_basket_items) {
            // let mandate = await this.mandatesRepository.findOne({ where: { mandate_id: transaction_basket_item.payment_source } })
            const funddata = await this.funddetailRepository.findOne({
              where: { isin: transaction_basket_item.fund_isin },
            });
            switch (transaction_basket_item.transaction_type) {
              case 'lumpsum': {
                const fp_lumpsum_dto = new FpLumpsumDTO();
                fp_lumpsum_dto.amount = transaction_basket_item.amount;
                if (transaction_basket_item.folio_number) {
                  fp_lumpsum_dto.folio_number =
                    transaction_basket_item.folio_number;
                }
                fp_lumpsum_dto.user_ip = ip;
                fp_lumpsum_dto.scheme = transaction_basket_item.fund_isin;
                fp_lumpsum_dto.server_ip = server_ip;
                // fp_lumpsum_dto.mf_investment_account = onboardingDetails.fp_investment_account_id;
                // let fp_create_purchase = await this.fintechService.create_purchase(fp_lumpsum_dto);
                // if (fp_create_purchase.status == HttpStatus.OK) {

                transaction_basket_item.transaction_basket_id =
                  transaction_basket.id;
                transaction_basket_item.status = 'pending';
                transaction_basket_item.user_id = transaction_basket.user_id;
                const created_transaction_basket_item =
                  await this.transactionBasketItemRepository.save(
                    transaction_basket_item,
                  );
                // transaction_basket.payment_id = mandate.mandate_id
                // transaction_basket.total_amount=transaction_basket_item.amount
                await this.transactionBasketRepository.save(transaction_basket);
                let purchase = new Purchase();
                // fp_create_purchase.data["fp_id"] = fp_create_purchase.data.id;
                // fp_create_purchase.data["user_id"] = transaction_basket_item.user_id;

                // fp_create_purchase.data["transaction_basket_item_id"] = created_transaction_basket_item.id;
                // console.log("TRANDSACTION OBJ", fp_create_purchase);
                // delete fp_create_purchase.data.id;
                purchase.user_id = transaction_basket_item.user_id;
                purchase.state = 'pending';
                purchase.amount = transaction_basket_item.amount;
                purchase.gateway = 'rta';
                const date = new Date();

                purchase.folio_number = transaction_basket_item.folio_number;

                purchase.scheduled_on = date;
                purchase.user_ip = ip;
                purchase.server_ip = server_ip;
                purchase.scheme = transaction_basket_item.fund_isin;
                purchase.transaction_basket_item_id =
                  created_transaction_basket_item.id;

                purchase = await this.purchaseRepository.save(purchase);
                transaction_basket_item =
                  await this.transactionBasketItemRepository.save(
                    transaction_basket_item,
                  );
                console.log('tbi', transaction_basket_item);
                // } else {
                //     transaction_basket_item.transaction_basket_id = transaction_basket.id;
                //     transaction_basket_item.user_id = transaction_basket.user_id;
                //     transaction_basket_item.status = "failed";
                //     transaction_basket_item.response_message = fp_create_purchase.error;
                //     transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);
                // }

                //BSE data
                // let register_sip = new RegisterSipDto()
                // let fund_detail: any = await this.get_mf_fund_details(transaction_basket_item.fund_isin)
                // let amc = await this.amcRepository.findOne({ where: { amcId: fund_detail.data.amcId } })

                // let frequency = await this.bseFrequencyRepo.findOne({ where: { description: transaction_basket_item.frequency } })
                // let freq_code = frequency.code
                // register_sip.sxp_type = 'lumpsum';
                // register_sip.mem_ord_ref_id = '';
                // register_sip.ucc = '';
                // register_sip.src_scheme = transaction_basket_item.fund_isin
                // register_sip.amc_code = amc.rta_amc_code
                // register_sip.amount = transaction_basket_item.amount;
                // register_sip.cur = 'INR';
                // register_sip.src_folio = transaction_basket_item.folio_number;
                // register_sip.phys_or_demat = 'P';
                // register_sip.isunits = false;
                // register_sip.dpc = true;
                // register_sip.start_date = new Date();
                // register_sip.end_date = new Date();
                // register_sip.freq = freq_code;
                // register_sip.txn_date = transaction_basket_item.installment_day;
                // register_sip.payment_ref_id = '1';
                // register_sip.holder = [];
                // register_sip.info.mem_details.euin_flag = true;
                // register_sip.info.mem_details.euin = '';
                // register_sip.depository_acct = {
                //     depository: "string",
                //     dp_id: "string",
                //     client_id: "string"
                // };
                // register_sip.bank_acct = {
                //     ifsc: "string",
                //     no: "string",
                //     type: "string",
                //     name: "string"
                // };
                // register_sip.remark = '';
                // register_sip.email = user.email;
                // register_sip.mobnum = user.mobile;
                // register_sip.first_order_today = true;
                // register_sip.brokerage = transaction_basket_item.amount * 0.01;
                // register_sip.ninstallments = transaction_basket_item.number_of_installments;
                // register_sip.nomination = [];
                // let sip_register = await this.bseService.register_sip(register_sip)
                // // let sip_registered = await this.mfPurchasePlanRepository.save(sip_register)
                // console.log("sip_reg", sip_register)

                // let sip_registered = new MfPurchasePlan();
                // sip_registered.sxp_type = register_sip.sxp_type;
                // sip_registered.mem_ord_ref_id = register_sip.mem_ord_ref_id;
                // sip_registered.ucc = register_sip.ucc;
                // sip_registered.scheme = transaction_basket_item.fund_isin;
                // sip_registered.amc_code = amc.rta_amc_code;
                // sip_registered.amount = transaction_basket_item.amount;
                // sip_registered.cur = 'INR';
                // sip_registered.folio_number = transaction_basket_item.folio_number;
                // sip_registered.phys_or_demat = 'P';
                // sip_registered.isunits = false;
                // sip_registered.dpc = true;
                // sip_registered.start_date = new Date();
                // sip_registered.end_date = new Date();
                // sip_registered.frequency = transaction_basket_item.frequency;
                // sip_registered.installment_day = transaction_basket_item.installment_day;
                // sip_registered.payment_ref_id = '1';
                // sip_registered.euin_flag = true;
                // sip_registered.euin = '';
                // sip_registered.remark = '';
                // sip_registered.first_order_today = true;
                // sip_registered.brokerage = transaction_basket_item.amount * 0.01;
                // sip_registered.number_of_installments = transaction_basket_item.number_of_installments;

                // sip_registered = await this.mfPurchasePlanRepository.save(sip_registered)
                // console.log("sip_regd", sip_registered)

                // let purchase_order = new OrderNewPurchaseDTO()
                // let investorDto = new InvestorDTO()
                // purchase_order.investor = investorDto

                // let orderInfo = new OrderInfoDto()

                // let memDetails = new MemDetailsDTO()

                // let mandate = await this.mandatesRepository.findOne({ where: { mandate_id: transaction_basket_item.payment_source } })
                // // purchase_order.src = 'ui';
                // purchase_order.type = 'P';
                // purchase_order.mem_ord_ref_id = this.generateRandomMemOrdRefId();
                // //  purchase_order.mem_ord_ref_id = "836598657";
                // // purchase_order.investor.ucc = onboardingDetails.fp_investment_account_id;
                // purchase_order.investor.ucc = '1002300031';
                // purchase_order.member = this.member;
                // purchase_order.scheme = transaction_basket_item.fund_isin
                // purchase_order.amount = transaction_basket_item.amount;
                // purchase_order.cur = 'INR';
                // // purchase_order.is_units = true;
                // // purchase_order.all_units = false;
                // purchase_order.folio = transaction_basket_item.folio_number;
                // // purchase_order.is_fresh = true;
                // purchase_order.phys_or_demat = "P";
                // purchase_order.info = orderInfo
                // purchase_order.info.mem_details = memDetails
                // // purchase_order.info.min_redeem_flag = true;
                // purchase_order.info.src = 'lumpsum';
                // // purchase_order.info.reg_no = '';
                // purchase_order.info.mem_details.euin_flag = false;
                // // purchase_order.info.mem_details.euin = '';
                // // purchase_order.holder = [];
                // purchase_order.email = user.email;
                // purchase_order.mobnum = user.mobile;
                // purchase_order.exch_mandate_id = parseInt(mandate.mandate_id);
                // purchase_order.kyc_passed = true;
                // // purchase_order.depository_acct =
                // // {
                // //     depository: "string",
                // //     dp_id: "string",
                // //     client_id: "string"
                // // };
                // purchase_order.bank_acct = {
                //     ifsc: user_bank.ifsc_code,
                //     no: user_bank.account_number,
                //     type: user_bank.account_type,
                //     name: user_bank.account_holder_name
                // };
                // purchase_order.dpc = true;
                // // purchase_order.nomination = [];

                // let sip_order = await this.bseService.create_order_purchase(purchase_order)
                // // let sip_ordered = await this.purchaseRepository.save(sip_order)
                // console.log("sip_order", sip_order)

                // let order_purchase = new Purchase();
                // order_purchase.src = 'ui';
                // order_purchase.type = 'P';
                // order_purchase.mem_ord_ref_id = purchase_order.mem_ord_ref_id;
                // order_purchase.ucc = onboardingDetails.fp_investment_account_id;
                // order_purchase.member = this.member;
                // order_purchase.scheme = transaction_basket_item.fund_isin
                // order_purchase.amount = transaction_basket_item.amount;
                // order_purchase.cur = 'INR';
                // // order_purchase.is_units = true;
                // // order_purchase.all_units = false;
                // order_purchase.folio_number = transaction_basket_item.folio_number;
                // // order_purchase.is_fresh = true;
                // order_purchase.phys_or_demat = "P";
                // order_purchase.min_redeem_flag = true;
                // order_purchase.src = 'sip';
                // // order_purchase.reg_no = '';
                // // order_purchase.euin_flag = true;
                // // order_purchase.euin = '';
                // order_purchase.exch_mandate_id = purchase_order.exch_mandate_id;
                // order_purchase.kyc_passed = true;
                // order_purchase.dpc = true;
                // order_purchase.sip_order_id = sip_order.data.items.id

                // order_purchase = await this.purchaseRepository.save(order_purchase)
                // console.log("sip_ordered", order_purchase)
                break;
              }
              case 'sip': {
                // FOR SIP we create FP Order ONLY after CONSENT
                transaction_basket_item.transaction_basket_id =
                  transaction_basket.id;
                transaction_basket_item.user_id = transaction_basket.user_id;
                transaction_basket_item.number_of_installments =
                  transaction_basket_item.number_of_installments
                    ? transaction_basket_item.number_of_installments
                    : 50;
                transaction_basket_item.status = 'pending';
                const today = new Date();
                const date = today.getDate();
                console.log('date', date);
                const difference =
                  transaction_basket_item.installment_day - date;
                // if (difference <= 2) {
                //     return { status: HttpStatus.BAD_REQUEST, error: "START DATE SHOULD BE ATLEAST 2 WORKING DAYS LATER THAN REGISTRATION DATE" }
                // }

                let created_transaction_basket_item =
                  await this.transactionBasketItemRepository.save(
                    transaction_basket_item,
                  );
                let start_date, next_installment_date;
                if (transaction_basket_item.generate_first_installment_now) {
                  start_date = this.calculateStartDate(
                    transaction_basket_item.installment_day,
                  );
                  next_installment_date = NextInstallmentDate(
                    transaction_basket_item.frequency,
                    transaction_basket_item.installment_day,
                    transaction_basket_item.generate_first_installment_now,
                  );
                } else {
                  start_date = NextInstallmentDate(
                    transaction_basket_item.frequency,
                    transaction_basket_item.installment_day,
                    transaction_basket_item.generate_first_installment_now,
                  );
                  next_installment_date = NextInstallmentDate(
                    transaction_basket_item.frequency,
                    transaction_basket_item.installment_day,
                    transaction_basket_item.generate_first_installment_now,
                  );
                }
                created_transaction_basket_item.start_date = start_date;
                created_transaction_basket_item.next_installment_date =
                  next_installment_date;
                created_transaction_basket_item =
                  await this.transactionBasketItemRepository.save(
                    created_transaction_basket_item,
                  );
                const mandate = await this.mandatesRepository.findOne({
                  where: { mandate_id: transaction_basket_item.payment_source },
                });
                transaction_basket.payment_id = mandate.mandate_id;
                await this.transactionBasketRepository.save(transaction_basket);

                let mf_purchase_plan = new MfPurchasePlan();
                mf_purchase_plan.user_id = user.id;
                mf_purchase_plan.user_ip = ip;
                mf_purchase_plan.systematic = true;
                mf_purchase_plan.server_ip = server_ip;
                mf_purchase_plan.scheme = transaction_basket_item.fund_isin;
                mf_purchase_plan.transaction_basket_item_id =
                  created_transaction_basket_item.id;
                mf_purchase_plan.state = 'created';
                mf_purchase_plan.frequency = transaction_basket_item.frequency;
                mf_purchase_plan.installment_day =
                  transaction_basket_item.installment_day;
                mf_purchase_plan.auto_generate_installments = true;
                mf_purchase_plan.remaining_installments =
                  transaction_basket_item.number_of_installments;
                mf_purchase_plan.number_of_installments =
                  transaction_basket_item.number_of_installments;
                mf_purchase_plan.folio_number =
                  transaction_basket_item.folio_number;
                const currentDate = moment();
                let startdate;
                // mf_purchase_plan.start_date = currentDate.format('YYYY-MM-DD');
                if (transaction_basket_item.generate_first_installment_now) {
                  mf_purchase_plan.start_date = this.calculateStartDate(
                    transaction_basket_item.installment_day,
                  );
                  // mf_purchase_plan.start_date = this.calculateStartDate(date);
                  mf_purchase_plan.next_installment_date = NextInstallmentDate(
                    transaction_basket_item.frequency,
                    transaction_basket_item.installment_day,
                    transaction_basket_item.generate_first_installment_now,
                  );
                  console.log('start_datessss', mf_purchase_plan.start_date);
                } else {
                  startdate = moment(
                    NextInstallmentDate(
                      transaction_basket_item.frequency,
                      transaction_basket_item.installment_day,
                      transaction_basket_item.generate_first_installment_now,
                    ),
                  ).toDate();
                  mf_purchase_plan.start_date = startdate;
                  mf_purchase_plan.next_installment_date = NextInstallmentDate(
                    transaction_basket_item.frequency,
                    transaction_basket_item.installment_day,
                    transaction_basket_item.generate_first_installment_now,
                  );
                  console.log('start_dateeeee', mf_purchase_plan.start_date);
                }

                let moment_frequency: any = 'months';
                let no_of_installments: number =
                  transaction_basket_item.number_of_installments;
                if (mf_purchase_plan.frequency == 'daily') {
                  moment_frequency = 'days';
                  no_of_installments =
                    transaction_basket_item.number_of_installments;
                } else if (mf_purchase_plan.frequency == 'day_in_a_week') {
                  moment_frequency = 'weeks';
                  no_of_installments =
                    transaction_basket_item.number_of_installments;
                } else if (mf_purchase_plan.frequency == 'monthly') {
                  moment_frequency = 'months';
                  no_of_installments =
                    transaction_basket_item.number_of_installments;
                } else if (mf_purchase_plan.frequency == 'quaterly') {
                  moment_frequency = 'months';
                  no_of_installments =
                    transaction_basket_item.number_of_installments * 4;
                } else if (mf_purchase_plan.frequency == 'half-yearly') {
                  moment_frequency = 'months';
                  no_of_installments =
                    transaction_basket_item.number_of_installments * 2;
                } else if (mf_purchase_plan.frequency == 'yearly') {
                  moment_frequency = 'years';
                  no_of_installments =
                    transaction_basket_item.number_of_installments;
                }
                if (transaction_basket_item.generate_first_installment_now) {
                  mf_purchase_plan.end_date = moment(
                    currentDate
                      .add(no_of_installments, moment_frequency)
                      .format('YYYY-MM-DD'),
                  ).toDate();
                  console.log('end_dateeeee', mf_purchase_plan.end_date);
                } else {
                  mf_purchase_plan.end_date = moment(startdate)
                    .add(no_of_installments, moment_frequency)
                    .toDate();
                  console.log('end_datehjfvwkasgc', mf_purchase_plan.end_date);
                }
                mf_purchase_plan.folio_number =
                  transaction_basket_item.folio_number;
                // mf_purchase_plan.next_installment_date = currentDate.add(1,moment_frequency).format('YYYY-MM-DD');
                mf_purchase_plan.amount = transaction_basket_item.amount;
                mf_purchase_plan.activated_at = new Date();
                mf_purchase_plan.gateway = 'rta';
                mf_purchase_plan = await this.mfPurchasePlanRepository.save(
                  mf_purchase_plan,
                );
                console.log('mf_purchase_plan saved', mf_purchase_plan);
                //BSE data
                // console.log("sip")
                console.log('trans_basket', created_transaction_basket_item);
                // let register_sip = new RegisterSipDto()
                // // let fund_detail: any = await this.get_mf_fund_details(transaction_basket_item.fund_isin)
                // // let fund_detail: any = await this.mfService.findFundsByIsins([transaction_basket_item.fund_isin])
                // // let fund_detail
                // // console.log("funddddddddddddddd", fund_detail)
                // // console.log("fund.data", fund_detail.data[0].amcId)
                // // let amc = await this.amcRepository.findOne({ where: { amcId: fund_detail.amcId } })
                // // console.log("amc")
                // // let amc = await this.amcRepository.findOne({})
                // // console.log("amc", amc)
                // console.log("amcgxfhfgsh")
                // let frequency = await this.bseFrequencyRepo.findOne({ where: { description: transaction_basket_item.frequency } })
                // let freq_code = frequency.code
                // register_sip.sxp_type = 'sip';
                // register_sip.mem_ord_ref_id = this.generateRandomMemOrdRefId();
                // // register_sip.ucc = '1002100031';
                // register_sip.ucc = onboardingDetails.fp_investment_account_id;
                // // register_sip.src_scheme = transaction_basket_item.fund_isin
                // register_sip.src_scheme = "RERTA12-GR"
                // register_sip.amc_code = "AMC123232"
                // // register_sip.amc_code = amc.rta_amc_code
                // // register_sip.exch_mandate_id = parseInt(mandate.mandate_id);
                // register_sip.amount = transaction_basket_item.amount;
                // register_sip.cur = 'INR';
                // register_sip.src_folio = transaction_basket_item.folio_number;
                // register_sip.phys_or_demat = 'P';
                // register_sip.isunits = false;
                // register_sip.dpc = true;
                // register_sip.start_date = new Date();
                // register_sip.end_date = new Date();
                // register_sip.freq = freq_code;
                // register_sip.txn_date = transaction_basket_item.installment_day;
                // register_sip.payment_ref_id = '1';
                // register_sip.holder = [];
                // // register_sip.info.mem_details.euin_flag = false;
                // // register_sip.info.mem_details.euin = '';
                // // register_sip.depository_acct = {
                // //     depository: "string",
                // //     dp_id: "string",
                // //     client_id: "string"
                // // };
                // register_sip.bank_acct = {
                //     ifsc: user_bank.ifsc_code,
                //     no: user_bank.account_number,
                //     type: user_bank.account_type,
                //     name: user_bank.account_holder_name
                // }
                // register_sip.remark = 'sip';
                // register_sip.email = user.email;
                // register_sip.mobnum = user.mobile;
                // register_sip.first_order_today = true;
                // register_sip.brokerage = transaction_basket_item.amount * 0.01;
                // register_sip.ninstallments = transaction_basket_item.number_of_installments;

                // let sip_register = await this.bseService.register_sip(register_sip)
                // console.log("sip_register", sip_register)
                // // let sip_registered = await this.mfPurchasePlanRepository.save(sip_register)
                // let sip_registered = new MfPurchasePlan();
                // sip_registered.sxp_type = register_sip.sxp_type;
                // // sip_registered.state = 'pending';
                // sip_registered.mem_ord_ref_id = register_sip.mem_ord_ref_id;
                // sip_registered.ucc = register_sip.ucc;
                // sip_registered.scheme = transaction_basket_item.fund_isin;
                // // sip_registered.amc_code = amc.rta_amc_code;
                // sip_registered.amount = transaction_basket_item.amount;
                // sip_registered.cur = 'INR';
                // sip_registered.folio_number = transaction_basket_item.folio_number;
                // sip_registered.phys_or_demat = 'P';
                // sip_registered.isunits = false;
                // sip_registered.dpc = true;
                // sip_registered.start_date = new Date();
                // sip_registered.end_date = new Date();
                // sip_registered.frequency = transaction_basket_item.frequency;
                // sip_registered.installment_day = transaction_basket_item.installment_day;
                // sip_registered.payment_ref_id = '1';
                // sip_registered.euin_flag = true;
                // sip_registered.euin = '';
                // sip_registered.remark = '';
                // sip_registered.first_order_today = true;
                // sip_registered.brokerage = transaction_basket_item.amount * 0.01;
                // sip_registered.number_of_installments = transaction_basket_item.number_of_installments;
                // // sip_registered.sip_register_id= sip_register.data.id

                // sip_registered = await this.mfPurchasePlanRepository.save(sip_registered)
                // console.log("sip_registered", sip_registered)
                // let get_password = await this.bsev1Service.get_password_for_registration()
                // console.log("get_password", get_password)
                // let encrypted_password = await this.extractPassword(get_password.data)
                // console.log("password", encrypted_password)

                // let mandate = await this.mandatesRepository.findOne({ where: { mandate_id: transaction_basket_item.payment_source } })
                // let purchase_order = new OrderNewPurchaseDTO()
                // let investor = new InvestorDTO()
                // investor.ucc = '1002100031';

                // purchase_order.src = 'ui';
                // purchase_order.type = 'P';
                // purchase_order.mem_ord_ref_id = `milessw_sip_${created_transaction_basket_item.id}`;
                // purchase_order.investor = investor;
                // // purchase_order.investor.ucc ="1002100031" ;
                // console.log("purchase_orderid", purchase_order.investor.ucc)
                // // purchase_order.investor.ucc =onboardingDetails.fp_investment_account_id ;
                // purchase_order.member = '0103';
                // purchase_order.scheme = transaction_basket_item.fund_isin
                // purchase_order.amount = transaction_basket_item.amount;
                // purchase_order.cur = 'INR';
                // purchase_order.is_units = false;
                // purchase_order.all_units = false;
                // purchase_order.folio = transaction_basket_item.folio_number;
                // purchase_order.is_fresh = true;
                // purchase_order.phys_or_demat = "P";
                // // purchase_order.info.min_redeem_flag = true;
                // // purchase_order.info.src = 'sip';
                // // purchase_order.info.reg_no = '';
                // // purchase_order.info.mem_details.euin_flag = true;
                // // purchase_order.info.mem_details.euin = '';
                // // purchase_order.holder = [];
                // purchase_order.email = user.email;
                // purchase_order.mobnum = user.mobile;
                // purchase_order.exch_mandate_id = parseInt(mandate.mandate_id);
                // purchase_order.kyc_passed = true;
                // // purchase_order.depository_acct ={
                // //     depository: "string",
                // //     dp_id: "string",
                // //     client_id: "string"
                // // };
                // purchase_order.bank_acct = {
                //     ifsc: "UTIB0000004",
                //     no: "6986598569865",
                //     type: "SB",
                //     name: "SELF"
                // };
                // purchase_order.dpc = true;
                // // purchase_order.nomination = [];

                // let sip_order = await this.bseService.create_order_purchase(purchase_order)
                // // let sip_ordered = await this.purchaseRepository.save(sip_order)
                // console.log("sip_order", sip_order)

                // let order_purchase = new Purchase();
                // order_purchase.src = 'ui';
                // order_purchase.type = 'P';
                // order_purchase.mem_ord_ref_id = purchase_order.mem_ord_ref_id;
                // // order_purchase.ucc = '1002100031';
                // order_purchase.ucc = purchase_order.investor.ucc;
                // order_purchase.member = '0103';
                // order_purchase.scheme = transaction_basket_item.fund_isin
                // order_purchase.amount = transaction_basket_item.amount;
                // order_purchase.cur = 'INR';
                // order_purchase.is_units = false;
                // order_purchase.all_units = false;
                // order_purchase.folio_number = transaction_basket_item.folio_number;
                // order_purchase.is_fresh = true;
                // order_purchase.phys_or_demat = "P";
                // order_purchase.min_redeem_flag = true;
                // order_purchase.src = 'sip';
                // order_purchase.reg_no = '';
                // order_purchase.euin_flag = true;
                // order_purchase.euin = '';
                // order_purchase.exch_mandate_id = purchase_order.exch_mandate_id;
                // order_purchase.kyc_passed = true;
                // order_purchase.dpc = true;
                // order_purchase.sip_order_id = sip_order.data.items.id

                // order_purchase = await this.purchaseRepository.save(order_purchase)
                // console.log("order_purchase", order_purchase)
              }
              case 'smart_sip': {
                //FOR SIP we create FP Order ONLY after CONSENT
                transaction_basket_item.transaction_basket_id =
                  transaction_basket.id;
                transaction_basket_item.user_id = transaction_basket.user_id;
                const created_transaction_basket_item =
                  await this.transactionBasketItemRepository.save(
                    transaction_basket_item,
                  );
                break;
              }
              case 'no_mandate_sip': {
                const fp_lumpsum_dto = new FpLumpsumDTO();
                fp_lumpsum_dto.amount = transaction_basket_item.amount;
                if (transaction_basket_item.folio_number) {
                  fp_lumpsum_dto.folio_number =
                    transaction_basket_item.folio_number;
                }
                fp_lumpsum_dto.user_ip = ip;
                fp_lumpsum_dto.scheme = transaction_basket_item.fund_isin;
                fp_lumpsum_dto.server_ip = server_ip;
                // fp_lumpsum_dto.mf_investment_account = onboardingDetails.fp_investment_account_id;
                const fp_create_purchase =
                  await this.fintechService.create_purchase(fp_lumpsum_dto);
                if (fp_create_purchase.status == HttpStatus.OK) {
                  transaction_basket_item.transaction_basket_id =
                    transaction_basket.id;
                  transaction_basket_item.status = 'active';
                  transaction_basket_item.user_id = transaction_basket.user_id;

                  const created_transaction_basket_item =
                    await this.transactionBasketItemRepository.save(
                      transaction_basket_item,
                    );

                  let purchase = new Purchase();
                  fp_create_purchase.data['fp_id'] = fp_create_purchase.data.id;
                  fp_create_purchase.data['user_id'] =
                    transaction_basket_item.user_id;

                  fp_create_purchase.data['transaction_basket_item_id'] =
                    created_transaction_basket_item.id;
                  console.log('TRANDSACTION OBJ', fp_create_purchase);
                  delete fp_create_purchase.data.id;
                  purchase = fp_create_purchase.data;

                  const currentDate = new Date();

                  // Define the day you want to set (1 to 31)
                  const installment_day =
                    transaction_basket_item.installment_day; // Change this to your desired day

                  // Set the day for the current date
                  currentDate.setDate(installment_day);

                  currentDate.setDate(currentDate.getDate() + 30);

                  // // Format the date as "yyyy-mm-dd"
                  // const year = currentDate.getFullYear();
                  // const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so we add 1 and pad with leading zeros if needed.
                  // const day = String(currentDate.getDate()).padStart(2, '0'); // Pad with leading zeros if needed.

                  // const formattedDate = `${year}-${month}-${day}`;

                  purchase.next_installment_date = currentDate;
                  console.log('purchase_29w3', purchase);
                  purchase = await this.purchaseRepository.save(purchase);
                } else {
                  transaction_basket_item.transaction_basket_id =
                    transaction_basket.id;
                  transaction_basket_item.user_id = transaction_basket.user_id;
                  transaction_basket_item.status = 'failed';
                  transaction_basket_item.response_message =
                    fp_create_purchase.error;
                  transaction_basket_item =
                    await this.transactionBasketItemRepository.save(
                      transaction_basket_item,
                    );
                  console.log('basket', transaction_basket_item);
                }

                break;
              }
              case 'redemption': {
                const fp_redemption_dto = new FpRedemptionDTO();
                if (fp_redemption_dto.amount) {
                  fp_redemption_dto.amount = transaction_basket_item.amount;
                } else {
                  fp_redemption_dto.units = transaction_basket_item.units;
                }

                // if (transaction_basket_item.is_instant_redemption) {
                //     fp_redemption_dto.redemption_mode = "instant";
                // } else {
                //     fp_redemption_dto.redemption_mode = "normal"
                // }
                if (transaction_basket_item.folio_number) {
                  fp_redemption_dto.folio_number =
                    transaction_basket_item.folio_number;
                }
                fp_redemption_dto.user_ip = ip;
                fp_redemption_dto.scheme = transaction_basket_item.fund_isin;
                fp_redemption_dto.server_ip = server_ip;
                // fp_redemption_dto.mf_investment_account = onboardingDetails.fp_investment_account_id;
                // let fp_create_redemption = await this.fintechService.create_redemption(fp_redemption_dto);
                // if (fp_create_redemption.status == HttpStatus.OK) {
                transaction_basket_item.transaction_basket_id =
                  transaction_basket.id;
                transaction_basket_item.status = 'pending';
                transaction_basket_item.user_id = transaction_basket.user_id;
                const created_transaction_basket_item =
                  await this.transactionBasketItemRepository.save(
                    transaction_basket_item,
                  );

                let redemption = new Redemption();
                // fp_create_redemption.data["fp_id"] = fp_create_redemption.data.id;
                redemption.user_id = transaction_basket_item.user_id;

                redemption.transaction_basket_item_id =
                  created_transaction_basket_item.id;
                redemption.folio_number =
                  created_transaction_basket_item.folio_number;
                redemption.amount = created_transaction_basket_item.amount;
                redemption.units = created_transaction_basket_item.units;
                redemption.scheme = created_transaction_basket_item.fund_isin;
                redemption.gateway = 'rta';
                redemption.initiated_by = 'investor';
                redemption.user_ip = ip;
                redemption.server_ip = server_ip;
                redemption.state = 'pending';
                // console.log("TRANDSACTION OBJ", fp_create_redemption);
                // delete fp_create_redemption.data.id;
                // redemption = fp_create_redemption.data;
                redemption = await this.redemptionRepository.save(redemption);

                // transaction_basket.payment_id = mandate.mandate_id
                await this.transactionBasketRepository.save(transaction_basket);

                const data = {
                  TransCode: 'NEW',
                  TransNo: await this.generateReferenceNumber(this.member_id),
                  OrderId: '',
                  UserID: this.user_id,
                  MemberId: this.member_id,
                  ClientCode: onboardingDetails.fp_investor_id,
                  SchemeCd: funddata.schemeCode,
                  BuySell: 'R',
                  BuySellType: 'FRESH',
                  DPTxn: 'P',
                  OrderVal: transaction_basket_item.amount,
                  Qty: created_transaction_basket_item.units
                    ? created_transaction_basket_item.units
                    : 0,
                  AllRedeem: all_redemption == true ? 'Y' : 'N',
                  FolioNo: transaction_basket_item.folio_number
                    ? transaction_basket_item.folio_number
                    : '',
                  Remarks: '',
                  KYCStatus: 'Y',
                  RefNo: '',
                  SubBrCode: '',
                  EUIN: this.euin,
                  EUINVal: this.euin ? 'Y' : 'N',
                  MinRedeem: 'N',
                  DPC: 'Y',
                  IPAdd: '',
                  // Password: encrypted_password,
                  PassKey: this.password,
                  Parma1: '',
                  Param2: '',
                  Param3: '',
                  MobileNo: '',
                  EmailID: '',
                  MandateID: '',
                  Filler1: '',
                  Filler2: '',
                  Filler3: '',
                  Filler4: '',
                  Filler5: '',
                  Filler6: '',
                };
                console.log('data', data);
                const unique_no = new UniqueReferenceNo();
                unique_no.unique_number = data.TransNo;
                await this.uniqueReferenceNoRepo.save(unique_no);

                const purchaseOrder = new BsePurchaseRedemptionOrder();
                purchaseOrder.type =
                  created_transaction_basket_item.transaction_type;
                purchaseOrder.transaction_code = data.TransCode;
                purchaseOrder.transaction_no = data.TransNo;
                purchaseOrder.order_id = data.OrderId
                  ? parseInt(data.OrderId)
                  : null;
                purchaseOrder.user_id = parseInt(data.UserID);
                purchaseOrder.member_id = data.MemberId;
                purchaseOrder.client_code = data.ClientCode;
                purchaseOrder.scheme_code = data.SchemeCd;
                purchaseOrder.buy_sell = data.BuySell;
                purchaseOrder.buy_sell_type = data.BuySellType;
                purchaseOrder.dp_trans_mode = data.DPTxn;
                purchaseOrder.amount = data.OrderVal;
                purchaseOrder.qty = data.Qty;
                purchaseOrder.all_redeem = data.AllRedeem;
                purchaseOrder.folio_no = data.FolioNo;
                purchaseOrder.remarks = data.Remarks;
                purchaseOrder.kyc_status = data.KYCStatus;
                purchaseOrder.int_ref_no = data.RefNo;
                purchaseOrder.sub_br_code = data.SubBrCode;
                purchaseOrder.euin = data.EUIN;
                purchaseOrder.euin_flag = data.EUINVal;
                purchaseOrder.min_redeem = data.MinRedeem;
                purchaseOrder.dpc = data.DPC;
                purchaseOrder.ip_add = data.IPAdd;
                purchaseOrder.param1 = data.Parma1;
                purchaseOrder.param2 = data.Param2;
                purchaseOrder.param3 = data.Param3;
                purchaseOrder.mobile_no = data.MobileNo;
                purchaseOrder.email = data.EmailID;
                purchaseOrder.mandate_id = data.MandateID;
                purchaseOrder.filler1 = data.Filler1;
                purchaseOrder.filler2 = data.Filler2;
                purchaseOrder.filler3 = data.Filler3;
                purchaseOrder.filler4 = data.Filler4;
                purchaseOrder.filler5 = data.Filler5;
                purchaseOrder.filler6 = data.Filler6;
                purchaseOrder.transaction_basket_item_id =
                  created_transaction_basket_item.id;
                const saved_purchase = await this.purchaseOrderRepo.save(
                  purchaseOrder,
                );
                console.log('saved_purchase', saved_purchase);

                // // } else {
                //     // transaction_basket_item.transaction_basket_id = transaction_basket.id;
                //     // transaction_basket_item.user_id = transaction_basket.user_id;
                //     // transaction_basket_item.status = "failed";
                //     // transaction_basket_item.response_message = fp_create_redemption.error;
                //     // transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);
                // // }

                //BSE Data
                // let register_swp = new RegisterSwpDto()
                // let fund_detail: any = await this.get_mf_fund_details(transaction_basket_item.fund_isin)
                // let amc = await this.amcRepository.findOne({ where: { amcId: fund_detail.data.amcId } })

                // let frequency = await this.bseFrequencyRepo.findOne({ where: { bse_frequency: transaction_basket_item.frequency } })
                // let freq_code = frequency.bse_frequency_code;

                // register_swp.sxp_type = 'swp';
                // register_swp.mem_ord_ref_id = '';
                // register_swp.ucc =;
                // register_swp.member = '';
                // register_swp.src_scheme = transaction_basket_item.fund_isin
                // register_swp.amc_code = amc.rta_amc_code
                // register_swp.amount = transaction_basket_item.amount;
                // register_swp.cur = 'INR';
                // register_swp.src_folio = transaction_basket_item.folio_number;
                // register_swp.phys_or_demat = 'P';
                // register_swp.isunits = false;
                // register_swp.dpc = true;
                // register_swp.start_date =;
                // register_swp.end_date =;
                // register_swp.freq = freq_code;
                // register_swp.txn_date = transaction_basket_item.installment_day;
                // register_swp.payment_ref_id = '1';
                // register_swp.holder =;
                // register_swp.info.mem_details.euin_flag = true;
                // register_swp.info.mem_details.euin = '';
                // register_swp.depository_acct =;
                // register_swp.bank_acct =;
                // register_swp.remark = '';
                // register_swp.email = user.email;
                // register_swp.mobnum = user.mobile;
                // register_swp.first_order_today = true;
                // register_swp.brokerage = transaction_basket_item.amount * 0.01;
                // register_swp.ninstallments = transaction_basket_item.number_of_installments;

                // let swp_registered = await this.bseService.register_swp(register_swp)
                // // swp_registered=await this.mfRedemptionPlanRepository.save(swp_registered)

                // let order_swp = new OrderNewPurchaseDTO();
                // // let mandate = await this.mandatesRepository.findOne({ where: { mandate_id: transaction_basket_item.payment_source } })
                // let investor = new InvestorDTO();
                // investor.ucc = '1002100031';

                // let info = new OrderInfoDto();
                // info.src = 'swp';
                // let mem = new MemDetailsDTO()
                // mem.euin_flag = false
                // info.mem_details = mem

                // // investor.ucc='1002100031';
                // order_swp.type = 'R';
                // order_swp.mem_ord_ref_id = this.generateRandomMemOrdRefId();
                // order_swp.investor = investor;
                // order_swp.investor.ucc = onboardingDetails.fp_investor_id;
                // // investor.ucc='1002100031';
                // order_swp.member = '0103';
                // order_swp.scheme = transaction_basket_item.fund_isin
                // order_swp.amount = transaction_basket_item.amount;
                // order_swp.cur = 'INR';
                // order_swp.is_units = false;
                // order_swp.all_units = false;
                // order_swp.folio = transaction_basket_item.folio_number;
                // order_swp.phys_or_demat = "P";
                // order_swp.payment_ref_id = '';
                // // order_swp.info.src = 'swp';
                // order_swp.info = info;
                // // order_swp.info = true;
                // // order_swp.info.mem_details.euin_flag = true;
                // order_swp.info.mem_details.euin = '';
                // order_swp.email = user.email;
                // order_swp.mobnum = user.mobile;
                // order_swp.exch_mandate_id = parseInt(mandate.mandate_id)
                // order_swp.kyc_passed = true;
                // // order_swp.depository_acct ={
                // //     depository: "string",
                // //     dp_id: "string",
                // //     client_id: "string"
                // // };
                // order_swp.bank_acct = {
                //     ifsc: "UTIB0000004",
                //     no: "6986598569865",
                //     type: "SB",
                //     name: "SELF"
                // };
                // order_swp.dpc = true;
                // order_swp.nomination = [];

                // let swp_order = await this.bseService.create_order_purchase(order_swp);

                // let swp_order_save = new Redemption();
                // swp_order_save.type = 'R';
                // swp_order_save.mem_ord_ref_id = order_swp.mem_ord_ref_id;
                // swp_order_save.ucc = order_swp.investor.ucc;
                // // swp_order_save.ucc = '1002100031';
                // swp_order_save.member = '0103';
                // swp_order_save.scheme = transaction_basket_item.fund_isin
                // swp_order_save.amount = transaction_basket_item.amount;
                // swp_order_save.cur = 'INR';
                // swp_order_save.is_units = false;
                // swp_order_save.all_units = false;
                // swp_order_save.folio_number = transaction_basket_item.folio_number;
                // swp_order_save.phys_or_demat = "P";
                // swp_order_save.payment_ref_id = '';
                // swp_order_save.info_src = 'swp';
                // swp_order_save.euin_flag = true;
                // swp_order_save.euin = '';
                // swp_order_save.exch_mandate_id = order_swp.exch_mandate_id
                // swp_order_save.kyc_passed = true;
                // swp_order_save.dpc = true;
                // swp_order_save.swp_order_id = swp_order.data.items.id
                // let swp_ordered = await this.redemptionRepository.save(swp_order_save);
                break;
              }
              case 'swp': {
                let start_date, next_installment_date;
                // FOR SWP we create FP Order ONLY after CONSENT
                transaction_basket_item.transaction_basket_id =
                  transaction_basket.id;
                transaction_basket_item.user_id = transaction_basket.user_id;
                transaction_basket_item.number_of_installments =
                  transaction_basket_item.number_of_installments
                    ? transaction_basket_item.number_of_installments
                    : 50;
                transaction_basket_item.status = 'pending';
                let created_transaction_basket_item =
                  await this.transactionBasketItemRepository.save(
                    transaction_basket_item,
                  );
                if (transaction_basket_item.generate_first_installment_now) {
                  start_date = await this.calculateStartDate(
                    transaction_basket_item.installment_day,
                  );
                  next_installment_date = NextInstallmentDate(
                    transaction_basket_item.frequency,
                    transaction_basket_item.installment_day,
                    transaction_basket_item.generate_first_installment_now,
                  );
                } else {
                  start_date = NextInstallmentDate(
                    transaction_basket_item.frequency,
                    transaction_basket_item.installment_day,
                    transaction_basket_item.generate_first_installment_now,
                  );
                  next_installment_date = NextInstallmentDate(
                    transaction_basket_item.frequency,
                    transaction_basket_item.installment_day,
                    transaction_basket_item.generate_first_installment_now,
                  );
                }
                created_transaction_basket_item.start_date = start_date;
                created_transaction_basket_item.next_installment_date =
                  next_installment_date;
                created_transaction_basket_item =
                  await this.transactionBasketItemRepository.save(
                    created_transaction_basket_item,
                  );
                console.log('transaction_basket_item', transaction_basket_item);
                console.log(
                  'created_transaction_basket_item',
                  created_transaction_basket_item,
                );

                // transaction_basket.payment_id = mandate.mandate_id
                await this.transactionBasketRepository.save(transaction_basket);
                let mf_redemption_plan = new MfRedemptionPlan();
                mf_redemption_plan.user_id = user.id;
                mf_redemption_plan.user_ip = ip;
                mf_redemption_plan.server_ip = server_ip;
                mf_redemption_plan.scheme = transaction_basket_item.fund_isin;
                mf_redemption_plan.transaction_basket_item_id =
                  created_transaction_basket_item.id;
                mf_redemption_plan.state = 'created';
                mf_redemption_plan.frequency =
                  transaction_basket_item.frequency;
                mf_redemption_plan.installment_day =
                  transaction_basket_item.installment_day;
                mf_redemption_plan.auto_generate_installments = true;
                mf_redemption_plan.remaining_installments =
                  transaction_basket_item.number_of_installments;
                mf_redemption_plan.number_of_installments =
                  transaction_basket_item.number_of_installments;
                mf_redemption_plan.folio_number =
                  transaction_basket_item.folio_number;
                const currentDate = moment();
                // mf_redemption_plan.start_date = currentDate.format('YYYY-MM-DD');
                let startdate;

                if (transaction_basket_item.generate_first_installment_now) {
                  mf_redemption_plan.start_date = this.calculateStartDate(
                    transaction_basket_item.installment_day,
                  );
                  // mf_redemption_plan.start_date = this.calculateStartDate(date);
                  mf_redemption_plan.next_installment_date =
                    NextInstallmentDate(
                      transaction_basket_item.frequency,
                      transaction_basket_item.installment_day,
                      transaction_basket_item.generate_first_installment_now,
                    );
                  console.log('start_datessss', mf_redemption_plan.start_date);
                } else {
                  startdate = moment(
                    NextInstallmentDate(
                      transaction_basket_item.frequency,
                      transaction_basket_item.installment_day,
                      transaction_basket_item.generate_first_installment_now,
                    ),
                  ).toDate();
                  mf_redemption_plan.start_date = startdate;
                  mf_redemption_plan.next_installment_date =
                    NextInstallmentDate(
                      transaction_basket_item.frequency,
                      transaction_basket_item.installment_day,
                      transaction_basket_item.generate_first_installment_now,
                    );
                  console.log('start_dateeeee', mf_redemption_plan.start_date);
                }
                let moment_frequency: any = 'months';
                let no_of_installments: number =
                  transaction_basket_item.number_of_installments;
                if (mf_redemption_plan.frequency == 'daily') {
                  moment_frequency = 'days';
                  no_of_installments =
                    transaction_basket_item.number_of_installments;
                } else if (mf_redemption_plan.frequency == 'day_in_a_week') {
                  moment_frequency = 'weeks';
                  no_of_installments =
                    transaction_basket_item.number_of_installments;
                } else if (mf_redemption_plan.frequency == 'monthly') {
                  moment_frequency = 'months';
                  no_of_installments =
                    transaction_basket_item.number_of_installments;
                } else if (mf_redemption_plan.frequency == 'quaterly') {
                  moment_frequency = 'months';
                  no_of_installments =
                    transaction_basket_item.number_of_installments * 4;
                } else if (mf_redemption_plan.frequency == 'half-yearly') {
                  moment_frequency = 'months';
                  no_of_installments =
                    transaction_basket_item.number_of_installments * 2;
                } else if (mf_redemption_plan.frequency == 'yearly') {
                  moment_frequency = 'years';
                  no_of_installments =
                    transaction_basket_item.number_of_installments;
                }

                // mf_redemption_plan.end_date = currentDate.add(no_of_installments, moment_frequency).format('YYYY-MM-DD');
                if (transaction_basket_item.generate_first_installment_now) {
                  mf_redemption_plan.end_date = moment(
                    currentDate
                      .add(no_of_installments, moment_frequency)
                      .format('YYYY-MM-DD'),
                  ).toDate();
                  console.log('end_dateeeee', mf_redemption_plan.end_date);
                } else {
                  mf_redemption_plan.end_date = moment(startdate)
                    .add(no_of_installments, moment_frequency)
                    .toDate();
                  console.log(
                    'end_datehjfvwkasgc',
                    mf_redemption_plan.end_date,
                  );
                }
                mf_redemption_plan.folio_number =
                  transaction_basket_item.folio_number;
                // mf_redemption_plan.next_installment_date = currentDate.add(1,moment_frequency).format('YYYY-MM-DD');
                mf_redemption_plan.amount = transaction_basket_item.amount;
                mf_redemption_plan.activated_at = new Date();
                mf_redemption_plan.gateway = 'rta';
                mf_redemption_plan = await this.mfRedemptionPlanRepository.save(
                  mf_redemption_plan,
                );

                //BSE Data
                // console.log('swp')
                // let register_swp = new RegisterSwpDto()
                // let fund_detail: any = await this.get_mf_fund_details(transaction_basket_item.fund_isin)
                // console.log("fund", fund_detail)
                // let amc = await this.amcRepository.findOne({ where: { amcId: fund_detail.amcId } })
                // console.log("amc", amc)
                // let frequency = await this.bseFrequencyRepo.findOne({ where: { description: transaction_basket_item.frequency } })
                // let freq_code = frequency.code;
                // let mandate = await this.mandatesRepository.findOne({ where: { mandate_id: transaction_basket_item.payment_source } })
                // let info = new OrderInfoDto();
                // info.src = 'swp';
                // let mem = new MemDetailsDTO()
                // mem.euin_flag = false
                // info.mem_details = mem

                // // let investor= new InvestorDTO();
                // // investor.ucc='1002100031';
                // register_swp.sxp_type = 'swp';
                // register_swp.mem_ord_ref_id = `milessw_sip_${created_transaction_basket_item.id}`;
                // // register_swp.ucc = '1002100031';
                // register_swp.ucc = onboardingDetails.fp_investment_account_id;
                // console.log("ucc", register_swp.ucc)
                // register_swp.member = '0103';
                // register_swp.src_scheme = transaction_basket_item.fund_isin
                // register_swp.amc_code = amc.rta_amc_code
                // register_swp.amount = transaction_basket_item.amount;
                // register_swp.cur = 'INR';
                // register_swp.src_folio = transaction_basket_item.folio_number;
                // register_swp.phys_or_demat = 'P';
                // register_swp.isunits = false;
                // register_swp.dpc = true;
                // register_swp.start_date = new Date();
                // register_swp.end_date = new Date();
                // register_swp.freq = freq_code;
                // register_swp.txn_date = transaction_basket_item.installment_day;
                // register_swp.payment_ref_id = '1';
                // register_swp.holder = [];
                // // register_swp.info.mem_details.euin_flag = false;
                // // register_swp.info.mem_details.euin = '';
                // // register_swp.depository_acct ={
                // //     depository: "string",
                // //     dp_id: "string",
                // //     client_id: "string"
                // // };
                // register_swp.bank_acct = {
                //     ifsc: "UTIB0000004",
                //     no: "6986598569865",
                //     type: "SB",
                //     name: "SELF"
                // };
                // register_swp.remark = '';
                // register_swp.email = user.email;
                // register_swp.mobnum = user.mobile;
                // register_swp.first_order_today = true;
                // register_swp.brokerage = transaction_basket_item.amount * 0.01;
                // register_swp.ninstallments = transaction_basket_item.number_of_installments;

                // let swp_registered = await this.bseService.register_swp(register_swp)

                // swp_registered=await this.mfRedemptionPlanRepository.save(swp_registered)

                // let swp_registered_save = new MfRedemptionPlan()
                // swp_registered_save.sxp_type = 'swp';
                // swp_registered_save.mem_ord_ref_id = register_swp.mem_ord_ref_id;
                // swp_registered_save.ucc = register_swp.ucc;
                // // swp_registered_save.ucc = '1002100031';
                // swp_registered_save.member = '0103';
                // swp_registered_save.scheme = transaction_basket_item.fund_isin
                // swp_registered_save.amc_code = amc.rta_amc_code
                // swp_registered_save.amount = transaction_basket_item.amount;
                // swp_registered_save.cur = 'INR';
                // swp_registered_save.folio_number = transaction_basket_item.folio_number;
                // swp_registered_save.phys_or_demat = 'P';
                // swp_registered_save.isunits = false;
                // swp_registered_save.dpc = true;
                // swp_registered_save.start_date = new Date();
                // swp_registered_save.end_date = new Date();
                // swp_registered_save.frequency = transaction_basket_item.frequency;
                // swp_registered_save.installment_day = transaction_basket_item.installment_day;
                // swp_registered_save.payment_ref_id = '1';
                // swp_registered_save.euin_flag = true;
                // swp_registered_save.euin = '';
                // swp_registered_save.remark = '';
                // swp_registered_save.first_order_today = true;
                // swp_registered_save.brokerage = transaction_basket_item.amount * 0.01;
                // swp_registered_save.number_of_installments = transaction_basket_item.number_of_installments;
                // swp_registered_save.swp_register_id = swp_registered.data.id;
                // swp_registered_save = await this.mfRedemptionPlanRepository.save(swp_registered_save)

                // let order_swp = new OrderNewPurchaseDTO();
                // order_swp.type = 'R';
                // order_swp.mem_ord_ref_id = `milessw_sip_${created_transaction_basket_item.id}`;
                // order_swp.investor.ucc = onboardingDetails.fp_investment_account_id;
                // // order_swp.investor.ucc = '1002100031';
                // order_swp.member = '0103';
                // order_swp.scheme = transaction_basket_item.fund_isin
                // order_swp.amount = transaction_basket_item.amount;
                // order_swp.cur = 'INR';
                // order_swp.is_units = false;
                // order_swp.all_units = false;
                // order_swp.folio = transaction_basket_item.folio_number;
                // order_swp.phys_or_demat = "P";
                // order_swp.payment_ref_id = '';
                // order_swp.info.src = 'swp';
                // order_swp.info.mem_details.euin_flag = true;
                // order_swp.info.mem_details.euin = '';
                // order_swp.email = user.email;
                // order_swp.mobnum = user.mobile;
                // order_swp.exch_mandate_id = parseInt(mandate.mandate_id)
                // order_swp.kyc_passed = true;
                // // order_swp.depository_acct ={
                // //     depository: "string",
                // //     dp_id: "string",
                // //     client_id: "string"
                // // };
                // order_swp.bank_acct = {
                //     ifsc: "UTIB0000004",
                //     no: "6986598569865",
                //     type: "SB",
                //     name: "SELF"
                // };
                // order_swp.dpc = true;
                // order_swp.nomination = [];

                // let swp_order = await this.bseService.create_order_purchase(order_swp);

                // // let swp_ordered = await this.redemptionRepository.save(swp_order);

                // let swp_order_save = new Redemption();
                // swp_order_save.type = 'R';
                // swp_order_save.mem_ord_ref_id = order_swp.mem_ord_ref_id;
                // // swp_order_save.ucc = '1002100031';
                // swp_order_save.ucc = order_swp.investor.ucc;
                // swp_order_save.member = '0103';
                // swp_order_save.scheme = transaction_basket_item.fund_isin
                // swp_order_save.amount = transaction_basket_item.amount;
                // swp_order_save.cur = 'INR';
                // swp_order_save.is_units = false;
                // swp_order_save.all_units = false;
                // swp_order_save.folio_number = transaction_basket_item.folio_number;
                // swp_order_save.phys_or_demat = "P";
                // swp_order_save.payment_ref_id = '';
                // swp_order_save.info_src = 'swp';
                // swp_order_save.euin_flag = true;
                // swp_order_save.euin = '';
                // swp_order_save.exch_mandate_id = order_swp.exch_mandate_id
                // swp_order_save.kyc_passed = true;
                // swp_order_save.dpc = true;
                // swp_order_save.swp_order_id = swp_order.data.items.id
                // let swp_ordered = await this.redemptionRepository.save(swp_order_save);
                break;
              }
              case 'switch_fund': {
                const fp_switch_fund_dto = new FpSwitchFundDTO();
                fp_switch_fund_dto.amount = transaction_basket_item.amount;
                if (transaction_basket_item.folio_number) {
                  fp_switch_fund_dto.folio_number =
                    transaction_basket_item.folio_number;
                }
                fp_switch_fund_dto.user_ip = ip;
                fp_switch_fund_dto.switch_out_scheme =
                  transaction_basket_item.fund_isin;
                fp_switch_fund_dto.switch_in_scheme =
                  transaction_basket_item.to_fund_isin;

                fp_switch_fund_dto.server_ip = server_ip;
                // fp_switch_fund_dto.mf_investment_account = onboardingDetails.fp_investment_account_id;
                // let fp_create_switch = await this.fintechService.create_switch(fp_switch_fund_dto);
                // if (fp_create_switch.status == HttpStatus.OK) {
                transaction_basket_item.transaction_basket_id =
                  transaction_basket.id;
                transaction_basket_item.status = 'pending';
                transaction_basket_item.user_id = transaction_basket.user_id;
                const created_transaction_basket_item =
                  await this.transactionBasketItemRepository.save(
                    transaction_basket_item,
                  );

                let switch_fund = new SwitchFunds();
                // fp_create_switch.data["fp_id"] = fp_create_switch.data.id;
                // fp_create_switch.data["user_id"] = transaction_basket_item.user_id;

                // fp_create_switch.data["transaction_basket_item_id"] = created_transaction_basket_item.id;
                // console.log("TRANDSACTION OBJ", fp_create_switch);
                // delete fp_create_switch.data.id;
                switch_fund.user_id = transaction_basket_item.user_id;
                switch_fund.transaction_basket_item_id =
                  created_transaction_basket_item.id;
                switch_fund.state = 'pending';
                switch_fund.amount = created_transaction_basket_item.amount;
                switch_fund.units = created_transaction_basket_item.units;
                switch_fund.switch_out_scheme =
                  created_transaction_basket_item.fund_isin;
                switch_fund.switch_in_scheme =
                  created_transaction_basket_item.to_fund_isin;
                switch_fund.gateway = 'rta';
                switch_fund.initiated_by = 'investor';
                switch_fund.initiated_via = 'web';
                switch_fund.folio_number =
                  created_transaction_basket_item.folio_number;

                switch_fund.server_ip = server_ip;
                switch_fund.user_ip = ip;

                switch_fund = await this.switchRepository.save(switch_fund);

                // transaction_basket.payment_id = mandate.mandate_id
                await this.transactionBasketRepository.save(transaction_basket);
                // // } else {
                // //     transaction_basket_item.transaction_basket_id = transaction_basket.id;
                // //     transaction_basket_item.user_id = transaction_basket.user_id;
                // //     transaction_basket_item.status = "failed";
                // //     transaction_basket_item.response_message = fp_create_switch.error;
                // //     transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);
                // // }

                //BSE Data
                // let register_stp = new RegisterStpDto()
                // let fund_detail: any = await this.get_mf_fund_details(transaction_basket_item.fund_isin)
                // let amc = await this.amcRepository.findOne({ where: { amcId: fund_detail.data.amcId } })

                // let frequency = await this.bseFrequencyRepo.findOne({ where: { bse_frequency: transaction_basket_item.frequency } })
                // let freq_code = frequency.bse_frequency_code;

                // register_stp.sxp_type = 'stp';
                // register_stp.mem_ord_ref_id = '';
                // register_stp.ucc =;
                // register_stp.member = '';
                // register_stp.src_scheme = transaction_basket_item.fund_isin
                // register_stp.dest_scheme = '';
                // register_stp.amc_code = amc.rta_amc_code
                // register_stp.amount = transaction_basket_item.amount;
                // register_stp.cur = 'INR';
                // register_stp.src_folio = transaction_basket_item.folio_number;
                // register_stp.dest_folio = '';
                // register_stp.phys_or_demat = 'P';
                // register_stp.isunits = false;
                // register_stp.dpc = true;
                // register_stp.start_date =;
                // register_stp.end_date =;
                // register_stp.freq = freq_code;
                // register_stp.txn_date = transaction_basket_item.installment_day;
                // register_stp.payment_ref_id = '1';
                // register_stp.info.mem_details.euin_flag = true;
                // register_stp.info.mem_details.euin = '';
                // register_stp.depository_acct = 'stp';
                // register_stp.bank_acct = 'stp';
                // register_stp.remark = '';
                // register_stp.email = user.email;
                // register_stp.mobnum = user.mobile;
                // register_stp.first_order_today = true;
                // // register_stp.brokerage=transaction_basket_item.amount*0.01;
                // register_stp.ninstallments = transaction_basket_item.number_of_installments;

                // let stp_registered = await this.bseService.register_stp(register_stp)
                // // stp_registered=await this.mfSwitchPlanRepository.save(stp_registered)

                // let investor = new InvestorDTO()
                // investor.ucc = '1002100031'
                // // let mandate = await this.mandatesRepository.findOne({ where: { mandate_id: transaction_basket_item.payment_source } })
                // let info = new OrderInfoDto()
                // info.src = 'stp'

                // let mem = new MemDetailsDTO()
                // mem.euin_flag = false
                // info.mem_details = mem
                // let order_stp = new OrderNewPurchaseDTO();
                // order_stp.type = 'S';
                // order_stp.mem_ord_ref_id = `milessw_sip_${created_transaction_basket_item.id}`;
                // // order_stp.investor = investor;
                // order_stp.investor.ucc = onboardingDetails.fp_investor_id;
                // order_stp.member = '0103';
                // order_stp.scheme = transaction_basket_item.fund_isin
                // order_stp.dst_scheme = transaction_basket_item.to_fund_isin
                // order_stp.amount = transaction_basket_item.amount;
                // order_stp.cur = 'INR';
                // order_stp.is_units = false;
                // order_stp.all_units = false;
                // order_stp.folio = transaction_basket_item.folio_number;
                // order_stp.phys_or_demat = "P";
                // order_stp.payment_ref_id = '';
                // order_stp.info = info;
                // order_stp.info.reg_no = '';
                // order_stp.info.mem_details = mem;
                // order_stp.info.mem_details.euin = '';
                // order_stp.email = user.email;
                // order_stp.mobnum = user.mobile;
                // order_stp.exch_mandate_id = parseInt(mandate.mandate_id)
                // order_stp.kyc_passed = true;
                // // order_stp.depository_acct ={
                // //     depository: "string",
                // //     dp_id: "string",
                // //     client_id: "string"
                // // };
                // order_stp.bank_acct = {
                //     ifsc: "UTIB0000004",
                //     no: "6986598569865",
                //     type: "SB",
                //     name: "SELF"
                // };
                // order_stp.dpc = true;
                // order_stp.nomination = [];

                // let stp_order = await this.bseService.create_order_purchase(order_stp);
                // console.log("stp_order", stp_order)
                // // let stp_ordered = await this.switchRepository.save(stp_order);

                // let stp_ordered_save = new SwitchFunds()
                // stp_ordered_save.type = 'S';
                // stp_ordered_save.mem_ord_ref_id = order_stp.mem_ord_ref_id;
                // stp_ordered_save.ucc = order_stp.investor.ucc;
                // // stp_ordered_save.ucc = '1002100031';
                // stp_ordered_save.member = '0103';
                // stp_ordered_save.switch_out_scheme = transaction_basket_item.fund_isin
                // stp_ordered_save.switch_in_scheme = transaction_basket_item.to_fund_isin
                // stp_ordered_save.amount = transaction_basket_item.amount;
                // stp_ordered_save.cur = 'INR';
                // stp_ordered_save.is_units = false;
                // stp_ordered_save.all_units = false;
                // stp_ordered_save.folio_number = transaction_basket_item.folio_number;
                // stp_ordered_save.phys_or_demat = "P";
                // stp_ordered_save.payment_ref_id = '';
                // stp_ordered_save.info_src = 'stp';
                // stp_ordered_save.reg_no = '';
                // stp_ordered_save.euin_flag = true;
                // stp_ordered_save.euin = '';
                // stp_ordered_save.exch_mandate_id = order_stp.exch_mandate_id
                // stp_ordered_save.kyc_passed = true;
                // stp_ordered_save.dpc = true;
                // stp_ordered_save.stp_order_id = stp_order.data.items.id
                // let stp_ordered = await this.switchRepository.save(stp_ordered_save);
                break;
              }
              case 'stp': {
                //FOR STP we create FP Order ONLY after CONSENT
                let start_date, next_installment_date;
                const today = new Date();
                const date = today.getDate();
                console.log('date', date);
                const difference =
                  transaction_basket_item.installment_day - date;
                // if (difference <= 6) {
                //     return { status: HttpStatus.BAD_REQUEST, error: "START DATE SHOULD BE ATLEAST 6 WORKING DAYS LATER THAN REGISTRATION DATE" }
                // }
                transaction_basket_item.transaction_basket_id =
                  transaction_basket.id;
                transaction_basket_item.user_id = transaction_basket.user_id;
                transaction_basket_item.status = 'pending';
                let created_transaction_basket_item =
                  await this.transactionBasketItemRepository.save(
                    transaction_basket_item,
                  );
                transaction_basket_item.number_of_installments =
                  transaction_basket_item.number_of_installments
                    ? transaction_basket_item.number_of_installments
                    : 50;
                if (transaction_basket_item.generate_first_installment_now) {
                  start_date = await this.calculateStartDate(
                    transaction_basket_item.installment_day,
                  );
                  next_installment_date = NextInstallmentDate(
                    transaction_basket_item.frequency,
                    transaction_basket_item.installment_day,
                    transaction_basket_item.generate_first_installment_now,
                  );
                } else {
                  start_date = NextInstallmentDate(
                    transaction_basket_item.frequency,
                    transaction_basket_item.installment_day,
                    transaction_basket_item.generate_first_installment_now,
                  );
                  next_installment_date = NextInstallmentDate(
                    transaction_basket_item.frequency,
                    transaction_basket_item.installment_day,
                    transaction_basket_item.generate_first_installment_now,
                  );
                }
                created_transaction_basket_item.start_date = start_date;
                created_transaction_basket_item.next_installment_date =
                  next_installment_date;
                created_transaction_basket_item =
                  await this.transactionBasketItemRepository.save(
                    created_transaction_basket_item,
                  );

                // transaction_basket.payment_id = mandate.mandate_id
                await this.transactionBasketRepository.save(transaction_basket);

                let mf_switch_plan = new MfSwitchPlan();
                mf_switch_plan.user_id = user.id;
                mf_switch_plan.user_ip = ip;
                mf_switch_plan.folio_number =
                  transaction_basket_item.folio_number;
                mf_switch_plan.server_ip = server_ip;
                mf_switch_plan.switch_in_scheme =
                  transaction_basket_item.to_fund_isin;
                mf_switch_plan.switch_out_scheme =
                  transaction_basket_item.fund_isin;
                mf_switch_plan.transaction_basket_item_id =
                  created_transaction_basket_item.id;
                mf_switch_plan.state = 'created';
                mf_switch_plan.frequency = transaction_basket_item.frequency;
                mf_switch_plan.installment_day =
                  transaction_basket_item.installment_day;
                mf_switch_plan.auto_generate_installments = true;
                mf_switch_plan.remaining_installments =
                  transaction_basket_item.number_of_installments;
                mf_switch_plan.number_of_installments =
                  transaction_basket_item.number_of_installments;

                const currentDate = moment();
                // mf_switch_plan.start_date = currentDate.format('YYYY-MM-DD');
                let startdate;
                if (transaction_basket_item.generate_first_installment_now) {
                  mf_switch_plan.start_date = this.calculateStartDate(
                    transaction_basket_item.installment_day,
                  );
                  // mf_switch_plan.start_date = this.calculateStartDate(date);
                  mf_switch_plan.next_installment_date = NextInstallmentDate(
                    transaction_basket_item.frequency,
                    transaction_basket_item.installment_day,
                    transaction_basket_item.generate_first_installment_now,
                  );
                  console.log('start_datessss', mf_switch_plan.start_date);
                } else {
                  startdate = moment(
                    NextInstallmentDate(
                      transaction_basket_item.frequency,
                      transaction_basket_item.installment_day,
                      transaction_basket_item.generate_first_installment_now,
                    ),
                  ).toDate();
                  mf_switch_plan.start_date = startdate;
                  mf_switch_plan.next_installment_date = NextInstallmentDate(
                    transaction_basket_item.frequency,
                    transaction_basket_item.installment_day,
                    transaction_basket_item.generate_first_installment_now,
                  );
                  console.log('start_dateeeee', mf_switch_plan.start_date);
                }

                let moment_frequency: any = 'months';
                let no_of_installments: number =
                  transaction_basket_item.number_of_installments;
                if (mf_switch_plan.frequency == 'daily') {
                  moment_frequency = 'days';
                  no_of_installments =
                    transaction_basket_item.number_of_installments;
                } else if (mf_switch_plan.frequency == 'day_in_a_week') {
                  moment_frequency = 'weeks';
                  no_of_installments =
                    transaction_basket_item.number_of_installments;
                } else if (mf_switch_plan.frequency == 'monthly') {
                  moment_frequency = 'months';
                  no_of_installments =
                    transaction_basket_item.number_of_installments;
                } else if (mf_switch_plan.frequency == 'quaterly') {
                  moment_frequency = 'months';
                  no_of_installments =
                    transaction_basket_item.number_of_installments * 4;
                } else if (mf_switch_plan.frequency == 'half-yearly') {
                  moment_frequency = 'months';
                  no_of_installments =
                    transaction_basket_item.number_of_installments * 2;
                } else if (mf_switch_plan.frequency == 'yearly') {
                  moment_frequency = 'years';
                  no_of_installments =
                    transaction_basket_item.number_of_installments;
                }

                // mf_switch_plan.end_date = currentDate.add(no_of_installments, moment_frequency).format('YYYY-MM-DD');

                if (transaction_basket_item.generate_first_installment_now) {
                  mf_switch_plan.end_date = moment(
                    currentDate
                      .add(no_of_installments, moment_frequency)
                      .format('YYYY-MM-DD'),
                  ).toDate();
                  console.log('end_dateeeee', mf_switch_plan.end_date);
                } else {
                  mf_switch_plan.end_date = moment(startdate)
                    .add(no_of_installments, moment_frequency)
                    .toDate();
                  console.log('end_datehjfvwkasgc', mf_switch_plan.end_date);
                }

                // mf_switch_plan.next_installment_date = currentDate.add(1,moment_frequency).format('YYYY-MM-DD');
                mf_switch_plan.amount = transaction_basket_item.amount;
                mf_switch_plan.activated_at = new Date();
                mf_switch_plan.gateway = 'rta';
                mf_switch_plan = await this.mfSwitchPlanRepository.save(
                  mf_switch_plan,
                );

                // let register_stp = new RegisterStpDto()
                // let fund_detail: any = await this.get_mf_fund_details(transaction_basket_item.fund_isin)
                // console.log("fund", fund_detail)
                // let amc = await this.amcRepository.findOne({ where: { amcId: fund_detail.amcId } })
                // console.log("amc", amc)

                // let frequency = await this.bseFrequencyRepo.findOne({ where: { description: transaction_basket_item.frequency } })
                // let freq_code = frequency.code;
                // let mandate = await this.mandatesRepository.findOne({ where: { mandate_id: transaction_basket_item.payment_source } })
                // let mem = new MemDetailsDTO()
                // mem.euin_flag = false
                // register_stp.sxp_type = 'stp';
                // register_stp.mem_ord_ref_id = `milessw_sip_${created_transaction_basket_item.id}`;
                // register_stp.ucc = onboardingDetails.fp_investment_account_id;
                // // register_stp.ucc = '1002100031';
                // register_stp.member = this.member;
                // // register_stp.member = '0103';
                // register_stp.src_scheme = transaction_basket_item.fund_isin
                // register_stp.dest_scheme = transaction_basket_item.to_fund_isin;
                // register_stp.amc_code = amc.rta_amc_code
                // register_stp.amount = transaction_basket_item.amount;
                // register_stp.cur = 'INR';
                // register_stp.src_folio = transaction_basket_item.folio_number;
                // register_stp.dest_folio = '';
                // register_stp.phys_or_demat = 'P';
                // register_stp.isunits = false;
                // register_stp.dpc = true;
                // register_stp.start_date = new Date();
                // register_stp.end_date = new Date();
                // register_stp.freq = freq_code;
                // register_stp.txn_date = transaction_basket_item.installment_day;
                // register_stp.payment_ref_id = '1';
                // // register_stp.info.mem_details = mem;
                // // register_stp.info.mem_details.euin = '';
                // // register_stp.depository_acct = {
                // //     depository: "string",
                // //     dp_id: "string",
                // //     client_id: "string"
                // // } ;
                // register_stp.bank_acct = {
                //     ifsc: "UTIB0000004",
                //     no: "6986598569865",
                //     type: "SB",
                //     name: "SELF"
                // };
                // register_stp.remark = '';
                // register_stp.email = user.email;
                // register_stp.mobnum = user.mobile;
                // register_stp.first_order_today = true;
                // // register_stp.brokerage=transaction_basket_item.amount*0.01;
                // register_stp.ninstallments = transaction_basket_item.number_of_installments;
                // let stp_registered = await this.bseService.register_stp(register_stp)
                // console.log("registered_stp", stp_registered)
                // // stp_registered=await this.mfSwitchPlanRepository.save(stp_registered)

                // let stp_registered_save = new MfSwitchPlan()
                // stp_registered_save.sxp_type = 'stp';
                // stp_registered_save.mem_ord_ref_id = register_stp.mem_ord_ref_id;
                // // stp_registered_save.ucc = '1002100031';
                // stp_registered_save.ucc = register_stp.ucc;
                // stp_registered_save.member = '0103';
                // stp_registered_save.switch_out_scheme = "INF179KA1RT1";
                // // stp_registered_save.switch_out_scheme = transaction_basket_item.fund_isin;
                // stp_registered_save.switch_in_scheme = "INF179KA1RT1";
                // stp_registered_save.amc_code = amc.rta_amc_code
                // stp_registered_save.amount = transaction_basket_item.amount;
                // stp_registered_save.cur = 'INR';
                // stp_registered_save.folio_number = transaction_basket_item.folio_number;
                // stp_registered_save.dest_folio = '';
                // stp_registered_save.phys_or_demat = 'P';
                // stp_registered_save.isunits = false;
                // stp_registered_save.dpc = true;
                // stp_registered_save.start_date = new Date();
                // stp_registered_save.end_date = new Date();
                // stp_registered_save.frequency = transaction_basket_item.frequency;
                // stp_registered_save.installment_day = transaction_basket_item.installment_day;
                // stp_registered_save.payment_ref_id = '1';
                // stp_registered_save.euin_flag = true;
                // stp_registered_save.euin = '';
                // stp_registered_save.remark = '';
                // stp_registered_save.first_order_today = true;
                // stp_registered_save.brokerage = transaction_basket_item.amount * 0.01;
                // stp_registered_save.number_of_installments = transaction_basket_item.number_of_installments;
                // stp_registered_save.stp_register_id = stp_registered.data.id
                // stp_registered_save = await this.mfSwitchPlanRepository.save(stp_registered_save)

                // // let investor= new InvestorDTO()
                // // investor.ucc='1002100031'

                // let info = new OrderInfoDto()
                // info.src = 'stp'
                // mem.euin_flag = false
                // let order_stp = new OrderNewPurchaseDTO();
                // order_stp.type = 'S';
                // order_stp.mem_ord_ref_id = `milessw_sip_${created_transaction_basket_item.id}`;
                // // order_stp.investor= investor;
                // order_stp.investor.ucc = onboardingDetails.fp_investment_account_id;
                // order_stp.member = this.member;
                // // order_stp.member = '0103';
                // order_stp.scheme = transaction_basket_item.fund_isin
                // order_stp.dst_scheme = transaction_basket_item.to_fund_isin
                // order_stp.amount = transaction_basket_item.amount;
                // order_stp.cur = 'INR';
                // // order_stp.is_units = false;
                // // order_stp.all_units = false;
                // order_stp.folio = transaction_basket_item.folio_number;
                // order_stp.phys_or_demat = "P";
                // // order_stp.payment_ref_id = '';
                // order_stp.info = info
                // // order_stp.info.reg_no = '';
                // order_stp.info.mem_details = mem;
                // // order_stp.info.mem_details.euin = '';
                // order_stp.email = user.email;
                // order_stp.mobnum = user.mobile;
                // order_stp.exch_mandate_id = parseInt(mandate.mandate_id)
                // order_stp.kyc_passed = true;
                // // order_stp.depository_acct ={
                // //     depository: "string",
                // //     dp_id: "string",
                // //     client_id: "string"
                // // };
                // order_stp.bank_acct = {
                //     ifsc: user_bank.ifsc_code,
                //     no: user_bank.account_number,
                //     type: user_bank.account_type,
                //     name: user_bank.account_holder_name
                // };
                // // order_stp.bank_acct ={
                // //     ifsc: "UTIB0000004",
                // //     no: "6986598569865",
                // //     type: "SB",
                // //     name: "SELF"
                // // };
                // order_stp.dpc = true;
                // order_stp.nomination = [];

                // let stp_order = await this.bseService.create_order_purchase(order_stp);
                // // let stp_ordered = await this.switchRepository.save(stp_order);
                // console.log("stp_order", stp_order)
                // let stp_ordered_save = new SwitchFunds()
                // stp_ordered_save.type = 'S';
                // stp_ordered_save.mem_ord_ref_id = order_stp.mem_ord_ref_id;
                // // stp_ordered_save.ucc = '1002100031';
                // stp_ordered_save.ucc = order_stp.investor.ucc;
                // stp_ordered_save.member = this.member;
                // stp_ordered_save.switch_out_scheme = transaction_basket_item.fund_isin
                // stp_ordered_save.switch_in_scheme = transaction_basket_item.to_fund_isin
                // stp_ordered_save.amount = transaction_basket_item.amount;
                // stp_ordered_save.cur = 'INR';
                // // stp_ordered_save.is_units = false;
                // // stp_ordered_save.all_units = false;
                // stp_ordered_save.folio_number = transaction_basket_item.folio_number;
                // stp_ordered_save.phys_or_demat = "P";
                // // stp_ordered_save.payment_ref_id = '';
                // stp_ordered_save.info_src = 'stp';
                // // stp_ordered_save.reg_no = '';
                // // stp_ordered_save.euin_flag = true;
                // // stp_ordered_save.euin = '';
                // stp_ordered_save.exch_mandate_id = order_stp.exch_mandate_id
                // stp_ordered_save.kyc_passed = true;
                // stp_ordered_save.dpc = true;
                // stp_ordered_save.stp_order_id = stp_order.data.items.id
                // let stp_ordered = await this.switchRepository.save(stp_ordered_save);
                break;
              }
              default: {
                //statements;
                //    transaction_basket_items_response['']
                transaction_basket_item.transaction_basket_id =
                  transaction_basket.id;
                transaction_basket_item.user_id = transaction_basket.user_id;
                transaction_basket_item.status = 'failed';
                transaction_basket_item.response_message =
                  'No transaction type recognised as ' +
                  transaction_basket_item.transaction_type;
                transaction_basket_item =
                  await this.transactionBasketItemRepository.save(
                    transaction_basket_item,
                  );

                break;
              }
            }
          }

          const results = await this.transactionBasketRepository.findOne({
            where: { id: transaction_basket.id },
            relations: ['transaction_basket_items'],
          });
          results.transaction_basket_items =
            results.transaction_basket_items.map((transaction_basket_item) => {
              if (transaction_basket_item.is_payment) {
                return transaction_basket_item;
              }
            });

          return { status: HttpStatus.OK, data: results };
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Please complete the onboarding account creation.',
          };
        }
      } else {
        return {
          status: HttpStatus.NOT_FOUND,
          message:
            'Sorry no funds sent in the request, please add funds to the request',
        };
      }
    } catch (err) {
      console.log('Errr', err);
      return { status: HttpStatus.BAD_REQUEST, message: err.message };
    }
  }

  async generateBasketConsent(
    tenant_id,
    transaction_basket_id: number,
    type: string,
    user: Users,
  ) {
    try {
      let fund_details;
      user = await this.userRepository.findOneBy({ id: user.id });
      console.log('user', user);
      const user_onboarding = await this.userOnboardingDetailRepository.findOne(
        {
          where: { user_id: user.id },
        },
      );
      console.log('onb', user_onboarding);
      const transaction_basket = await this.transactionBasketRepository.findOne(
        {
          where: { id: transaction_basket_id },
          relations: ['transaction_basket_items'],
        },
      );
      const model_portfolio = await this.modelPortfolioRepository.findOne({
        where: { id: transaction_basket.model_portfolio_id },
      });
      if (transaction_basket) {
        const transaction_basket_items =
          await this.transactionBasketItemRepository.find({
            where: {
              transaction_basket_id: transaction_basket.id,
              status: Not('failed'),
            },
          });
        console.log('transaction_basket_items', transaction_basket_items);

        const isins: string[] = [
          ...new Set(transaction_basket_items.map((items) => items.fund_isin)),
        ];
        console.log('isins', isins);
        const fundData = await this.mutualFundService.findFundsByIsins(isins);
        console.log('fundData', fundData);
        if (fundData.data.length == 0) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'No such fund is available',
          };
        }
        const fund = fundData.data;
        console.log('jadbkajbdjd', fund);
        const fundNames = fund.map((item) => item.shortName);
        console.log('sjjndkjasl', fundNames);

        // Handling the last element separately
        // const lastFundName = fundNames.pop();
        let fundNamesJoined, lastFundName;

        if (fundNames.length === 1) {
          // If there's only one fund, directly assign it to fundNamesJoined
          fundNamesJoined = fundNames[0];
        } else if (fundNames.length > 1) {
          // If there are multiple funds, use the original logic
          lastFundName = fundNames.pop();
          fundNamesJoined =
            fundNames.join(', ') +
            (fundNames.length ? ', ' : '') +
            (lastFundName ? lastFundName + ' and' : '');
        } else {
          fundNamesJoined = '';
        }
        console.log('fundname', fundNames);
        console.log('lastF', lastFundName);
        console.log('fundNaJo', fundNamesJoined);
        let amount = 0;
        for (const item of transaction_basket_items) {
          const isin: any[] = [];
          console.log('transd', item);
          if (item.status != 'failed') {
            amount += item.amount;
            isin.push(item.fund_isin);
          }

          console.log('isin', isin);

          // let fundResponse = await this.mutualFundService.findFundsByIsins(isin)
          // console.log("dskdnsdkj", fundResponse)
          // if (fundResponse.data.length == 0) {
          //     return { "status": HttpStatus.BAD_REQUEST, "error": "No such fund is available" }
          // }
          // const fund = fundResponse.data
          // console.log("jadbkajbdjd", fund)
          // const fundNames = fund.map(item => item.shortName);
          // console.log("sjjndkjasl", fundNames)

          // // Handling the last element separately
          // const lastFundName = fundNames.pop();
          // let fundNamesJoined;

          // if (fundNames.length === 1) {
          //     // If there's only one fund, directly assign it to fundNamesJoined
          //     fundNamesJoined = fundNames[0];
          // } else {
          //     // If there are multiple funds, use the original logic
          //     const lastFundName = fundNames.pop();
          //     fundNamesJoined = fundNames.join(', ') + (fundNames.length ? ', ' : '') + (lastFundName ? lastFundName + ' and' : '');
          // }
          // console.log("fundname", fundNames)
          // console.log("lastF", lastFundName)
          // console.log("fundNaJo", fundNamesJoined)

          fund_details = await this.funddetailRepository.findOne({
            where: { isin: item.fund_isin },
          });
          console.log('fund', fund_details);
          console.log('fund', fund_details.rtaAgentCode);

          transaction_basket.otp = parseInt(generateOTP());

          if (item.folio_number) {
            if (fund_details.rtaAgentCode.toUpperCase() === 'CAMS') {
              console.log('funddetails', fund_details.amcSchemeCode);
              const amc_fund = fund.find((f) => f.isinCode === item.fund_isin);
              const amc = await this.amcRepository.findOne({
                where: { amcId: amc_fund.amcId },
              });
              const folio_number = item.folio_number.split('/')[0];
              //fund_details.amcSchemeCode, //"TH", //item.folio_number,//user_onboarding.pan, //"FSWPD9192K",
              const data = {
                amc: amc.rta_amc_code,
                application_id: this.cams_application_id,
                password: this.cams_password,
                folio: folio_number, //"27859129",
                pan: user_onboarding.pan, //"DIPPP6907R",
              };
              console.log('cams_body2fa', data);
              const cams_result = await this.camsService.fetch_user_mobile(
                data,
              );
              console.log('cams_result', cams_result);
              if (cams_result.data.Services.Details.Return_Code == 0) {
                if (
                  cams_result.data.Services.Details.Investor_Details[0].mobileno
                ) {
                  item.folio_mobile =
                    cams_result.data.Services.Details.Investor_Details[0].mobileno;
                  item.folio_email =
                    cams_result.data.Services.Details.Investor_Details[0].email;

                  await this.transactionBasketItemRepository.save(item);
                  // let send = await this.enablexService.hasEnablexSMS();
                  // console.log("sendenable", send)
                  // if (send) {
                  //     let data = await this.enablexService.findOneSms("enablex")
                  //     console.log("hi", data.keys_json)
                  //     let info = {
                  //         "var1": `${transaction_basket.otp}`,
                  //         "var2": `${transaction_basket.transaction_basket_items[0].transaction_type}`,
                  //         "var3": `${fundNamesJoined}`,
                  //         "var4": `${amount}`
                  //     }
                  //     console.log("info&&&", info)
                  //     this.enablexService.sendSMS(cams_result.data.Services.Details.Investor_Details[0].mobileno, data.keys_json.from, data.keys_json.campaign_id.service, data.keys_json.type, data.keys_json.template_id.otp_transaction, info)
                  // }
                }
              } //cams_result.data.Services.Details.Investor_Details[0].mobileno
              console.log(
                'cams_result_list',
                cams_result.data.Services.Details.Investor_Details,
              );
            } else if (fund_details.rtaAgentCode === 'KARVY') {
              const data = {
                amc: fund_details.amcSchemeCode,
                pan: user_onboarding.pan, // "DIPPP6907R"
                folio: item.folio_number,
              };
              console.log('karvy2fa', data);
              const encrypted = await this.karvyService.encrypt_2fa(data);
              console.log('encrypted', encrypted);
              const channel_2fa = await this.karvyService.channel_2fa(
                encrypted.data.encryptedData,
                encrypted.data.iv,
              );
              console.log('channel_2fa', channel_2fa);
              const decrypt = await this.karvyService.decrypt(
                channel_2fa.data.encryptedData,
                channel_2fa.data.iv,
              );
              console.log('decrypt', decrypt);
              if (decrypt.data.status == 'Y') {
                const mobile = decrypt.data.mobile;
                console.log('mobile information', mobile);
                // let sms = msg91.getSMS();
                item.folio_mobile = decrypt.data.mobile;
                item.folio_email = decrypt.data.email;
                await this.transactionBasketItemRepository.save(item);
                // let send = await this.enablexService.hasEnablexSMS();
                // console.log("sendenable", send)
                // if (send) {
                //     let data = await this.enablexService.findOneSms("enablex")
                //     console.log("hi", data.keys_json)
                //     let info = {
                //         "var1": `${transaction_basket.otp}`,
                //         "var2": `${transaction_basket.transaction_basket_items[0].transaction_type}`,
                //         "var3": `${fundNamesJoined}`,
                //         "var4": `${amount}`
                //     }
                //     console.log("info&&&", info)
                //     this.enablexService.sendSMS(mobile, data.keys_json.from, data.keys_json.campaign_id.service, data.keys_json.type, data.keys_json.template_id.otp_transaction, info)
                // }
              }
              // sms.send("651406ded6fc05537a399362", { 'mobile': "+91" + mobile, "otp": transaction_basket.otp.toString(), "amount": amount.toString() });
            }
          } else {
            // transaction_basket.consent_email = user.email;
            transaction_basket.consent_isd_code = '+91';
            transaction_basket.consent_mobile = user.mobile;
            item.folio_mobile = user.country_code + user.mobile;
            item.folio_email = user.email;
            await this.transactionBasketItemRepository.save(item);

            // let sms = msg91.getSMS();
            // let whatsapp = msg91.getWhatsApp();
            // transaction_basket.otp = 1111;//Math.floor(1000 + Math.random() * 9000);
            // let info = {
            //     "var1": `${transaction_basket.otp}`,
            //     "var2": `${transaction_basket.transaction_basket_items[0].transaction_type}`,
            //     "var3": `${fundNamesJoined}`,
            //     "var4": `${amount}`
            // }
            // let data = await this.enablexService.findOneSms("enablex")
            // this.enablexService.sendSMS(transaction_basket.consent_isd_code + transaction_basket.consent_mobile, data.keys_json.from, data.keys_json.campaign_id.service, data.keys_json.type, data.keys_json.template_id.otp_transaction, info)
            //transaction_basket.consent_mobile
          }
        }
        if (tenant_id == 'miles') {
          const send = await this.enablexService.hasEnablexSMS();
          console.log('sendenable', send);
          if (send) {
            const data = await this.enablexService.findOneSms('enablex');
            console.log('hi', data.keys_json);
            const info = {
              var1: `${transaction_basket.otp}`,
              var2: `${transaction_basket.transaction_basket_items[0].transaction_type}`,
              var3: `${fundNamesJoined}`,
              var4: `${amount}`,
            };
            if (transaction_basket_items.length > 1 && model_portfolio) {
              info.var3 = `${model_portfolio.name}`;
            }
            console.log('info&&&', info);
            let mobile =
              transaction_basket.consent_isd_code +
              transaction_basket.consent_mobile;
            if (transaction_basket_items[0].folio_mobile) {
              mobile = transaction_basket_items[0].folio_mobile;
            }
            this.enablexService.sendSMS(
              mobile,
              data.keys_json.from,
              data.keys_json.campaign_id.service,
              data.keys_json.type,
              data.keys_json.template_id.otp_transaction,
              info,
            );
          }
        } else {
          transaction_basket.otp = 1111;
          // sms.send("651406ded6fc05537a399362", { 'mobile': "+91" + user.mobile, "otp": transaction_basket.otp.toString(), "amount": amount.toString() });
        }

        // let amount = 0;
        // let isin: any[] = []
        // for (let transaction_basket_item of transaction_basket.transaction_basket_items) {
        //     console.log("transd", transaction_basket_item)
        //     if (transaction_basket_item.status != 'failed') {
        //         amount += transaction_basket_item.amount
        //         isin.push(transaction_basket_item.fund_isin)
        //     }
        // }
        // console.log("isin", isin)
        //
        // let fundResponse = await this.mutualFundService.findFundsByIsins(isin)
        // console.log("dskdnsdkj", fundResponse)
        // if (fundResponse.data.length == 0) {
        //     return { "status": HttpStatus.BAD_REQUEST, "error": "No such fund is available" }
        // }
        // const fund = fundResponse.data
        // console.log("jadbkajbdjd", fund)
        // const fundNames = fund.map(item => item.shortName);
        // console.log("sjjndkjasl", fundNames)

        // // Handling the last element separately
        // const lastFundName = fundNames.pop();
        // let fundNamesJoined;

        // if (fundNames.length === 1) {
        //     // If there's only one fund, directly assign it to fundNamesJoined
        //     fundNamesJoined = fundNames[0];
        // } else {
        //     // If there are multiple funds, use the original logic
        //     const lastFundName = fundNames.pop();
        //     fundNamesJoined = fundNames.join(', ') + (fundNames.length ? ', ' : '') + (lastFundName ? lastFundName + ' and' : '');
        // }
        // console.log("fundname", fundNames)
        // console.log("lastF", lastFundName)
        // console.log("fundNaJo", fundNamesJoined)

        // let send = await this.enablexService.hasEnablexSMS();
        // console.log("sendenable", send)
        // if (send) {
        //     let data = await this.enablexService.findOneSms("enablex")
        //     if (type != null) {
        //         if (type == "Risk Profile") {
        //             let risk_profile = await this.riskProfileRepositoyry.findOne({ where: { model_portfolio_id: transaction_basket.model_portfolio_id } })
        //             let info = {
        //                 "var1": `${transaction_basket.otp}`,
        //                 "var2": `${transaction_basket.transaction_basket_items[0].transaction_type}`,
        //                 "var3": `${risk_profile.name}`,
        //                 "var4": `${amount}`
        //             }

        //             console.log("risk", info)
        //             this.enablexService.sendSMS(user.mobile, data.keys_json.from, data.keys_json.campaign_id.service, data.keys_json.type, data.keys_json.template_id.risk_profile, info)
        //         }
        //         if (type == "Goals") {
        //             let goal = await this.goalsRepository.findOne({ where: { model_portfolio_id: transaction_basket.model_portfolio_id } })
        //             let info = {
        //                 "var1": `${transaction_basket.otp}`,
        //                 "var2": `${transaction_basket.transaction_basket_items[0].transaction_type}`,
        //                 "var3": `${goal.name}`,
        //                 "var4": `${amount}`
        //             }
        //             console.log("goal", info)
        //             this.enablexService.sendSMS(user.mobile, data.keys_json.from, data.keys_json.campaign_id.service, data.keys_json.type, data.keys_json.template_id.goals, info)
        //         }
        //     }
        //     else {
        //         console.log("hi", data.keys_json)
        //         let info = {
        //             "var1": `${transaction_basket.otp}`,
        //             "var2": `${transaction_basket.transaction_basket_items[0].transaction_type}`,
        //             "var3": `${fundNamesJoined}`,
        //             "var4": `${amount}`
        //         }
        //         console.log("info&&&", info)
        //         this.enablexService.sendSMS(user.mobile, data.keys_json.from, data.keys_json.campaign_id.service, data.keys_json.type, data.keys_json.template_id.otp_transaction, info)
        //     }
        // }
        // else {
        //     transaction_basket.otp = 1111;
        //     // sms.send("651406ded6fc05537a399362", { 'mobile': "+91" + user.mobile, "otp": transaction_basket.otp.toString(), "amount": amount.toString() });
        // }

        await this.transactionBasketRepository.save(transaction_basket);
        return { status: HttpStatus.OK, message: 'OTP generated' };
      } else {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Sorry no transaction basket found with the given ID',
        };
      }
    } catch (err) {
      console.log('Errr', err);
      return { status: HttpStatus.BAD_REQUEST, message: err.message };
    }
  }

  // async test() {
  //     let data = await this.enablexService.findOne("enablex")
  //     console.log("hi", data.keys_json)
  //     let info = {
  //         "var1": `44443`,
  //         "var2": `sip`,
  //         "var3": `handa`,
  //         "var4": `50000`
  //     }
  //     this.enablexService.sendSMS("8050733694", data.keys_json.from, data.keys_json.campaign_id.service, data.keys_json.type, data.keys_json.template_id.otp_transaction, info)
  // }

  async validateBasketConsent(
    transaction_basket_id: number,
    otp: number,
    ip,
    server_ip,
    tenant_id,
  ) {
    try {
      let transaction_basket = await this.transactionBasketRepository.findOne({
        where: { id: transaction_basket_id },
        relations: [
          'transaction_basket_items',
          'transaction_basket_items.purchases',
          'transaction_basket_items.redemption',
          'transaction_basket_items.switch_fund',
          'transaction_basket_items.mf_switch_plan',
          'transaction_basket_items.mf_purchase_plan',
          'transaction_basket_items.mf_redemption_plan',
        ],
      });
      // let encrypted_password
      console.log('transaction_basket', transaction_basket.otp, 'otp', otp);
      if (transaction_basket) {
        if (otp == transaction_basket.otp) {
          transaction_basket.is_consent_verified = true;
          const consent_object = {
            isd_code: transaction_basket.consent_isd_code,
            mobile: transaction_basket.consent_mobile,
          };
          const onboardingDetails =
            await this.userOnboardingDetailRepository.findOneBy({
              user_id: transaction_basket.user_id,
            });

          if (transaction_basket.is_euin == false) {
            this.euin = null;
          }
          for (let transaction_basket_item of transaction_basket.transaction_basket_items) {
            //update_purchase
            const funddata = await this.funddetailRepository.findOne({
              where: { isin: transaction_basket_item.fund_isin },
            });
            const mandate = await this.mandatesRepository.findOne({
              where: { mandate_id: transaction_basket_item.payment_source },
            });
            switch (transaction_basket_item.transaction_type) {
              case 'lumpsum': {
                // let funddata = await this.funddetailRepository.findOne({ where: { isin: transaction_basket_item.fund_isin } })
                console.log('Fund Dataa', funddata);
                if (
                  transaction_basket_item.status != 'failed' &&
                  transaction_basket_item.purchases.length > 0
                ) {
                  console.log('enteredd');
                  const p =
                    transaction_basket_item.purchases[
                      transaction_basket_item.purchases.length - 1
                    ];
                  console.log('purchasess', p);
                  console.log('consent_object', consent_object);

                  const get_password = await this.bsev1Service.get_password();
                  console.log('get_password', get_password);
                  const encrypted_password = await this.extractPassword(
                    get_password.data,
                  );
                  console.log(
                    'password',
                    encrypted_password,
                    transaction_basket,
                  );
                  const data = {
                    TransCode: 'NEW',
                    TransNo: await this.generateReferenceNumber(this.member_id),
                    OrderId: '',
                    UserID: this.user_id,
                    MemberId: this.member_id,
                    ClientCode: onboardingDetails.fp_investor_id,
                    SchemeCd: funddata.schemeCode,
                    BuySell: 'P',
                    BuySellType: 'FRESH',
                    DPTxn: 'P',
                    OrderVal: transaction_basket_item.amount,
                    Qty: transaction_basket_item.units
                      ? transaction_basket_item.units
                      : 0,
                    AllRedeem: 'N',
                    FolioNo: transaction_basket_item.folio_number
                      ? transaction_basket_item.folio_number
                      : '',
                    Remarks: '',
                    KYCStatus: 'Y',
                    RefNo: '',
                    SubBrCode: '',
                    EUIN: this.euin ? this.euin : '',
                    EUINVal: this.euin ? 'Y' : 'N',
                    MinRedeem: 'N',
                    DPC: 'Y',
                    IPAdd: '',
                    Password: encrypted_password,
                    PassKey: this.password,
                    Parma1: '',
                    Param2: '',
                    Param3: '',
                    MobileNo: transaction_basket_item.folio_number
                      ? transaction_basket_item.folio_mobile
                        ? transaction_basket_item.folio_mobile.slice(-10)
                        : ''
                      : '',
                    EmailID: transaction_basket_item.folio_number
                      ? transaction_basket_item.folio_email
                        ? transaction_basket_item.folio_email
                        : ''
                      : '',
                    MandateID: '',
                    Filler1: '',
                    Filler2: '',
                    Filler3: '',
                    Filler4: '',
                    Filler5: '',
                    Filler6: '',
                  };
                  console.log('data', data);

                  const bse_update_purchase =
                    await this.bsev1Service.bse_orders_purchase_redemption(
                      data,
                    );
                  console.log('bse_update_purchase', bse_update_purchase);

                  const uniqueNo = new UniqueReferenceNo();
                  uniqueNo.unique_number = data.TransNo;
                  await this.uniqueReferenceNoRepo.save(uniqueNo);

                  const extracted_result =
                    await this.extractpurchase_redemptionOrderId(
                      bse_update_purchase.data,
                    );
                  const purchaseOrder = new BsePurchaseRedemptionOrder();
                  purchaseOrder.type = transaction_basket_item.transaction_type;
                  purchaseOrder.transaction_code = data.TransCode;
                  purchaseOrder.transaction_no = data.TransNo;
                  purchaseOrder.order_id = data.OrderId
                    ? Number(data.OrderId)
                    : null;
                  purchaseOrder.user_id = parseInt(data.UserID);
                  purchaseOrder.member_id = data.MemberId;
                  purchaseOrder.client_code = data.ClientCode;
                  purchaseOrder.scheme_code = data.SchemeCd;
                  purchaseOrder.buy_sell = data.BuySell;
                  purchaseOrder.buy_sell_type = data.BuySellType;
                  purchaseOrder.dp_trans_mode = data.DPTxn;
                  purchaseOrder.amount = data.OrderVal;
                  purchaseOrder.qty = data.Qty;
                  purchaseOrder.all_redeem = data.AllRedeem;
                  purchaseOrder.folio_no = data.FolioNo;
                  purchaseOrder.remarks = data.Remarks;
                  purchaseOrder.kyc_status = data.KYCStatus;
                  purchaseOrder.int_ref_no = data.RefNo;
                  purchaseOrder.sub_br_code = data.SubBrCode;
                  purchaseOrder.euin = data.EUIN;
                  purchaseOrder.euin_flag = data.EUINVal;
                  purchaseOrder.min_redeem = data.MinRedeem;
                  purchaseOrder.dpc = data.DPC;
                  purchaseOrder.ip_add = data.IPAdd;
                  purchaseOrder.password = '';
                  purchaseOrder.passKey = '';
                  purchaseOrder.param1 = data.Parma1;
                  purchaseOrder.param2 = data.Param2;
                  purchaseOrder.param3 = data.Param3;
                  purchaseOrder.mobile_no = data.MobileNo;
                  purchaseOrder.email = data.EmailID;
                  purchaseOrder.mandate_id = data.MandateID;
                  purchaseOrder.filler1 = data.Filler1;
                  purchaseOrder.filler2 = data.Filler2;
                  purchaseOrder.filler3 = data.Filler3;
                  purchaseOrder.filler4 = data.Filler4;
                  purchaseOrder.filler5 = data.Filler5;
                  purchaseOrder.filler6 = data.Filler6;
                  purchaseOrder.order_no = extracted_result.orderNo;
                  purchaseOrder.bse_remarks = extracted_result.bseRemarks;
                  purchaseOrder.success_flag = extracted_result.successFlag;
                  purchaseOrder.transaction_basket_item_id =
                    transaction_basket_item.id;
                  const saved_purchase = await this.purchaseOrderRepo.save(
                    purchaseOrder,
                  );
                  console.log('saved_purchase', saved_purchase);

                  // let fp_update_purchase = await this.fintechService.update_purchase({ id: p.fp_id, consent: consent_object });
                  // if (fp_update_purchase.status == HttpStatus.OK) {

                  // transaction_basket_item.status = fp_update_purchase.data.status;
                  transaction_basket_item.is_consent_verified = true;
                  let purchase = await this.purchaseRepository.findOneBy({
                    transaction_basket_item_id: transaction_basket_item.id,
                  });
                  if (
                    extracted_result.successFlag == '0' &&
                    extracted_result.orderNo != null
                  ) {
                    transaction_basket_item.status = 'submitted';
                    purchase.state = 'confirmed';
                  } else {
                    transaction_basket_item.status = 'failed';
                    purchase.state = 'failed';
                  }
                  transaction_basket_item =
                    await this.transactionBasketItemRepository.save(
                      transaction_basket_item,
                    );

                  purchase.order_number = saved_purchase.order_no;
                  purchase = await this.purchaseRepository.save(purchase);
                  // let purchase = await this.purchaseRepository.findOneBy({ transaction_basket_item_id: transaction_basket_item.id });
                  // fp_update_purchase.data["fp_id"] = fp_update_purchase.data.id;
                  // fp_update_purchase.data.id = purchase.id;
                  // purchase = fp_update_purchase.data;
                  // purchase = await this.purchaseRepository.save(purchase);

                  // } else {
                  //     if (fp_update_purchase.error == "failed to update investor consent, already exists") {
                  //         transaction_basket_item.is_consent_verified = true;
                  //         transaction_basket_item.response_message = "";
                  //         transaction_basket_item.status = "pending";
                  //         transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);

                  //     } else {

                  //         transaction_basket_item.status = "failed consent update";
                  //         transaction_basket_item.is_consent_verified = false;
                  //         transaction_basket_item.response_message = fp_update_purchase.error;
                  //         transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);
                  //     }
                  // }
                }
                break;
              }
              case 'no_mandate_sip': {
                if (
                  transaction_basket_item.status != 'failed' &&
                  transaction_basket_item.purchases.length > 0
                ) {
                  const p =
                    transaction_basket_item.purchases[
                      transaction_basket_item.purchases.length - 1
                    ];
                  console.log(consent_object);
                  const fp_update_purchase =
                    await this.fintechService.update_purchase({
                      id: p.fp_id,
                      consent: consent_object,
                    });
                  if (fp_update_purchase.status == HttpStatus.OK) {
                    transaction_basket_item.status =
                      fp_update_purchase.data.status;
                    transaction_basket_item.is_consent_verified = true;
                    transaction_basket_item =
                      await this.transactionBasketItemRepository.save(
                        transaction_basket_item,
                      );

                    let purchase = await this.purchaseRepository.findOneBy({
                      transaction_basket_item_id: transaction_basket_item.id,
                    });
                    fp_update_purchase.data['fp_id'] =
                      fp_update_purchase.data.id;
                    fp_update_purchase.data.id = purchase.id;
                    purchase = fp_update_purchase.data;
                    purchase = await this.purchaseRepository.save(purchase);
                  } else {
                    if (
                      fp_update_purchase.error ==
                      'failed to update investor consent, already exists'
                    ) {
                      transaction_basket_item.is_consent_verified = true;
                      transaction_basket_item.response_message = '';
                      transaction_basket_item.status = 'pending';
                      transaction_basket_item =
                        await this.transactionBasketItemRepository.save(
                          transaction_basket_item,
                        );
                    } else {
                      transaction_basket_item.status = 'failed consent update';
                      transaction_basket_item.is_consent_verified = false;
                      transaction_basket_item.response_message =
                        fp_update_purchase.error;
                      transaction_basket_item =
                        await this.transactionBasketItemRepository.save(
                          transaction_basket_item,
                        );
                    }
                  }
                }
                break;
              }
              case 'sip': {
                // let fp_create_sip = await this.fintechService.create_sip(fp_sip_dto);
                // if (fp_create_sip.status == 200) {

                //     transaction_basket_item.status = fp_create_sip.data.state;
                //     transaction_basket_item.fp_sip_id = fp_create_sip.data.id;

                //     transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);

                //     let fp_installments = await this.fintechService.get_plan_purchase(transaction_basket_item.fp_sip_id);

                //     if (fp_installments.status == 200) {
                //         if (fp_installments.data.length > 0) {

                //             let purchase = new Purchase();
                //             fp_installments.data[0]["fp_id"] = fp_installments.data[0].id;
                //             fp_installments.data[0]["user_id"] = transaction_basket_item.user_id;

                //             fp_installments.data[0]["transaction_basket_item_id"] = transaction_basket_item.id;
                //             console.log("TRANDSACTION OBJ", fp_installments.data[0]);
                //             delete fp_installments.data[0].id;
                //             purchase = fp_installments.data[0];
                //             console.log("PURCHASE OBJ", purchase);
                //             purchase = await this.purchaseRepository.save(purchase);
                //         }
                //     } else {
                //         transaction_basket_item.response_message = "SIP Created but first installment fetch has some issue: " + fp_installments.error;
                //         transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);
                //     }

                // } else {
                //     transaction_basket_item.status = "failed";
                //     transaction_basket_item.response_message = fp_create_sip.error;
                //     transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);
                // }
                // break;

                transaction_basket_item.is_consent_verified = true;

                transaction_basket_item.status = 'confirmed';

                transaction_basket_item =
                  await this.transactionBasketItemRepository.save(
                    transaction_basket_item,
                  );
                let startdate;
                console.log(
                  'transaction_basket_item.start_date',
                  transaction_basket_item,
                );

                startdate = transaction_basket_item.start_date
                  .toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                  .replace(/\//g, '/');
                console.log('start_date', startdate);
                const data = {
                  login_id: this.user_id,
                  member_id: this.member_id,
                  password: this.password,
                  scheme_code: funddata.schemeCode,
                  client_code: onboardingDetails.fp_investor_id,
                  internal_ref_no: '',
                  trans_mode: 'P',
                  dp_trans_mode: 'P',
                  start_date: startdate,
                  frequency_type:
                    transaction_basket_item.frequency.toUpperCase(),
                  frequency_allowed: 1,
                  installment_amount: transaction_basket_item.amount,
                  no_of_installemnts:
                    transaction_basket_item.number_of_installments,
                  remarks: '',
                  folio_no: transaction_basket_item.folio_number
                    ? transaction_basket_item.folio_number
                    : '',
                  first_order_flag:
                    transaction_basket_item.generate_first_installment_now ==
                    true
                      ? 'Y'
                      : 'N',
                  sub_br_code: '',
                  euin: this.euin ? this.euin : '',
                  euin_declaration_flag: this.euin ? 'Y' : 'N',
                  dpc: 'Y',
                  sub_broker_arn: '',
                  end_date: '',
                  registration_type: 'XSIP',
                  brokerage: 0,
                  mandate_id: mandate.mandate_id,
                  xsip_type: '01',
                  target_scheme: ' ',
                  target_amount: ' ',
                  goal_type: ' ',
                  goal_amount: ' ',
                  filler_1: transaction_basket_item.folio_number
                    ? transaction_basket_item.folio_mobile
                      ? transaction_basket_item.folio_mobile.slice(-10)
                      : ''
                    : '',
                  filler_2: transaction_basket_item.folio_number
                    ? transaction_basket_item.folio_email
                      ? transaction_basket_item.folio_email
                      : ''
                    : '',
                  filler_3: '',
                  filler_4: '',
                  filler_5: '',
                  filler_6: '',
                  filler_7: '',
                  filler_8: '',
                  filler_9: '',
                  filler_10: '',
                };

                const xsip_register = await this.bsev1Service.register_xsip(
                  data,
                );
                console.log('xsip_register', xsip_register);

                const xsip_registered = new BseXSipRegister();
                (xsip_registered.login_id = this.user_id),
                  (xsip_registered.member_id = this.member_id),
                  // xsip_registered.password = this.password,
                  (xsip_registered.scheme_code = data.scheme_code),
                  (xsip_registered.client_code = data.client_code),
                  (xsip_registered.internal_ref_no = data.internal_ref_no),
                  (xsip_registered.trans_mode = data.trans_mode),
                  (xsip_registered.dp_trans_mode = data.dp_trans_mode),
                  (xsip_registered.start_date = data.start_date),
                  (xsip_registered.frequency_type = data.frequency_type),
                  (xsip_registered.frequency_allowed = Boolean(
                    data.frequency_allowed,
                  )),
                  (xsip_registered.installment_amount =
                    data.installment_amount),
                  (xsip_registered.no_of_installemnts =
                    data.no_of_installemnts),
                  (xsip_registered.remarks = data.remarks),
                  (xsip_registered.folio_no = data.folio_no),
                  (xsip_registered.first_order_flag = data.first_order_flag),
                  (xsip_registered.sub_br_code = data.sub_br_code),
                  (xsip_registered.euin = data.euin),
                  (xsip_registered.euin_declaration_flag =
                    data.euin_declaration_flag),
                  (xsip_registered.dpc = data.dpc),
                  (xsip_registered.sub_broker_arn = data.sub_broker_arn),
                  (xsip_registered.end_date = data.end_date),
                  (xsip_registered.registration_type = data.registration_type),
                  (xsip_registered.brokerage = data.brokerage),
                  (xsip_registered.mandate_id = data.mandate_id),
                  (xsip_registered.xsip_type = data.xsip_type),
                  (xsip_registered.target_scheme = data.target_scheme),
                  // xsip_registered.target_amount = data.target_amount,
                  (xsip_registered.goal_type = data.goal_type),
                  // xsip_registered.goal_amount = data.goal_amount,
                  (xsip_registered.filler_1 = data.filler_1),
                  (xsip_registered.filler_2 = data.filler_2),
                  (xsip_registered.filler_3 = data.filler_3),
                  (xsip_registered.filler_4 = data.filler_4),
                  (xsip_registered.filler_5 = data.filler_5);
                xsip_registered.xsip_reg_id = xsip_register.data.XSIPRegId;
                xsip_registered.bse_remarks = xsip_register.data.BSERemarks;
                xsip_registered.internal_reference_number =
                  xsip_register.data.IntRefNo;
                xsip_registered.success_flag = xsip_register.data.SuccessFlag;
                xsip_registered.transaction_basket_item_id =
                  transaction_basket_item.id;
                const saved_xsip = await this.xsipRegisterRepo.save(
                  xsip_registered,
                );
                console.log('saved_xsip', saved_xsip);

                if (
                  xsip_register.data.SuccessFlag == '0' &&
                  xsip_register.data.XSIPRegId != null
                ) {
                  transaction_basket_item.status = 'active';
                  transaction_basket_item.fp_sip_id =
                    xsip_registered.xsip_reg_id.toString();

                  let purchase = new Purchase();
                  purchase.confirmed_at = new Date();

                  console.log(
                    'transaction_basket_item',
                    transaction_basket_item,
                  );

                  purchase.amount = transaction_basket_item.amount;

                  if (transaction_basket_item.folio_number) {
                    purchase.folio_number =
                      transaction_basket_item.folio_number;
                  }
                  console.log(
                    'mfpurchase',
                    transaction_basket_item.mf_purchase_plan,
                  );
                  purchase.plan = transaction_basket_item.mf_purchase_plan.id;
                  purchase.user_ip = ip;
                  purchase.scheme = transaction_basket_item.fund_isin;
                  purchase.server_ip = server_ip;

                  purchase.user_id = transaction_basket_item.user_id;

                  purchase.transaction_basket_item_id =
                    transaction_basket_item.id;
                  purchase.folio_number = transaction_basket_item.folio_number;
                  purchase.state = 'confirmed';
                  purchase.scheme = transaction_basket_item.fund_isin;
                  purchase.gateway = 'rta';
                  purchase.initiated_by = 'investor';
                  purchase.user_ip = ip;
                  purchase.server_ip = server_ip;
                  purchase.created_at = new Date();

                  const password_body = {
                    MemberId: this.member_id,
                    PassKey: this.password,
                    Password: this.password,
                    RequestType: 'CHILDORDER',
                    UserId: this.user_id,
                  };
                  const child_order_password =
                    await this.bsev1Service.child_order_password(password_body);
                  console.log('child_order_password', child_order_password);
                  // let get_password = await this.bsev1Service.get_password()
                  // let encrypted_password = await this.extractPassword(get_password.data)
                  const date = new Date();
                  const formattedDate = date
                    .toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                    .toUpperCase()
                    .replace(',', '');
                  const child_order = {
                    ClientCode: onboardingDetails.fp_investor_id,
                    Date: formattedDate,
                    EncryptedPassword: child_order_password.data.ResponseString,
                    MemberCode: this.member_id,
                    RegnNo: saved_xsip.xsip_reg_id,
                    SystematicPlanType: 'XSIP',
                  };
                  const c_order_result =
                    await this.bsev1Service.child_order_request(child_order);
                  console.log('c_order_result', c_order_result);

                  if (c_order_result.data.Status == '100') {
                    const order = new BseXSipOrder();
                    order.order_no =
                      c_order_result.data.ChildOrderDetails[0].OrderNumber;
                    order.scheme_code =
                      c_order_result.data.ChildOrderDetails[0].BSESchemeCode;
                    order.member_id =
                      c_order_result.data.ChildOrderDetails[0].MemberCode;
                    order.client_code =
                      c_order_result.data.ChildOrderDetails[0].ClientCode;
                    order.user_id = xsip_registered.login_id;
                    order.int_ref_no =
                      c_order_result.data.ChildOrderDetails[0].IntRefNo;
                    order.transaction_mode =
                      c_order_result.data.ChildOrderDetails[0].BuySell;
                    order.dp_trans_mode =
                      c_order_result.data.ChildOrderDetails[0].DPTxnType;
                    order.installment_amount =
                      c_order_result.data.ChildOrderDetails[0].Amount;
                    order.folio_no =
                      c_order_result.data.ChildOrderDetails[0].FolioNo;
                    order.first_order_flag =
                      c_order_result.data.ChildOrderDetails[0].FirstOrderTodayFlag;
                    order.mandate_id = parseInt(xsip_registered.mandate_id);
                    order.sub_br_code =
                      c_order_result.data.ChildOrderDetails[0].SubBrokerCode;
                    order.euin =
                      c_order_result.data.ChildOrderDetails[0].EUINNumber;
                    order.euin_flag =
                      c_order_result.data.ChildOrderDetails[0].EUINFlag;
                    order.xsip_reg_id = xsip_registered.xsip_reg_id;
                    order.bse_remarks = c_order_result.data.Message;
                    order.success_flag = c_order_result.data.Status;
                    order.transaction_basket_item_id =
                      transaction_basket_item.id;
                    await this.xsipOrderRepo.save(order);

                    purchase.order_number =
                      c_order_result.data.ChildOrderDetails[0].OrderNumber;
                    console.log('before saved purchase', purchase);
                    purchase = await this.purchaseRepository.save(purchase);
                    transaction_basket_item.purchases.push(purchase);
                    console.log('saved purchase', purchase);
                  }
                } else {
                  transaction_basket_item.status = 'failed';
                }
                console.log(
                  'before saved transaction_basket_item',
                  transaction_basket_item,
                );
                await this.transactionBasketItemRepository.save(
                  transaction_basket_item,
                );
                console.log(
                  'before saved transaction_basket_item',
                  transaction_basket_item,
                );

                // let funddata = await this.funddetailRepository.findOne({ where: { isin: transaction_basket_item.fund_isin } })
                // let get_password = await this.bsev1Service.get_password()
                // console.log("get_password", get_password)
                // let encrypted_password = await this.extractPassword(get_password.data)
                // let xsip_register = await this.xsipRegisterRepo.findOne({ where: { transaction_basket_item_id: transaction_basket_item.id } })
                // console.log("start_date", transaction_basket_item.start_date)
                // console.log("start_date", formatDateIST(transaction_basket_item.start_date))
                // let data = {
                //     TransactionCode: "NEW",
                //     UniqueRefNo: await this.generateReferenceNumber(this.member_id),
                //     SchemeCode: funddata.amcSchemeCode,
                //     MemberCode: this.member_id,
                //     ClientCode: onboardingDetails.fp_investor_id,
                //     UserID: this.user_id,
                //     InternalRefNo: "",
                //     TransMode: "P",
                //     DpTxnMode: "P",
                //     StartDate: formatDateIST(transaction_basket_item.start_date),
                //     FrequencyType: transaction_basket_item.frequency.toUpperCase(),
                //     FrequencyAllowed: 1,
                //     InstallmentAmount: transaction_basket_item.amount,
                //     NoOfInstallment: transaction_basket_item.number_of_installments,
                //     Remarks: "",
                //     FolioNo: transaction_basket_item.folio_number ? transaction_basket_item.folio_number : "",
                //     FirstOrderFlag: transaction_basket_item.generate_first_installment_now ? "Y" : "N",
                //     Brokerage: 0,
                //     MandateID: transaction_basket_item.payment_source,
                //     SubberCode: "",
                //     Euin: this.euin,
                //     EuinVal: "Y",
                //     DPC: "Y",
                //     XsipRegID: xsip_register.xsip_reg_id,
                //     IPAdd: "",
                //     Password: encrypted_password,
                //     PassKey: this.password,
                //     Param1: "",
                //     Param2: "",
                //     Param3: "",
                //     Filler1: "",
                //     Filler2: "",
                //     Filler3: "",
                //     Filler4: "",
                //     Filler5: "",
                //     Filler6: ""

                // }

                // let bse_update_purchase = await this.bsev1Service.bse_order_xsip(data);
                // console.log("bse_update_purchase", bse_update_purchase)

                // let fetchOrder = await this.extractXSIPOrderId(bse_update_purchase.data)
                // let orderNo = fetchOrder.orderNo
                // let bseRemarks = fetchOrder.bseRemarks
                // let successFlag = fetchOrder.successFlag
                // let xsip = new BseXSipOrder()
                // xsip.transaction_code = data.TransactionCode
                // xsip.unique_reference_no = data.UniqueRefNo
                // xsip.scheme_code = data.SchemeCode
                // xsip.member_id = data.MemberCode
                // xsip.client_code = data.ClientCode
                // xsip.user_id = data.UserID
                // xsip.int_ref_no = data.InternalRefNo
                // xsip.transaction_mode = data.TransMode
                // xsip.dp_trans_mode = data.DpTxnMode
                // xsip.start_date = data.StartDate.toString()
                // xsip.frequency_type = data.FrequencyType
                // xsip.frequency_allowed = data.FrequencyAllowed
                // xsip.installment_amount = data.InstallmentAmount
                // xsip.no_of_installments = data.NoOfInstallment
                // xsip.remarks = data.Remarks
                // xsip.folio_no = data.FolioNo
                // xsip.first_order_flag = data.FirstOrderFlag
                // xsip.brokerage = data.Brokerage
                // xsip.mandate_id = parseInt(data.MandateID)
                // xsip.sub_br_code = data.SubberCode
                // xsip.euin = this.euin
                // xsip.euin_flag = data.EuinVal
                // xsip.dpc = data.DPC
                // xsip.xsip_reg_id = xsip_register.xsip_reg_id
                // xsip.ip_add = data.IPAdd
                // xsip.password = ""
                // xsip.passKey = ""
                // xsip.param1 = data.Param1
                // xsip.param2 = data.Param2
                // xsip.param3 = data.Param3
                // xsip.filler1 = data.Filler1
                // xsip.filler2 = data.Filler2
                // xsip.filler3 = data.Filler3
                // xsip.filler4 = data.Filler4
                // xsip.filler5 = data.Filler5
                // xsip.filler6 = data.Filler6

                // xsip.transaction_basket_item_id = transaction_basket_item.id

                // xsip.order_no = orderNo
                // xsip.bse_remarks = bseRemarks
                // xsip.success_flag = successFlag
                // let saved_order = await this.xsipOrderRepo.save(xsip)
                // console.log('saved_order', saved_order)

                // let uniqueNo = new UniqueReferenceNo()
                // uniqueNo.unique_number = data.UniqueRefNo
                // await this.uniqueReferenceNoRepo.save(uniqueNo)

                // if (transaction_basket_item.generate_first_installment_now) {

                // }

                break;
              }
              case 'smart_sip': {
                const fp_sip_dto = new FpSipDTO();
                fp_sip_dto.amount = transaction_basket_item.amount;
                if (transaction_basket_item.folio_number) {
                  fp_sip_dto.folio_number =
                    transaction_basket_item.folio_number;
                }

                fp_sip_dto.mf_investment_account =
                  onboardingDetails.fp_investment_account_id;
                fp_sip_dto.user_ip = ip;
                fp_sip_dto.scheme = transaction_basket_item.fund_isin;
                fp_sip_dto.server_ip = server_ip;
                fp_sip_dto.mf_investment_account =
                  onboardingDetails.fp_investment_account_id;
                fp_sip_dto.installment_day =
                  transaction_basket_item.installment_day;
                fp_sip_dto.frequency = transaction_basket_item.frequency;
                fp_sip_dto.systematic = true;
                fp_sip_dto.payment_method =
                  transaction_basket_item.payment_method;
                fp_sip_dto.payment_source =
                  transaction_basket_item.payment_source;
                if (transaction_basket_item.is_payment) {
                  fp_sip_dto.generate_first_installment_now = true;
                } else {
                  fp_sip_dto.generate_first_installment_now = false;
                }
                fp_sip_dto.auto_generate_installments = true;
                fp_sip_dto.number_of_installments = 100;

                fp_sip_dto.consent = consent_object;

                const fp_create_sip = await this.fintechService.create_sip(
                  fp_sip_dto,
                );
                if (fp_create_sip.status == 200) {
                  if (transaction_basket_item.is_payment) {
                    transaction_basket_item.status = fp_create_sip.data.state;
                    transaction_basket_item.fp_sip_id = fp_create_sip.data.id;

                    transaction_basket_item =
                      await this.transactionBasketItemRepository.save(
                        transaction_basket_item,
                      );

                    const fp_installments =
                      await this.fintechService.get_plan_purchase(
                        transaction_basket_item.fp_sip_id,
                      );

                    if (fp_installments.status == 200) {
                      if (fp_installments.data.length > 0) {
                        let purchase = new Purchase();
                        fp_installments.data[0]['fp_id'] =
                          fp_installments.data[0].id;
                        fp_installments.data[0]['user_id'] =
                          transaction_basket_item.user_id;

                        fp_installments.data[0]['transaction_basket_item_id'] =
                          transaction_basket_item.id;
                        console.log(
                          'TRANDSACTION OBJ',
                          fp_installments.data[0],
                        );
                        delete fp_installments.data[0].id;
                        purchase = fp_installments.data[0];
                        console.log('PURCHASE OBJ', purchase);
                        purchase = await this.purchaseRepository.save(purchase);
                      }
                    } else {
                      transaction_basket_item.response_message =
                        'SIP Created but first installment fetch has some issue: ' +
                        fp_installments.error;
                      transaction_basket_item =
                        await this.transactionBasketItemRepository.save(
                          transaction_basket_item,
                        );
                    }
                  } else {
                    transaction_basket_item.status = 'active';
                    transaction_basket_item =
                      await this.transactionBasketItemRepository.save(
                        transaction_basket_item,
                      );

                    //skip instructions code here
                  }
                } else {
                  transaction_basket_item.status = 'failed';
                  transaction_basket_item.response_message =
                    fp_create_sip.error;
                  transaction_basket_item =
                    await this.transactionBasketItemRepository.save(
                      transaction_basket_item,
                    );
                }
                break;
              }
              case 'redemption': {
                console.log('helllo', transaction_basket_item.redemption);
                if (
                  transaction_basket_item.status != 'failed' &&
                  transaction_basket_item.redemption
                ) {
                  console.log(consent_object);
                  // let fp_update_redemption = await this.fintechService.update_redemption({ id: transaction_basket_item.redemption.fp_id, state: 'confirmed', consent: consent_object });
                  // if (fp_update_redemption.status == HttpStatus.OK) {

                  // transaction_basket_item.status = "confirmed";
                  transaction_basket_item.is_consent_verified = true;
                  transaction_basket_item =
                    await this.transactionBasketItemRepository.save(
                      transaction_basket_item,
                    );

                  let redemption = await this.redemptionRepository.findOneBy({
                    transaction_basket_item_id: transaction_basket_item.id,
                  });

                  // redemption.state = "confirmed";

                  // redemption = await this.redemptionRepository.save(redemption);

                  // } else {
                  //     if (fp_update_redemption.error == "failed to update investor consent, already exists") {
                  //         transaction_basket_item.is_consent_verified = true;
                  //         transaction_basket_item.response_message = "";
                  //         transaction_basket_item.status = "confirmed";
                  //         transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);

                  //     } else {

                  //         transaction_basket_item.status = "failed consent update";
                  //         transaction_basket_item.is_consent_verified = false;
                  //         transaction_basket_item.response_message = fp_update_redemption.error;
                  //         transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);
                  //     }
                  // }

                  const saved_redemption = await this.purchaseOrderRepo.findOne(
                    {
                      where: {
                        transaction_basket_item_id: transaction_basket_item.id,
                      },
                    },
                  );
                  console.log('saved_redemption', saved_redemption);
                  const get_password = await this.bsev1Service.get_password();
                  const encrypted_password = await this.extractPassword(
                    get_password.data,
                  );
                  console.log('encrypted_password', encrypted_password);
                  const data = {
                    TransCode: saved_redemption.transaction_code,
                    TransNo: saved_redemption.transaction_no,
                    OrderId: saved_redemption.order_id
                      ? saved_redemption.order_id
                      : '',
                    UserID: saved_redemption.user_id,
                    MemberId: saved_redemption.member_id,
                    ClientCode: saved_redemption.client_code,
                    SchemeCd: saved_redemption.scheme_code,
                    BuySell: saved_redemption.buy_sell,
                    BuySellType: saved_redemption.buy_sell_type,
                    DPTxn: saved_redemption.dp_trans_mode,
                    OrderVal: saved_redemption.amount,
                    Qty: transaction_basket_item.units
                      ? transaction_basket_item.units
                      : 0,
                    AllRedeem: saved_redemption.all_redeem,
                    FolioNo: saved_redemption.folio_no,
                    Remarks: saved_redemption.remarks,
                    KYCStatus: saved_redemption.kyc_status,
                    RefNo: saved_redemption.int_ref_no,
                    SubBrCode: saved_redemption.sub_br_code,
                    EUIN: saved_redemption.euin,
                    EUINVal: saved_redemption.euin_flag,
                    MinRedeem: saved_redemption.min_redeem,
                    DPC: saved_redemption.dpc,
                    IPAdd: saved_redemption.ip_add,
                    Password: encrypted_password,
                    PassKey: this.password,
                    Parma1: '',
                    Param2: '',
                    Param3: '',
                    MobileNo: transaction_basket_item.folio_number
                      ? transaction_basket_item.folio_mobile
                        ? transaction_basket_item.folio_mobile.slice(-10)
                        : ''
                      : '',
                    EmailID: transaction_basket_item.folio_number
                      ? transaction_basket_item.folio_email
                        ? transaction_basket_item.folio_email
                        : ''
                      : '',
                    MandateID: '',
                    Filler1: '',
                    Filler2: '',
                    Filler3: '',
                    Filler4: '',
                    Filler5: '',
                    Filler6: '',
                  };
                  console.log('data', data);

                  const bse_update_purchase =
                    await this.bsev1Service.bse_orders_purchase_redemption(
                      data,
                    );
                  console.log('bse_update_purchase', bse_update_purchase);
                  const extracted_result =
                    await this.extractpurchase_redemptionOrderId(
                      bse_update_purchase.data,
                    );
                  // let purchaseOrder = new BsePurchaseRedemptionOrder()

                  saved_redemption.order_no = extracted_result.orderNo;
                  saved_redemption.bse_remarks = extracted_result.bseRemarks;
                  saved_redemption.success_flag = extracted_result.successFlag;
                  saved_redemption.transaction_basket_item_id =
                    transaction_basket_item.id;
                  const saved_purchase = await this.purchaseOrderRepo.save(
                    saved_redemption,
                  );
                  console.log('saved_purchase', saved_purchase);

                  if (
                    extracted_result.successFlag == '0' &&
                    extracted_result.orderNo != null
                  ) {
                    transaction_basket_item.status = 'successful';
                    redemption.state = 'successful';
                  } else {
                    transaction_basket_item.status = 'failed';
                    redemption.state = 'failed';
                  }
                  await this.transactionBasketItemRepository.save(
                    transaction_basket_item,
                  );
                  redemption = await this.redemptionRepository.save(redemption);
                }
                break;
              }
              case 'swp': {
                transaction_basket_item.is_consent_verified = true;
                // transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);

                // let fp_create_swp = await this.fintechService.create_swp(fp_swp_dto);
                // if (fp_create_swp.status == 200) {

                transaction_basket_item.status = 'confirmed';
                // transaction_basket_item.fp_swp_id = fp_create_swp.data.id;

                transaction_basket_item =
                  await this.transactionBasketItemRepository.save(
                    transaction_basket_item,
                  );

                // let fp_installments = await this.fintechService.get_plan_redemption(transaction_basket_item.fp_swp_id);

                // if (fp_installments.status == 200) {
                // if (fp_installments.data.length > 0) {

                const startdate = transaction_basket_item.start_date
                  .toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                  .replace(/\//g, '/');
                console.log('startdate', startdate);
                const get_password =
                  await this.bsev1Service.get_password_for_registration(
                    tenant_id,
                  );
                console.log('get_password', get_password);
                const encrypted_password = await this.extractPassword(
                  get_password.data,
                );
                console.log('password', encrypted_password);
                const data = {
                  encrypted_password: encrypted_password,
                  client_code: onboardingDetails.fp_investor_id,
                  bse_scheme_code: funddata.schemeCode,
                  transaction_mode: 'P',
                  folio_no: transaction_basket_item.folio_number,
                  internal_ref_no: '',
                  start_date: startdate,
                  no_of_withdrawls:
                    transaction_basket_item.number_of_installments,
                  frequency_type:
                    transaction_basket_item.frequency.toUpperCase(),
                  installment_amount: transaction_basket_item.amount,
                  installment_units: transaction_basket_item.units
                    ? transaction_basket_item.units
                    : 0,
                  first_order_today: 'N',
                  sub_br_code: '',
                  euin_declaration_flag: this.euin ? 'Y' : 'N',
                  euin: this.euin,
                  remarks: '',
                  sub_broker_arn: '',
                  mobile_no: transaction_basket_item.folio_mobile
                    ? transaction_basket_item.folio_mobile.slice(-10)
                    : '',
                  email: transaction_basket_item.folio_email
                    ? transaction_basket_item.folio_email
                    : '',
                  bank_account_no: '',
                };

                const register_swp = await this.bsev1Service.register_swp(data);
                console.log('register_swp', register_swp);
                const extracted_result = await this.extract_swp_RegId(
                  register_swp.data,
                );
                console.log('extracted_result', extracted_result);
                const registered_swp = new BseSwpRegister();
                (registered_swp.client_code = data.client_code),
                  (registered_swp.bse_scheme_code = data.bse_scheme_code),
                  (registered_swp.transaction_mode = data.transaction_mode),
                  (registered_swp.folio_no = data.folio_no),
                  (registered_swp.internal_ref_no = data.internal_ref_no),
                  (registered_swp.start_date = data.start_date),
                  (registered_swp.no_of_withdrawls = data.no_of_withdrawls),
                  (registered_swp.frequency_type = data.frequency_type),
                  (registered_swp.installment_amount = data.installment_amount),
                  (registered_swp.installment_units = data.installment_units),
                  (registered_swp.first_order_today = data.first_order_today),
                  (registered_swp.sub_br_code = data.sub_br_code),
                  (registered_swp.euin_declaration_flag =
                    data.euin_declaration_flag),
                  (registered_swp.euin = data.euin),
                  (registered_swp.remarks = data.remarks),
                  (registered_swp.sub_broker_arn = data.sub_broker_arn),
                  (registered_swp.mobile_no = data.mobile_no
                    ? parseInt(data.mobile_no)
                    : null),
                  (registered_swp.email = data.email),
                  (registered_swp.bank_account_no = data.bank_account_no);
                registered_swp.success_flag = extracted_result.successFlag;
                registered_swp.bse_remarks = extracted_result.bseRemarks;
                registered_swp.swp_reg_id = extracted_result.reg_no;
                registered_swp.transaction_basket_item_id =
                  transaction_basket_item.id;
                console.log(
                  'registered_swp.start_date',
                  registered_swp.start_date,
                );
                const saved_swp = await this.swpRegisterRepo.save(
                  registered_swp,
                );
                console.log('saved_swp', saved_swp);

                if (
                  extracted_result.successFlag == '100' &&
                  extracted_result.reg_no != null
                ) {
                  transaction_basket_item.fp_swp_id =
                    registered_swp.swp_reg_id.toString();
                  transaction_basket_item.status = 'active';

                  let redemption = new Redemption();
                  redemption.confirmed_at = new Date();

                  if (transaction_basket_item.amount) {
                    redemption.amount = transaction_basket_item.amount;
                  } else {
                    redemption.units = transaction_basket_item.units;
                  }

                  // if (transaction_basket_item.is_instant_redemption) {
                  //     fp_redemption_dto.redemption_mode = "instant";
                  // } else {
                  //     fp_redemption_dto.redemption_mode = "normal"
                  // }
                  if (transaction_basket_item.folio_number) {
                    redemption.folio_number =
                      transaction_basket_item.folio_number;
                  }
                  redemption.plan =
                    transaction_basket_item.mf_redemption_plan.id;
                  redemption.user_ip = ip;
                  redemption.scheme = transaction_basket_item.fund_isin;
                  redemption.server_ip = server_ip;
                  // let fp_create_redemption = await this.fintechService.create_redemption(fp_redemption_dto);
                  // if (fp_create_redemption.status == HttpStatus.OK) {

                  // fp_create_redemption.data["fp_id"] = fp_create_redemption.data.id;
                  redemption.user_id = transaction_basket_item.user_id;

                  redemption.transaction_basket_item_id =
                    transaction_basket_item.id;
                  redemption.folio_number =
                    transaction_basket_item.folio_number;
                  redemption.state = 'confirmed';
                  redemption.scheme = transaction_basket_item.fund_isin;
                  redemption.gateway = 'rta';
                  redemption.initiated_by = 'investor';
                  redemption.user_ip = ip;
                  redemption.server_ip = server_ip;
                  // console.log("TRANDSACTION OBJ", fp_create_redemption);
                  // delete fp_create_redemption.data.id;
                  // redemption = fp_create_redemption.data;
                  redemption = await this.redemptionRepository.save(redemption);

                  const password_body = {
                    MemberId: this.member_id,
                    PassKey: this.password,
                    Password: this.password,
                    RequestType: 'CHILDORDER',
                    UserId: this.user_id,
                  };
                  const child_order_password =
                    await this.bsev1Service.child_order_password(password_body);
                  console.log('child_order_password', child_order_password);

                  const date = new Date();
                  const formattedDate = date
                    .toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                    .toUpperCase()
                    .replace(',', '');
                  const child_order = {
                    ClientCode: onboardingDetails.fp_investor_id,
                    Date: formattedDate,
                    EncryptedPassword: child_order_password.data.ResponseString,
                    MemberCode: this.member_id,
                    RegnNo: registered_swp.swp_reg_id,
                    SystematicPlanType: 'SWP',
                  };
                  const c_order_result =
                    await this.bsev1Service.child_order_request(child_order);
                  console.log('c_order_result', c_order_result);

                  if (c_order_result.data.status == 100) {
                    const swp_order = new BsePurchaseRedemptionOrder();
                    swp_order.type = 'swp';
                    swp_order.order_no =
                      c_order_result.data.ChildOrderDetails[0].OrderNumber;
                    swp_order.scheme_code =
                      c_order_result.data.ChildOrderDetails[0].BSESchemeCode;
                    swp_order.member_id =
                      c_order_result.data.ChildOrderDetails[0].MemberCode;
                    swp_order.client_code =
                      c_order_result.data.ChildOrderDetails[0].ClientCode;
                    swp_order.user_id = parseInt(this.user_id);
                    swp_order.int_ref_no =
                      c_order_result.data.ChildOrderDetails[0].IntRefNo;
                    swp_order.buy_sell =
                      c_order_result.data.ChildOrderDetails[0].BuySell;
                    swp_order.buy_sell_type =
                      c_order_result.data.ChildOrderDetails[0].BuySellType;
                    swp_order.dp_trans_mode =
                      c_order_result.data.ChildOrderDetails[0].DPTxnType;
                    swp_order.amount =
                      c_order_result.data.ChildOrderDetails[0].Amount;
                    swp_order.qty =
                      c_order_result.data.ChildOrderDetails[0].Quantity;
                    swp_order.folio_no =
                      c_order_result.data.ChildOrderDetails[0].FolioNo;
                    //    swp_order.first_order_flag = c_order_result.data.ChildOrderDetails[0].FirstOrderTodayFlag
                    swp_order.mandate_id = '';
                    swp_order.sub_br_code =
                      c_order_result.data.ChildOrderDetails[0].SubBrokerCode;
                    swp_order.euin =
                      c_order_result.data.ChildOrderDetails[0].EUINNumber;
                    swp_order.euin_flag =
                      c_order_result.data.ChildOrderDetails[0].EUINFlag;
                    swp_order.reg_no = registered_swp.swp_reg_id;
                    swp_order.bse_remarks = c_order_result.data.Message;
                    swp_order.success_flag = c_order_result.data.Status;
                    swp_order.transaction_basket_item_id =
                      transaction_basket_item.id;
                    await this.purchaseOrderRepo.save(swp_order);

                    redemption.bse_order_no =
                      c_order_result.data.ChildOrderDetails[0].OrderNumber;
                    redemption = await this.redemptionRepository.save(
                      redemption,
                    );
                  }
                } else {
                  transaction_basket_item.status = 'failed';
                }
                await this.transactionBasketItemRepository.save(
                  transaction_basket_item,
                );

                // if (transaction_basket_item.generate_first_installment_now) {

                // }
                // } else {
                //     transaction_basket_item.response_message = "SWP Created but first installment fetch has some issue: " + fp_installments.error;
                //     transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);
                // }

                // } else {
                //     transaction_basket_item.status = "failed";
                //     transaction_basket_item.response_message = fp_create_swp.error;
                //     transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);
                // }
                break;
              }
              case 'switch_fund': {
                console.log('helllo', transaction_basket_item.switch_fund);
                if (
                  transaction_basket_item.status != 'failed' &&
                  transaction_basket_item.switch_fund
                ) {
                  console.log(consent_object);
                  // let fp_update_switch = await this.fintechService.update_switch({ id: transaction_basket_item.switch_fund.fp_id, state: 'confirmed', consent: consent_object });
                  // if (fp_update_switch.status == HttpStatus.OK) {

                  // transaction_basket_item.status = "confirmed";
                  transaction_basket_item.is_consent_verified = true;
                  transaction_basket_item =
                    await this.transactionBasketItemRepository.save(
                      transaction_basket_item,
                    );

                  const get_password = await this.bsev1Service.get_password();
                  console.log('get_password', get_password);
                  const encrypted_password = await this.extractPassword(
                    get_password.data,
                  );
                  console.log('password', encrypted_password);
                  const from_funddata = await this.funddetailRepository.findOne(
                    {
                      where: { isin: transaction_basket_item.fund_isin },
                    },
                  );
                  const to_funddata = await this.funddetailRepository.findOne({
                    where: { isin: transaction_basket_item.to_fund_isin },
                  });
                  const data = {
                    Transactioncode: 'NEW',
                    UniqueRefNo: await this.generateReferenceNumber(
                      this.member_id,
                    ),
                    OrderId: '',
                    UserID: this.user_id,
                    MemberCode: this.member_id,
                    ClientCode: onboardingDetails.fp_investor_id,
                    FromSchemeCode: from_funddata.schemeCode,
                    ToSchemeCode: to_funddata.schemeCode,
                    Buysell: 'SO',
                    Buyselltype: 'FRESH',
                    DpTxnMode: 'P',
                    SwitchAmount: transaction_basket_item.amount,
                    SwitchUnits: transaction_basket_item.units
                      ? transaction_basket_item.units
                      : 0,
                    AllUnitsFlag: 'Y',
                    FolioNo: transaction_basket_item.folio_number
                      ? transaction_basket_item.folio_number
                      : '',
                    Remarks: '',
                    KycStatus: 'Y',
                    SubbrCode: '',
                    Euin: this.euin,
                    EuinVal: this.euin != null ? 'Y' : 'N',
                    MinRedeem: 'Y',
                    IPAddress: '',
                    Password: encrypted_password,
                    PassKey: this.password,
                    Param1: '',
                    Param2: transaction_basket_item.folio_mobile
                      ? transaction_basket_item.folio_mobile.slice(-10)
                      : '',
                    Param3: transaction_basket_item.folio_email
                      ? transaction_basket_item.folio_email
                      : '',
                    Filler1: '',
                    Filler2: '',
                    Filler3: '',
                    Filler4: '',
                    Filler5: '',
                    Filler6: '',
                  };
                  const bse_update_stp =
                    await this.bsev1Service.bse_order_switch(data);
                  console.log('bse_update_switch', bse_update_stp);

                  const uniqueNo = new UniqueReferenceNo();
                  uniqueNo.unique_number = data.UniqueRefNo;
                  await this.uniqueReferenceNoRepo.save(uniqueNo);

                  const extractedData = await this.extract_switch_OrderId(
                    bse_update_stp.data,
                  );
                  const switchData = new BseSwitchOrder();
                  switchData.type = transaction_basket_item.transaction_type;
                  switchData.transaction_code = data.Transactioncode;
                  switchData.unique_reference_no = data.UniqueRefNo;
                  switchData.order_id = Number(data.OrderId);
                  switchData.user_id = parseInt(data.UserID);
                  switchData.member_id = data.MemberCode;
                  switchData.client_code = data.ClientCode;
                  switchData.from_scheme_code = data.FromSchemeCode;
                  switchData.to_scheme_code = data.ToSchemeCode;
                  switchData.buy_sell = data.Buysell;
                  switchData.buy_sell_type = data.Buyselltype;
                  switchData.dp_trans_mode = data.DpTxnMode;
                  switchData.switch_amount = data.SwitchAmount;
                  switchData.switch_units = data.SwitchUnits;
                  switchData.all_units_flag = data.AllUnitsFlag;
                  switchData.folio_no = data.FolioNo;
                  switchData.remarks = data.Remarks;
                  switchData.kyc_status = data.KycStatus;
                  switchData.sub_br_code = data.SubbrCode;
                  switchData.euin = data.Euin;
                  switchData.euin_flag = data.EuinVal;
                  switchData.min_redeem = data.MinRedeem;
                  switchData.ip_add = data.IPAddress;
                  switchData.password = '';
                  switchData.passKey = '';
                  switchData.param1 = data.Param1;
                  switchData.param2 = data.Param2;
                  switchData.param3 = data.Param3;
                  switchData.filler1 = data.Filler1;
                  switchData.filler2 = data.Filler2;
                  switchData.filler3 = data.Filler3;
                  switchData.filler4 = data.Filler4;
                  switchData.filler5 = data.Filler5;
                  switchData.filler6 = data.Filler6;
                  switchData.order_no = Number(extractedData.order_no);
                  switchData.bse_remarks = extractedData.bseRemarks;
                  switchData.success_flag = extractedData.successFlag;
                  switchData.transaction_basket_item_id =
                    transaction_basket_item.id;
                  const saved_switch = await this.switchOrderRepo.save(
                    switchData,
                  );
                  console.log('saved_switch', saved_switch);

                  let switch_fund = await this.switchRepository.findOneBy({
                    transaction_basket_item_id: transaction_basket_item.id,
                  });
                  // fp_update_switch.data["fp_id"] = fp_update_switch.data.id;
                  // fp_update_switch.data.id = switch_fund.id;
                  if (
                    extractedData.successFlag == '0' &&
                    extractedData.order_no != null
                  ) {
                    transaction_basket_item.status = 'successful';
                    switch_fund.state = 'successful';
                  } else {
                    transaction_basket_item.status = 'failed';
                    switch_fund.state = 'failed';
                  }
                  switch_fund = await this.switchRepository.save(switch_fund);
                  await this.transactionBasketItemRepository.save(
                    transaction_basket_item,
                  );

                  // } else {
                  //     if (fp_update_switch.error == "failed to update investor consent, already exists") {
                  //         transaction_basket_item.is_consent_verified = true;
                  //         transaction_basket_item.response_message = "";
                  //         transaction_basket_item.status = "confirmed";
                  //         transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);

                  //     } else {

                  //         transaction_basket_item.status = "failed consent update";
                  //         transaction_basket_item.is_consent_verified = false;
                  //         transaction_basket_item.response_message = fp_update_switch.error;
                  //         transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);
                  //     }
                  // }
                }
                break;
              }
              case 'stp': {
                transaction_basket_item.is_consent_verified = true;
                transaction_basket_item.status = 'confirmed';
                transaction_basket_item =
                  await this.transactionBasketItemRepository.save(
                    transaction_basket_item,
                  );

                // let fp_stp_dto = new FpStpDTO();
                // fp_stp_dto.amount = transaction_basket_item.amount;
                // if (transaction_basket_item.folio_number) {
                //     fp_stp_dto.folio_number = transaction_basket_item.folio_number;
                // }

                // fp_stp_dto.mf_investment_account = onboardingDetails.fp_investment_account_id;
                // fp_stp_dto.user_ip = ip;
                // fp_stp_dto.switch_in_scheme = transaction_basket_item.to_fund_isin;
                // fp_stp_dto.switch_out_scheme = transaction_basket_item.fund_isin;
                // fp_stp_dto.server_ip = server_ip;
                // fp_stp_dto.mf_investment_account = onboardingDetails.fp_investment_account_id;
                // fp_stp_dto.installment_day = transaction_basket_item.installment_day;
                // fp_stp_dto.frequency = transaction_basket_item.frequency;
                // fp_stp_dto.systematic = true;

                // fp_stp_dto.generate_first_installment_now = false;
                // fp_stp_dto.auto_generate_installments = true;
                // fp_stp_dto.number_of_installments = transaction_basket_item.number_of_installments;

                // fp_stp_dto.consent = consent_object;

                // let fp_create_stp = await this.fintechService.create_stp(fp_stp_dto);
                // if (fp_create_stp.status == 200) {

                const from_funddata = await this.funddetailRepository.findOne({
                  where: { isin: transaction_basket_item.fund_isin },
                });
                console.log('funddata', from_funddata);
                const to_funddata = await this.funddetailRepository.findOne({
                  where: { isin: transaction_basket_item.to_fund_isin },
                });
                console.log('to_funddata', to_funddata);
                const startdate = transaction_basket_item.start_date
                  .toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                  .replace(/\//g, '/');
                console.log('start_date', startdate);
                const data = {
                  login_id: this.user_id,
                  member_id: this.member_id,
                  password: this.password,
                  transaction_type: 'NEW',
                  stp_type: 'AMC',
                  client_code: onboardingDetails.fp_investor_id,
                  from_bse_scheme_code: from_funddata.schemeCode,
                  to_bse_scheme_code: to_funddata.schemeCode,
                  buy_sell_type: 'Fresh',
                  transaction_mode: 'P',
                  folio_no: transaction_basket_item.folio_number
                    ? transaction_basket_item.folio_number.slice(-10)
                    : '',
                  stp_registration_no: null,
                  internal_ref_no: '',
                  start_date: startdate,
                  frequency_type:
                    transaction_basket_item.frequency.toUpperCase(),
                  no_of_transfers:
                    transaction_basket_item.number_of_installments,
                  installment_amount: transaction_basket_item.amount,
                  units: transaction_basket_item.units
                    ? transaction_basket_item.units
                    : null,
                  first_order_flag: 'N',
                  sub_br_code: '',
                  euin_declaration_flag: this.euin ? 'Y' : 'N',
                  euin: this.euin,
                  remarks: '',
                  end_date: '',
                  sub_broker_arn: '',
                  filler_1: transaction_basket_item.folio_mobile
                    ? transaction_basket_item.folio_mobile
                    : '',
                  filler_2: transaction_basket_item.folio_email
                    ? transaction_basket_item.folio_email
                    : '',
                  filler_3: '',
                  filler_4: '',
                  filler_5: '',
                };

                const stp_register = await this.bsev1Service.register_stp(data);
                console.log('stp_register', stp_register);

                const registered_stp = new BseStpRegister();
                (registered_stp.login_id = this.user_id),
                  (registered_stp.member_id = this.member_id),
                  (registered_stp.password = ''),
                  (registered_stp.transaction_type = data.transaction_type),
                  (registered_stp.stp_type = data.stp_type),
                  (registered_stp.client_code = data.client_code),
                  (registered_stp.from_bse_scheme_code =
                    from_funddata.schemeCode),
                  (registered_stp.to_bse_scheme_code = data.to_bse_scheme_code),
                  (registered_stp.buy_sell_type = data.buy_sell_type),
                  (registered_stp.transaction_mode = data.transaction_mode),
                  (registered_stp.folio_no = data.folio_no),
                  (registered_stp.stp_registration_no =
                    stp_register.data.STPRegNo),
                  (registered_stp.internal_ref_no = data.internal_ref_no),
                  (registered_stp.start_date = data.start_date),
                  (registered_stp.frequency_type = data.frequency_type),
                  (registered_stp.no_of_transfers = data.no_of_transfers),
                  (registered_stp.installment_amount = data.installment_amount),
                  (registered_stp.units =
                    typeof data.units === 'string'
                      ? parseInt(data.units)
                      : data.units),
                  (registered_stp.first_order_today = data.first_order_flag),
                  (registered_stp.sub_br_code = data.sub_br_code),
                  (registered_stp.euin_declaration_flag =
                    data.euin_declaration_flag),
                  (registered_stp.euin = data.euin),
                  (registered_stp.remarks = data.remarks),
                  (registered_stp.end_date = data.end_date),
                  (registered_stp.sub_broker_arn = data.sub_broker_arn),
                  (registered_stp.filler_1 = data.filler_1),
                  (registered_stp.filler_2 = data.filler_2),
                  (registered_stp.filler_3 = data.filler_3),
                  (registered_stp.filler_4 = data.filler_4),
                  (registered_stp.filler_5 = data.filler_5);
                registered_stp.response_stp_reg_no = stp_register.data.STPRegNo;
                registered_stp.bse_remarks = stp_register.data.BSERemarks;
                registered_stp.success_flag = stp_register.data.SuccessFlag;
                registered_stp.from_order_no = stp_register.data.FromOrderNo;
                registered_stp.to_order_no = stp_register.data.ToOrderNo;
                registered_stp.transaction_basket_item_id =
                  transaction_basket_item.id;
                const saved_stp = await this.stpRegisterRepo.save(
                  registered_stp,
                );
                console.log('saved_stp', saved_stp);

                if (
                  stp_register.data.SuccessFlag == '0' &&
                  stp_register.data.STPRegNo != null
                ) {
                  transaction_basket_item.status = 'active';
                  transaction_basket_item.fp_stp_id =
                    registered_stp.response_stp_reg_no.toString();

                  let switch_fund = new SwitchFunds();
                  switch_fund.confirmed_at = new Date();

                  if (transaction_basket_item.amount) {
                    switch_fund.amount = transaction_basket_item.amount;
                  } else {
                    switch_fund.units = transaction_basket_item.units;
                  }

                  if (transaction_basket_item.folio_number) {
                    switch_fund.folio_number =
                      transaction_basket_item.folio_number;
                  }
                  switch_fund.plan = transaction_basket_item.mf_switch_plan.id;
                  switch_fund.user_ip = ip;

                  switch_fund.server_ip = server_ip;
                  // switch_fund.mf_investment_account = onboardingDetails.fp_investment_account_id;

                  switch_fund.user_id = transaction_basket_item.user_id;

                  switch_fund.transaction_basket_item_id =
                    transaction_basket_item.id;
                  switch_fund.folio_number =
                    transaction_basket_item.folio_number;
                  switch_fund.state = 'confirmed';
                  switch_fund.switch_out_scheme =
                    transaction_basket_item.fund_isin;
                  switch_fund.switch_in_scheme =
                    transaction_basket_item.to_fund_isin;

                  switch_fund.gateway = 'rta';
                  switch_fund.initiated_by = 'investor';
                  switch_fund.user_ip = ip;
                  switch_fund.server_ip = server_ip;

                  switch_fund = await this.switchRepository.save(switch_fund);

                  const password_body = {
                    MemberId: this.member_id,
                    PassKey: this.password,
                    Password: this.password,
                    RequestType: 'CHILDORDER',
                    UserId: this.user_id,
                  };
                  const child_order_password =
                    await this.bsev1Service.child_order_password(password_body);
                  console.log('child_order_password', child_order_password);

                  const date = new Date();
                  const formattedDate = date
                    .toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                    .toUpperCase()
                    .replace(',', '');
                  const child_order = {
                    ClientCode: onboardingDetails.fp_investor_id,
                    Date: formattedDate,
                    EncryptedPassword: child_order_password.data.ResponseString,
                    MemberCode: this.member_id,
                    RegnNo: stp_register.data.STPRegNo,
                    SystematicPlanType: 'STP',
                  };
                  const c_order_result =
                    await this.bsev1Service.child_order_request(child_order);
                  console.log('c_order_result', c_order_result);

                  if (c_order_result.data.status == 100) {
                    const stp_order = new BseSwitchOrder();
                    stp_order.order_no =
                      c_order_result.data.ChildOrderDetails[0].OrderNumber;
                    stp_order.type = 'stp';
                    stp_order.user_id = parseInt(this.user_id);
                    stp_order.from_scheme_code =
                      c_order_result.data.ChildOrderDetails[0].BSESchemeCode;
                    stp_order.member_id =
                      c_order_result.data.ChildOrderDetails[0].MemberCode;
                    stp_order.client_code =
                      c_order_result.data.ChildOrderDetails[0].ClientCode;
                    stp_order.int_ref_no =
                      c_order_result.data.ChildOrderDetails[0].IntRefNo;
                    stp_order.buy_sell =
                      c_order_result.data.ChildOrderDetails[0].BuySell;
                    stp_order.dp_trans_mode =
                      c_order_result.data.ChildOrderDetails[0].DPTxnType;
                    stp_order.switch_amount =
                      c_order_result.data.ChildOrderDetails[0].Amount;
                    stp_order.switch_units =
                      c_order_result.data.ChildOrderDetails[0].Quantity;
                    stp_order.folio_no =
                      c_order_result.data.ChildOrderDetails[0].FolioNo;
                    //    stp_order.first_order_flag = c_order_result.data.ChildOrderDetails[0].FirstOrderTodayFlag
                    //    stp_order.mandate_id = parseInt(xsip_registered.mandate_id)
                    stp_order.sub_br_code =
                      c_order_result.data.ChildOrderDetails[0].SubBrokerCode;
                    stp_order.euin =
                      c_order_result.data.ChildOrderDetails[0].EUINNumber;
                    stp_order.euin_flag =
                      c_order_result.data.ChildOrderDetails[0].EUINFlag;
                    stp_order.register_no = stp_register.data.STPRegNo;
                    stp_order.bse_remarks = c_order_result.data.Message;
                    stp_order.success_flag = c_order_result.data.Status;
                    stp_order.transaction_basket_item_id =
                      transaction_basket_item.id;
                    await this.switchOrderRepo.save(stp_order);

                    switch_fund.switch_order_no =
                      c_order_result.data.ChildOrderDetails[0].OrderNumber;
                    switch_fund = await this.switchRepository.save(switch_fund);
                  }
                } else {
                  transaction_basket_item.status = 'failed';
                }
                await this.transactionBasketItemRepository.save(
                  transaction_basket_item,
                );

                // let get_password = await this.bsev1Service.get_password()
                // let encrypted_password = await this.extractPassword(get_password.data)
                // let from_funddata = await this.funddetailRepository.findOne({ where: { isin: transaction_basket_item.fund_isin } })
                // let to_funddata = await this.funddetailRepository.findOne({ where: { isin: transaction_basket_item.to_fund_isin } })
                // let data_SO = {
                //     Transactioncode: "NEW",
                //     UniqueRefNo: await this.generateReferenceNumber(this.member_id),
                //     OrderId: "",
                //     UserID: this.user_id,
                //     MemberCode: this.member_id,
                //     ClientCode: onboardingDetails.fp_investor_id,
                //     FromSchemeCode: from_funddata.amcSchemeCode,
                //     ToSchemeCode: to_funddata.amcSchemeCode,
                //     Buysell: "SO",
                //     Buyselltype: "FRESH",
                //     DpTxnMode: "P",
                //     SwitchAmount: transaction_basket_item.amount,
                //     SwitchUnits: transaction_basket_item.units ? transaction_basket_item.units : "",
                //     AllUnitsFlag: "Y",
                //     FolioNo: transaction_basket_item.folio_number ? transaction_basket_item.folio_number : "",
                //     Remarks: "",
                //     KycStatus: "",
                //     SubbrCode: "",
                //     Euin: this.euin,
                //     EuinVal: this.euin ? "Y" : "N",
                //     MinRedeem: "N",
                //     IPAddress: "",
                //     Password: encrypted_password,
                //     PassKey: this.password,
                //     Param1: "",
                //     Param2: "",
                //     Param3: "",
                //     Filler1: "",
                //     Filler2: "",
                //     Filler3: "",
                //     Filler4: "",
                //     Filler5: "",
                //     Filler6: ""

                // }
                // let bse_update_stp_SO = await this.bsev1Service.bse_order_switch(data_SO);
                // console.log("bse_update_stp_SO", bse_update_stp_SO)

                // let uniqueNo_SO = new UniqueReferenceNo()
                // uniqueNo_SO.unique_number= data_SO.UniqueRefNo
                // await this.uniqueReferenceNoRepo.save(uniqueNo_SO)

                // let stp_dto = new BseSwitchOrder()
                // stp_dto.transaction_code = data_SO.Transactioncode

                // if (transaction_basket_item.generate_first_installment_now) {

                // let fp_installments = await this.fintechService.get_plan_switches(transaction_basket_item.fp_stp_id);

                // if (fp_installments.status == 200) {
                //     if (fp_installments.data.length > 0) {

                //         let switches = new SwitchFunds();
                //         fp_installments.data[0]["fp_id"] = fp_installments.data[0].id;
                //         fp_installments.data[0]["user_id"] = transaction_basket_item.user_id;

                //         fp_installments.data[0]["transaction_basket_item_id"] = transaction_basket_item.id;
                //         console.log("TRANDSACTION OBJ", fp_installments.data[0]);
                //         delete fp_installments.data[0].id;
                //         switches = fp_installments.data[0];
                //         console.log("SWITCH OBJ", switches);
                //         switches = await this.switchRepository.save(switches);
                //     }
                // } else {
                //     transaction_basket_item.response_message = "STP Created but first installment fetch has some issue: " + fp_installments.error;
                //     transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);
                // }

                // }

                //  else {
                //     transaction_basket_item.status = "failed";
                //     transaction_basket_item.response_message = fp_create_stp.error;
                //     transaction_basket_item = await this.transactionBasketItemRepository.save(transaction_basket_item);
                // }
                break;
              }
            }
          }

          transaction_basket.is_consent_verified = true;
          transaction_basket = await this.transactionBasketRepository.save(
            transaction_basket,
          );

          const results = await this.transactionBasketRepository.findOne({
            where: { id: transaction_basket.id },
            relations: [
              'transaction_basket_items',
              'transaction_basket_items.purchases',
              'transaction_basket_items.redemption',
              'transaction_basket_items.switch_fund',
            ],
          });

          return { status: HttpStatus.OK, data: results };
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'OTP does not match',
          };
        }
      } else {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Sorry no transaction basket found with the given ID',
        };
      }
    } catch (err) {
      console.log('err', err);
      return { status: HttpStatus.BAD_REQUEST, message: err.message };
    }
  }

  async generateReferenceNumber(userCode: string) {
    const today = new Date();
    const datePart = today.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
    console.log('datePart', datePart);
    // Find the last order for today and user
    const lastOrder = await this.uniqueReferenceNoRepo
      .createQueryBuilder('order')
      .where('order.unique_number LIKE :refNo', {
        refNo: `${datePart}${userCode}%`,
      })
      .orderBy('order.unique_number', 'DESC')
      .getOne();
    console.log('lastOrder', lastOrder);
    let orderNumber = '000001'; // Default first order of the day

    if (lastOrder) {
      // Extract and increment the numeric part
      const lastNumber = parseInt(lastOrder.unique_number.slice(-6), 10);
      console.log('lastNumber', lastNumber);
      orderNumber = String(lastNumber + 1).padStart(6, '0');
      console.log('orderNumber', orderNumber);
    }

    return `${datePart}${userCode}${orderNumber}`;
  }

  async generateReferenceNumberPurchaseRedemption(userCode: string) {
    const today = new Date();
    const datePart = today.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
    console.log('datePart', datePart);
    // Find the last order for today and user
    const lastOrder = await this.purchaseOrderRepo
      .createQueryBuilder('order')
      .where('order.transaction_no LIKE :refNo', {
        refNo: `${datePart}${userCode}%`,
      })
      .orderBy('order.transaction_no', 'DESC')
      .getOne();
    console.log('lastOrder', lastOrder);
    let orderNumber = '000001'; // Default first order of the day

    if (lastOrder) {
      // Extract and increment the numeric part
      const lastNumber = parseInt(lastOrder.transaction_no.slice(-6), 10);
      console.log('lastNumber', lastNumber);
      orderNumber = String(lastNumber + 1).padStart(6, '0');
      console.log('orderNumber', orderNumber);
    }

    return `${datePart}${userCode}${orderNumber}`;
  }

  async initiateBasketPayments(
    transaction_basket_id: number,
    method: string,
    bank_id: number,
    tenant_id: string,
    vpa_id: string,
  ) {
    try {
      let total_amount = 0;
      const transaction_basket = await this.transactionBasketRepository.findOne(
        {
          where: { id: transaction_basket_id },
          relations: [
            'transaction_basket_items',
            'transaction_basket_items.purchases',
            'transaction_basket_items.purchase_redemption_orders',
          ],
        },
      );
      console.log('transaction_basket', transaction_basket);
      if (transaction_basket) {
        const user_onboarding =
          await this.userOnboardingDetailRepository.findOne({
            where: { user_id: transaction_basket.user_id },
          });
        const bank = await this.userBankDetailsRepository.findOne({
          where: { id: bank_id },
        });
        if (!bank) {
          return {
            status: HttpStatus.NOT_FOUND,
            message: 'Sorry no bank details found with the given ID',
          };
        }
        const mandate = await this.mandatesRepository.findOne({
          where: { mandate_id: transaction_basket.payment_id },
        });
        let bank_code;
        let bse_bank_id: string;
        if (method == 'NETBANKING') {
          bank_code = await this.bsev1EmandateBankCodeRepository.findOne({
            where: { bank_name: Like(`%${bank.bank_name}%`) },
          });
          method = bank_code.pay_mode;
          if (bank_code.merged_bank_id) {
            bse_bank_id = bank_code.merged_bank_id;
          } else {
            bse_bank_id = bank_code.bank_id;
          }
        } else if (method == 'UPI') {
          bank_code = await this.bsev1UpiBankCodeRepository.findOne({
            where: { bank_name: Like(`%${bank.bank_name}%`) },
          });
          method = bank_code.pay_mode;
          bse_bank_id = bank_code.bank_code;
        }

        for (const items of transaction_basket.transaction_basket_items) {
          total_amount += items.amount;
        }

        const payment_obj = {
          LoginId: this.user_id,
          Password: this.password,
          membercode: this.member_id,
          clientcode: user_onboarding.fp_investor_id,
          modeofpayment: method,
          bankid: bse_bank_id,
          accountnumber: bank.account_number,
          ifsc: bank.ifsc_code.toUpperCase(),
          ordernumber: '',
          totalamount: total_amount,
          internalrefno: '',
          NEFTreference: '',
          mandateid: '',
          vpaid: '',
          loopbackURL:
            process.env.BASE_URL +
            '/api/transaction-baskets/postback/' +
            tenant_id +
            '?transaction_basket_id=' +
            transaction_basket_id,
          allowloopBack: 'Y',
          filler1: '',
          filler2: '',
          filler3: '',
          filler4: '',
          filler5: '',
          // "payment_postback_url": process.env.BASE_URL + '/api/transaction-baskets/postback/' + tenant_id + '?transaction_basket_id=' + transaction_basket_id,
          // "bank_account": bank
        };
        console.log('payment_obj', payment_obj);
        if (vpa_id) {
          payment_obj.vpaid = vpa_id;
          bank.vpa_id = vpa_id;
          await this.userBankDetailsRepository.save(bank);
        }

        for (const transaction_basket_item of transaction_basket.transaction_basket_items) {
          //update_purchase
          switch (transaction_basket_item.transaction_type) {
            case 'sip': {
              if (
                transaction_basket_item.is_payment &&
                transaction_basket_item.status != 'failed' &&
                transaction_basket_item.purchases.length > 0
              ) {
                // let p = transaction_basket_item.purchase_redemption_orders[transaction_basket_item.purchase_redemption_orders.length - 1];
                // payment_obj.ordernumber += (p.order_no);
                const p =
                  transaction_basket_item.purchases[
                    transaction_basket_item.purchases.length - 1
                  ];
                payment_obj.ordernumber += payment_obj.ordernumber
                  ? `|${p.order_number}`
                  : p.order_number.toString();
              } else {
                if (!transaction_basket_item.is_consent_verified) {
                  transaction_basket_item.response_message =
                    'Please give a consent before purchase of this fund';
                  await this.transactionBasketItemRepository.save(
                    transaction_basket_item,
                  );
                }
              }
              break;
            }

            case 'smart_sip':
            case 'no_mandate_sip':
            case 'lumpsum': {
              if (
                transaction_basket_item.is_payment &&
                transaction_basket_item.status != 'failed' &&
                transaction_basket_item.purchases.length > 0
              ) {
                // let p = transaction_basket_item.purchase_redemption_orders[transaction_basket_item.purchase_redemption_orders.length - 1];
                // payment_obj.ordernumber += (p.order_no);
                const p =
                  transaction_basket_item.purchases[
                    transaction_basket_item.purchases.length - 1
                  ];
                payment_obj.ordernumber += payment_obj.ordernumber
                  ? `|${p.order_number}`
                  : p.order_number.toString();
              } else {
                if (!transaction_basket_item.is_consent_verified) {
                  transaction_basket_item.response_message =
                    'Please give a consent before purchase of this fund';
                  await this.transactionBasketItemRepository.save(
                    transaction_basket_item,
                  );
                }
              }
              break;
            }
          }
        }
        console.log('payment_obj2', payment_obj);

        const results: any = await this.bsev1Service.paymentGateway(
          payment_obj,
        );
        console.log('response', results);
        if (results.statuscode == '100' && results.status == 200) {
          transaction_basket.payment_page = results.responsestring;
          await this.transactionBasketRepository.save(transaction_basket);
          results['token_url'] =
            process.env.BASE_URL +
            '/api/transaction-baskets/payment/postback/' +
            tenant_id +
            '?transaction_basket_id=' +
            transaction_basket_id;
          console.log('results', results);
          return { status: HttpStatus.OK, data: results };
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: results.responsestring,
          };
        }
      } else {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Sorry no transaction basket found with the given ID',
        };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, message: err.message };
    }
  }

  async order_status(tenant_id: string, transaction_basket_id: number) {
    try {
      const transaction_basket = await this.transactionBasketRepository.findOne(
        {
          where: { id: transaction_basket_id },
          relations: [
            'transaction_basket_items',
            'transaction_basket_items.purchases',
            'transaction_basket_items.purchase_redemption_orders',
          ],
        },
      );
      const user_onboarding = await this.userOnboardingDetailRepository.findOne(
        {
          where: { user_id: transaction_basket.user_id },
        },
      );
      const extracted_password =
        await this.bsev1Service.get_password_for_registration(tenant_id);
      const encrypted_password = await this.extractPassword(
        extracted_password.data,
      );
      const order_obj = {
        client_code: user_onboarding.fp_investor_id,
        order_number:
          transaction_basket.transaction_basket_items[0].purchases[0]
            .order_number,
        segment: 'BSEMF',
      };
      const order = await this.bsev1Service.order_status(
        order_obj,
        encrypted_password,
      );
      const result = await this.extractIdFromXML(order.data);
      if (result.status == '100') {
        if (
          result.message.includes('APPROVED') ||
          result.message.includes('REJECTED')
        ) {
          transaction_basket.payment_status == result.message;
          if (result.message.includes('APPROVED')) {
            const updated = await this.transactionBasketItemRepository.update(
              { transaction_basket_id },
              { status: 'successful' },
            );
            const transaction_basket_items =
              await this.transactionBasketItemRepository.find({
                where: { transaction_basket_id },
              });
            for (const items of transaction_basket_items) {
              const purchase = await this.purchaseRepository.update(
                { transaction_basket_item_id: items.id },
                { state: 'successful' },
              );
            }
          } else {
            const updated = await this.transactionBasketItemRepository.update(
              { transaction_basket_id },
              { status: 'failed' },
            );
            const transaction_basket_items =
              await this.transactionBasketItemRepository.find({
                where: { transaction_basket_id },
              });
            for (const items of transaction_basket_items) {
              const purchase = await this.purchaseRepository.update(
                { transaction_basket_item_id: items.id },
                { state: 'failed' },
              );
            }
          }
        }

        return {
          status: HttpStatus.OK,
          message: result.message,
          order_id: transaction_basket_id,
          amount: transaction_basket.total_amount,
        };
      } else {
        return { status: HttpStatus.BAD_REQUEST, message: result.message };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, message: err.message };
    }
  }

  async paymentPage(id: number) {
    try {
      const transaction_basket = await this.transactionBasketRepository.findOne(
        {
          where: { id: id },
        },
      );
      console.log('DADADA', transaction_basket);
      return { status: HttpStatus.OK, data: transaction_basket.payment_page };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, message: err.message };
    }
  }

  dummySuccess() {
    return { status: HttpStatus.OK };
  }

  async paymentPostback(body: any) {
    try {
      const payment_status = this.razorpayService.validate_callback(
        body.razorpay_order_id,
        body.razorpay_payment_id,
        body.razorpay_signature,
      );

      const razorpay_order = await this.rzpOrderRepository.findOne({
        where: { id: body.razorpay_order_id },
      });

      const transaction_basket =
        await this.transactionBasketRepository.findOneBy({
          id: razorpay_order.transaction_basket_id,
        });
      transaction_basket.payment_status = payment_status
        ? 'successful'
        : 'failed';
      transaction_basket.payment_id = body.razorpay_order_id;
      transaction_basket.payment_failure_reason = '';
      await this.transactionBasketRepository.save(transaction_basket);

      const fund_names = '';
      const order_id = transaction_basket.id;
      const transactionBasketItems =
        await this.transactionBasketItemRepository.find({
          where: {
            transaction_basket_id: razorpay_order.transaction_basket_id,
          },
        });
      let amount = 0;
      transactionBasketItems.forEach((item) => {
        amount += item.amount;
      });

      let message = '';
      if (payment_status) {
        message = 'Payment approved';
      } else {
        const item_ids = transactionBasketItems.map((item) => {
          return item.id;
        });

        console.log(item_ids);
        await this.purchaseRepository.update(
          {
            transaction_basket_item_id: In(item_ids),
          },
          { state: 'failed' },
        );

        message = 'Payment failed,' + body.failureReason;
      }
      return {
        status: HttpStatus.OK,
        message: message,
        order_id: order_id,
        amount: amount,
      };
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Sorry something went wrong: ' + err.message,
      };
    }
  }

  async getMfDetailByName(name: string) {
    try {
      await this.mfService.searchFundbyName(name);
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Sorry something went wrong: ' + err.message,
      };
    }
  }

  async getStopNonMandateSystematic(
    user_id: number,
    transaction_item_id: number,
  ) {
    try {
      const basketItem = await this.transactionBasketItemRepository.findOne({
        where: { user_id: user_id, id: transaction_item_id },
      });

      if (basketItem) {
        if (basketItem.status == 'cancelled') {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'already cancelled',
          };
        } else {
          basketItem.status = 'cancelled';
          await this.transactionBasketItemRepository.save(basketItem);
          return {
            status: HttpStatus.OK,
            message: 'cancelled the No Mandate SIP',
          };
        }
      } else {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'No NO Mandate SIP for the user found with the given id ',
        };
      }
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Sorry something went wrong: ' + err.message,
      };
    }
  }

  async stopSystematic(
    user_id: number,
    type: string,
    id: string,
    cancellation_code: string,
    reason: string,
  ) {
    try {
      if (type == 'sip' || type == 'smart_sip') {
        const basket = await this.transactionBasketItemRepository.findOne({
          where: [
            { user_id: user_id, fp_sip_id: id, transaction_type: 'sip' },
            { user_id: user_id, fp_sip_id: id, transaction_type: 'smart_sip' },
          ],
        });
        const user_onboarding_details =
          await this.userOnboardingDetailRepository.findOne({
            where: { user_id: user_id },
          });
        if (basket) {
          const body = {
            client_code: user_onboarding_details.fp_investor_id,
            cancel_code: cancellation_code,
            regn_no: basket.fp_sip_id,
            reason: reason ? reason : '',
          };
          const response = await this.bsev1Service.cancelXsip(body);
          if (response.status == HttpStatus.OK) {
            basket.status = 'cancelled';
            await this.transactionBasketItemRepository.save(basket);
          } else if (response.error == 'Plan is not in active state') {
            basket.status = 'cancelled';
            await this.transactionBasketItemRepository.save(basket);
          }
          return response;
        } else {
          return {
            status: HttpStatus.NOT_FOUND,
            message: 'No SIP for the user found with id - ' + id,
          };
        }
      } else if (type == 'no_mandate') {
        return this.getStopNonMandateSystematic(user_id, parseInt(id));
      } else if (type == 'swp') {
        const basket = await this.transactionBasketItemRepository.findOne({
          where: { user_id: user_id, fp_swp_id: id, transaction_type: 'swp' },
        });
        if (basket) {
          const response = await this.fintechService.cancel_swp(id);
          return response;
        } else {
          return {
            status: HttpStatus.NOT_FOUND,
            message: 'No SWP for the user found with id - ' + id,
          };
        }
      } else if (type == 'stp') {
        const basket = await this.transactionBasketItemRepository.findOne({
          where: { user_id: user_id, fp_stp_id: id, transaction_type: 'stp' },
        });
        if (basket) {
          const response = await this.fintechService.cancel_stp(id);
          return response;
        } else {
          return {
            status: HttpStatus.NOT_FOUND,
            message: 'No STP for the user found with id - ' + id,
          };
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid transaction type, only swp, stp and sip allowed',
        };
      }
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Sorry something went wrong: ' + err.message,
      };
    }
  }

  async get_pending_three_days(user_id: number) {
    try {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const allowedPaymentStatus = ['pending', 'initiated'];

      const pending_baskets = await this.transactionBasketRepository.find({
        where: [
          {
            transaction_basket_items: {
              transaction_type: In([
                'sip',
                'lumpsum',
                'smart_sip',
                'no_mandate_sip',
              ]),
            },
            user_id: user_id,
            created_at: MoreThan(threeDaysAgo),
            status: In(allowedPaymentStatus),
            payment_status: Not('success'),
          },
          {
            transaction_basket_items: {
              transaction_type: In([
                'sip',
                'lumpsum',
                'smart_sip',
                'no_mandate_sip',
              ]),
            },
            user_id: user_id,
            created_at: MoreThan(threeDaysAgo),
            status: In(allowedPaymentStatus),
            payment_status: IsNull(),
          },
        ],
        relations: [
          'transaction_basket_items',
          'transaction_basket_items.purchases',
          'transaction_basket_items.redemption',
          'transaction_basket_items.switch_fund',
        ],
      });

      let j = 0;
      for (const basket of pending_baskets) {
        let i = 0;
        for (const item of basket.transaction_basket_items) {
          if (item.fund_isin) {
            // let fund_detail = await this.getFpFund(item.fund_isin);
            const mf_detail = await this.get_mf_fund_details(item.fund_isin);

            // if (fund_detail.status == HttpStatus.OK) {
            pending_baskets[j].transaction_basket_items[i]['fund_detail'] =
              mf_detail;
            // }
            pending_baskets[j].transaction_basket_items[i]['amc_logo_url'] =
              mf_detail.logo_url;
            pending_baskets[j].transaction_basket_items[i]['fund_plan_id'] =
              mf_detail.fund_plan_id;
            pending_baskets[j].transaction_basket_items[i]['holding_details'] =
              null;
            if (item.folio_number) {
              const holding_details = await this.getHoldingDetails(
                user_id,
                item.fund_isin,
                item.folio_number,
              );
              if (holding_details.status == HttpStatus.OK) {
                pending_baskets[j].transaction_basket_items[i][
                  'holding_details'
                ] = holding_details.data;
              }
            }
          }
          if (item.to_fund_isin) {
            // let fund_detail = await this.getFpFund(item.to_fund_isin);
            const mf_detail = await this.get_mf_fund_details(item.to_fund_isin);
            // if (fund_detail.status == HttpStatus.OK) {
            pending_baskets[j].transaction_basket_items[i]['to_fund_detail'] =
              mf_detail;
            // }

            pending_baskets[j].transaction_basket_items[i]['to_amc_logo_url'] =
              mf_detail.logo_url;
            pending_baskets[j].transaction_basket_items[i]['to_fund_plan_id'] =
              mf_detail.fund_plan_id;
          }

          i++;
        }
        j++;
      }

      return { status: HttpStatus.OK, data: pending_baskets };
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Sorry something went wrong: ' + err.message,
      };
    }
  }

  async getHoldingDetails(
    user_id: number,
    fund_isin: string,
    folio_number: string,
  ) {
    try {
      const userOnboardingDetails: UserOnboardingDetails =
        await this.userOnboardingDetailRepository.findOne({
          where: { user_id: user_id },
        });
      const result = await this.fintechService.get_holdings_report(
        userOnboardingDetails.fp_investment_account_old_id,
        folio_number,
      );
      let holding_detail_resp = null;
      if (result.status == HttpStatus.OK) {
        const holding_details = result.data.folios;
        for (const holding_detail of holding_details) {
          if (holding_detail.folio_number == folio_number) {
            for (const fundHolding of holding_detail.schemes) {
              if (fundHolding.isin == fund_isin) {
                holding_detail_resp = fundHolding;
                break;
              }
            }
          }
        }
      }
      return { status: HttpStatus.OK, data: holding_detail_resp };
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Sorry something went wrong: ' + err.message,
      };
    }
  }

  async get_system_generated_pending_baskets(user_id: number) {
    try {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const allowedPaymentStatus = ['pending', 'initiated'];
      const pending_baskets = await this.transactionBasketRepository.find({
        where: [
          {
            user_id: user_id,
            created_by: 'system',
            status: In(allowedPaymentStatus),
            payment_status: Not('success'),
          },
          {
            user_id: user_id,
            created_by: 'system',
            status: In(allowedPaymentStatus),
            payment_status: IsNull(),
          },
        ],
        relations: [
          'transaction_basket_items',
          'transaction_basket_items.purchases',
          'transaction_basket_items.redemption',
          'transaction_basket_items.switch_fund',
        ],
      });

      let j = 0;
      for (const basket of pending_baskets) {
        let i = 0;
        for (const item of basket.transaction_basket_items) {
          if (item.fund_isin) {
            const fund_detail = await this.getFpFund(item.fund_isin);
            if (fund_detail.status == HttpStatus.OK) {
              pending_baskets[j].transaction_basket_items[i]['fund_detail'] =
                fund_detail.data;
            }

            const mf_detail = await this.get_mf_fund_details(item.fund_isin);

            pending_baskets[j].transaction_basket_items[i]['amc_logo_url'] =
              mf_detail.logo_url;
            pending_baskets[j].transaction_basket_items[i]['fund_plan_id'] =
              mf_detail.fund_plan_id;
            pending_baskets[j].transaction_basket_items[i]['holding_details'] =
              null;
            if (item.folio_number) {
              const holding_details = await this.getHoldingDetails(
                user_id,
                item.fund_isin,
                item.folio_number,
              );
              if (holding_details.status == HttpStatus.OK) {
                pending_baskets[j].transaction_basket_items[i][
                  'holding_details'
                ] = holding_details.data;
              }
            }
          }
          if (item.to_fund_isin) {
            const fund_detail = await this.getFpFund(item.to_fund_isin);
            if (fund_detail.status == HttpStatus.OK) {
              pending_baskets[j].transaction_basket_items[i]['to_fund_detail'] =
                fund_detail.data;
            }

            const mf_detail = await this.get_mf_fund_details(item.to_fund_isin);

            pending_baskets[j].transaction_basket_items[i]['to_amc_logo_url'] =
              mf_detail.logo_url;
            pending_baskets[j].transaction_basket_items[i]['to_fund_plan_id'] =
              mf_detail.fund_plan_id;
          }

          i++;
        }
        j++;
      }

      return { status: HttpStatus.OK, data: pending_baskets };
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Sorry something went wrong: ' + err.message,
      };
    }
  }

  async get_basket_items(transaction_basket_id: number) {
    try {
      const pending_baskets = await this.transactionBasketRepository.findOne({
        where: { id: transaction_basket_id },
        relations: [
          'transaction_basket_items',
          'transaction_basket_items.purchases',
          'transaction_basket_items.redemption',
          'transaction_basket_items.switch_fund',
        ],
      });
      return { status: HttpStatus.OK, data: pending_baskets };
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Sorry something went wrong: ' + err.message,
      };
    }
  }

  async deactivate_basket_item(
    transaction_basket_item_id: number,
    user: Users,
  ) {
    try {
      let basket_item: TransactionBasketItems =
        await this.transactionBasketItemRepository.findOne({
          where: { id: transaction_basket_item_id },
        });
      if (user.role == 'Admin' || user.id == basket_item.user_id) {
        basket_item.is_active = false;
        basket_item = await this.transactionBasketItemRepository.save(
          basket_item,
        );
        return { status: HttpStatus.OK, data: basket_item };
      } else {
        return {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Sorry you are not allowed to delete basket items',
        };
      }
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Sorry something went wrong: ' + err.message,
      };
    }
  }

  async getPaymentPageResult(rzp_order_id: string, tenant_id: string) {
    try {
      console.log('ok help 1');
      const configService = new ConfigService();
      console.log('ok help 2');

      const rzp_key = configService.get('TPV_RAZORPAY_KEY_ID');
      console.log('ok help 3');

      const rzp_order = await this.rzpOrderRepository.findOneBy({
        id: rzp_order_id,
      });
      console.log('ok help 4');

      console.log('rzp_order', rzp_order);
      return {
        status: HttpStatus.OK,
        ...rzp_order,
        rzp_key: rzp_key,
        post_back_url:
          this.base_url + '/api/transaction-baskets/postback/' + tenant_id,
      };
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Sorry something went wrong: ' + err.message,
      };
    }
  }

  private generateRandomMemOrdRefId(): string {
    // Generate a random 15-digit number as a string
    const randomCode = Math.floor(Math.random() * 10 ** 12).toString();

    // Ensure the string is exactly 15 digits by padding with leading zeroes if necessary
    return randomCode.padStart(15, '0');
  }

  async transformData(rawData, isin: string, plan_id: number) {
    const data = rawData;
    console.log('data', data);

    const frequencyMap = {
      Daily: '1',
      Weekly: '2',
      FortNightly: '3',
      Monthly: '4',
      Quarterly: '5',
      'Half-Yearly': '6',
      Annual: '7',
    };

    const frequencyMapReverse = {
      '1': 'Daily',
      '2': 'Weekly',
      '3': 'FortNightly',
      '4': 'Monthly',
      '5': 'Quarterly',
      '6': 'Half-Yearly',
      '7': 'Annual',
    };

    // Process SIP frequency
    const sipFrequencySpecificData: any = {};
    const sipFrequencies = data.sipFrequency.split(' / ');
    const sipDates = data.sipDates.split(' / ');
    const sipMinAmounts = data.sipMinInvAmount.split(' / ');
    const sipMultiples = data.sipInMultiplesOf.split(' / ');
    const sipMinInstallments = data.sipMinInstallments.split(' / ');
    console.log('sipfrequencies', sipFrequencies);
    sipFrequencies.forEach((frequency, idx) => {
      const freqKey = frequencyMap[frequency];
      sipFrequencySpecificData[frequencyMapReverse[freqKey]] = {
        // dates: `[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]`,
        dates: JSON.parse(
          '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]',
        ),
        // dates: sipDates[idx],//.trim(),
        min_installment_amount: parseFloat(sipMinAmounts[idx]),
        max_installment_amount: 99999999.0,
        amount_multiples: parseFloat(sipMultiples[idx]),
        min_installments: parseInt(sipMinInstallments[idx]),
      };
    });
    console.log('sipFrequencySpecificData', sipFrequencySpecificData);

    // Similarly, handle SWP frequency and STP frequency
    const swpFrequencySpecificData: any = {};
    const swpFrequencies = data.swpFrequency.split(' / ');
    const swpDates = data.swpDates.split(' / ');
    const swpMinAmounts = data.swpMinInvAmount.split(' / ');
    const swpMultiples = data.swpInMultiplesOf.split(' / ');
    const swpMinInstallments = data.swpMinInstallments.split(' / ');

    swpFrequencies.forEach((frequency, idx) => {
      const freqKey = frequencyMap[frequency];
      swpFrequencySpecificData[frequencyMapReverse[freqKey]] = {
        // dates: `[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]`,
        dates: JSON.parse(
          '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]',
        ),
        // dates: swpDates[idx].trim(),
        min_installment_amount: parseFloat(swpMinAmounts[idx]),
        max_installment_amount: 99999999.0,
        min_installments: parseInt(swpMinInstallments[idx]),
        amount_multiples: parseFloat(swpMultiples[idx]),
      };
    });
    console.log('swpFrequencySpecificData', swpFrequencySpecificData);
    // Similar for STP frequency
    const stpFrequencySpecificData: any = {};
    const stpFrequencies = data.stpFrequency.split(' / ');
    const stpDates = data.stpDates.split(' / ');
    const stpMinAmounts = data.stpMinInvAmount.split(' / ');
    const stpMultiples = data.stpInMultiplesOf.split(' / ');
    const stpMinInstallments = data.stpMinInstallments.split(' / ');

    stpFrequencies.forEach((frequency, idx) => {
      const freqKey = frequencyMap[frequency];
      stpFrequencySpecificData[frequencyMapReverse[freqKey]] = {
        // dates: `[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]`,
        dates: JSON.parse(
          '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]',
        ),
        // dates: stpDates[idx].trim(),
        min_installment_amount: parseFloat(stpMinAmounts[idx]),
        max_installment_amount: 99999999.0,
        min_installments: parseInt(stpMinInstallments[idx]),
        amount_multiples: parseFloat(stpMultiples[idx]),
      };
    });
    console.log('stpFrequencySpecificData', stpFrequencySpecificData);

    const frequencyDataProcessor = (frequencies: string, dates: string) => {
      const freqArray = frequencies.split(' / ');
      const dateArray = dates.split(' / ');
      const frequencyMap: any = {};

      freqArray.forEach((frequency, idx) => {
        frequencyMap[frequency] = dateArray[idx]; //.trim();
      });

      return frequencyMap;
    };

    const sipFrequencyData = frequencyDataProcessor(
      rawData.sipFrequency,
      rawData.sipDates,
    );

    // Generate SWP Frequency Data
    const swpFrequencyData = frequencyDataProcessor(
      rawData.swpFrequency,
      rawData.swpDates,
    );

    // Generate STP Frequency Data
    const stpFrequencyData = frequencyDataProcessor(
      rawData.stpFrequency,
      rawData.stpDates,
    );
    let SI, SO, stpSI, stpSO;
    const fund_detail = await this.mutualFundService.getFundDetails(plan_id);
    console.log('funddetails', fund_detail);
    console.log('funddetailsdata', fund_detail['data']);
    console.log('funddetailamc', fund_detail['data']['amc']);
    const funddata = await this.funddetailRepository.findOne({
      where: { isin: isin },
    });
    console.log('funddataaaaaaa', funddata);
    if (funddata.switchFlag == true) {
      if (funddata.purchaseAllowed == true) {
        SI = true;
      } else {
        SI = false;
      }
      if (funddata.redemptionAllowed == true) {
        SO = true;
      } else {
        SO = false;
      }
    } else {
      SI = false;
      SO = false;
    }
    if (funddata.stpFlag == true) {
      if (funddata.purchaseAllowed == true) {
        stpSI = true;
      } else {
        stpSI = false;
      }
      if (funddata.redemptionAllowed == true) {
        stpSO = true;
      } else {
        stpSO = false;
      }
    } else {
      stpSI = false;
      stpSO = false;
    }
    console.log('amoint,', funddata.redemptionAmountMinimum.toString());
    return {
      fund_scheme_id: data.planId,
      name: fund_detail['data']['schemeName'],
      investment_option: 'DIV_REINVESTMENT',
      min_initial_investment: fund_detail['data']['minInitialInvestment'],
      purchaseAllowed: funddata['purchaseAllowed'],
      redemptionAllowed: funddata.redemptionAllowed,
      switchOutAllowed: SO,
      switchInAllowed: SI,
      // min_additional_investment: 1000,
      initial_investment_multiples: data.purchaceInMultiplesOf,
      // max_initial_investment: 99999999,
      // max_additional_investment: 99999999,
      // additional_investment_multiples: 1,
      min_withdrawal_amount: parseFloat(
        funddata.redemptionAmountMinimum.toString(),
      ),
      min_withdrawal_units: parseFloat(
        funddata.minimumRedemptionQty.toString(),
      ),
      max_withdrawal_amount: parseFloat(
        funddata.redemptionAmountMaximum.toString(),
      ),
      max_withdrawal_units: parseFloat(
        funddata.maximumRedemptionQty.toString(),
      ),
      withdrawal_multiples: parseFloat(
        funddata.redemptionAmountMultiple.toString(),
      ),
      withdrawal_multiples_units: parseFloat(
        funddata.redemptionQtyMultiplier.toString(),
      ),
      sip_allowed: funddata.sipFlag,
      swp_allowed: funddata.swpFlag,
      stp_out_allowed: stpSO,
      stp_in_allowed: stpSI,
      sip_frequency_specific_data: sipFrequencySpecificData,
      swp_frequency_specific_data: swpFrequencySpecificData,
      stp_frequency_specific_data: stpFrequencySpecificData,
      // switch_in_allowed: true,
      // min_switch_in_amount: 5000,
      // switch_in_amount_multiples: 0.01,
      fund_category: fund_detail['data']['category']['primaryCategoryName'],
      plan_type: 'REGULAR',
      // sub_category: "",
      // amfi_code: "144545",
      isin: isin,
      // close_ended: false,
      scheme_code: funddata.schemeCode,
      // scheme_code: fund_detail['data']['rtaCode'],
      lock_in: fund_detail['data']['lockInPeriodDays'] ? true : false,
      lock_in_period: fund_detail['data']['lockInPeriodDays'],
      // long_term_period: null,
      // purchase_allowed: true,
      // redemption_allowed: true,
      // insta_redemption_allowed: false,
      // merged: false,
      // merged_to_isin: "",
      // merger_date: null,
      // switch_out_allowed: true,
      // min_switch_out_amount: 5000.0,
      // min_switch_out_units: 0.01,
      // switch_out_unit_multiples: 0.01,
      // switch_out_amount_multiples: 0.01,
      amc_id: fund_detail['data']['amc']['amcId'],
      // rta_id: 1,
      // name_changes: null,
      active: fund_detail['data']['category']['active'],
      // delivery_mode: "PHYSICAL",
      // switch_multiples: 0.01,
      // switch_in_min_amt: 5000,
      // min_sip_amount: 150,
      // min_swp_amount: 500,
      // min_stp_in_amount: 1000,
      // max_sip_amount: 1999999,
      // max_swp_amount: 99999999,
      // max_stp_in_amount: 99999999,
      // min_sip_installments: 12,
      // min_stp_out_installments: 6,
      // min_swp_installments: 6,
      // sip_multiples: 1,
      // swp_multiples: 1,
      // stp_in_amount_multiples: 1,
      sip_frequency_data: sipFrequencyData,
      swp_frequency_data: swpFrequencyData,
      stp_frequency_data: stpFrequencyData,
      // sip_frequency_data: {
      //     "MONTHLY": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28"
      // },
      // swp_frequency_data: {
      //     "MONTHLY": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28"
      // },
      // stp_frequency_data: {
      //     "MONTHLY": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28"
      // }
    };
  }

  async extractPassword(soapResponse: string) {
    try {
      const parsedResult = await parseStringPromise(soapResponse, {
        explicitArray: false,
      });

      const passwordResult =
        parsedResult['s:Envelope']['s:Body']['getPasswordResponse'][
          'getPasswordResult'
        ];

      const password = passwordResult.split('|')[1];

      return password;
    } catch (error) {
      throw new Error(`Failed to extract password: ${error.message}`);
    }
  }

  async extractXSIPOrderId(soapResponse: string) {
    try {
      const parsedResult = await parseStringPromise(soapResponse, {
        explicitArray: false,
      });

      const orderResult =
        parsedResult['s:Envelope']['s:Body']['xsipOrderEntryParamResponse'][
          'xsipOrderEntryParamResult'
        ];
      console.log('orderResult', orderResult);
      const resultParts = orderResult.split('|');
      if (resultParts.length < 9) {
        throw new Error('Unexpected response format');
      }
      console.log('resultParts', resultParts);
      const orderNo = resultParts[5]; // 6th field (index 5)
      const bseRemarks = resultParts[6]; // 7th field (index 6)
      const successFlag = resultParts[7];
      console.log('orderNo', orderNo);
      console.log('bseRemarks', bseRemarks);
      console.log('successFlag', successFlag);
      return { orderNo, bseRemarks, successFlag };
    } catch (error) {
      throw new Error(`Failed to extract password: ${error.message}`);
    }
  }

  async extractpurchase_redemptionOrderId(soapResponse: string) {
    try {
      const parsedResult = await parseStringPromise(soapResponse, {
        explicitArray: false,
      });

      const orderResult =
        parsedResult['s:Envelope']['s:Body']['orderEntryParamResponse'][
          'orderEntryParamResult'
        ];
      console.log('orderResult', orderResult);
      const resultParts = orderResult.split('|');
      if (resultParts.length < 8) {
        throw new Error('Unexpected response format');
      }
      console.log('resultParts', resultParts);
      const orderNo = resultParts[2]; // 6th field (index 5)
      const bseRemarks = resultParts.slice(6, resultParts.length - 1).join('|'); // 7th field (index 6)
      const successFlag = resultParts[resultParts.length - 1];
      console.log('orderNo', orderNo);
      console.log('bseRemarks', bseRemarks);
      console.log('successFlag', successFlag);
      return { orderNo, bseRemarks, successFlag };
    } catch (error) {
      throw new Error(`Failed to extract data: ${error.message}`);
    }
  }

  async extract_swp_RegId(soapResponse: string) {
    try {
      const parsedResult = await parseStringPromise(soapResponse, {
        explicitArray: false,
        tagNameProcessors: [(name) => name.replace(/^.+:/, '')], // Removes namespaces
      });

      const orderResult = parsedResult.Envelope.Body.MFAPIResponse.MFAPIResult;
      console.log('orderResult', orderResult);
      const resultParts = orderResult.split('|');
      if (resultParts.length < 3) {
        throw new Error('Unexpected response format');
      }
      console.log('resultParts', resultParts);
      const successFlag = resultParts[0];
      const bseRemarks = resultParts[1];
      const reg_no = resultParts[2]; // 6th field (index 5)
      console.log('orderNo', reg_no);
      console.log('bseRemarks', bseRemarks);
      console.log('successFlag', successFlag);
      return { successFlag, bseRemarks, reg_no };
    } catch (error) {
      throw new Error(`Failed to extract data: ${error.message}`);
    }
  }

  async extract_switch_OrderId(soapResponse: string) {
    try {
      const parsedResult = await parseStringPromise(soapResponse, {
        explicitArray: false,
        tagNameProcessors: [(name) => name.replace(/^.+:/, '')], // Removes namespaces
      });

      const orderResult =
        parsedResult.Envelope.Body.switchOrderEntryParamResponse
          .switchOrderEntryParamResult;
      console.log('orderResult', orderResult);
      const resultParts = orderResult.split('|');
      if (resultParts.length < 8) {
        throw new Error('Unexpected response format');
      }
      console.log('resultParts', resultParts);
      const successFlag = resultParts[resultParts.length - 1];
      const bseRemarks = resultParts.slice(6, resultParts.length - 1).join('|');
      const order_no = resultParts[2]; // 6th field (index 5)
      console.log('orderNo', order_no);
      console.log('bseRemarks', bseRemarks);
      console.log('successFlag', successFlag);
      return { successFlag, bseRemarks, order_no };
    } catch (error) {
      throw new Error(`Failed to extract data: ${error.message}`);
    }
  }

  calculateStartDate(installmentDay: number): Date {
    const today = new Date();
    let start_date: Date;

    // Check if the installment day is valid for the month
    const isValidDay = (day: number, year: number, month: number) => {
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
      return day <= lastDayOfMonth ? day : lastDayOfMonth;
    };

    // Get the current year and month
    const year = today.getFullYear();
    const month = today.getMonth();

    if (installmentDay < today.getDate()) {
      // Move to next month's installment day
      const nextMonth = month + 1;
      const validDay = isValidDay(installmentDay, year, nextMonth);
      start_date = new Date(year, nextMonth, validDay);
    } else {
      // Use the current month's installment day
      const validDay = isValidDay(installmentDay, year, month);
      start_date = new Date(year, month, validDay);
    }
    console.log('start_date from function', start_date);
    return start_date;
  }

  async req_child(transaction_basket_id) {
    try {
      const transaction_basket = await this.transactionBasketRepository.findOne(
        {
          where: { id: transaction_basket_id },
          relations: [
            'transaction_basket_items',
            'transaction_basket_items.purchases',
            'transaction_basket_items.redemption',
            'transaction_basket_items.switch_fund',
            'transaction_basket_items.mf_switch_plan',
            'transaction_basket_items.mf_purchase_plan',
            'transaction_basket_items.mf_redemption_plan',
          ],
        },
      );
      console.log('transaction_basket', transaction_basket);
      const pass_body = {
        MemberId: this.member_id,
        PassKey: this.password,
        Password: this.password,
        RequestType: 'CHILDORDER',
        UserId: this.user_id,
      };

      const userOnboardingDetails =
        await this.userOnboardingDetailRepository.findOne({
          where: { user_id: transaction_basket.user_id },
        });
      const reg_no = await this.swpRegisterRepo.findOne({
        where: {
          transaction_basket_item_id:
            transaction_basket.transaction_basket_items[0].id,
        },
      });
      const date = new Date();
      const formattedDate = date
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        .toUpperCase()
        .replace(',', '');
      const password = await this.bsev1Service.child_order_password(pass_body);
      console.log('childpassword', password);
      const body = {
        ClientCode: userOnboardingDetails.fp_investor_id,
        Date: formattedDate,
        EncryptedPassword: password.data.ResponseString,
        MemberCode: this.member_id,
        RegnNo: reg_no.swp_reg_id,
        SystematicPlanType: 'SWP',
      };
      const res = await this.bsev1Service.child_order_request(body);
      console.log('order_res', res);
      return { status: HttpStatus.OK, data: res };
    } catch (err) {
      console.log('error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

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

  async get_sip_count(year?: number) {
    try {
      const selectedYear = year ? year : new Date().getFullYear();
      console.log('Selected Year', selectedYear);
      const monthsData = [];
      for (let month = 1; month <= 12; month++) {
        const startOfMonth = moment(`${selectedYear}-${month}-01`)
          .startOf('month')
          .toDate();
        const endOfMonth = moment(startOfMonth).endOf('month').toDate();

        console.log('Start of Month', startOfMonth, 'End of Month', endOfMonth);
        const queryBuilder = await this.transactionBasketItemRepository
          .createQueryBuilder('sip')
          .select('COUNT(sip.id)', 'total_sips')
          .where('sip.transaction_type = :type', { type: 'sip' })
          .andWhere('sip.status = :status', { status: 'active' })
          .andWhere('sip.created_at BETWEEN :start AND :end', {
            start: startOfMonth,
            end: endOfMonth,
          });

        const { total_sips } = await queryBuilder.getRawOne();

        monthsData.push({
          month: month,
          active_sips: parseInt(total_sips, 10),
        });
      }
      return {
        status: HttpStatus.OK,
        year: selectedYear,
        monthsData,
      };
    } catch (err) {
      console.log('Error in get_total_users', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_lumpsum_count(year?: number) {
    try {
      const selectedYear = year ? year : new Date().getFullYear();
      console.log('Selected Year', selectedYear);
      const monthsData = [];
      for (let month = 1; month <= 12; month++) {
        const startOfMonth = moment(`${selectedYear}-${month}-01`)
          .startOf('month')
          .toDate();
        const endOfMonth = moment(startOfMonth).endOf('month').toDate();

        console.log('Start of Month', startOfMonth, 'End of Month', endOfMonth);
        const queryBuilder = await this.transactionBasketItemRepository
          .createQueryBuilder('lumpsum')
          .select('COUNT(lumpsum.id)', 'total_lumpsum')
          .where('lumpsum.transaction_type = :type', { type: 'lumpsum' })
          .andWhere('lumpsum.status = :status', { status: 'confirmed' })
          .andWhere('lumpsum.created_at BETWEEN :start AND :end', {
            start: startOfMonth,
            end: endOfMonth,
          });

        const { total_lumpsum } = await queryBuilder.getRawOne();

        monthsData.push({
          month: month,
          active_lumpsum: parseInt(total_lumpsum, 10),
        });
      }
      return {
        status: HttpStatus.OK,
        year: selectedYear,
        monthsData,
      };
    } catch (err) {
      console.log('Error in get_total_users', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }
}

function generateTransactionNumber() {
  let uniqueCode: string;
  let isUnique = false;
  const storedCode = [];
  // Loop until a unique code is generated
  while (!isUnique) {
    uniqueCode = generateRandomCode();
    console.log('uniqueCode', uniqueCode);
    storedCode.push(uniqueCode);
    // Check if the code exists in the database
    for (const code of storedCode) {
      if (code != uniqueCode)
        // const existingCode = await this.userOnboardingDetailsRepository.findOne({
        //     where: { fp_investment_account_id: uniqueCode },
        // });

        // if (!existingCode) {
        isUnique = true; // Found a unique code
    }
  }

  return uniqueCode;
}

function generateRandomCode(): string {
  // Generate a random 15-digit number as a string
  const randomCode = Math.floor(Math.random() * 10 ** 19).toString();

  // Ensure the string is exactly 15 digits by padding with leading zeroes if necessary
  return randomCode.padStart(19, '0');
}

function formatDateIST(isoString: Date): string {
  const date = new Date(isoString);

  // Convert to IST (UTC+5:30)
  date.setMinutes(date.getMinutes() + 330); // Adding 5 hours 30 minutes

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function NextInstallmentDate(
  frequency,
  installmentDay,
  generateFirstInstallmentNow?: boolean,
) {
  const nextDate = moment(); // Clone to prevent modifying original date
  console.log('nextDate', nextDate);
  if (generateFirstInstallmentNow) {
    switch (frequency) {
      case 'daily':
        nextDate.add(2, 'days');
        break;
      case 'weekly':
        nextDate.add(2, 'weeks');
        break;
      case 'monthly':
        const today = nextDate.date();
        console.log('today', today >= installmentDay);
        if (today < installmentDay) {
          nextDate.add(1, 'months'); // Move to next month if past the installment day
        } else {
          nextDate.add(2, 'months'); // Move to next month on the same day
        }
        break;
      case 'quarterly':
        nextDate.add(6, 'months'); // 2 quarters ahead
        break;
      case 'half-yearly':
        nextDate.add(1, 'years'); // 2 half-years = 1 year
        break;
      case 'yearly':
        nextDate.add(2, 'years'); // Move to 2 years ahead
        break;
      default:
        throw new Error('Invalid frequency');
    }

    if (installmentDay) {
      nextDate.date(installmentDay); // Set to given installment day
      console.log(
        'Next Installment Date with installmentDay:',
        nextDate.format('YYYY-MM-DD'),
      );
    }
  } else {
    switch (frequency) {
      case 'daily':
        nextDate.add(1, 'days');
        break;
      case 'weekly':
        nextDate.add(1, 'weeks');
        break;
      case 'monthly':
        const today = nextDate.date();
        if (installmentDay) {
          if (today >= installmentDay) {
            nextDate.add(1, 'months'); // Move to next month if past the installment day
          }
          nextDate.date(installmentDay);
        } else {
          nextDate.add(1, 'months'); // Move to next month on the same day
        }
        break;
      case 'quarterly':
        nextDate.add(3, 'months');
        if (installmentDay) nextDate.date(installmentDay);
        break;
      case 'half-yearly':
        nextDate.add(6, 'months');
        if (installmentDay) nextDate.date(installmentDay);
        break;
      case 'yearly':
        nextDate.add(1, 'years');
        if (installmentDay) nextDate.date(installmentDay);
        break;
      default:
        throw new Error('Invalid frequency');
    }
  }

  return nextDate.format('YYYY-MM-DD');
}

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function splitCountryCode(mobile: string): {
  countryCode: string;
  number: string;
} {
  const match = mobile.match(/^(\+\d{1,4})(\d+)$/);
  if (match) {
    return { countryCode: match[1], number: match[2] };
  }
  return { countryCode: '', number: mobile }; // Return original if no match
}

function removeIsd(mobileNumber: string): string {
  // Remove ISD code that starts with + or 00 followed by up to 4 digits
  let localNumber = mobileNumber.replace(/^(\+|00)\d{1,4}/, '');

  // Remove all non-digit characters (spaces, dashes, parentheses)
  localNumber = localNumber.replace(/\D/g, '');

  return localNumber;
}
