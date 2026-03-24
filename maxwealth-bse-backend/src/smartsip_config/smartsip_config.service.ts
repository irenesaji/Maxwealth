import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartSipFunds } from './entities/smart_sip_funds.entity';
import { MutualfundsService } from 'src/utils/mutualfunds/mutualfunds.service';
import { FintechService } from 'src/utils/fintech/fintech.service';
import { TransactionBaskets } from 'src/transaction_baskets/entities/transaction_baskets.entity';
import { CreateTransactionBasketDTO } from 'src/transaction_baskets/dtos/create_transaction_baskets.dto';
import { CreateTransactionBasketItemDTO } from 'src/transaction_baskets/dtos/create_transaction_basket_items.dto';
import { ConfigService } from '@nestjs/config';
import { SmartSipFundSplitDto } from './dtos/smart_sip_fund_split.dto';
import { SmartSipFundsRepository } from 'src/repositories/smart_sip_funds.repository';

@Injectable()
export class SmartsipConfigService {
  mf_base_url: string;

  constructor(
    // @InjectRepository(SmartSipFunds)
    // private smartSipFundsRepository : Repository<SmartSipFunds>,

    private smartSipFundsRepository: SmartSipFundsRepository,

    private mutualFundsService: MutualfundsService,
    private fintechService: FintechService,
  ) {
    const configService = new ConfigService();
    this.mf_base_url = configService.get('MF_BASE_URL');
  }

  async get_fund_details(isin: string[]) {
    try {
      const fundDetails: any = await this.mutualFundsService.findFundsByIsins(
        isin,
      );
      console.log('FUND DETAILS', fundDetails);
      return fundDetails;
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_all_smartsip_funds() {
    try {
      const smartFundIsins = await this.smartSipFundsRepository.find({
        select: { equity_scheme_isin: true },
      });
      const smartfundIsinsArray = smartFundIsins.map((smartFund) => {
        return smartFund.equity_scheme_isin;
      });
      console.log('smart fund ISINS', smartfundIsinsArray);
      if (smartfundIsinsArray.length == 0) {
        return { status: HttpStatus.NOT_FOUND, error: 'No Funds available' };
      } else {
        const result = await this.mutualFundsService.findFundsByIsins(
          smartfundIsinsArray,
        );
        return result;
      }
    } catch (ex) {
      return { status: HttpStatus.BAD_REQUEST, error: ex.message };
    }
  }

  async split_fund(smartSipFundSplitDto: SmartSipFundSplitDto) {
    try {
      const smartsip = await this.smartSipFundsRepository.findOne({
        where: { equity_scheme_isin: smartSipFundSplitDto.isin },
      });
      const total_amount = smartSipFundSplitDto.amount;
      if (smartsip) {
        const fund_list = {};
        const equityfundDetail = await this.fintechService.getFpFund(
          smartsip.equity_scheme_isin,
        );
        const debtfundDetail = await this.fintechService.getFpFund(
          smartsip.debt_scheme_isin,
        );

        const scheme_data_array = await this.get_fund_details([
          smartsip.equity_scheme_isin,
          smartsip.debt_scheme_isin,
        ]);

        for (const scheme of scheme_data_array.data) {
          console.log('data of scheme', scheme);
          if (equityfundDetail.data.isin == scheme.isinCode) {
            equityfundDetail.data['scheme_logo'] =
              this.mf_base_url + '/' + scheme.amcLogoUrl;
          } else if (debtfundDetail.data.isin == scheme.isinCode) {
            debtfundDetail.data['scheme_logo'] =
              this.mf_base_url + '/' + scheme.amcLogoUrl;
          }
        }

        fund_list[smartsip.equity_scheme_isin] = equityfundDetail.data;
        fund_list[smartsip.debt_scheme_isin] = debtfundDetail.data;

        if (
          equityfundDetail.status == HttpStatus.OK &&
          debtfundDetail.status == HttpStatus.OK
        ) {
          const equity_min_instalment =
            equityfundDetail.data.min_initial_investment;
          const debt_min_instalment =
            equityfundDetail.data.min_initial_investment;

          const basket = new CreateTransactionBasketDTO();

          const transaction_basket_items: CreateTransactionBasketItemDTO[] = [];
          basket.transaction_basket_items = transaction_basket_items;

          basket.user_id = smartSipFundSplitDto.user_id;
          basket.is_smart_sip = true;
          basket.total_amount = total_amount;

          const equity_basket_item = new CreateTransactionBasketItemDTO();
          const debt_basket_item = new CreateTransactionBasketItemDTO();

          if (
            smartsip.equity_scheme_allocation >= smartsip.debt_scheme_allocation
          ) {
            equity_basket_item.amount = equity_min_instalment;
            smartSipFundSplitDto.amount =
              smartSipFundSplitDto.amount - equity_min_instalment;

            if (debt_min_instalment <= smartSipFundSplitDto.amount) {
              debt_basket_item.amount = debt_min_instalment;
              smartSipFundSplitDto.amount =
                smartSipFundSplitDto.amount - debt_min_instalment;
            } else {
              debt_basket_item.amount = 0;
            }
          } else {
            debt_basket_item.amount = debt_min_instalment;
            smartSipFundSplitDto.amount =
              smartSipFundSplitDto.amount - debt_min_instalment;

            if (equity_min_instalment <= smartSipFundSplitDto.amount) {
              equity_basket_item.amount = equity_min_instalment;
              smartSipFundSplitDto.amount =
                smartSipFundSplitDto.amount - equity_min_instalment;
            } else {
              equity_basket_item.amount = 0;
            }
          }

          if (smartSipFundSplitDto.amount > 0) {
            if (
              smartsip.equity_scheme_allocation >
              smartsip.debt_scheme_allocation
            ) {
              let split_amount =
                (smartSipFundSplitDto.amount *
                  smartsip.equity_scheme_allocation) /
                100;

              if (debt_basket_item.amount == 0) {
                split_amount = smartSipFundSplitDto.amount;
              }

              split_amount =
                split_amount -
                (split_amount % equityfundDetail.data.sip_multiples);
              equity_basket_item.amount += split_amount;

              smartSipFundSplitDto.amount =
                smartSipFundSplitDto.amount - split_amount;

              if (
                smartSipFundSplitDto.amount > 0 &&
                debt_basket_item.amount > 0
              ) {
                split_amount =
                  (smartSipFundSplitDto.amount *
                    smartsip.debt_scheme_allocation) /
                  100;

                split_amount =
                  split_amount -
                  (split_amount % debtfundDetail.data.sip_multiples);
                debt_basket_item.amount += split_amount;
                smartSipFundSplitDto.amount =
                  smartSipFundSplitDto.amount - split_amount;
              }
            } else {
              let split_amount =
                (smartSipFundSplitDto.amount *
                  smartsip.debt_scheme_allocation) /
                100;

              if (equity_basket_item.amount == 0) {
                split_amount = smartSipFundSplitDto.amount;
              }

              split_amount =
                split_amount -
                (split_amount % debtfundDetail.data.sip_multiples);
              debt_basket_item.amount += split_amount;

              smartSipFundSplitDto.amount =
                smartSipFundSplitDto.amount - split_amount;

              if (
                smartSipFundSplitDto.amount > 0 &&
                equity_basket_item.amount > 0
              ) {
                split_amount =
                  (smartSipFundSplitDto.amount *
                    smartsip.equity_scheme_allocation) /
                  100;

                split_amount =
                  split_amount -
                  (split_amount % equityfundDetail.data.sip_multiples);
                equity_basket_item.amount += split_amount;
                smartSipFundSplitDto.amount =
                  smartSipFundSplitDto.amount - split_amount;
              }
            }
          }

          debt_basket_item.folio_number = smartSipFundSplitDto.folio_number;
          equity_basket_item.folio_number = smartSipFundSplitDto.folio_number;

          debt_basket_item.number_of_installments =
            smartSipFundSplitDto.duration;
          debt_basket_item.frequency = 'monthly';
          debt_basket_item.fund_isin = smartsip.debt_scheme_isin;
          debt_basket_item.installment_day =
            smartSipFundSplitDto.instalment_day;
          debt_basket_item.user_id = smartSipFundSplitDto.user_id;
          debt_basket_item.payment_method = 'mandate';
          debt_basket_item.transaction_type = 'smart_sip';

          equity_basket_item.number_of_installments =
            smartSipFundSplitDto.duration;
          equity_basket_item.frequency = 'monthly';
          equity_basket_item.fund_isin = smartsip.equity_scheme_isin;
          equity_basket_item.installment_day =
            smartSipFundSplitDto.instalment_day;
          equity_basket_item.user_id = smartSipFundSplitDto.user_id;
          equity_basket_item.payment_method = 'mandate';
          equity_basket_item.transaction_type = 'smart_sip';

          if (equity_basket_item.amount > 0) {
            basket.transaction_basket_items.push(equity_basket_item);
          }

          if (debt_basket_item.amount > 0) {
            basket.transaction_basket_items.push(debt_basket_item);
          }

          return {
            status: HttpStatus.OK,
            data: { basket: basket, fund_details: fund_list },
          };
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Sorry no smart sips not found in FP',
          };
        }
      } else {
        return {
          status: HttpStatus.NOT_FOUND,
          error: 'Sorry no SIP funds Found',
        };
      }
    } catch (ex) {
      return { status: HttpStatus.BAD_REQUEST, error: ex.message };
    }
  }
}
