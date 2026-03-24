import { HttpStatus, Injectable } from '@nestjs/common';
import { EmergencyFundInputsDto } from './dtos/emergency_fund_inputs.dto';
import { PaymentDueTime, pmt, fv, pv } from 'financial';
import { EmergencyFundOutputDto } from './dtos/emergency_fund_output.dto';
import { FirstCroreInputsDto } from './dtos/first_crore_inputs.dto';
import { FirstCroreOutputDto } from './dtos/first_crore_output.dto';
import { InvestmentGraphDto } from './dtos/investment_graph.dto';
import { TaxSaverInputsDto } from './dtos/tax_saver_inputs.dto';
import { TaxSaverOutputDto } from './dtos/tax_saver_output.dto';
import { LongTermInputsDto } from './dtos/long_term_inputs.dto';
import { LongTermOutputDto } from './dtos/long_term_output.dto';
import { RetirementCorpusInputsDto } from './dtos/retirement_corpus_inputs.dto';
import { pow } from 'mathjs';
import { RetirementCorpusOutputDto } from './dtos/retirement_corpus_output.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from './entities/goals.entity';
import { Repository } from 'typeorm';
import { ParkedMoneyOutputDto } from './dtos/parked_money_output.dto';
import { ParkedMoneyInputsDto } from './dtos/parked_money_inputs.dto';
import { MutualfundsModule } from 'src/utils/mutualfunds/mutualfunds.module';
import { MutualfundsService } from 'src/utils/mutualfunds/mutualfunds.service';
import { ConfigService } from '@nestjs/config';
import { GoalRepository } from 'src/repositories/goal.repository';
@Injectable()
export class GoalsService {
  benchmark_fund_id: number;
  constructor(
    // @InjectRepository(Goal)
    // private goalRepository: Repository<Goal>,
    private goalRepository: GoalRepository,
    private mutualFundService: MutualfundsService,
  ) {
    const configService = new ConfigService();
    this.benchmark_fund_id = configService.get('BENCHMARK_FUND_ID');
  }

  async get_future_value(
    current_value: number,
    years: number,
    inflation_rate: number,
  ) {
    try {
      console.log('current_value', current_value);
      console.log('years', years);
      console.log('inflation_rate', inflation_rate);

      const f_value = fv(
        inflation_rate / 100,
        years,
        0,
        current_value * -1,
        PaymentDueTime.Begin,
      );
      return {
        status: HttpStatus.OK,
        data: { future_value: Math.round(f_value) },
      };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async calculate_fund_returns(
    plan_id: number,
    amount: number,
    calculation_type: string,
  ) {
    try {
      const return_calulator_result = {};
      const fundDetail: any = await this.mutualFundService.getFundDetails(
        plan_id,
      );
      const benchmarkFundDetail: any =
        await this.mutualFundService.getFundDetails(this.benchmark_fund_id);

      // "fundRet1year": 26.3547232481,
      // "fundRet3year": 26.333942175475,
      // "fundRet5year": 12.774843114177,

      if (fundDetail.status == HttpStatus.OK) {
        const fund_1yr_return = fundDetail.data.fundRet1year;
        const fund_3yr_return = fundDetail.data.fundRet3year;
        const fund_5yr_return = fundDetail.data.fundRet5year;

        console.log('fund_1yr_return', fund_1yr_return);

        const benchmark_1yr_return = benchmarkFundDetail.data.fundRet1year;
        const benchmark_3yr_return = benchmarkFundDetail.data.fundRet3year;
        const benchmark_5yr_return = benchmarkFundDetail.data.fundRet5year;

        const fund_sip_1yr_return = fundDetail.data.fundSipR1year;
        const fund_sip_3yr_return = fundDetail.data.fundSipR3year;
        const fund_sip_5yr_return = fundDetail.data.fundSipR5year;

        const benchmark_sip_1yr_return = benchmarkFundDetail.data.fundSipR1year;
        const benchmark_sip_3yr_return = benchmarkFundDetail.data.fundSipR3year;
        const benchmark_sip_5yr_return = benchmarkFundDetail.data.fundSipR5year;

        const fund_catavg_1yr_return = fundDetail.data.catRet1year;
        const fund_catavg_3yr_return = fundDetail.data.catRet3year;
        const fund_catavg_5yr_return = fundDetail.data.catRet5year;

        const fund_1yr_calculation = {
          invested_amount: 0,
          profit: 0,
          total: 0,
        };
        const fund_3yr_calculation = {
          invested_amount: 0,
          profit: 0,
          total: 0,
        };
        const fund_5yr_calculation = {
          invested_amount: 0,
          profit: 0,
          total: 0,
        };

        const fund_catavg_1yr_calculation = {
          invested_amount: 0,
          profit: 0,
          total: 0,
        };
        const fund_catavg_3yr_calculation = {
          invested_amount: 0,
          profit: 0,
          total: 0,
        };
        const fund_catavg_5yr_calculation = {
          invested_amount: 0,
          profit: 0,
          total: 0,
        };

        const benchmark_1yr_calculation = {
          invested_amount: 0,
          profit: 0,
          total: 0,
        };
        const benchmark_3yr_calculation = {
          invested_amount: 0,
          profit: 0,
          total: 0,
        };
        const benchmark_5yr_calculation = {
          invested_amount: 0,
          profit: 0,
          total: 0,
        };

        let calculation: any = {};

        if (calculation_type == 'sip') {
          if (fund_sip_1yr_return) {
            calculation = await this.calculate_investments_returns(
              amount,
              fund_sip_1yr_return,
              0,
              'year',
              1,
            );
            fund_1yr_calculation.invested_amount = Number(amount * 12);
            fund_1yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              fund_1yr_calculation.invested_amount;
            fund_1yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }
          return_calulator_result['fund_1_year'] = fund_1yr_calculation;

          if (fund_sip_3yr_return) {
            calculation = await this.calculate_investments_returns(
              amount,
              fund_sip_3yr_return,
              0,
              'year',
              3,
            );

            fund_3yr_calculation.invested_amount = Number(amount * 36);
            fund_3yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              fund_3yr_calculation.invested_amount;
            fund_3yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }
          return_calulator_result['fund_3_year'] = fund_3yr_calculation;

          if (fund_sip_5yr_return) {
            calculation = await this.calculate_investments_returns(
              amount,
              fund_sip_5yr_return,
              0,
              'year',
              5,
            );

            fund_5yr_calculation.invested_amount = Number(amount * 60);
            fund_5yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              fund_5yr_calculation.invested_amount;
            fund_5yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }

          return_calulator_result['fund_5_year'] = fund_5yr_calculation;

          if (fund_catavg_1yr_return) {
            calculation = await this.calculate_investments_returns(
              amount,
              fund_catavg_1yr_return,
              0,
              'year',
              1,
            );
            fund_catavg_1yr_calculation.invested_amount = Number(amount * 12);
            fund_catavg_1yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              fund_catavg_1yr_calculation.invested_amount;
            fund_catavg_1yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }
          return_calulator_result['fund_catavg_1_year'] =
            fund_catavg_1yr_calculation;

          if (fund_catavg_3yr_return) {
            calculation = await this.calculate_investments_returns(
              amount,
              fund_catavg_3yr_return,
              0,
              'year',
              3,
            );

            fund_catavg_3yr_calculation.invested_amount = Number(amount * 36);
            fund_catavg_3yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              fund_catavg_3yr_calculation.invested_amount;
            fund_catavg_3yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }
          return_calulator_result['fund_catavg_3_year'] =
            fund_catavg_3yr_calculation;

          if (fund_catavg_5yr_return) {
            calculation = await this.calculate_investments_returns(
              amount,
              fund_catavg_5yr_return,
              0,
              'year',
              5,
            );

            fund_catavg_5yr_calculation.invested_amount = Number(amount * 60);
            fund_catavg_5yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              fund_catavg_5yr_calculation.invested_amount;
            fund_catavg_5yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }

          return_calulator_result['fund_catavg_5_year'] =
            fund_catavg_5yr_calculation;

          if (benchmark_sip_1yr_return) {
            calculation = await this.calculate_investments_returns(
              amount,
              benchmark_sip_1yr_return,
              0,
              'year',
              1,
            );
            benchmark_1yr_calculation.invested_amount = Number(amount * 12);
            benchmark_1yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              benchmark_1yr_calculation.invested_amount;
            benchmark_1yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }
          return_calulator_result['benchmark_1_year'] =
            benchmark_1yr_calculation;

          if (benchmark_sip_3yr_return) {
            calculation = await this.calculate_investments_returns(
              amount,
              benchmark_sip_3yr_return,
              0,
              'year',
              3,
            );

            benchmark_3yr_calculation.invested_amount = Number(amount * 36);
            benchmark_3yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              benchmark_3yr_calculation.invested_amount;
            benchmark_3yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }
          return_calulator_result['benchmark_3_year'] =
            benchmark_3yr_calculation;

          if (benchmark_sip_5yr_return) {
            calculation = await this.calculate_investments_returns(
              amount,
              benchmark_sip_5yr_return,
              0,
              'year',
              5,
            );

            benchmark_5yr_calculation.invested_amount = Number(amount * 60);
            benchmark_5yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              benchmark_5yr_calculation.invested_amount;
            benchmark_5yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }

          return_calulator_result['benchmark_5_year'] =
            benchmark_5yr_calculation;
        } else if (calculation_type == 'onetime') {
          if (fund_1yr_return) {
            calculation = await this.calculate_investments_returns(
              0,
              fund_1yr_return,
              0,
              'year',
              1,
              amount,
            );
            fund_1yr_calculation.invested_amount = Number(amount);
            fund_1yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              fund_1yr_calculation.invested_amount;
            fund_1yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }
          return_calulator_result['fund_1_year'] = fund_1yr_calculation;

          if (fund_3yr_return) {
            calculation = await this.calculate_investments_returns(
              0,
              fund_3yr_return,
              0,
              'year',
              3,
              amount,
            );

            fund_3yr_calculation.invested_amount = Number(amount);
            fund_3yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              fund_3yr_calculation.invested_amount;
            fund_3yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }
          return_calulator_result['fund_3_year'] = fund_3yr_calculation;

          if (fund_5yr_return) {
            calculation = await this.calculate_investments_returns(
              0,
              fund_5yr_return,
              0,
              'year',
              5,
              amount,
            );

            fund_5yr_calculation.invested_amount = Number(amount);
            fund_5yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              fund_5yr_calculation.invested_amount;
            fund_5yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }

          return_calulator_result['fund_5_year'] = fund_5yr_calculation;

          if (fund_catavg_1yr_return) {
            calculation = await this.calculate_investments_returns(
              0,
              fund_catavg_1yr_return,
              0,
              'year',
              1,
              amount,
            );
            fund_catavg_1yr_calculation.invested_amount = Number(amount);
            fund_catavg_1yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              fund_catavg_1yr_calculation.invested_amount;
            fund_catavg_1yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }
          return_calulator_result['fund_catavg_1_year'] =
            fund_catavg_1yr_calculation;

          if (fund_catavg_3yr_return) {
            calculation = await this.calculate_investments_returns(
              0,
              fund_catavg_3yr_return,
              0,
              'year',
              3,
              amount,
            );

            fund_catavg_3yr_calculation.invested_amount = Number(amount);
            fund_catavg_3yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              fund_catavg_3yr_calculation.invested_amount;
            fund_catavg_3yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }
          return_calulator_result['fund_catavg_3_year'] =
            fund_catavg_3yr_calculation;

          if (fund_catavg_5yr_return) {
            calculation = await this.calculate_investments_returns(
              0,
              fund_catavg_5yr_return,
              0,
              'year',
              5,
              amount,
            );

            fund_catavg_5yr_calculation.invested_amount = Number(amount);
            fund_catavg_5yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              fund_catavg_5yr_calculation.invested_amount;
            fund_catavg_5yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }

          return_calulator_result['fund_catavg_5_year'] =
            fund_catavg_5yr_calculation;

          if (benchmark_1yr_return) {
            calculation = await this.calculate_investments_returns(
              0,
              benchmark_1yr_return,
              0,
              'year',
              1,
              amount,
            );
            benchmark_1yr_calculation.invested_amount = Number(amount);
            benchmark_1yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              benchmark_1yr_calculation.invested_amount;
            benchmark_1yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }
          return_calulator_result['benchmark_1_year'] =
            benchmark_1yr_calculation;

          if (benchmark_3yr_return) {
            calculation = await this.calculate_investments_returns(
              0,
              benchmark_3yr_return,
              0,
              'year',
              3,
              amount,
            );

            benchmark_3yr_calculation.invested_amount = Number(amount);
            benchmark_3yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              benchmark_3yr_calculation.invested_amount;
            benchmark_3yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }
          return_calulator_result['benchmark_3_year'] =
            benchmark_3yr_calculation;

          if (benchmark_5yr_return) {
            calculation = await this.calculate_investments_returns(
              0,
              benchmark_5yr_return,
              0,
              'year',
              5,
              amount,
            );

            benchmark_5yr_calculation.invested_amount = Number(amount);
            benchmark_5yr_calculation.profit =
              calculation.data[calculation.data.length - 1].closing_balance -
              benchmark_5yr_calculation.invested_amount;
            benchmark_5yr_calculation.total =
              calculation.data[calculation.data.length - 1].closing_balance;
          }

          return_calulator_result['benchmark_5_year'] =
            benchmark_5yr_calculation;
        }

        return { status: HttpStatus.OK, data: return_calulator_result };
      } else {
        return { status: HttpStatus.NOT_FOUND, error: 'Fund not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async calculate_emergency_fund(
    emergencyFundInputsDto: EmergencyFundInputsDto,
  ) {
    try {
      const corpus =
        Number(emergencyFundInputsDto.monthly_expense) * 6 -
        Number(emergencyFundInputsDto.existing_investment);
      const emergencyFundOutputDto = new EmergencyFundOutputDto();

      if (corpus > 1000) {
        emergencyFundInputsDto.expected_return =
          Number(emergencyFundInputsDto.expected_return) / 100;
        emergencyFundOutputDto.amount_for_fifteen_months = Math.ceil(
          pmt(
            Number(emergencyFundInputsDto.expected_return) / 12,
            15,
            0,
            corpus * -1,
            PaymentDueTime.Begin,
          ),
        );
        emergencyFundOutputDto.amount_for_nine_months = Math.ceil(
          pmt(
            Number(emergencyFundInputsDto.expected_return) / 12,
            9,
            0,
            corpus * -1,
            PaymentDueTime.Begin,
          ),
        );
        emergencyFundOutputDto.amount_for_six_months = Math.ceil(
          pmt(
            Number(emergencyFundInputsDto.expected_return) / 12,
            6,
            0,
            corpus * -1,
            PaymentDueTime.Begin,
          ),
        );
        emergencyFundOutputDto.amount_for_twelve_months = Math.ceil(
          pmt(
            Number(emergencyFundInputsDto.expected_return) / 12,
            12,
            0,
            corpus * -1,
            PaymentDueTime.Begin,
          ),
        );
        emergencyFundOutputDto.corpus_amount = Math.ceil(corpus);

        return { status: HttpStatus.OK, ...emergencyFundOutputDto };
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Monthly Expense is low, the emergency fund corpus is already covered by exiting investments',
        };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async calculate_my_first_crore(firstCroreInputsDto: FirstCroreInputsDto) {
    try {
      const calculations = await this.calculate_investments_returns(
        firstCroreInputsDto.investment_per_month,
        firstCroreInputsDto.expected_returns,
        firstCroreInputsDto.increase_investment_yearly_percent,
        'closing_balance',
        10000000,
      );
      console.log(calculations);
      const firstCroreOutputDto = new FirstCroreOutputDto();
      firstCroreOutputDto.crore_duration = Math.ceil(
        calculations.data.length / 12,
      );

      const graphData: InvestmentGraphDto[] = [];
      const investmentGraph = new InvestmentGraphDto();

      investmentGraph.year = new Date().getFullYear();
      investmentGraph.invested_amount = 0;
      investmentGraph.profit = 0;
      investmentGraph.total = 0;

      graphData.push(investmentGraph);

      let current_month = 1;
      let year = 0;
      let investment = 0;
      calculations.data.forEach((element) => {
        investment = investment + element.sip_amount;
        if (current_month >= 12 && current_month % 12 == 0) {
          year++;

          const investmentGraph = new InvestmentGraphDto();
          investmentGraph.year = new Date().getFullYear() + year;
          investmentGraph.invested_amount = investment;
          investmentGraph.profit = element.closing_balance - investment;
          investmentGraph.total = element.closing_balance;

          graphData.push(investmentGraph);
        }
        current_month++;
      });

      firstCroreOutputDto.investment_graph = graphData;

      return { status: HttpStatus.OK, ...firstCroreOutputDto };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async calculate_long_term(longTermInputsDto: LongTermInputsDto) {
    try {
      const monthly_investment = pmt(
        Number(longTermInputsDto.expected_returns) / 100 / 12,
        longTermInputsDto.years * 12,
        0,
        longTermInputsDto.target_corpus * -1,
        PaymentDueTime.Begin,
      );

      console.log('monthly_investment', monthly_investment);
      console.log('mothns', longTermInputsDto.years * 12);
      console.log('returns', Number(longTermInputsDto.expected_returns) / 12);
      console.log('corpus', longTermInputsDto.target_corpus);

      const calculations = await this.calculate_investments_returns(
        monthly_investment,
        longTermInputsDto.expected_returns,
        0,
        'year',
        longTermInputsDto.years,
      );
      const longTermOutputDto = new LongTermOutputDto();

      const graphData: InvestmentGraphDto[] = [];
      const investmentGraph = new InvestmentGraphDto();

      investmentGraph.year = new Date().getFullYear();
      investmentGraph.invested_amount = 0;
      investmentGraph.profit = 0;
      investmentGraph.total = 0;

      graphData.push(investmentGraph);

      let current_month = 1;
      let year = 0;
      let investment = 0;
      calculations.data.forEach((element) => {
        investment = investment + element.sip_amount;
        if (current_month >= 12 && current_month % 12 == 0) {
          year++;

          const investmentGraph = new InvestmentGraphDto();
          investmentGraph.year = new Date().getFullYear() + year;
          investmentGraph.invested_amount = investment;
          investmentGraph.profit = element.closing_balance - investment;
          investmentGraph.total = element.closing_balance;

          graphData.push(investmentGraph);
        }
        current_month++;
      });

      longTermOutputDto.duration = calculations.data.length / 12;
      longTermOutputDto.monthly_investment = Math.ceil(monthly_investment);
      longTermOutputDto.total_corpus = graphData[graphData.length - 1].total;
      longTermOutputDto.investment_graph = graphData;

      return { status: HttpStatus.OK, ...longTermOutputDto };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async calculate_parked_money(parkedMoneyInputsDto: ParkedMoneyInputsDto) {
    try {
      const assumed_expected_returns = 6;
      const years = 3;
      const monthly_investment = parkedMoneyInputsDto.amount;

      console.log('monthly_investment', monthly_investment);
      console.log('mothns', years * 12);
      console.log('returns', Number(assumed_expected_returns) / 12);

      let calculations: any = [];
      if (parkedMoneyInputsDto.is_monthly) {
        calculations = await this.calculate_investments_returns(
          monthly_investment,
          assumed_expected_returns,
          0,
          'year',
          years,
        );
      } else {
        calculations = await this.calculate_investments_returns(
          0,
          assumed_expected_returns,
          0,
          'year',
          years,
          parkedMoneyInputsDto.amount,
        );
      }
      const parkedMoneyOutputDto = new ParkedMoneyOutputDto();

      const graphData: InvestmentGraphDto[] = [];
      const investmentGraph = new InvestmentGraphDto();

      investmentGraph.year = new Date().getFullYear();
      investmentGraph.invested_amount = 0;
      investmentGraph.profit = 0;
      investmentGraph.total = 0;

      graphData.push(investmentGraph);

      let current_month = 1;
      let year = 0;
      let investment = 0;
      calculations.data.forEach((element) => {
        investment = investment + element.sip_amount;
        if (current_month >= 12 && current_month % 12 == 0) {
          year++;

          const investmentGraph = new InvestmentGraphDto();
          investmentGraph.year = new Date().getFullYear() + year;
          investmentGraph.invested_amount = investment;
          investmentGraph.profit = element.closing_balance - investment;
          investmentGraph.total = element.closing_balance;

          graphData.push(investmentGraph);
        }
        current_month++;
      });

      parkedMoneyOutputDto.duration = calculations.data.length / 12;
      parkedMoneyOutputDto.monthly_investment = monthly_investment;
      parkedMoneyOutputDto.total_corpus = graphData[graphData.length - 1].total;

      if (parkedMoneyInputsDto.is_monthly) {
        parkedMoneyOutputDto.total_investment =
          parkedMoneyOutputDto.monthly_investment * calculations.data.length;
        parkedMoneyOutputDto.gain =
          parkedMoneyOutputDto.total_corpus -
          parkedMoneyOutputDto.total_investment;
      } else {
        parkedMoneyOutputDto.total_investment = parkedMoneyInputsDto.amount;
        parkedMoneyOutputDto.gain =
          parkedMoneyOutputDto.total_corpus - parkedMoneyInputsDto.amount;
      }
      parkedMoneyOutputDto.investment_graph = graphData;
      return { status: HttpStatus.OK, ...parkedMoneyOutputDto };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async calculate_tax_saver(taxSaverInputsDto: TaxSaverInputsDto) {
    try {
      const assumed_return = 14.5;
      const calculations = await this.calculate_investments_returns(
        taxSaverInputsDto.investment_per_month,
        assumed_return,
        0,
        'year',
        taxSaverInputsDto.years,
      );
      console.log(calculations);
      const taxSaverOutputDto = new TaxSaverOutputDto();
      taxSaverOutputDto.duration = calculations.data.length / 12;

      const graphData: InvestmentGraphDto[] = [];
      const investmentGraph = new InvestmentGraphDto();

      investmentGraph.year = new Date().getFullYear();
      investmentGraph.invested_amount = 0;
      investmentGraph.profit = 0;
      investmentGraph.total = 0;

      graphData.push(investmentGraph);

      let current_month = 1;
      let year = 0;
      let investment = 0;
      calculations.data.forEach((element) => {
        investment = investment + element.sip_amount;
        if (current_month >= 12 && current_month % 12 == 0) {
          year++;

          const investmentGraph = new InvestmentGraphDto();
          investmentGraph.year = new Date().getFullYear() + year;
          investmentGraph.invested_amount = investment;
          investmentGraph.profit = element.closing_balance - investment;
          investmentGraph.total = element.closing_balance;

          graphData.push(investmentGraph);
        }
        current_month++;
      });

      taxSaverOutputDto.invested =
        graphData[graphData.length - 1].invested_amount;
      taxSaverOutputDto.profit = graphData[graphData.length - 1].profit;
      taxSaverOutputDto.total = graphData[graphData.length - 1].total;
      taxSaverOutputDto.assumed_return = assumed_return;
      taxSaverOutputDto.investment_graph = graphData;

      return { status: HttpStatus.OK, ...taxSaverOutputDto };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async calculate_retirement(
    retirementCorpusInputsDto: RetirementCorpusInputsDto,
  ) {
    try {
      const years_until_retire =
        retirementCorpusInputsDto.retire_at_age - retirementCorpusInputsDto.age;
      const retirment_years =
        retirementCorpusInputsDto.life_expectancy -
        retirementCorpusInputsDto.retire_at_age;

      const expected_rate_existing =
        retirementCorpusInputsDto.expected_rate_existing_investment / 100;

      // let power = Number(pow((1 + expected_rate_existing ), years_until_retire));

      // let fv_existing_investments  = retirementCorpusInputsDto.existing_investments * power;
      const fv_existing_investments = fv(
        expected_rate_existing,
        years_until_retire,
        0,
        retirementCorpusInputsDto.existing_investments * -1,
        PaymentDueTime.Begin,
      );

      const expected_inflation_rate =
        retirementCorpusInputsDto.expected_inflation / 100;

      const power = Number(
        pow(1 + expected_inflation_rate, years_until_retire),
      );

      const fv_retirement_expenses =
        retirementCorpusInputsDto.retirement_monthly_expense * 12 * power;

      console.log('fv_retirement_expenses', fv_retirement_expenses);

      // let retirement_corpus = pv(((1+ (retirementCorpusInputsDto.expected_rate_new_investment/100))/(1+ (retirementCorpusInputsDto.expected_inflation/100)))-1 ,retirment_years,(fv_retirement_expenses*-1),0,PaymentDueTime.Begin);
      const r =
        (1 + retirementCorpusInputsDto.expected_rate_new_investment / 100) /
          (1 + retirementCorpusInputsDto.expected_inflation / 100) -
        1;
      const g = retirementCorpusInputsDto.yearly_rate_of_expense_increase / 100; // 2% annual increase in retirement expenses
      const n = retirment_years;
      const PMT = fv_retirement_expenses;
      let retirement_corpus;
      if (r === g) {
        // Special case: when r == g, the formula becomes n * PMT / (1 + r)
        retirement_corpus = (n * PMT) / (1 + r);
      } else {
        retirement_corpus =
          PMT * ((1 - Math.pow((1 + g) / (1 + r), n)) / (r - g));
      }
      console.log('retirement_corpus', retirement_corpus);

      console.log('retirement_corpus', fv_existing_investments);

      const final_retirement_corpus =
        retirement_corpus - fv_existing_investments;

      console.log('final_retirement_corpus', final_retirement_corpus);

      const per_month_investment = pmt(
        retirementCorpusInputsDto.expected_rate_new_investment / 100 / 12,
        years_until_retire * 12,
        0,
        final_retirement_corpus * -1,
        PaymentDueTime.Begin,
      );
      console.log('per_month_investment', per_month_investment);

      const calculations = await this.calculate_investments_returns(
        per_month_investment,
        retirementCorpusInputsDto.expected_rate_new_investment,
        retirementCorpusInputsDto.yearly_rate_of_expense_increase,
        'closing_balance',
        final_retirement_corpus,
      );

      console.log(calculations);

      if (per_month_investment > 0) {
        const retirement_corpus_output = new RetirementCorpusOutputDto();
        retirement_corpus_output.duration = years_until_retire;
        retirement_corpus_output.monthly_investment =
          Math.ceil(per_month_investment);
        retirement_corpus_output.total_corpus = final_retirement_corpus;
        retirement_corpus_output.investment_graph = [];
        let current_month = 1;
        let year = 0;
        let investment = 0;
        calculations.data.forEach((element) => {
          investment = investment + element.sip_amount;
          if (current_month >= 12 && current_month % 12 == 0) {
            year++;

            const investmentGraph = new InvestmentGraphDto();
            investmentGraph.year = new Date().getFullYear() + year;
            investmentGraph.invested_amount = investment;
            investmentGraph.profit = element.closing_balance - investment;
            investmentGraph.total = element.closing_balance;

            retirement_corpus_output.investment_graph.push(investmentGraph);
          }
          current_month++;
        });
        if (current_month % 12 != 0) {
          const remaining_months = current_month % 12;
          if (remaining_months > 5) {
            const investmentGraph = new InvestmentGraphDto();
            investmentGraph.year = new Date().getFullYear() + year + 1;
            investmentGraph.invested_amount = investment;
            investmentGraph.profit =
              calculations.data[calculations.data.length - 1].closing_balance -
              investment;
            investmentGraph.total =
              calculations.data[calculations.data.length - 1].closing_balance;

            retirement_corpus_output.investment_graph.push(investmentGraph);
          }
        }
        return { status: HttpStatus.OK, ...retirement_corpus_output };
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Your existing investment will cover your retirement plan',
        };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async calculate_investments_returns(
    investment_per_month,
    expected_returns,
    increase_investment_yearly_percent,
    until_unit,
    until,
    initial_investment = 0,
  ) {
    const calculation_array: any = [];

    let current_month = 1;
    let current_sip_amount = Number(investment_per_month);
    let current_opening_balance = Number(initial_investment);
    const current_interest = Number(expected_returns) / 100;

    while (1) {
      const row = {};
      row['month'] = current_month;
      row['sip_amount'] = current_sip_amount;
      row['opening_balance'] = current_opening_balance + current_sip_amount;
      row['interest'] = row['opening_balance'] * (current_interest / 12);
      row['closing_balance'] = row['opening_balance'] + row['interest'];

      calculation_array.push(row);

      if (until_unit == 'year') {
        if (until == current_month / 12) {
          break;
        }
      } else if (until_unit == 'closing_balance') {
        if (row['closing_balance'] >= until) {
          break;
        }
      }

      if (increase_investment_yearly_percent != null) {
        if (current_month >= 12 && current_month % 12 == 0) {
          current_sip_amount =
            current_sip_amount +
            current_sip_amount * (increase_investment_yearly_percent / 100);
        }
      }
      current_opening_balance = row['closing_balance'];
      current_month++;
    }

    return { status: HttpStatus.OK, data: calculation_array };
  }

  async get_all_goals() {
    try {
      const goals = await this.goalRepository.find();
      return { status: HttpStatus.OK, data: goals };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }
}
