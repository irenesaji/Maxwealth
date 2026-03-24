import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { FintechService } from 'src/utils/fintech/fintech.service';
import { Between, In, IsNull, Not, Repository } from 'typeorm';
import { DashboardOutputDto } from './dtos/dashboard_output.dto';
import { MutualfundsService } from 'src/utils/mutualfunds/mutualfunds.service';
import { ConfigService } from '@nestjs/config';
import { UserReturnsHistory } from './entities/user_returns_history.entity';
import { startOfDay, endOfDay } from 'date-fns';
import { CapitalGainReport } from './entities/capital_gain_reports.entity';
import { TransactionBasketItems } from 'src/transaction_baskets/entities/transaction_basket_items.entity';
import { TransactionBaskets } from 'src/transaction_baskets/entities/transaction_baskets.entity';
import { UserSmartReturnsHistory } from './entities/user_smart_returns_history.entity';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { UserSmartReturnsHistoryRepository } from 'src/repositories/user_smart_returns_history.repository';
import { CapitalGainReportRepository } from 'src/repositories/capital_gain_report.repository';
import { TransactionBasketsRepository } from 'src/repositories/transaction_baskets.repository';
import { TransactionBasketItemsRepository } from 'src/repositories/transaction_basket_item.repository';
import { UserReturnsHistoryRepository } from 'src/repositories/user_returns_history.repository';
import { ModelPortfolioFundRepository } from 'src/repositories/model_portfolio_fund.repository';
import { UsersRepository } from 'src/repositories/user.repository';
import { TransactionsService } from 'src/transactions/transactions.service';
import { TransactionReports } from 'src/investor-details/entities/transaction-details.entity';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { isArray } from 'class-validator';
import { UserReturnsHistoryVersion2Repository } from 'src/repositories/user_return_v2.repository';
import Role from 'src/users/entities/role.enum';
import { DistributorLogoRepository } from 'src/repositories/distributor_logo.repository';
import { cos } from 'mathjs';
@Injectable()
export class PortfolioService {
  mf_base_url: string;
  benchmark_fund_id: number;
  filepath = process.env.FILE_PATH;
  base_url: string;

  constructor(
    // @InjectRepository(UserOnboardingDetails)
    // private userOnboardingRepository : Repository<UserOnboardingDetails>,
    // @InjectRepository(UserReturnsHistory)
    // private userReturnsHistoryRepository : Repository<UserReturnsHistory>,
    // @InjectRepository(UserSmartReturnsHistory)
    // private userSmartReturnsHistoryRepository : Repository<UserSmartReturnsHistory>,
    // @InjectRepository(CapitalGainReport)
    // private capitalGainRepository : Repository<CapitalGainReport>,
    // @InjectRepository(TransactionBaskets)
    // private readonly transactionBasketsRepository:Repository<TransactionBaskets>,
    // @InjectRepository(TransactionBasketItems)
    // private readonly transactionBasketItemsRepository:Repository<TransactionBasketItems>,

    @InjectRepository(TransactionReports)
    private readonly transactionReportsRepository: Repository<TransactionReports>,

    private readonly usersRepository: UsersRepository,
    private readonly userOnboardingRepository: UserOnboardingDetailsRepository,
    private readonly userReturnsHistoryRepository: UserReturnsHistoryRepository,
    private readonly userSmartReturnsHistoryRepository: UserSmartReturnsHistoryRepository,
    private readonly capitalGainRepository: CapitalGainReportRepository,
    private readonly transactionBasketsRepository: TransactionBasketsRepository,
    private readonly transactionBasketItemsRepository: TransactionBasketItemsRepository,
    private readonly modelPortfolioFundRepository: ModelPortfolioFundRepository,
    private readonly userReturnsHistoryv2Repository: UserReturnsHistoryVersion2Repository,
    private readonly distributologoRepo: DistributorLogoRepository,
    private readonly fintechService: FintechService,
    private readonly mutualFundService: MutualfundsService,
    private readonly transactionsService: TransactionsService,
  ) {
    const configService = new ConfigService();
    this.mf_base_url = configService.get('MF_BASE_URL');
    this.benchmark_fund_id = configService.get('BENCHMARK_FUND_ID');
    this.base_url = configService.get('BASE_URL');
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

  async get_fund_details_v2(isin: string[]) {
    try {
      const fundDetails: any = await this.mutualFundService.findFundsByIsinsv2(
        isin,
      );
      console.log('FUND DETAILS', fundDetails);
      return fundDetails;
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_risk_based_funds(user_id: number, pagenumber: number) {
    // filterFundsByCategoryIds
    try {
      // let fundDetails:any = await this.mutualFundService.filterFundsByCategoryIds([1,100],pagenumber)
      const user = await this.usersRepository.findOne({
        where: { id: user_id },
        relations: ['risk_profile'],
      });
      if (user) {
        if (user.risk_profile_id) {
          const model_portfolio_funds =
            await this.modelPortfolioFundRepository.find({
              where: {
                model_portfolio_id: user.risk_profile.model_portfolio_id,
              },
            });

          const isins: string[] = [];

          // Loop through the model_portfolio_funds array and extract ids
          for (const fund of model_portfolio_funds) {
            isins.push(fund.scheme_isin);
          }

          console.log('ISIN', isins);
          const fundDetails = await this.get_fund_details(isins);
          console.log('fUNDS', fundDetails);
          return fundDetails;
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            error:
              'Risk profile not associated. Please take the risk profile quiz',
          };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User Not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_capital_gain_reports(user_id: number, page: number) {
    try {
      if (!page) {
        page = 1;
      }
      const skip = (page - 1) * 10;
      const capitalGainReports = await this.capitalGainRepository.find({
        where: {
          user_id: user_id,
          month: Not(0),
        },
        take: 10,
        skip: skip,
      });

      return { status: HttpStatus.OK, data: capitalGainReports };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_capital_gain_reports_yearly(user_id: number, page: number) {
    try {
      if (!page) {
        page = 1;
      }
      const skip = (page - 1) * 10;
      const capitalGainReports = await this.capitalGainRepository.find({
        where: {
          user_id: user_id,
          month: 0,
        },
        take: 10,
        skip: skip,
      });

      return { status: HttpStatus.OK, data: capitalGainReports };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  // async get_dashboard(user_id: number) {
  //     try {
  //         let onboardingUser = await this.userOnboardingRepository.findOneBy({ user_id: user_id });

  //         let response: any = await this.transactionsService.investment_account_wise_returns(user_id.toString());
  //         console.log("Response", response)
  //         // var yesterdays_date = new Date();
  //         // yesterdays_date.setDate(yesterdays_date.getDate() - 1);

  //         let data = await this.userReturnsHistoryv2Repository.findOne({ where: { user_id: user_id }, order: { date: 'DESC' } })
  //         console.log("Data of dashboard", data)

  //         if (data == null) {
  //             console.log("NO investments found")
  //             let dashboardOutputDto = new DashboardOutputDto();
  //             dashboardOutputDto.user_id = onboardingUser.user_id;
  //             dashboardOutputDto.mf_investment_account = onboardingUser.user_id;
  //             dashboardOutputDto.invested_amount = 0;
  //             dashboardOutputDto.current_value = 0;
  //             dashboardOutputDto.unrealized_gain = 0;
  //             dashboardOutputDto.absolute_return = 0;

  //             // dashboardOutputDto.day_change = response.data.data.rows.length > 0 ? response.data.data.rows[0][2] - last_return : 0;  //changed index to 2 from 4
  //             dashboardOutputDto.day_change = 0
  //             dashboardOutputDto.day_change_percentage = 0
  //             dashboardOutputDto.total_returns = 0
  //             dashboardOutputDto.total_returns_percentage = 0

  //             // dashboardOutputDto.day_change_percent = dashboardOutputDto.absolute_return != 0 ? ((100 * dashboardOutputDto.day_change) / dashboardOutputDto.absolute_return) : 0;

  //             dashboardOutputDto.cagr = 0;
  //             dashboardOutputDto.xirr = 0;
  //             return { "status": HttpStatus.OK, data: dashboardOutputDto };

  //         }

  //         if (response.status = HttpStatus.OK) {
  //             console.log("hello", response);

  //             const currentValue = response.data.length > 0 ? Number(response.data[0].current_value) : data.current_value;
  //             const previousValue = data.current_value;

  //             let dashboardOutputDto = new DashboardOutputDto();
  //             dashboardOutputDto.mf_investment_account = response.data.length > 0 ? Number(response.data[0].investment_account_id) : Number(onboardingUser.user_id);
  //             dashboardOutputDto.invested_amount = response.data.length > 0 ? Number(response.data[0].invested_amount) : data.invested_amount;
  //             dashboardOutputDto.current_value = response.data.length > 0 ? Number(response.data[0].current_value) : data.current_value;
  //             dashboardOutputDto.unrealized_gain = response.data.length > 0 ? Number(response.data[0].unrealized_gain) : data.total_returns;
  //             dashboardOutputDto.absolute_return = response.data.length > 0 ? Number(response.data[0].absolute_return) : data.total_returns_percentage;
  //             dashboardOutputDto.total_returns = data.total_returns
  //             dashboardOutputDto.total_returns_percentage = data.total_returns_percentage
  //             dashboardOutputDto.xirr = 0

  //             // dashboardOutputDto.day_change = response.data.data.rows.length > 0 ? response.data.data.rows[0][2] - last_return : 0;  //changed index to 2 from 4

  //             dashboardOutputDto.day_change = response.data.length > 0 ? Number(response.data[0].current_value) - data.current_value : data.day_change_amount
  //             dashboardOutputDto.day_change_percentage = previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : data.day_change_percentage

  //             // dashboardOutputDto.day_change_percent = dashboardOutputDto.absolute_return != 0 ? ((100 * dashboardOutputDto.day_change) / dashboardOutputDto.absolute_return) : 0;

  //             dashboardOutputDto.cagr = response.data.length > 0 ? Number(response.data[0].cagr) : 0;
  //             // dashboardOutputDto.xirr = response.data.data.rows.length > 0 ? response.data.data.rows[0][6] : 0;

  //             return { "status": HttpStatus.OK, data: dashboardOutputDto };
  //         } else {
  //             return response;
  //         }
  //     } catch (err) {
  //         console.log("Errorrrrrr", err)
  //         return { "status": HttpStatus.BAD_REQUEST, error: err.message };
  //     }
  // }

  async get_dashboard(user_id: number) {
    try {
      const onboardingUser = await this.userOnboardingRepository.findOneBy({
        user_id: user_id,
      });

      const response: any =
        await this.transactionsService.investment_account_wise_returns_for_portfolio_service(
          user_id.toString(),
        );
      console.log('Response', response);
      // var yesterdays_date = new Date();
      // yesterdays_date.setDate(yesterdays_date.getDate() - 1);

      const data = await this.userReturnsHistoryv2Repository.findOne({
        where: { user_id: user_id },
        order: { id: 'DESC' },
      });
      console.log('Data of dashboard', data);

      if (data == null) {
        console.log('NO investments found');
        const dashboardOutputDto = new DashboardOutputDto();
        dashboardOutputDto.user_id = onboardingUser.user_id;
        dashboardOutputDto.mf_investment_account = onboardingUser.user_id;
        // dashboardOutputDto.invested_amount = 0;
        // dashboardOutputDto.current_value = 0;
        // dashboardOutputDto.unrealized_gain = 0;
        // dashboardOutputDto.absolute_return = 0;
        console.log('Response data', response.data.data.rows[1]);
        dashboardOutputDto.invested_amount = response.data.data.rows[1] || 0; // Assuming the invested amount is at index 1
        dashboardOutputDto.current_value = response.data.data.rows[2] || 0;
        dashboardOutputDto.unrealized_gain = response.data.data.rows[3] || 0;
        dashboardOutputDto.absolute_return =
          parseFloat(response.data.data.rows[4]) || 0;

        // dashboardOutputDto.day_change = response.data.data.rows.length > 0 ? response.data.data.rows[0][2] - last_return : 0;  //changed index to 2 from 4
        dashboardOutputDto.day_change = 0;
        dashboardOutputDto.day_change_percentage = 0;
        dashboardOutputDto.total_returns = 0;
        dashboardOutputDto.total_returns_percentage = 0;

        // dashboardOutputDto.day_change_percent = dashboardOutputDto.absolute_return != 0 ? ((100 * dashboardOutputDto.day_change) / dashboardOutputDto.absolute_return) : 0;

        dashboardOutputDto.cagr = 0;
        dashboardOutputDto.xirr = 0;
        console.log('Dashboard Output DTO', dashboardOutputDto);
        return { status: HttpStatus.OK, data: dashboardOutputDto };
      }

      if ((response.status = HttpStatus.OK)) {
        console.log('hello', response);
        console.log('hello', response.data.data.rows);
        console.log('hello', response.data.data.columns);

        const dashboardOutputDto = new DashboardOutputDto();
        dashboardOutputDto.mf_investment_account =
          response.data.data.rows.length > 0
            ? Number(response.data.data.rows[0])
            : Number(onboardingUser.fp_investment_account_id);
        dashboardOutputDto.invested_amount = data.invested_amount;
        dashboardOutputDto.current_value = data.current_value;
        dashboardOutputDto.unrealized_gain = data.total_returns;
        dashboardOutputDto.absolute_return = data.total_returns_percentage;

        // dashboardOutputDto.day_change = response.data.data.rows.length > 0 ? response.data.data.rows[0][2] - last_return : 0;  //changed index to 2 from 4

        dashboardOutputDto.day_change = data.day_change_amount;
        dashboardOutputDto.day_change_percentage = data.day_change_percentage;
        // dashboardOutputDto.total_returns = data.total_returns
        // dashboardOutputDto.total_returns_percentage = data.total_returns_percentage
        dashboardOutputDto.xirr = 0;

        // dashboardOutputDto.day_change_percent = dashboardOutputDto.absolute_return != 0 ? ((100 * dashboardOutputDto.day_change) / dashboardOutputDto.absolute_return) : 0;

        dashboardOutputDto.cagr =
          response.data.data.rows.length > 0
            ? Number(response.data.data.rows[5])
            : 0;
        // dashboardOutputDto.xirr = response.data.data.rows.length > 0 ? response.data.data.rows[0][6] : 0;

        return { status: HttpStatus.OK, data: dashboardOutputDto };
      } else {
        return response;
      }
    } catch (err) {
      console.log('Errorrrrrr', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async smart_portfolio_analysis(
    user_id: number,
    transaction_basket_id: number,
  ) {
    try {
      const onboardingUser = await this.userOnboardingRepository.findOneBy({
        user_id: user_id,
      });
      if (onboardingUser) {
        const basket = await this.transactionBasketsRepository.findOne({
          where: { id: transaction_basket_id },
          relations: ['transaction_basket_items'],
        });
        const dashboard = {
          status: HttpStatus.OK,
          data: { current_value: 0, absolute_return: 0 },
        };
        let folio = '';

        for (const item of basket.transaction_basket_items) {
          if (item.folio_number) {
            folio += item.folio_number + ',';
          }
        }
        folio = folio.replace(/,*$/, '');

        const holding_response = await this.fintechService.get_holdings(
          onboardingUser.fp_investment_account_old_id,
          folio,
        );
        dashboard.status = holding_response.status;
        if (holding_response.status == HttpStatus.OK) {
          let current_value = 0;
          let absolute_return = 0;

          for (const folio of holding_response.data.folios) {
            for (const scheme of folio.schemes) {
              current_value += scheme.market_value.amount;
              absolute_return +=
                scheme.market_value.amount - scheme.invested_value.amount;
            }
          }
          dashboard.data.current_value = current_value;
          dashboard.data.absolute_return = absolute_return;
        }

        const result = await this.get_portfolio_analysis(
          user_id,
          dashboard,
          holding_response,
        );
        return result;
      } else {
        return {
          status: HttpStatus.NOT_FOUND,
          error: 'Investment account not created',
        };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async portfolio_analysis(user_id: number, tradedOnTo: string) {
    try {
      const onboardingUser = await this.userOnboardingRepository.findOneBy({
        user_id: user_id,
      });
      console.log('Onboardinng USer', onboardingUser);
      console.log('USerid', user_id);

      if (onboardingUser) {
        // Fetch investment account-wise returns
        const dashboard =
          await this.transactionsService.investment_account_wise_returns(
            user_id.toString(),
          );
        console.log('Dashboard', dashboard);

        // Prepare traded on date
        const tradedOnDate = tradedOnTo
          ? new Date(tradedOnTo).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];

        // Fetch user folios
        const user_folios = await this.transactionReportsRepository.find({
          where: { user_id: user_id },
        });
        const folio_list = [
          ...new Set(user_folios.map((folio) => folio.folio_number)),
        ];

        console.log('User ID', user_id);
        console.log('Folio List', folio_list);

        // Default response object
        const response = {
          id: onboardingUser.id,
          folios: [],
        };

        // Only generate holdings report if there are folios
        if (folio_list.length > 0) {
          try {
            const getreport =
              await this.transactionsService.generateHoldingsReport(
                null,
                user_id.toString(),
                folio_list,
                tradedOnDate,
              );
            console.log('Getting Report', getreport);

            // Only update response if report has a result
            if (getreport && getreport.result) {
              response.folios = getreport.result;
            }
          } catch (reportError) {
            console.log('Error generating holdings report', reportError);
            // Continue with empty folios
          }
        }

        console.log('Response', response);

        if (dashboard.data.length > 0 && response.folios.length > 0) {
          // Proceed with portfolio analysis
          const result = await this.get_portfolio_analysis(
            user_id,
            dashboard,
            response,
          );
          if (result.status == 400) {
            return {
              status: HttpStatus.BAD_REQUEST,
              error: result.error,
            };
          }
          return result.response;
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: "You don't have any investments",
          };
        }
      } else {
        return {
          status: HttpStatus.NOT_FOUND,
          error: 'Investment account not created',
        };
      }
    } catch (err) {
      console.log('Error', err);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      };
    }
  }

  async get_portfolio_analysis(user_id: number, dashboard, holding_response) {
    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    try {
      console.log('DAshboard', dashboard);
      const onboardingUser = await this.userOnboardingRepository.findOneBy({
        user_id: user_id,
      });
      if (onboardingUser) {
        const response = holding_response;
        const investment_portfolio = {
          total_investments:
            dashboard.status == HttpStatus.OK
              ? Number(dashboard.data[0].current_value)
              : 0,
          total_absolute_return:
            dashboard.status == HttpStatus.OK
              ? Number(dashboard.data[0].absolute_return)
              : 0,
          fund_analysis_variables: {},
          category_base_allocation: {},
          sector_base_alloction: {},
          cap_base_allocation: {},
          stock_base_allocation: {},
        };

        const scheme_isin_list_array = [];

        if ((response.status = HttpStatus.OK)) {
          console.log('holdings response: ', response);
          console.log('holdings response folios: ', response.folios);
          console.log('investment_portfolio', investment_portfolio);

          let i = 0;
          for (const folio of response.folios) {
            for (const scheme of folio.schemes) {
              if (!scheme_isin_list_array.includes(scheme.isin)) {
                scheme_isin_list_array.push(scheme.isin);
              }
              console.log('Scheme details', scheme);
              if (!investment_portfolio.fund_analysis_variables[scheme.isin]) {
                investment_portfolio.fund_analysis_variables[scheme.isin] =
                  scheme.holdings.units * scheme.nav.value;
              } else {
                investment_portfolio.fund_analysis_variables[scheme.isin] +=
                  scheme.holdings.units * scheme.nav.value;
              }
            }
            i++;
          }

          /// calc category allocation start

          console.log('ISINSSS', scheme_isin_list_array);
          if (scheme_isin_list_array.length == 0) {
            return { status: HttpStatus.BAD_REQUEST, error: 'NO ISINs FOUND' };
          }
          const scheme_data_array: any =
            await this.get_fund_details_all_categories(scheme_isin_list_array);
          console.log('Scheme data array', scheme_data_array);
          //let scheme_data_array: any = await this.get_fund_details(scheme_isin_list_array);

          console.log('schemearraydata', scheme_data_array);
          console.log('schemearraydata.data', scheme_data_array.data);
          // console.log("data of scheme", scheme_data_array);
          const category_totals = {};
          const stock_totals = {};
          const cap_totals = {
            giant: 0,
            large: 0,
            mid: 0,
            small: 0,
            tiny: 0,
          };
          const sector_totals = {};

          for (const scheme of scheme_data_array.data) {
            //get split

            // console.log("SCHEME~",scheme);

            const scheme_allocation: any =
              await this.mutualFundService.fund_allocation_details(
                scheme.planId,
              );
            await sleep(200);
            console.log(
              'Scheme allocations in the for loop',
              scheme_allocation,
            );

            console.log('data of scheme', scheme);
            if (!category_totals[scheme.category.primaryCategoryName]) {
              category_totals[scheme.category.primaryCategoryName] = Number(
                investment_portfolio.fund_analysis_variables[scheme.isinCode],
              );
            } else {
              category_totals[scheme.category.primaryCategoryName] += Number(
                investment_portfolio.fund_analysis_variables[scheme.isinCode],
              );
            }

            if (scheme_allocation.status == HttpStatus.OK) {
              console.log(
                'scheme_allocation stocks',
                scheme_allocation.data.allocationByStockHoldings,
              );

              for (const stocks of scheme_allocation.data
                .allocationByStockHoldings) {
                if (!stock_totals[stocks.fullName]) {
                  stock_totals[stocks.fullName] =
                    (investment_portfolio.fund_analysis_variables[
                      scheme.isinCode
                    ] *
                      (Math.round(stocks.assetAercentage * 100) / 100)) /
                    100;
                } else {
                  stock_totals[stocks.fullName] +=
                    (investment_portfolio.fund_analysis_variables[
                      scheme.isinCode
                    ] *
                      (Math.round(stocks.assetAercentage * 100) / 100)) /
                    100;
                }
              }

              console.log('stock_totals', stock_totals);

              for (const sectors of scheme_allocation.data.allocationBySector) {
                if (!sector_totals[sectors.sector]) {
                  sector_totals[sectors.sector] =
                    (investment_portfolio.fund_analysis_variables[
                      scheme.isinCode
                    ] *
                      (Math.round(sectors.percentage * 100) / 100)) /
                    100;
                } else {
                  sector_totals[sectors.sector] +=
                    (investment_portfolio.fund_analysis_variables[
                      scheme.isinCode
                    ] *
                      (Math.round(sectors.percentage * 100) / 100)) /
                    100;
                }
              }

              console.log('sectors', scheme_allocation.data.allocationBySector);

              console.log(
                'allocationByMarketCap',
                scheme_allocation.data.allocationByMarketCap,
              );
              console.log(scheme_allocation.data.allocationByMarketCap);

              if (scheme_allocation.data.allocationByMarketCap.length > 0) {
                cap_totals.giant += scheme_allocation.data
                  .allocationByMarketCap[0].giantPercentage
                  ? (investment_portfolio.fund_analysis_variables[
                      scheme.isinCode
                    ] *
                      (Math.round(
                        scheme_allocation.data.allocationByMarketCap[0]
                          .giantPercentage * 100,
                      ) /
                        100)) /
                    100
                  : 0;
                cap_totals.large += scheme_allocation.data
                  .allocationByMarketCap[0].largePercentage
                  ? (investment_portfolio.fund_analysis_variables[
                      scheme.isinCode
                    ] *
                      (Math.round(
                        scheme_allocation.data.allocationByMarketCap[0]
                          .largePercentage * 100,
                      ) /
                        100)) /
                    100
                  : 0;
                cap_totals.mid += scheme_allocation.data
                  .allocationByMarketCap[0].midPercentage
                  ? (investment_portfolio.fund_analysis_variables[
                      scheme.isinCode
                    ] *
                      (Math.round(
                        scheme_allocation.data.allocationByMarketCap[0]
                          .midPercentage * 100,
                      ) /
                        100)) /
                    100
                  : 0;
                cap_totals.small += scheme_allocation.data
                  .allocationByMarketCap[0].smallPercentage
                  ? (investment_portfolio.fund_analysis_variables[
                      scheme.isinCode
                    ] *
                      (Math.round(
                        scheme_allocation.data.allocationByMarketCap[0]
                          .smallPercentage * 100,
                      ) /
                        100)) /
                    100
                  : 0;
                cap_totals.tiny += scheme_allocation.data
                  .allocationByMarketCap[0].tinyPercentage
                  ? (investment_portfolio.fund_analysis_variables[
                      scheme.isinCode
                    ] *
                      (Math.round(
                        scheme_allocation.data.allocationByMarketCap[0]
                          .tinyPercentage * 100,
                      ) /
                        100)) /
                    100
                  : 0;
              }
            }

            console.log(
              'Investment Portfolio in the final of for loop',
              investment_portfolio,
            );
          }

          for (const [key, value] of Object.entries(category_totals)) {
            console.log('category', key);
            console.log(
              'total investment',
              investment_portfolio.total_investments,
            );
            console.log('category ' + key, value);
            investment_portfolio.category_base_allocation[key] =
              (Number(value) * 100) / investment_portfolio.total_investments;
            if (investment_portfolio.category_base_allocation[key] > 100) {
              investment_portfolio.category_base_allocation[key] = 100;
            }
          }

          for (const [key, value] of Object.entries(stock_totals)) {
            investment_portfolio.stock_base_allocation[key] =
              (Number(value) * 100) / investment_portfolio.total_investments;
          }

          for (const [key, value] of Object.entries(cap_totals)) {
            investment_portfolio.cap_base_allocation[key] =
              (Number(value) * 100) / investment_portfolio.total_investments;
          }

          for (const [key, value] of Object.entries(sector_totals)) {
            investment_portfolio.sector_base_alloction[key] =
              (Number(value) * 100) / investment_portfolio.total_investments;
          }

          // Sorting stock_base_allocation
          investment_portfolio.stock_base_allocation = Object.fromEntries(
            Object.entries(investment_portfolio.stock_base_allocation).sort(
              ([, a], [, b]) => Number(b) - Number(a),
            ),
          );

          // Sorting cap_base_allocation
          investment_portfolio.cap_base_allocation = Object.fromEntries(
            Object.entries(investment_portfolio.cap_base_allocation).sort(
              ([, a], [, b]) => Number(b) - Number(a),
            ),
          );

          // Sorting sector_base_allocation
          investment_portfolio.sector_base_alloction = Object.fromEntries(
            Object.entries(investment_portfolio.sector_base_alloction).sort(
              ([, a], [, b]) => Number(b) - Number(a),
            ),
          );

          response.data = investment_portfolio;
          return { status: HttpStatus.OK, response: response };
        } else {
          return { status: HttpStatus.OK, response: response };
        }
      } else {
        return {
          status: HttpStatus.NOT_FOUND,
          error: 'Investment account not created',
        };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_fund_details_all_categories(isin: string[]) {
    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    try {
      console.log('ISIN data', isin);
      const fundDetails: any =
        await this.mutualFundService.getFundDetailsByIsins(isin);
      await sleep(200);
      console.log('FUND DETAILS BY CATEGORIES', fundDetails);
      return fundDetails;
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_specific_fund_holding(
    user_id: number,
    folio_number: string,
    isin: string,
  ) {
    try {
      const onboardingUser = await this.userOnboardingRepository.findOneBy({
        user_id: user_id,
      });
      console.log('FP investment', onboardingUser);
      if (onboardingUser) {
        const response = await this.fintechService.get_holdings(
          onboardingUser.fp_investment_account_old_id,
          folio_number,
        );
        if ((response.status = HttpStatus.OK)) {
          console.log('holdings response: ', response);
          let schemes = [];
          console.log('hello1', response.data.folios);
          const folio = response.data.folios.filter((s) => {
            return s.folio_number == folio_number;
          });
          console.log('hello 2', folio);
          schemes = folio[0].schemes.filter((s) => {
            return s.isin == isin;
          });
          const scheme_data: any = await this.get_fund_details([
            schemes[0].isin,
          ]);
          if (scheme_data.status == HttpStatus.OK) {
            schemes[0]['fund_data'] = scheme_data.data[0];
          } else {
            schemes[0]['fund_data'] = {};
          }

          return { status: HttpStatus.OK, data: schemes };
        } else {
          return response;
        }
      } else {
        return {
          status: HttpStatus.NOT_FOUND,
          error: 'Investment account not created',
        };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_holdings(
    user_id: number,
    filter: string,
    tradedOnTo: string,
    page?: number,
    limit?: number,
  ) {
    try {
      const onboardingUser = await this.userOnboardingRepository.findOne({
        where: { user_id: user_id },
        relations: ['user'],
      });
      console.log('FP investment', onboardingUser);
      if (onboardingUser) {
        const tradedOnDate = tradedOnTo
          ? new Date(tradedOnTo).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        const user_folios = await this.transactionReportsRepository.find({
          where: { user_id: user_id },
        });
        const folio_list = [];
        console.log('user_folios', user_folios);
        for (const folio of user_folios) {
          if (!folio_list.includes(folio.folio_number)) {
            folio_list.push(folio.folio_number);
          }
        }
        let getreport;
        if (user_id) {
          getreport = await this.transactionsService.generateHoldingsReport(
            filter,
            user_id.toString(),
            folio_list,
            tradedOnDate,
          );
          console.log(
            'user_id, folio',
            user_id.toString(),
            folio_list,
            tradedOnDate,
          );
        } else {
          getreport = await this.transactionsService.generateHoldingsReport(
            filter,
          );
          console.log(' folio', folio_list, tradedOnDate);
        }
        console.log('GEtting Report', getreport);
        console.log('flio list', folio_list);

        const response = {
          id: onboardingUser.id,
          folios: getreport.result,
        };
        console.log('respppp', response);
        if (response.folios == undefined || response.folios == null) {
          response.folios = [];
        }
        //await this.fintechService.get_holdings(onboardingUser.fp_investment_account_old_id);
        if (response.folios.length > 0) {
          console.log('holdings response: ', response);

          // Step 1: Collect all ISINs
          const allIsins: string[] = [];
          for (const folio of response.folios) {
            for (const scheme of folio.schemes) {
              allIsins.push(scheme.isin);
            }
          }

          console.log('Collected ISINs: ', allIsins);

          // Step 2: Call get_fund_details_v2() with all ISINs
          const scheme_data_response = await this.get_fund_details_v2(allIsins);

          const schemeDataMap: Record<string, any> = {};

          if (
            scheme_data_response.status == HttpStatus.OK &&
            isArray(scheme_data_response.data)
          ) {
            // Create a map for quick lookup
            console.log('Scheme Data', scheme_data_response);
            for (const isin of allIsins) {
              const matchingScheme = scheme_data_response.data.find(
                (scheme) => scheme.isinCode === isin,
              );
              if (matchingScheme) {
                schemeDataMap[isin] = matchingScheme;
              }
            }
          }
          console.log('Scheme data mapped', schemeDataMap);

          // Step 3: Update folios with the fetched data
          for (const folio of response.folios) {
            for (const scheme of folio.schemes) {
              const schemeDetails = schemeDataMap[scheme.isin];
              if (schemeDetails) {
                scheme.logo_url = `${this.mf_base_url}/${schemeDetails.amcLogoUrl}`;
                scheme.plan_id = schemeDetails.planId;
                scheme.amc_id = schemeDetails.amcId;
              } else {
                scheme.logo_url = '';
                scheme.plan_id = 0;
              }
            }
          }

          console.log('Updated Response.folios', response.folios);

          return { status: HttpStatus.OK, data: response };
        } else {
          // return response;
          return { status: HttpStatus.OK, data: response };
        }
      } else {
        return {
          status: HttpStatus.NOT_FOUND,
          error: 'Investment account not created',
        };
      }
    } catch (err) {
      console.log('error ', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  //old code holdings
  // async get_holdings(user_id: number, filter: string, tradedOnTo: string, page?: number, limit?: number) {
  //     try {
  //         let onboardingUser = await this.userOnboardingRepository.findOne({ where: { user_id: user_id }, relations: ["user"] });
  //         console.log("FP investment", onboardingUser)
  //         if (onboardingUser) {
  //             const tradedOnDate = tradedOnTo ? new Date(tradedOnTo).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  //             let user_folios = await this.transactionReportsRepository.find({ where: { user_id: user_id } })
  //             let folio_list = []
  //             console.log("user_folios", user_folios)
  //             for (let folio of user_folios) {
  //                 if (!folio_list.includes(folio.folio_number)) {
  //                     folio_list.push(folio.folio_number)
  //                 }
  //             }
  //             let getreport
  //             if (user_id) {
  //                 getreport = await this.transactionsService.generateHoldingsReport(filter, user_id.toString(), folio_list, tradedOnDate)
  //                 console.log("user_id, folio", user_id.toString(), folio_list, tradedOnDate)
  //             }
  //             else {
  //                 getreport = await this.transactionsService.generateHoldingsReport(filter)
  //                 console.log(" folio", folio_list, tradedOnDate)
  //             }
  //             console.log("GEtting Report", getreport)
  //             console.log("flio list", folio_list)

  //             let response = {
  //                 "id": onboardingUser.id,
  //                 "folios": getreport.result
  //             }
  //             console.log("respppp", response)
  //             if (response.folios == undefined || response.folios == null) {
  //                 response.folios = []
  //             }
  //             //await this.fintechService.get_holdings(onboardingUser.fp_investment_account_old_id);
  //             if (response.folios.length > 0) {
  //                 console.log("holdings response: ", response);
  //                 console.log("holdings response: ", response.folios.schemes);

  //                 let i = 0;
  //                 for (let folio of response.folios) {
  //                     let j = 0;
  //                     for (let scheme of folio.schemes) {
  //                         console.log("isin", [scheme['isin']])
  //                         let scheme_data = await this.get_fund_details_v2([scheme['isin']]);
  //                         await sleep(200);

  //                         if (scheme_data.status == HttpStatus.OK && isArray(scheme_data.data)) {
  //                             console.log("Scheme Dataa", scheme_data.data[0])
  //                             response.folios[i].schemes[j]["logo_url"] = this.mf_base_url + "/" + scheme_data.data[0].amcLogoUrl;
  //                             response.folios[i].schemes[j]["plan_id"] = scheme_data.data[0].planId;
  //                             response.folios[i].schemes[j]["amc_id"] = scheme_data.data[0].amcId;

  //                         } else {
  //                             response.folios[i].schemes[j]["logo_url"] = "";
  //                             response.folios[i].schemes[j]["plan_id"] = 0;

  //                         }
  //                         j++;
  //                     }
  //                     i++;
  //                 }

  //                 console.log("Response.folios", response.folios)

  //                 // const filePath = await this.generateExcel(response.folios);
  //                 // console.log("filepath", filePath)
  //                 // return { status: HttpStatus.OK, data: response, excelDownloadLink: filePath, }
  //                 return { status: HttpStatus.OK, data: response }

  //             }
  //             else {
  //                 // return response;
  //                 return { status: HttpStatus.OK, data: response, }
  //             }
  //         } else {
  //             return { "status": HttpStatus.NOT_FOUND, error: "Investment account not created" };

  //         }

  //     } catch (err) {
  //         console.log("error ", err)
  //         return { "status": HttpStatus.BAD_REQUEST, error: err.message };
  //     }
  // }

  // old code v2
  // async get_holdings_version_2(user_id: number, filter: string, tradedOnTo: string, page: number = 1, limit: number = 10) {
  //     try {
  //         let onboardingUser = await this.userOnboardingRepository.findOne({ where: { user_id: user_id }, relations: ["user"] });
  //         console.log("FP investment", onboardingUser)
  //         if (onboardingUser) {
  //             const tradedOnDate = tradedOnTo ? new Date(tradedOnTo).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  //             let user_folios = await this.transactionReportsRepository.find({ where: { user_id: user_id } })
  //             let folio_list = []
  //             for (let folio of user_folios) {
  //                 if (!folio_list.includes(folio.folio_number)) {
  //                     folio_list.push(folio.folio_number)
  //                 }
  //             }

  //             let getreport
  //             if (user_id) {
  //                 getreport = await this.transactionsService.generateHoldingsReport(filter, user_id.toString(), folio_list, tradedOnDate)
  //                 console.log("user_id, folio", user_id.toString(), folio_list, tradedOnDate)
  //             }
  //             else {
  //                 getreport = await this.transactionsService.generateHoldingsReport(filter)
  //                 console.log(" folio", folio_list, tradedOnDate)
  //             }

  //             let response = {
  //                 "id": onboardingUser.id,
  //                 "folios": getreport.result || []
  //             }

  //             if (!Array.isArray(response.folios)) {
  //                 response.folios = []
  //             }

  //             // Add scheme default details
  //             let i = 0;
  //             for (let folio of response.folios) {
  //                 let j = 0;
  //                 for (let scheme of folio.schemes) {
  //                     console.log("isin", [scheme['isin']])
  //                     // let scheme_data = await this.get_fund_details_v2([scheme['isin']]);
  //                     // await sleep(200);

  //                     // if (scheme_data.status == HttpStatus.OK && isArray(scheme_data.data)) {
  //                     // console.log("Scheme Dataa", scheme_data.data[0])
  //                     // response.folios[i].schemes[j]["logo_url"] = this.mf_base_url + "/" + scheme_data.data[0].amcLogoUrl;
  //                     // response.folios[i].schemes[j]["plan_id"] = scheme_data.data[0].planId;
  //                     // response.folios[i].schemes[j]["amc_id"] = scheme_data.data[0].amcId;

  //                     // } else {
  //                     response.folios[i].schemes[j]["logo_url"] = "";
  //                     response.folios[i].schemes[j]["plan_id"] = 0;
  //                     response.folios[i].schemes[j]["amc_id"] = 0;
  //                     // }
  //                     j++;
  //                 }
  //                 i++;
  //             }

  //             let allSchemes = [];
  //             for (let folio of response.folios) {
  //                 for (let scheme of folio.schemes) {
  //                     scheme["folio_number"] = folio.folio_number;
  //                     allSchemes.push(scheme);
  //                 }
  //             }

  //             const totalItems = allSchemes.length;
  //             const startIndex = (page - 1) * limit;
  //             const endIndex = startIndex + limit;
  //             const paginatedSchemes = allSchemes.slice(startIndex, endIndex);

  //             const excelFilePath = await this.generateExcelFromSchemes(allSchemes); // <-- pass full unpaginated list to Excel

  //             const finalResponse = {
  //                 id: response.id,
  //                 folios: paginatedSchemes,
  //                 meta: {
  //                     totalItems: totalItems,
  //                     page: page,
  //                     limit: limit,
  //                     totalPages: Math.ceil(totalItems / limit)
  //                 },
  //                 excelDownloadLink: excelFilePath
  //             }

  //             return { status: HttpStatus.OK, data: finalResponse }

  //         } else {
  //             return { status: HttpStatus.NOT_FOUND, error: "Investment account not created" }
  //         }

  //     } catch (err) {
  //         console.log("error ", err)
  //         return { status: HttpStatus.BAD_REQUEST, error: err.message }
  //     }
  // }

  async get_holdings_version_2(
    user_id: number,
    filter: string,
    tradedOnTo: string,
    page = 1,
    limit = 10,
  ) {
    try {
      // Fetch user onboarding details
      const onboardingUser = await this.userOnboardingRepository.findOne({
        where: { user_id },
        relations: ['user'],
      });
      console.log('FP investment', onboardingUser);

      if (!onboardingUser) {
        return {
          status: HttpStatus.NOT_FOUND,
          error: 'Investment account not created',
        };
      }

      // Prepare date filter
      const tradedOnDate = tradedOnTo
        ? new Date(tradedOnTo).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      // Fetch user folio numbers
      const user_folios = await this.transactionReportsRepository.find({
        where: { user_id },
      });
      const folio_list: string[] = [
        ...new Set(user_folios.map((f) => f.folio_number)),
      ];

      // Generate holdings report
      let getreport;
      if (user_id) {
        getreport = await this.transactionsService.generateHoldingsReport(
          filter,
          user_id.toString(),
          folio_list,
          tradedOnDate,
        );
        console.log(
          'user_id, folio',
          user_id.toString(),
          folio_list,
          tradedOnDate,
        );
      } else {
        getreport = await this.transactionsService.generateHoldingsReport(
          filter,
        );
        console.log(' folio', folio_list, tradedOnDate);
      }

      // Prepare response structure
      const response = {
        id: onboardingUser.id,
        folios: getreport.result || [],
      };

      if (!Array.isArray(response.folios)) {
        response.folios = [];
      }

      // Step 1: Collect all ISINs
      const allIsins: string[] = [];
      for (const folio of response.folios as any[]) {
        for (const scheme of folio.schemes) {
          allIsins.push(scheme.isin);
        }
      }

      // Step 2: Fetch fund details in batch
      const scheme_data_response = await this.get_fund_details_v2(allIsins);

      const schemeDataMap: Record<string, any> = {};

      if (
        scheme_data_response.status == HttpStatus.OK &&
        isArray(scheme_data_response.data)
      ) {
        // Create a map for quick lookup
        console.log('Scheme Data', scheme_data_response);
        for (const isin of allIsins) {
          const matchingScheme = scheme_data_response.data.find(
            (scheme) => scheme.isinCode === isin,
          );
          if (matchingScheme) {
            schemeDataMap[isin] = matchingScheme;
          }
        }
      }
      console.log('Scheme data mapped', schemeDataMap);

      // Step 3: Attach scheme details to folios
      const allSchemes: any[] = [];
      for (const folio of response.folios as any[]) {
        for (const scheme of folio.schemes) {
          const schemeDetails = schemeDataMap[scheme.isin];
          if (schemeDetails) {
            scheme.logo_url = `${this.mf_base_url}/${schemeDetails.amcLogoUrl}`;
            scheme.plan_id = schemeDetails.planId;
            scheme.amc_id = schemeDetails.amcId;
          } else {
            scheme.logo_url = '';
            scheme.plan_id = 0;
            scheme.amc_id = 0;
          }
          scheme.folio_number = folio.folio_number;
          allSchemes.push(scheme);
        }
      }

      // Step 4: Paginate the results
      const totalItems = allSchemes.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedSchemes = allSchemes.slice(startIndex, endIndex);

      // Step 5: Generate Excel file from full scheme list
      const excelFilePath = await this.generateExcelFromSchemes(allSchemes);

      // Step 6: Prepare final response
      const finalResponse = {
        id: response.id,
        folios: paginatedSchemes,
        meta: {
          totalItems,
          page,
          limit,
          totalPages: Math.ceil(totalItems / limit),
        },
        excelDownloadLink: excelFilePath,
      };

      return { status: HttpStatus.OK, data: finalResponse };
    } catch (err) {
      console.log('error ', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_holdings_report(
    user_id,
    filter: string,
    tradedOnTo: string,
    page: number,
    limit: number,
  ) {
    try {
      console.log('Entered');
      const tradedOnDate = tradedOnTo
        ? new Date(tradedOnTo).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      const folio_list = [];
      if (user_id == 'null') {
        user_id = null;
      }

      let getreport;
      console.log('User_id', user_id);
      if (user_id) {
        const user_folios = await this.transactionReportsRepository.find({
          where: { user_id: user_id },
        });
        console.log('user_folios', user_folios);
        for (const folio of user_folios) {
          if (!folio_list.includes(folio.folio_number)) {
            folio_list.push(folio.folio_number);
          }
        }
        getreport = await this.transactionsService.generateHoldingsReport(
          filter,
          user_id.toString(),
          folio_list,
          tradedOnDate,
        );
        console.log(
          'user_id, folio',
          user_id.toString(),
          folio_list,
          tradedOnDate,
        );
      } else {
        getreport = await this.transactionsService.generateHoldingsReport(
          filter,
        );
        console.log(' folio', folio_list, tradedOnDate);
      }
      console.log('GEtting Report', getreport);
      console.log('flio list', folio_list);

      const response = {
        id: user_id,
        folios: getreport.result,
      };
      console.log('respppp', response);
      if (response.folios == undefined || response.folios == null) {
        response.folios = [];
      }
      //await this.fintechService.get_holdings(onboardingUser.fp_investment_account_old_id);
      if (response.folios.length > 0) {
        console.log('holdings response: ', response);

        let i = 0;
        for (const folio of response.folios) {
          let j = 0;
          for (const scheme of folio.schemes) {
            const scheme_data = await this.get_fund_details([scheme['isin']]);
            console.log('Scheme Dataa', scheme_data.data[0]);
            if (scheme_data.status == HttpStatus.OK) {
              // response.folios[i].schemes[j]["logo_url"] = this.mf_base_url + "/" + scheme_data.data[0].amcLogoUrl;
              // response.folios[i].schemes[j]["plan_id"] = scheme_data.data[0].planId;
              // response.folios[i].schemes[j]["amc_id"] = scheme_data.data[0].amcId;
            } else {
              response.folios[i].schemes[j]['logo_url'] = '';
              response.folios[i].schemes[j]['plan_id'] = 0;
            }
            j++;
          }
          i++;
        }
        // const filePath = await this.generateExcel(response.folios);
        // console.log("filepath", filePath)
        // return { status: HttpStatus.OK, data: response, excelDownloadLink: filePath, }
        return { status: HttpStatus.OK, data: response };
      } else {
        // return response;
        return { status: HttpStatus.OK, data: response };
      }
    } catch (err) {
      console.log('error ', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async generateExcelFromSchemes(schemes: any[]): Promise<string> {
    try {
      const rows = [];

      for (const scheme of schemes) {
        rows.push({
          'Folio Number': scheme.folio_number,
          'Scheme Name': scheme.name,
          ISIN: scheme.isin,
          Type: scheme.type,
          Units: scheme.holdings.units,
          'Market Value': scheme.market_value.amount,
          NAV: scheme.nav.value,
          'Redeemable Units': scheme.holdings.redeemable_units,
        });
      }

      console.log('EROws', rows);

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Holdings');

      const directory = path.join(`${this.filepath}`, 'uploads');
      const downloaddirectory = path.join(directory, 'downloads');
      if (!fs.existsSync(downloaddirectory)) {
        console.log('Directory does not exist. Creating it...');
        fs.mkdirSync(downloaddirectory, { recursive: true });
      } else {
        console.log('Directory already exists.');
      }

      const uniqueFileName = `Holdings_${Date.now()}.xlsx`;
      const filePath = path.join(downloaddirectory, uniqueFileName);

      XLSX.writeFile(workbook, filePath);

      console.log(
        'Excel file generated:',
        `${process.env.BASE_URL}/uploads/downloads/${uniqueFileName}`,
      );
      return `${process.env.BASE_URL}/uploads/downloads/${uniqueFileName}`;
    } catch (err) {
      console.error('Error generating Excel file:', err.message);
      throw new Error('Failed to generate Excel file');
    }
  }

  async get_benchmark_nav(duration: number) {
    try {
      const fundDetail = await this.mutualFundService.getFundNavGraph(
        this.benchmark_fund_id,
        duration,
      );
      console.log('please', fundDetail);
      return fundDetail;
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, message: err.message };
    }
  }

  async get_returns_graph(user_id: number, duration: number) {
    try {
      console.log('USer_id', user_id);
      const today_date = new Date();
      const duration_date = new Date();
      duration_date.setDate(duration_date.getDate() - duration);

      const returnDetails = await this.userReturnsHistoryRepository.find({
        where: {
          user_id: user_id,
          date: Between(startOfDay(duration_date), endOfDay(today_date)),
        },
      });
      console.log('Return Details', returnDetails);

      return { status: HttpStatus.OK, data: returnDetails };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, message: err.message };
    }
  }

  async get_smart_returns_graph(
    user_id: number,
    duration: number,
    transaction_basket_id: number,
  ) {
    try {
      const today_date = new Date();
      const duration_date = new Date();
      duration_date.setDate(duration_date.getDate() - duration);

      // let returnDetails = await this.userSmartReturnsHistoryRepository.find({where:{user_id : user_id,transaction_basket_id:transaction_basket_id , date: Between(startOfDay(duration_date), endOfDay(today_date))}})
      console.log('user_id', user_id);
      console.log('duration', duration);
      console.log('transaction_basket_id', transaction_basket_id);
      console.log('duration_date', duration_date);

      const returnDetails = await this.userSmartReturnsHistoryRepository.find({
        where: {
          user_id: user_id,
          transaction_basket_id: transaction_basket_id,
        },
      });

      console.log('returnDetails', returnDetails);

      return { status: HttpStatus.OK, data: returnDetails };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, message: err.message };
    }
  }

  async list_smart_sips(user_id) {
    try {
      const transaction_basket_items =
        await this.transactionBasketItemsRepository.find({
          where: {
            transaction_type: 'smart_sip',
            user_id: user_id,
            status: 'active',
            folio_number: Not(IsNull()),
          },
        });
      const ids = transaction_basket_items.map((item) => {
        return item.transaction_basket_id;
      });

      const transaction_baskets = await this.transactionBasketsRepository.find({
        where: { id: In(ids) },
        relations: ['transaction_basket_items'],
      });

      const result_basket = [];

      for (const basket of transaction_baskets) {
        if (basket.transaction_basket_items.length > 0) {
          const result = await Promise.all(
            basket.transaction_basket_items.map(async (transaction) => {
              const fundDetails = await this.get_fund_details([
                transaction.fund_isin,
              ]);
              const fund_detail = {
                fund_name: fundDetails.data[0].schemeName,
                logo_url:
                  this.mf_base_url + '/' + fundDetails.data[0].amcLogoUrl,
                fund_plan_id: fundDetails.data[0].planId,
              };
              transaction['fund_plan_id'] = fund_detail.fund_plan_id;
              transaction['fund_name'] = fund_detail.fund_name;
              transaction['logo_url'] = fund_detail.logo_url;
              return transaction;
            }),
          );

          basket.transaction_basket_items = result;
          result_basket.push(basket);
        }
      }

      return { status: HttpStatus.OK, data: result_basket };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, message: err.message };
    }
  }

  async distributor_logo(file: Express.Multer.File, tenant_id: string) {
    try {
      const tenant = await this.distributologoRepo.findOne({
        where: { tenant_id: tenant_id },
      });
      if (!file) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Please upload a file',
        };
      }

      const ext = path.extname(file.path).toLowerCase();
      console.log('ext', ext);
      const fileName = `${this.base_url}/${file.path}`;
      console.log('fileName', fileName);
      if (!tenant) {
        const newTenant = await this.distributologoRepo.save({
          tenant_id: tenant_id,
          logo: fileName,
        });
        return {
          status: HttpStatus.OK,
          message: 'Distributor logo uploaded successfully',
          data: newTenant,
        };
      } else {
        tenant.logo = fileName;
        const updatedTenant = await this.distributologoRepo.save(tenant);
        return {
          status: HttpStatus.OK,
          message: 'Distributor logo updated successfully',
          data: updatedTenant,
        };
      }
    } catch (err) {
      console.log('Error in getting distributor logo', err);
      return { status: HttpStatus.BAD_REQUEST, message: err.message };
    }
  }

  async get_distributor_logo(tenant_id: string) {
    try {
      const tenant = await this.distributologoRepo.findOne({
        where: { tenant_id: tenant_id },
      });
      if (!tenant) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Distributor logo not found',
        };
      } else {
        return { status: HttpStatus.OK, data: tenant };
      }
    } catch (err) {
      console.log('Error in getting distributor logo', err);
      return { status: HttpStatus.BAD_REQUEST, message: err.message };
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
