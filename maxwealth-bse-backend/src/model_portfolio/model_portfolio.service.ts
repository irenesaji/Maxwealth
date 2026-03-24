import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModelPortfolio } from './entities/model_portfolios.entity';
import { ModelPortfolioFund } from './entities/model_portfolio_funds.entity';
import { FintechService } from 'src/utils/fintech/fintech.service';
import { CreateTransactionBasketDTO } from 'src/transaction_baskets/dtos/create_transaction_baskets.dto';
import { CreateTransactionBasketItemDTO } from 'src/transaction_baskets/dtos/create_transaction_basket_items.dto';
import { ChangeFundBasketInputDto } from './dtos/changeFundBasketInput.dto';
import { MutualfundsService } from 'src/utils/mutualfunds/mutualfunds.service';
import { ConfigService } from '@nestjs/config';
import { ModelPortfolioAssociatedFund } from './entities/model_portfolio_associated_fund.entity';
import { ModelPortfolioRepository } from 'src/repositories/model_portfolio.repository';
import { ModelPortfolioFundRepository } from 'src/repositories/model_portfolio_fund.repository';
import { ModelPortfolioAssociatedFundRepository } from 'src/repositories/model_portfolio_associated_fund.repository';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionBasketsService } from 'src/transaction_baskets/transaction_baskets.service';

@Injectable()
export class ModelPortfolioService {
  mf_base_url: string;

  constructor(
    // @InjectRepository(ModelPortfolio)
    // private modelPortfolioRepository: Repository<ModelPortfolio>,
    // @InjectRepository(ModelPortfolioFund)
    // private modelPortfolioFundRepository: Repository<ModelPortfolioFund>,
    // @InjectRepository(ModelPortfolioAssociatedFund)
    // private modelPortfolioAssociatedFundRepository: Repository<ModelPortfolioAssociatedFund>,

    private readonly modelPortfolioRepository: ModelPortfolioRepository,
    private readonly modelPortfolioFundRepository: ModelPortfolioFundRepository,
    private modelPortfolioAssociatedFundRepository: ModelPortfolioAssociatedFundRepository,

    private readonly fintechService: FintechService,
    private readonly mutualFundService: MutualfundsService,
    private readonly transactionBasketService: TransactionBasketsService,
  ) {
    const configService = new ConfigService();
    this.mf_base_url = configService.get('MF_BASE_URL');
  }

  async get_fund_details(isin: string) {
    try {
      const fundDetails: any = await this.mutualFundService.findFundsByIsins([
        isin,
      ]);
      console.log('FUND DETAILS', fundDetails);
      return {
        fund_plan_id: fundDetails.data[0].planId,
        fund_name: fundDetails.data[0].schemeName,
        logo_url: this.mf_base_url + '/' + fundDetails.data[0].amcLogoUrl,
      };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_full_fund_details(isin: string) {
    try {
      const fundDetails: any = await this.mutualFundService.findFundsByIsins([
        isin,
      ]);
      console.log('FUND DETAILS', fundDetails);
      return { status: HttpStatus.OK, data: fundDetails.data[0] };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async fundDistribute(
    amount: number,
    model_portfolio_id: number,
    user_id: number,
    duration: number,
    is_onetime: boolean,
  ) {
    try {
      amount = Math.round(amount);
      const model_portfolio_funds = (
        await this.modelPortfolioFundRepository.find({
          where: { model_portfolio_id: model_portfolio_id },
          relations: ['model_portfolio_associated_fund'],
        })
      ).sort((a, b) => a.priority - b.priority);
      const fund_list = {};
      let current_investment_amount = amount;
      const basket = new CreateTransactionBasketDTO();
      const transaction_basket_items: CreateTransactionBasketItemDTO[] = [];
      basket.transaction_basket_items = transaction_basket_items;

      basket.user_id = user_id;
      const fund_amount_lists = {};

      console.log('model_portfolio_funds', model_portfolio_funds);

      for (const mpf of model_portfolio_funds) {
        // let fp_fund = await this.fintechService.getFpFund(mpf.scheme_isin);
        let mfdetails = await this.get_full_fund_details(mpf.scheme_isin);
        if (mfdetails.status == HttpStatus.OK) {
          mfdetails = mfdetails.data;
          console.log('mf details', mfdetails);

          const fp_fund = await this.transactionBasketService.getFpFund(
            mpf.scheme_isin,
          );
          // {data:{
          //     "name":mfdetails['schemeName'],
          //     "fund_category": "EQUITY",
          //     "plan_type": "REGULAR",
          //     "min_sip_amount":1000,
          //     "min_initial_investment":1000,
          //     "initial_investment_multiples":1,
          //     "purchaseAllowed":true,
          //     "redemptionAllowed":true,
          //     "switchOutAllowed":true,
          //     "switchInAllowed":true,
          //     "sip_allowed": true,
          //     "swp_allowed": true,
          //     "stp_out_allowed": true,
          //     "stp_in_allowed": true,
          //     "sip_frequency_specific_data": {
          //         "monthly": {
          //         "dates": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
          //         "min_installment_amount": 1000.0,
          //         "max_installment_amount": 99999999.0,
          //         "amount_multiples": 100.0,
          //         "min_installments": 6
          //         },
          //         "quarterly": {
          //         "dates": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
          //         "min_installment_amount": 10000.0,
          //         "max_installment_amount": 99999999.0,
          //         "min_installments": 3,
          //         "amount_multiples": 1000
          //         },
          //         "half_yearly": {
          //         "dates": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
          //         "min_installment_amount": 10000.0,
          //         "max_installment_amount": 99999999.0,
          //         "min_installments": 3,
          //         "amount_multiples": 1000
          //         },
          //         "yearly": {
          //         "dates": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
          //         "min_installment_amount": 10000.0,
          //         "max_installment_amount": 99999999.0,
          //         "min_installments": 3,
          //         "amount_multiples": 1000
          //         }
          //     },
          //     "swp_frequency_specific_data": {
          //         "monthly": {
          //         "dates": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
          //         "min_installment_amount": 1000.0,
          //         "max_installment_amount": 99999999.0,
          //         "min_installments": 6,
          //         "amount_multiples": 100.0
          //         },
          //         "quarterly": {
          //         "dates": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
          //         "min_installment_amount": 10000.0,
          //         "max_installment_amount": 99999999.0,
          //         "min_installments": 3,
          //         "amount_multiples": 100.0
          //         },
          //         "half_yearly": {
          //         "dates": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
          //         "min_installment_amount": 10000.0,
          //         "max_installment_amount": 99999999.0,
          //         "min_installments": 3,
          //         "amount_multiples": 1000
          //         },
          //         "yearly": {
          //         "dates": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
          //         "min_installment_amount": 10000.0,
          //         "max_installment_amount": 99999999.0,
          //         "min_installments": 3,
          //         "amount_multiples": 1000
          //         }
          //     },
          //     "stp_frequency_specific_data": {
          //         "monthly": {
          //         "dates": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
          //         "min_installment_amount": 1000.0,
          //         "max_installment_amount": 99999999.0,
          //         "min_installments": 6,
          //         "amount_multiples": 100.0
          //         },
          //         "quarterly": {
          //         "dates": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
          //         "min_installment_amount": 1000.0,
          //         "max_installment_amount": 99999999.0,
          //         "min_installments": 6,
          //         "amount_multiples": 100.0
          //         },
          //         "half_yearly": {
          //         "dates": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
          //         "min_installment_amount": 10000.0,
          //         "max_installment_amount": 99999999.0,
          //         "min_installments": 3,
          //         "amount_multiples": 1000
          //         },
          //         "yearly": {
          //         "dates": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
          //         "min_installment_amount": 10000.0,
          //         "max_installment_amount": 99999999.0,
          //         "min_installments": 3,
          //         "amount_multiples": 1000
          //         }
          //     }}};
          // console.log("hello", fp_fund.status);
          // if (fp_fund.status == HttpStatus.OK) {
          if (
            mpf.scheme_logo != null &&
            mpf.scheme_logo != '' &&
            mpf.fund_plan_id != null
          ) {
            fp_fund.data['scheme_logo'] = mpf.scheme_logo;
            fp_fund.data['fund_plan_id'] = mpf.fund_plan_id;
          } else {
            // if (fp_fund.status == HttpStatus.OK) {
            mpf.scheme_logo = this.mf_base_url + '/' + mfdetails['amcLogoUrl'];
            mpf.fund_plan_id = mfdetails['planId'];

            fp_fund.data['scheme_logo'] =
              this.mf_base_url + '/' + mfdetails['amcLogoUrl'];
            fp_fund.data['fund_plan_id'] = mfdetails['planId'];

            this.modelPortfolioFundRepository.save(mpf);
            // }
          }
          if (mpf.model_portfolio_associated_fund) {
            console.log('ASSOCIATED');
            let associate_mfdetails = await this.get_full_fund_details(
              mpf.model_portfolio_associated_fund.scheme_isin,
            );
            if (associate_mfdetails.status == HttpStatus.OK) {
              associate_mfdetails = associate_mfdetails.data;
              // let associated_fund = await this.fintechService.getFpFund(mpf.model_portfolio_associated_fund.scheme_isin);
              const associated_fund =
                await this.transactionBasketService.getFpFund(
                  mpf.model_portfolio_associated_fund.scheme_isin,
                );
              // {
              //     data: {
              //         "name": associate_mfdetails['schemeName'],
              //         "fund_category": "EQUITY",
              //         "plan_type": "REGULAR",
              //         "min_sip_amount": 1000,
              //         "min_initial_investment": 1000,
              //         "initial_investment_multiples": 1,
              //         "purchaseAllowed": true,
              //         "redemptionAllowed": true,
              //         "switchOutAllowed": true,
              //         "switchInAllowed": true,
              //         "sip_allowed": true,
              //         "swp_allowed": true,
              //         "stp_out_allowed": true,
              //         "stp_in_allowed": true,
              //         "sip_frequency_specific_data": {
              //             "monthly": {
              //                 "dates": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
              //                 "min_installment_amount": 1000.0,
              //                 "max_installment_amount": 99999999.0,
              //                 "amount_multiples": 100.0,
              //                 "min_installments": 6
              //             },
              //             "quarterly": {
              //                 "dates": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
              //                 "min_installment_amount": 10000.0,
              //                 "max_installment_amount": 99999999.0,
              //                 "min_installments": 3,
              //                 "amount_multiples": 1000
              //             },
              //             "half_yearly": {
              //                 "dates": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
              //                 "min_installment_amount": 10000.0,
              //                 "max_installment_amount": 99999999.0,
              //                 "min_installments": 3,
              //                 "amount_multiples": 1000
              //             },
              //             "yearly": {
              //                 "dates": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
              //                 "min_installment_amount": 10000.0,
              //                 "max_installment_amount": 99999999.0,
              //                 "min_installments": 3,
              //                 "amount_multiples": 1000
              //             }
              //         },
              //         "swp_frequency_specific_data": {
              //             "monthly": {
              //                 "dates": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
              //                 "min_installment_amount": 1000.0,
              //                 "max_installment_amount": 99999999.0,
              //                 "min_installments": 6,
              //                 "amount_multiples": 100.0
              //             },
              //             "quarterly": {
              //                 "dates": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
              //                 "min_installment_amount": 10000.0,
              //                 "max_installment_amount": 99999999.0,
              //                 "min_installments": 3,
              //                 "amount_multiples": 100.0
              //             },
              //             "half_yearly": {
              //                 "dates": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
              //                 "min_installment_amount": 10000.0,
              //                 "max_installment_amount": 99999999.0,
              //                 "min_installments": 3,
              //                 "amount_multiples": 1000
              //             },
              //             "yearly": {
              //                 "dates": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
              //                 "min_installment_amount": 10000.0,
              //                 "max_installment_amount": 99999999.0,
              //                 "min_installments": 3,
              //                 "amount_multiples": 1000
              //             }
              //         },
              //         "stp_frequency_specific_data": {
              //             "monthly": {
              //                 "dates": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
              //                 "min_installment_amount": 1000.0,
              //                 "max_installment_amount": 99999999.0,
              //                 "min_installments": 6,
              //                 "amount_multiples": 100.0
              //             },
              //             "quarterly": {
              //                 "dates": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
              //                 "min_installment_amount": 1000.0,
              //                 "max_installment_amount": 99999999.0,
              //                 "min_installments": 6,
              //                 "amount_multiples": 100.0
              //             },
              //             "half_yearly": {
              //                 "dates": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
              //                 "min_installment_amount": 10000.0,
              //                 "max_installment_amount": 99999999.0,
              //                 "min_installments": 3,
              //                 "amount_multiples": 1000
              //             },
              //             "yearly": {
              //                 "dates": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
              //                 "min_installment_amount": 10000.0,
              //                 "max_installment_amount": 99999999.0,
              //                 "min_installments": 3,
              //                 "amount_multiples": 1000
              //             }
              //         }
              //     }
              // };
              if (
                mpf.model_portfolio_associated_fund.scheme_logo != null &&
                mpf.model_portfolio_associated_fund.scheme_logo != '' &&
                mpf.model_portfolio_associated_fund.fund_plan_id != null
              ) {
                associated_fund.data['scheme_logo'] =
                  mpf.model_portfolio_associated_fund.scheme_logo;
                associated_fund.data['fund_plan_id'] =
                  mpf.model_portfolio_associated_fund.fund_plan_id;
              } else {
                const mfdetails = await this.get_fund_details(
                  mpf.model_portfolio_associated_fund.scheme_isin,
                );
                // if (fp_fund.status == HttpStatus.OK) {
                mpf.model_portfolio_associated_fund.scheme_logo =
                  mfdetails.logo_url;
                mpf.model_portfolio_associated_fund.fund_plan_id =
                  mfdetails.fund_plan_id;

                associated_fund.data['scheme_logo'] = mfdetails.logo_url;
                associated_fund.data['fund_plan_id'] = mfdetails.fund_plan_id;
                this.modelPortfolioAssociatedFundRepository.save(
                  mpf.model_portfolio_associated_fund,
                );
                // }
              }

              fp_fund.data['associated_fund'] = associated_fund.data;
            }
          }

          console.log('halelujah11111x');
          fund_list[mpf.scheme_isin] = fp_fund.data;
          fund_amount_lists[mpf.scheme_isin] = 0;
          // } else {
          //     fund_list[mpf.scheme_isin] = null;
          //     console.log("FUND DISTRIBUTE, FP FUND NOT FOUND - ", "Fund not found - " + mpf.scheme_isin);
          //     fund_amount_lists[mpf.scheme_isin] = 0;
          // }
        }
      }

      //factors to consider
      // fund ISIN
      // check if fund exists then consider same folio and consider additional_investment_min_value else consider investment_min_value
      // minimum investment - if percent amount is greater than minimum consider min value else consider minimum
      // subtract the investment amount and update current_amount
      // move to next investment based on priority
      // do the needful and check all

      // right now considering only new fund folio need to enhance for checking existing folio

      let current_index = 0;
      const allocated_indexes = [];
      let index = 0;
      while (1) {
        const eligible_first_investment_fund_indexes = [];

        if (current_investment_amount <= 0) {
          break;
        }

        let fund_percent_amount =
          amount *
          (model_portfolio_funds[current_index].allocation_percentage / 100);
        console.log(
          'PPORT',
          model_portfolio_funds[current_index].allocation_percentage,
        );
        console.log('fund PERcent', fund_percent_amount);
        if (
          fund_percent_amount > current_investment_amount &&
          allocated_indexes.length > 0
        ) {
          fund_percent_amount = current_investment_amount;
        }

        for (let i = 0; i < model_portfolio_funds.length; i++) {
          let fend;
          if (is_onetime == true) {
            fend =
              fund_list[model_portfolio_funds[i].scheme_isin]
                .min_initial_investment;
          } else {
            fend =
              fund_list[model_portfolio_funds[i].scheme_isin].min_sip_amount;
          }
          if (!allocated_indexes.includes(i)) {
            if (fund_percent_amount >= fend) {
              eligible_first_investment_fund_indexes.push(i);
            }
          }
        }
        console.log(
          'ELSeGible',
          eligible_first_investment_fund_indexes,
          fund_percent_amount,
        );

        if (
          fund_list[model_portfolio_funds[current_index].scheme_isin] != null
        ) {
          console.log(
            'MAN',
            fund_list[model_portfolio_funds[current_index].scheme_isin],
          );

          if (
            fund_amount_lists[
              model_portfolio_funds[current_index].scheme_isin
            ] == 0
          ) {
            console.log('JSONMAC', fund_percent_amount);
            let ford;
            if (is_onetime == true) {
              ford =
                fund_list[model_portfolio_funds[current_index].scheme_isin]
                  .min_initial_investment;
            } else {
              ford =
                fund_list[model_portfolio_funds[current_index].scheme_isin]
                  .min_sip_amount;
            }
            if (fund_percent_amount <= ford) {
              if (eligible_first_investment_fund_indexes.length > 0) {
                current_index = eligible_first_investment_fund_indexes[0];
              } else if (allocated_indexes.length > 0) {
                current_index = allocated_indexes[0];
              } else {
                fund_percent_amount = ford;
              }
            }
          }

          console.log(
            'FPAM@1',
            fund_percent_amount,
            fund_list[model_portfolio_funds[current_index].scheme_isin]
              .initial_investment_multiples,
          );

          if (
            fund_percent_amount %
              fund_list[model_portfolio_funds[current_index].scheme_isin]
                .initial_investment_multiples !=
            0
          ) {
            fund_percent_amount =
              fund_percent_amount -
              (fund_percent_amount %
                fund_list[model_portfolio_funds[current_index].scheme_isin]
                  .initial_investment_multiples);
            console.log(
              'FPAM@',
              fund_percent_amount,
              fund_list[model_portfolio_funds[current_index].scheme_isin]
                .initial_investment_multiples,
            );
          }
          console.log('FPAM', fund_percent_amount);
          fund_amount_lists[model_portfolio_funds[current_index].scheme_isin] =
            fund_amount_lists[
              model_portfolio_funds[current_index].scheme_isin
            ] + fund_percent_amount;
          console.log(
            'FAML@@@@@@@',
            fund_amount_lists[model_portfolio_funds[current_index].scheme_isin],
          );
          let fand;
          if (is_onetime == true) {
            fand =
              fund_list[model_portfolio_funds[current_index].scheme_isin]
                .min_initial_investment;
          } else {
            fand =
              fund_list[model_portfolio_funds[current_index].scheme_isin]
                .min_sip_amount;
          }
          if (
            fund_amount_lists[
              model_portfolio_funds[current_index].scheme_isin
            ] > amount &&
            amount >= fand
          ) {
            fund_amount_lists[
              model_portfolio_funds[current_index].scheme_isin
            ] = amount;
            console.log(
              '!!@@##$$#AAAAAAAA',
              fund_amount_lists[
                model_portfolio_funds[current_index].scheme_isin
              ],
            );
          }
          current_investment_amount =
            current_investment_amount - fund_percent_amount;
          if (!allocated_indexes.includes(current_index)) {
            allocated_indexes.push(current_index);
          }
          console.log('AAALO', allocated_indexes);
        }

        if (index < model_portfolio_funds.length - 1) {
          index++;
          current_index = index;
        } else {
          index = 0;
          current_index = index;
        }
        console.log('currenttIndex', current_index);
      }
      console.log('isin', fund_amount_lists);

      for (const isin in fund_amount_lists) {
        if (fund_amount_lists[isin] > 0) {
          const basket_item = new CreateTransactionBasketItemDTO();
          basket_item.amount = fund_amount_lists[isin];
          basket_item.fund_isin = isin;
          if (is_onetime) {
            basket_item.transaction_type = 'lumpsum';
          } else {
            basket_item.frequency = 'monthly';
            basket_item.installment_day = 1;
            basket_item.number_of_installments = Number(duration);
            basket_item.payment_method = 'mandate';
            basket_item.payment_source = null;
            basket_item.folio_number = null;
            basket_item.transaction_type = 'sip';
          }

          console.log('sips', basket_item);
          basket.transaction_basket_items.push(basket_item);
        }
      }

      console.log('I found you', { basket: basket, fund: fund_list });

      return {
        status: HttpStatus.OK,
        data: { basket: basket, fund_details: fund_list },
      };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async changeFund(fundBasketInputDto: ChangeFundBasketInputDto) {
    try {
      const fund_list = {};

      const fp_fund = await this.transactionBasketService.getFpFund(
        fundBasketInputDto.isin,
      );
      const mfdetails = await this.get_fund_details(fundBasketInputDto.isin);

      console.log('hello', fp_fund.status);
      if (fp_fund.status == HttpStatus.OK) {
        fp_fund.data['scheme_logo'] = mfdetails.logo_url;
        fp_fund.data['fund_plan_id'] = mfdetails.fund_plan_id;

        fund_list[fp_fund.data.isin] = fp_fund.data;
      } else {
        fund_list[fundBasketInputDto.isin] = null;
        console.log(
          'FUND DISTRIBUTE, FP FUND NOT FOUND - ',
          'Fund not found - ' + fundBasketInputDto.isin,
        );
      }

      const basket_item = new CreateTransactionBasketItemDTO();
      basket_item.amount = fundBasketInputDto.amount;
      basket_item.fund_isin = fundBasketInputDto.isin;
      if (fundBasketInputDto.is_onetime) {
        basket_item.transaction_type = 'lumpsum';
      } else {
        basket_item.frequency = 'monthly';
        basket_item.installment_day = 5;
        basket_item.number_of_installments = Number(
          fundBasketInputDto.duration,
        );
        basket_item.payment_method = 'mandate';
        basket_item.payment_source = null;
        basket_item.folio_number = null;
        basket_item.transaction_type = 'sip';
      }

      return {
        status: HttpStatus.OK,
        data: { basket_item: basket_item, fund_details: fund_list },
      };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_invest_500() {
    try {
      const model_portfolio = await this.modelPortfolioRepository.findOne({
        where: { name: 'Invest 500' },
      });
      const model_portfolio_fund = await this.modelPortfolioFundRepository.find(
        {
          where: { model_portfolio_id: model_portfolio.id },
        },
      );
      return { status: HttpStatus.OK, data: model_portfolio_fund };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }
}
