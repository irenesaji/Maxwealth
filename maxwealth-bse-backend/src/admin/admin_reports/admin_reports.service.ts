import { HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { TransactionBasketItemsRepository } from 'src/repositories/transaction_basket_item.repository';
import { TransactionBasketItems } from 'src/transaction_baskets/entities/transaction_basket_items.entity';
import { CapitalGainFilterDto } from 'src/utils/fintech/dtos/capital_gain_filter.dto';
import { GetAumReportDto } from 'src/utils/fintech/dtos/get_aum_report.dto';
import { ListFilterDto } from 'src/utils/fintech/dtos/list_filter.dto';
import { ReturnsFilterDto } from 'src/utils/fintech/dtos/returns_filter.dto';
import { TransactionListDto } from 'src/utils/fintech/dtos/transaction_list.dto';
import { FintechService } from 'src/utils/fintech/fintech.service';
import { In, IsNull, LessThanOrEqual, Not, Repository } from 'typeorm';
import { AumReportDto } from '../dtos/aum_report.dto';
import { TransactionReportsRepository } from 'src/repositories/transaction_reports.repository';
import { MutualfundsService } from 'src/utils/mutualfunds/mutualfunds.service';
import {
  AggregatedScheme,
  Scheme,
} from 'src/transactions/types/transaction.types';
import { TransactionReports } from 'src/investor-details/entities/transaction-details.entity';
import { SourceRepository } from 'src/repositories/source.repository';
import { FundDetailsRepository } from 'src/repositories/fund_details.repository';
import { CostInflationIndexRepository } from 'src/repositories/cost_inflation.repository';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from 'src/repositories/user.repository';

@Injectable({ scope: Scope.REQUEST })
export class AdminReportsService {
  mf_base_url: string;
  configService: any;

  // constructor(
  //     private readonly fintechService:FintechService,
  //     @InjectRepository(TransactionBasketItems)
  //     private transactionBasketItemsRepository : Repository<TransactionBasketItems>
  // ){

  // }

  constructor(
    private readonly fintechService: FintechService,
    private readonly mutualfundsService: MutualfundsService,
    private readonly transactionBasketItemsRepository: TransactionBasketItemsRepository,
    private readonly purchasesRepository: PurchaseRepository,
    private transactionReportsRepository: TransactionReportsRepository,
    private sourceRepository: SourceRepository,
    private fundDetailRepository: FundDetailsRepository,
    private ciiRepository: CostInflationIndexRepository,
    private usersRepo: UsersRepository,
  ) {
    this.configService = new ConfigService();
    this.mf_base_url = this.configService.get('MF_BASE_URL');
    //    let transactionBasketItemsRepository = new Repository<TransactionBasketItems>(TransactionBasketItems, dataSource.createEntityManager());
    // super(transactionBasketItemsRepository);
  }

  async get_folios(user_id) {
    try {
      let result = [];
      if (user_id) {
        result = await this.transactionBasketItemsRepository
          .createQueryBuilder('transaction_basket_items')
          .innerJoin('transaction_basket_items.user', 'user')
          .select([
            'transaction_basket_items.folio_number',
            'transaction_basket_items.fund_isin',
            'user.email',
            'user.id',
          ])
          .where({ folio_number: Not(IsNull()), user_id: user_id })
          .distinct(true)
          .getRawMany();

        return { status: HttpStatus.OK, data: result };
      } else {
        result = await this.transactionBasketItemsRepository
          .createQueryBuilder('transaction_basket_items')
          .innerJoin('transaction_basket_items.user', 'user')
          .select([
            'transaction_basket_items.folio_number',
            'transaction_basket_items.fund_isin',
            'user.email',
            'user.id',
          ])
          .where({ folio_number: Not(IsNull()) })
          .distinct(true)
          .getRawMany();

        return { status: HttpStatus.OK, data: result };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_purchases() {
    try {
      const result = await this.purchasesRepository
        .createQueryBuilder('purchases')
        .innerJoin('purchases.user', 'user')
        .select([
          'purchases.fp_id',
          'purchases.scheme',
          'user.email',
          'user.id',
        ])
        .where({ plan: IsNull() })
        .distinct(true)
        .getRawMany();

      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_purchase_plans() {
    try {
      const result = await this.transactionBasketItemsRepository
        .createQueryBuilder('transaction_basket_items')
        .innerJoin('transaction_basket_items.user', 'user')
        .select([
          'transaction_basket_items.fp_sip_id',
          'transaction_basket_items.fund_isin',
          'user.email',
          'user.id',
        ])
        .where({ fp_sip_id: Not(IsNull()) })
        .distinct(true)
        .getRawMany();

      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_redemption_plans() {
    try {
      const result = await this.transactionBasketItemsRepository
        .createQueryBuilder('transaction_basket_items')
        .innerJoin('transaction_basket_items.user', 'user')
        .select([
          'transaction_basket_items.fp_swp_id',
          'transaction_basket_items.fund_isin',
          'user.email',
          'user.id',
        ])
        .where({ fp_swp_id: Not(IsNull()) })
        .distinct(true)
        .getRawMany();

      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_switch_plans() {
    try {
      const result = await this.transactionBasketItemsRepository
        .createQueryBuilder('transaction_basket_items')
        .innerJoin('transaction_basket_items.user', 'user')
        .select([
          'transaction_basket_items.fp_stp_id',
          'transaction_basket_items.fund_isin',
          'user.email',
          'user.id',
        ])
        .where({ fp_stp_id: Not(IsNull()) })
        .distinct(true)
        .getRawMany();

      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_aum_report_overall(traded_on_from, traded_on_to) {
    try {
      const aum_report = await this.get_aum_report(
        null,
        traded_on_from,
        traded_on_to,
      );
      console.log('AUM Report', aum_report);

      const aum_report_dto = new AumReportDto();

      // Helper to get value per category
      const getCategoryValue = (category: string) => {
        const categoryData = aum_report.data.find(
          (item) => item.category === category,
        );
        return categoryData ? categoryData.totalInvestment || 0 : 0;
      };

      // Fetch values
      const equityValue = getCategoryValue('Equity');
      const debtValue = getCategoryValue('Debt');
      const hybridValue = getCategoryValue('Hybrid');
      const alternateValue = getCategoryValue('Alternate'); // Or other categories if applicable

      // Total AUM value
      const totalValue = equityValue + debtValue + hybridValue + alternateValue;

      // Guard against division by zero
      const getPercentage = (value: number) =>
        totalValue === 0
          ? 0
          : parseFloat(((value / totalValue) * 100).toFixed(2));

      // Assign to DTO
      aum_report_dto.equity_value = equityValue;
      aum_report_dto.debt_value = debtValue;
      aum_report_dto.hybrid_value = hybridValue;
      aum_report_dto.alternate_value = alternateValue;

      aum_report_dto.equity_percentage = getPercentage(equityValue);
      aum_report_dto.debt_percentage = getPercentage(debtValue);
      aum_report_dto.hybrid_percentage = getPercentage(hybridValue);
      aum_report_dto.alternate_percentage = getPercentage(alternateValue);

      return { status: HttpStatus.OK, data: aum_report_dto };
    } catch (err) {
      console.log('Error occurred', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  // async get_aum_report(getAumReportDto: GetAumReportDto) {
  //     try {
  //         let result = await this.fintechService.get_aum_report(getAumReportDto);
  //         return result;
  //     } catch (err) {
  //         return { "status": HttpStatus.BAD_REQUEST, error: err.message };
  //     }
  // }

  async get_aum_report(
    partner: string,
    traded_on_from: Date,
    traded_on_to: Date,
  ) {
    try {
      console.log('Starting fund_scheme_category_wise with parameters:', {
        partner,
        traded_on_from,
        traded_on_to,
      });

      // Fetch purchase transactions
      const transactionsQuery = this.transactionReportsRepository
        .createQueryBuilder('transaction_reports')
        .select('transaction_reports.isin', 'isin')
        .addSelect('SUM(transaction_reports.units)', 'units')
        .addSelect('SUM(transaction_reports.amount)', 'total_investment')
        .where('LOWER(transaction_reports.type) NOT IN (:...excludedTypes)', {
          excludedTypes: ['redemption', 'switch out', 'lateral shift out'].map(
            (type) => type.toLowerCase(),
          ),
        }) // Filter for purchase transactions
        .groupBy('transaction_reports.isin');
      // .addGroupBy('transaction_reports.units')

      // Apply filters
      if (partner)
        transactionsQuery.andWhere('transaction_reports.partner = :partner', {
          partner,
        });
      if (traded_on_from)
        transactionsQuery.andWhere(
          'transaction_reports.traded_on >= :traded_on_from',
          { traded_on_from },
        );
      if (traded_on_to)
        transactionsQuery.andWhere(
          'transaction_reports.traded_on <= :traded_on_to',
          { traded_on_to },
        );

      console.log('Executing transactions query...');
      const purchaseTransactions = await transactionsQuery.getRawMany();
      console.log('Purchase transactions', purchaseTransactions);

      // Extract unique ISINs
      const allIsins = purchaseTransactions.map((txn) => txn.isin);
      const isins = [...new Set(allIsins)];
      console.log(
        `Retrieved ${allIsins.length} ISINs, ${isins.length} unique.`,
      );

      // Fetch fund categories for ISINs
      let fundDetails: any = [];
      if (isins.length > 0) {
        console.log('Fetching fund details for ISINs...');
        fundDetails = await this.mutualfundsService.getFundDetailsByIsins(
          isins,
        ); // Replace with your actual function to fetch fund details
        console.log('Fund details fetched successfully.');
      } else {
        console.log('No ISINs found. Skipping fund details fetch.');
      }

      // Group investments by category
      const investmentsByCategory = purchaseTransactions.reduce((acc, txn) => {
        const fundDetail =
          fundDetails.data.find((fund) => fund.isinCode === txn.isin) || {};
        // console.log("fundDetail category", fundDetail.category);
        const category = fundDetail?.category?.primaryCategoryName || 'Unknown';
        if (category == 'Unknown') {
          console.log('Showing unknown:', fundDetail);
        }
        const nav: number = fundDetail?.nav;

        if (!acc[category]) {
          acc[category] = 0;
        }
        // acc[category] += parseFloat((txn.units * nav).toString());
        acc[category] +=
          parseFloat(String(txn.units)) * parseFloat(String(nav));

        console.log('ACCC', acc);
        return acc;
      }, {});

      // Transform result to array format
      const detailedResults = Object.keys(investmentsByCategory).map(
        (category) => ({
          category,
          totalInvestment:
            investmentsByCategory[category] !== null
              ? parseFloat(investmentsByCategory[category].toFixed(4))
              : null,
        }),
      );

      // Calculate the total count of records for pagination metadata
      const totalCount = detailedResults.length;

      console.log('Function executed successfully. Returning results.');
      return {
        status: HttpStatus.OK,
        data: detailedResults,
      };
    } catch (err) {
      console.log('Error occurred', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_transaction_type_wise_amount_summary_overall(
    traded_on_from,
    traded_on_to,
  ) {
    try {
      const result = {
        redemption: 4044374.07,
        switch_out: 6713373.75,
        purchase: 13411292.51,
        transfer_in: 42440.77,
        switch_in: 7029926.1,
        dividend_payout: 185723.7,
        sip: 2921466.03,
      };
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  // async get_transaction_type_wise_amount_summary(getAumReportDto:GetAumReportDto) {
  //     try{
  //         let result = await this.fintechService.get_transaction_type_wise_amount_summary(getAumReportDto);
  //         return result;
  //     }catch(err){
  //         return { "status": HttpStatus.BAD_REQUEST , error: err.message};
  //     }
  // }

  async get_transaction_type_wise_amount_summary(
    partner?: string,
    traded_on_from?: Date,
    traded_on_to?: Date,
  ) {
    try {
      console.log('HEllo');
      // Start QueryBuilder
      const query = this.transactionReportsRepository
        .createQueryBuilder('transaction_reports')
        .select('transaction_reports.type', 'type')
        .addSelect('SUM(transaction_reports.amount)', 'total')
        .groupBy('transaction_reports.type');

      // Apply filters if provided
      if (partner) {
        query.andWhere('transaction_reports.user_id = :partner', { partner });
      }

      if (traded_on_from) {
        query.andWhere('transaction_reports.traded_on >= :traded_on_from', {
          traded_on_from,
        });
      }

      if (traded_on_to) {
        query.andWhere('transaction_reports.traded_on <= :traded_on_to', {
          traded_on_to,
        });
      }

      // Execute the query to get the result
      const result = await query.getRawMany();

      // Map and aggregate results by normalized type
      const aggregatedTotals = result.reduce((acc, row) => {
        let type = row.type.toLowerCase();

        if (
          type.includes('fresh purchase systematic') ||
          type.includes('additional purchase systematic') ||
          type.includes('systematic investment')
        ) {
          type = 'sip';
        } else if (
          type.includes('fresh purchase') ||
          type.includes('additional purchase') ||
          type.includes('purchase')
        ) {
          type = 'purchase';
        } else if (
          type.includes('partial redemption') ||
          type.includes('full redemption') ||
          type.includes('redemption')
        ) {
          type = 'redemption';
        } else if (
          type.includes('lateral shift out') ||
          type.includes('lateral shift in') ||
          type.includes('switch out') ||
          type.includes('switch over in') ||
          type.includes('ticob') ||
          type.includes('switch in')
        ) {
          type = 'switch';
        }

        // If type exists, add to total, otherwise create new entry
        if (acc[type]) {
          acc[type] += parseFloat(row.total);
        } else {
          acc[type] = parseFloat(row.total);
        }

        return acc;
      }, {} as Record<string, number>);

      // Convert aggregated totals to array format
      const aggregatedData = Object.entries(aggregatedTotals).map(
        ([type, total]) => ({
          type,
          total,
        }),
      );

      // Calculate the total count of records for pagination metadata
      const totalCount = aggregatedData.length;

      //   let excelLink = await this.generateExcelforTransactionType(aggregatedData)

      // Return the paginated result with metadata
      return {
        status: HttpStatus.OK,
        data: aggregatedData,
      };
    } catch (err) {
      console.log('Error occurred', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_transaction_list(transactionListDto: TransactionListDto) {
    try {
      const result = await this.fintechService.get_transaction_list(
        transactionListDto,
      );
      return result;
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_mf_purchase_list(listFilterDto: ListFilterDto) {
    try {
      const result = await this.fintechService.get_mf_purchase_list(
        listFilterDto,
      );
      return result;
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_mf_redemption_list(listFilterDto: ListFilterDto) {
    try {
      const result = await this.fintechService.get_mf_redemption_list(
        listFilterDto,
      );
      return result;
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_holdings_report(
    investmentAccountId: string,
    folios: string[],
    asOn: string,
  ) {
    try {
      // Normalize the date
      asOn = asOn
        ? new Date(asOn).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      // Input validation
      // if (!investmentAccountId && (!folios || folios.length === 0)) {
      //   return {
      //     status: HttpStatus.BAD_REQUEST,
      //     error: "Either investmentAccountId or at least one folio must be provided",
      //   };
      // }

      console.log('Generating Holdings Report for:', {
        investmentAccountId,
        folios,
        asOn,
      });

      const invested_amount = await this.getCurrentInvestedAmount(
        investmentAccountId,
        folios,
        asOn,
      );
      console.log('Invested Amount', invested_amount.data);

      // Retrieve transactions for the given investmentAccountId or folios with pagination
      const transactions = await this.getTransactions(
        investmentAccountId,
        folios,
        asOn,
      );
      console.log('Transactions Retrieved:', transactions.data);

      // Group transactions by folio using reduce
      if (transactions.status == 200) {
        const groupedByFolio = transactions.data.reduce(
          (acc: Record<string, any[]>, transaction: any) => {
            const { folio_number } = transaction;

            // Initialize array for the folio if not present
            if (!folio_number) {
              console.log(
                'Transaction without a folio number encountered:',
                transaction,
              );
              return acc;
            }

            acc[folio_number] = acc[folio_number] || [];
            acc[folio_number].push(transaction);

            return acc;
          },
          {},
        );

        console.log('Grouped Transactions by Folio:', groupedByFolio);

        // Process each folio and calculate holdings
        const holdingsData = await Promise.all(
          Object.entries(groupedByFolio).map(
            async ([folioNumber, folioTransactions]) => {
              // Ensure folioTransactions is an array
              if (!Array.isArray(folioTransactions)) {
                console.log(
                  `folioTransactions for folio ${folioNumber} is not an array.`,
                );
                return { folio_number: folioNumber, holdings: [] };
              }

              const holdings = await folioTransactions.reduce(
                async (
                  accP: Promise<Record<string, any>>,
                  transaction: any,
                ) => {
                  const acc = await accP; // Resolve the accumulator promise first

                  const isin = transaction.isin;
                  const type = transaction?.fund?.planName;
                  const name = transaction?.fund?.schemeName;
                  const fund = transaction?.fund;

                  // Initialize the ISIN object if not already present
                  if (!acc[isin]) {
                    acc[isin] = {
                      isin,
                      name,
                      type,
                      holdings: {
                        as_on: asOn,
                        units: 0,
                        redeemable_units: 0,
                      },
                      market_value: {
                        as_on: asOn,
                        amount: 0,
                        redeemable_amount: 0,
                      },
                      invested_value: {
                        as_on: asOn,
                        amount: 0,
                      },
                      payout: {
                        as_on: asOn,
                        amount: 0,
                      },
                      nav: {
                        as_on: asOn,
                        value: fund?.nav,
                      },
                    };
                  }

                  // Calculate holdings
                  const schemeHoldings = (await this.calculateHoldings([
                    transaction,
                  ])) || {
                    unit: 0,
                    redeemable_units: 0,
                  };
                  console.log('Scheme Holdings', schemeHoldings);

                  // Safely accumulate units and values
                  acc[isin].holdings.units += schemeHoldings.unit;
                  acc[isin].holdings.units = parseFloat(
                    parseFloat(acc[isin].holdings.units).toFixed(4),
                  );
                  acc[isin].holdings.redeemable_units +=
                    schemeHoldings.redeemable_units;
                  acc[isin].holdings.redeemable_units = parseFloat(
                    parseFloat(acc[isin].holdings.redeemable_units).toFixed(4),
                  );
                  acc[isin].market_value.amount = parseFloat(
                    (acc[isin].holdings.units * fund?.nav).toFixed(4),
                  );
                  acc[isin].market_value.redeemable_amount = parseFloat(
                    (acc[isin].holdings.redeemable_units * fund?.nav).toFixed(
                      4,
                    ),
                  );

                  const matchingInvestment = invested_amount.data.find(
                    (investment) =>
                      investment.folio_number === transaction.folio_number,
                  );
                  console.log('Matching Investment', matchingInvestment);

                  if (matchingInvestment) {
                    const schemeMatchingInvestment =
                      matchingInvestment.scheme_investments.find(
                        (scheme) => scheme.isin === acc[isin].isin,
                      );
                    console.log(
                      'Scheme Matching Investment',
                      schemeMatchingInvestment,
                    );

                    if (schemeMatchingInvestment) {
                      acc[isin].invested_value.amount =
                        schemeMatchingInvestment.invested_amount;
                    }
                  }
                  console.log('ACC', acc);

                  return acc;
                },
                Promise.resolve({}),
              ); // Start with an empty object

              console.log('Holdings:', holdings);

              const filteredHoldings = Object.values(holdings).filter(
                (holding) => holding['holdings'].units > 0,
              );
              console.log('Filtered holdings', filteredHoldings);

              return {
                folio_number: folioNumber,
                schemes: filteredHoldings,
              };
            },
          ),
        );

        console.log('Final Holdings Data:', holdingsData);

        const finHoldings = holdingsData.filter(
          (item) => item.schemes.length >= 1,
        );

        console.log('Filtered Holdings Data (schemes >= 1):', finHoldings);
        // let paginatedData, totalResults

        // // Implement pagination by slicing the holdingsData based on the current page and limit
        // if (page != null && limit != null) {
        //   totalResults = holdingsData.length;
        //   const startIndex = (page - 1) * limit;
        //   const endIndex = startIndex + limit;

        //   paginatedData = holdingsData.slice(startIndex, endIndex);
        // }

        // Return paginated data along with metadata (e.g., total results, current page, etc.)
        return {
          status: HttpStatus.OK,
          data: finHoldings,
        };
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: transactions.error };
      }
    } catch (err) {
      console.log('Error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_capital_gains_report(
    accountId: string,
    folios?: string[],
    scheme?: string,
    traded_on_from?: Date,
    traded_on_to?: Date,
  ) {
    if (accountId == 'null') {
      accountId = null;
    }
    const today = new Date().toISOString().split('T')[0];

    const queryBuilder = this.sourceRepository
      .createQueryBuilder('sources')
      .leftJoinAndSelect('sources.transactionReport', 'transactionReport')
      .leftJoinAndSelect('sources.source_transaction', 'source_transaction');

    // console.log("Query Builder", await queryBuilder.getMany());

    if (accountId !== null && accountId !== undefined) {
      console.log('INN users');
      console.log('Account ID', accountId);
      console.log('Type', typeof accountId);
      const user_id = Number(accountId);
      console.log('Account ID', user_id);
      console.log('Type', typeof user_id);
      queryBuilder.where('transactionReport.user_id = :user_id', { user_id });
    }

    // Filter by folios
    if (folios && folios.length > 0) {
      console.log('Folios Inn', folios);
      queryBuilder.andWhere('transactionReport.folio_number IN (:...folios)', {
        folios,
      });
    }

    // Filter by scheme
    if (scheme) {
      console.log('Scheme', scheme);
      queryBuilder.andWhere('transactionReport.rta_scheme_name = :scheme', {
        scheme,
      });
    }

    // Filter by traded_on date range
    if (traded_on_from) {
      console.log('Traded On From', traded_on_from);
      queryBuilder.andWhere('transactionReport.traded_on >= :traded_on_from', {
        traded_on_from,
      });
    }
    if (traded_on_to) {
      console.log('Traded On To', traded_on_to);
      queryBuilder.andWhere('transactionReport.traded_on <= :traded_on_to', {
        traded_on_to,
      });
    }

    // Apply pagination if page and limit are provided
    // if (page != null && limit != null) {
    //   const skip = (page - 1) * limit;
    //   queryBuilder.skip(skip).take(limit);
    // }

    // Execute the query to get the transactions
    const transactions = await queryBuilder.getMany();
    console.log('Transactions', transactions);

    const isin = transactions
      .filter(
        (scheme) =>
          scheme.transactionReport.isin &&
          scheme.transactionReport.isin.length > 0,
      ) // Ensure scheme.isin exists and is not empty
      .map((scheme) => scheme.transactionReport.isin);
    console.log('ISINs', isin);

    // Check if the ISIN array is empty or contains empty elements
    if (!isin.length || isin.some((item) => !item || item.trim() === '')) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Error: ISIN is empty or contains invalid values.',
      };
    } else {
      console.log('All ISINs are valid:', isin);
    }

    console.log('Total Count of Schemes:', isin.length);

    const fund: any = await this.mutualfundsService.getFundDetailsByIsins(isin);
    console.log('Funds', fund);

    // Get the total count of transactions to calculate total pages
    const totalCount = await queryBuilder.getCount();
    console.log('Total Count of Transactions:', totalCount);

    // Calculate capital gains for each transaction
    const result = [];
    for (const txn of transactions) {
      const year = new Date(txn.purchased_on).getFullYear(); // Extract purchase year
      const cii = await this.ciiRepository.findOne({
        where: { financial_year: year },
      });
      const ciiValue = cii.cost_inflation_index;
      console.log('CiiValue', ciiValue);

      // let exitload = fund?.data?.find(data => data.isin === txn.transactionReport.isin)?.exitload
      const fundDetail = await this.fundDetailRepository.findOne({
        where: { isin: txn.transactionReport.isin },
      });
      let exitload: any = fundDetail?.exitLoad;
      exitload = Number(exitload);
      console.log('Exitload exitload', exitload);
      if (exitload == null) {
        exitload = 0;
      }

      const exitloadforCalculation = 1 - exitload / 100;
      console.log('Exit Load For Calculation', exitloadforCalculation);

      const indexedCost = txn.purchased_at * (ciiValue / 100); // Adjust based on real formula

      // Grandfathering logic
      const grandfatherDate = new Date('2018-01-31');
      const isGrandfathered = new Date(txn.purchased_on) <= grandfatherDate;
      const grandFatheringNav = 0;
      let taxableCapitalGains = 0;

      if (isGrandfathered) {
        // Fetch NAV as of January 31, 2018
        const grandFatheringNav = await this.fetchNAVFromThirdParty(
          txn.transactionReport.isin,
          '2018-01-31',
        );

        // const nav2018 = txn.purchased_at

        const acquisitionCost = txn.purchased_at * txn.units;
        const fairMarketValue = grandFatheringNav * txn.units;
        const actualSellValue = txn.transactionReport.traded_at * txn.units;

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
          fund.data.find((f) => f.isinCode === txn.transactionReport.isin)
            ?.schemeName || txn.transactionReport.rta_scheme_name,
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
      });
    }

    // Return paginated result with metadata
    return {
      status: HttpStatus.OK,
      data: result,
    };
  }

  async get_scheme_wise_returns(
    investmentAccountId?: string,
    tradedOnTo?: Date,
  ) {
    const currentInvestedAmount =
      await this.getCurrentInvestedAmountbasedOnScheme(investmentAccountId);
    console.log('Current Invested Amount', currentInvestedAmount);

    if (investmentAccountId == 'null') {
      investmentAccountId = null;
    }
    const tradedOnDate = tradedOnTo
      ? new Date(tradedOnTo).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    // Create the query for schemes
    const query = this.transactionReportsRepository
      .createQueryBuilder('transaction_reports')
      .select('transaction_reports.isin', 'isin')
      .addSelect('MAX(transaction_reports.rta_scheme_name)', 'scheme_name')
      .addSelect('MAX(transaction_reports.folio_number)', 'folio_number')
      .addSelect('MAX(transaction_reports.type)', 'plan_type')
      .addSelect(
        'MAX(transaction_reports.rta_investment_option)',
        'investment_option',
      );

    console.log('type ', typeof investmentAccountId);
    console.log('Inves', investmentAccountId);
    if (investmentAccountId !== null && investmentAccountId !== undefined) {
      console.log('INN users');
      query.where('transaction_reports.user_id = :investmentAccountId', {
        investmentAccountId,
      });
    }
    query.groupBy('transaction_reports.isin');

    // Execute the query to get the schemes
    const schemes = await query.getRawMany();
    console.log('Schemes', schemes);
    if (schemes.length == 0) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Transactions Not Found',
      };
    }

    // Get the total count of schemes to calculate total pages
    // const totalCount = await query.getCount();

    const isin = schemes
      .filter((scheme) => scheme.isin && scheme.isin.length > 0) // Ensure scheme.isin exists and is not empty
      .map((scheme) => scheme.isin);
    console.log('ISINs', isin);

    // Check if the ISIN array is empty or contains empty elements
    if (!isin.length || isin.some((item) => !item || item.trim() === '')) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Error: ISIN is empty or contains invalid values.',
      };
    } else {
      console.log('All ISINs are valid:', isin);
    }

    console.log('Total Count of Schemes:', isin.length);

    const fund: any = await this.mutualfundsService.getFundDetailsByIsins(isin);
    console.log('Funds', fund);

    const mappedSchemes = await Promise.all(
      schemes
        .filter((scheme) => scheme.isin && scheme.isin.length > 0)
        .map(async (scheme) => {
          const funds = fund.data.find((item) => item.isinCode === scheme.isin);
          console.log('Funds details', funds);

          const currentValue = scheme.units * funds?.nav;

          const cashFlows = await this.transactionReportsRepository
            .createQueryBuilder('transaction_reports')
            .select('transaction_reports.amount', 'amount')
            .addSelect('transaction_reports.traded_on', 'date')
            .where('transaction_reports.isin = :isin', { isin: scheme.isin })
            .andWhere('transaction_reports.user_id = :investmentAccountId', {
              investmentAccountId,
            })
            .getRawMany();

          // Add the current value as the final cash flow
          cashFlows.push({
            amount: currentValue,
            date: tradedOnDate,
          });
          console.log('Cashflows', cashFlows);

          // Format cash flows for XIRR calculation
          const xirrCashFlows = cashFlows.map((flow) => ({
            amount: parseFloat(flow.amount),
            when: new Date(flow.date),
          }));
          console.log('XIRR Cashflows', xirrCashFlows);

          // Calculate XIRR (commented out, needs implementation)
          // const xirrValue = xirr(xirrCashFlows);

          const current_invested = currentInvestedAmount.data.find(
            (item) => item.isin === scheme.isin,
          )?.invested_amount;
          console.log('Current Invested', current_invested);
          const current_units = currentInvestedAmount.data.find(
            (item) => item.isin === scheme.isin,
          )?.units;
          console.log('Current Units', current_units);

          return {
            isin: scheme.isin,
            scheme_name: funds?.schemeName,
            plan_type: funds?.isDirectPlan ? 'DIRECT' : 'REGULAR',
            investment_option: funds?.planName,
            as_on: tradedOnDate,
            nav: funds?.nav,
            invested_amount: current_invested.toFixed(4),
            // invested_amount: (parseFloat(scheme.invested_amount)).toFixed(4),
            current_value: (current_units * funds?.nav).toFixed(4),
            unrealized_gain: (
              current_units * funds?.nav -
              current_invested
            ).toFixed(4),
            absolute_return:
              current_invested === 0
                ? 0
                : (
                    ((current_units * funds?.nav - current_invested) /
                      current_invested) *
                    100
                  ).toFixed(4),
            average_buying_value:
              current_invested === 0
                ? 0
                : (current_invested / current_units).toFixed(4),
            units: current_units.toFixed(4),
            // xirr: xirrValue
          };
        }),
    );

    // Return paginated result with metadata
    return {
      status: HttpStatus.OK,
      data: mappedSchemes,
    };
  }

  // async get_investment_account_wise_returns(returnsFilterDto: ReturnsFilterDto) {
  //     try {
  //         let result = await this.fintechService.get_investment_account_wise_returns_report(returnsFilterDto);
  //         return result;
  //     } catch (err) {
  //         return { "status": HttpStatus.BAD_REQUEST, error: err.message };
  //     }
  // }

  async investment_account_wise_returns(
    accountId: string,
    traded_on_to?: Date,
  ) {
    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    try {
      console.log('Original accountId:', accountId);

      const currentInvestedAmount =
        await this.getCurrentInvestedAmountbasedOnScheme(accountId);
      console.log('Current Invested Amount', currentInvestedAmount);

      if (!accountId || accountId === 'null') {
        accountId = null;
      }
      console.log('Processed accountId:', accountId);

      // const from_date = from ? new Date(from).toISOString().split('T')[0] : null;
      const tradedOnDate = traded_on_to
        ? new Date(traded_on_to).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      // Count unique user_id with at least one redemption before pagination
      const countQuery = this.transactionReportsRepository
        .createQueryBuilder('transaction_reports')
        .select(
          'COUNT(DISTINCT transaction_reports.user_id)',
          'totalInvestmentAccounts',
        );
      // .where("LOWER(transaction_reports.type) LIKE :redemption", { redemption: '%redemption%' });

      if (accountId) {
        countQuery.andWhere('transaction_reports.user_id = :accountId', {
          accountId,
        });
      }
      // if (from) {
      //     countQuery.andWhere('transaction_reports.traded_on >= :from_date', { from_date });
      // }
      if (traded_on_to) {
        countQuery.andWhere('transaction_reports.traded_on <= :tradedOnDate', {
          tradedOnDate,
        });
      }

      const { totalInvestmentAccounts } = await countQuery.getRawOne();
      console.log(
        'Total Investment Accounts (With Redemption):',
        totalInvestmentAccounts,
      );

      // Main query to fetch paginated results
      const queryBuilder = this.transactionReportsRepository
        .createQueryBuilder('transaction_reports')
        .select('transaction_reports.isin', 'isin')
        .addSelect('transaction_reports.user_id', 'investment_account_id')
        .addSelect('MAX(transaction_reports.rta_scheme_name)', 'scheme_name')
        .groupBy('transaction_reports.isin, transaction_reports.user_id');

      if (accountId) {
        queryBuilder.where('transaction_reports.user_id = :accountId', {
          accountId,
        });
      }
      // if (from) {
      //     queryBuilder.andWhere('transaction_reports.traded_on >= :from_date', { from_date });
      // }
      if (traded_on_to) {
        queryBuilder.andWhere(
          'transaction_reports.traded_on <= :tradedOnDate',
          { tradedOnDate },
        );
      }

      // // Apply pagination at the query level
      // if (page !== undefined && limit !== undefined) {
      //   const skip = (page - 1) * limit;
      //   queryBuilder.skip(skip).take(limit);
      // }

      console.log('Fetching paginated transaction reports...');
      const schemes: Scheme[] = await queryBuilder.getRawMany();
      console.log('Transaction Reports (Paginated):', schemes.length);

      const isin = Array.from(
        new Set(
          schemes
            .map((scheme) => scheme.isin)
            .filter(
              (isin) => isin !== null && isin !== undefined && isin !== '',
            ),
        ),
      );
      console.log('ISIN:', isin);

      const fund: any = await this.mutualfundsService.getFundDetailsByIsins(
        isin,
      );
      await sleep(200);

      const aggregatedSchemes: Record<string, AggregatedScheme> = {};

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
        const current_units = currentInvestedAmount.data.find(
          (item) => item.isin === scheme.isin,
        )?.units;
        const currentValue = current_units * (funds?.nav || 0);

        aggregatedSchemes[scheme.investment_account_id].invested_amount +=
          parseFloat(current_invested as any) || 0;
        aggregatedSchemes[scheme.investment_account_id].current_value +=
          currentValue || 0;
        aggregatedSchemes[scheme.investment_account_id].units +=
          parseFloat(current_units as any) || 0;
        aggregatedSchemes[scheme.investment_account_id].unrealized_gain +=
          (currentValue || 0) - (parseFloat(current_invested as any) || 0);

        const id = scheme.investment_account_id;
        if (id != null || id != undefined) {
          const user = await this.usersRepo.findOne({
            where: { id: parseInt(id) },
          });
          if (user) {
            aggregatedSchemes[scheme.investment_account_id].user = {
              id: user.id.toString(),
              name: user.full_name,
              email: user.email,
              mobile: user.mobile,
              role: user.role,
            };
          }
        }
      }

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
        user_details: scheme.user,
      }));

      console.log('Mapped schemes', mappedSchemes);

      // Apply pagination AFTER all calculations
      // let paginatedSchemes = mappedSchemes;
      // if (page != null && limit != null) {
      //     const startIndex = (page - 1) * limit;
      //     const endIndex = startIndex + limit;
      //     paginatedSchemes = mappedSchemes.slice(startIndex, endIndex);
      // }

      // console.log("Paginated data", paginatedSchemes)

      // let excelfilepath = null;
      // if (paginatedSchemes.length > 0) {
      //     excelfilepath = await this.generateExcelforInvestmentAccount(mappedSchemes);
      // }

      return {
        status: HttpStatus.OK,
        data: mappedSchemes,
        // excelDownloadLink: excelfilepath,
        // meta: {
        //     total: parseInt(totalInvestmentAccounts || '0'),
        //     totalPages: limit ? Math.ceil(totalInvestmentAccounts / limit) : 1,
        //     currentPage: page || 1
        // }
      };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err };
    }
  }

  async getCurrentInvestedAmount(
    investmentAccountId?: string,
    folios?: string[],
    asOn?: string,
  ) {
    const EPSILON = 1e-10; // Small value to handle floating-point precision issues
    const whereClause: any = {};

    if (investmentAccountId) {
      whereClause.user_id = investmentAccountId;
      console.log('Folios', folios);
      // console.log("Folios", folios.length)

      if (!folios || folios.length == 0) {
        const result = await this.transactionReportsRepository.find({
          where: { user_id: parseInt(investmentAccountId) },
          select: ['folio_number'],
        });

        console.log('Results', result);

        folios = [...new Set(result.map((record) => record.folio_number))];
        console.log('Folio Numbers', folios);
      }
    }

    if (folios && folios.length > 0) {
      whereClause.folio_number = In(folios);
    }

    if (asOn) {
      whereClause.traded_on = LessThanOrEqual(asOn);
    }

    console.log('Where Clause', whereClause);

    const transactions = await this.transactionReportsRepository.find({
      where: whereClause,
      order: {
        traded_on: 'ASC',
        traded_at: 'ASC',
      },
    });
    console.log('Transactions', transactions);

    const transactionsByFolio = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.folio_number]) {
        acc[transaction.folio_number] = [];
      }
      acc[transaction.folio_number].push(transaction);
      return acc;
    }, {} as Record<string, TransactionReports[]>);

    console.log('Transactions by Folio', transactionsByFolio);

    const folioInvestments: {
      folio_number: string;
      scheme_investments: { isin: string; invested_amount: number }[];
    }[] = [];

    console.log('Starting investment calculation...');

    for (const [folioNumber, folioTransactions] of Object.entries(
      transactionsByFolio,
    )) {
      console.log(
        `Processing Folio: ${folioNumber}, Transactions:`,
        folioTransactions,
      );

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

      const schemeInvestments: { isin: string; invested_amount: number }[] = [];

      for (const [isin, isinTransactions] of Object.entries(
        transactionsByISIN,
      )) {
        console.log(
          `Processing ISIN: ${isin}, Transactions:`,
          isinTransactions,
        );

        let investedAmount = 0;
        let currentUnits = 0;

        for (const transaction of isinTransactions) {
          const type = transaction.type;
          const transactionUnits = Number(transaction.units) || 0;
          const transactionAmount = Number(transaction.amount) || 0;

          console.log(
            `Transaction Type: ${type}, Units: ${transactionUnits}, Amount: ${transactionAmount}`,
          );

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

            console.log('Current Units in if', currentUnits);
            console.log('Invested Amount in If', investedAmount);
          } else if (
            ['redemption', 'switch out', 'transfer out', 'lateral shift out']
              .map((t) => t.toLowerCase())
              .some((t) => type.toLowerCase().includes(t))
          ) {
            console.log(`Processing Redemption - ISIN: ${isin}`);

            const source = await this.sourceRepository.findOne({
              where: { transaction_report_id: transaction.id },
              relations: ['source_transaction'],
            });
            console.log(`Source:`, source);

            if (source) {
              const sourceUnits = Number(source.source_transaction.units) || 0;
              const redemptionRatio =
                sourceUnits !== 0 ? transactionUnits / sourceUnits : 0;

              console.log(
                `Redemption Ratio: ${redemptionRatio}, Source Units: ${sourceUnits}`,
              );

              const purchaseTransaction = isinTransactions.find(
                (t) => t.id === source.source_transaction_id,
              );
              console.log(
                `Matching Purchase Transaction:`,
                purchaseTransaction,
              );

              if (purchaseTransaction) {
                const purchaseAmount = Number(purchaseTransaction.amount) || 0;
                investedAmount -= purchaseAmount * redemptionRatio;
                console.log(`Purchase Amount: ${purchaseAmount}`);
                console.log(`Invested Amount in Else: ${investedAmount}`);
              } else {
                console.warn(
                  `No matching purchase transaction found for redemption!`,
                );
              }
            }

            currentUnits -= transactionUnits;

            console.log('Current Units After all', currentUnits);
            if (currentUnits < EPSILON) {
              currentUnits = 0;
              investedAmount = 0;
            }
          }
        }

        currentUnits = Math.max(0, currentUnits);
        investedAmount = Math.max(0, investedAmount);

        console.log(
          `Computed Values - ISIN: ${isin}, Invested Amount: ${investedAmount}, Current Units: ${currentUnits}`,
        );

        // Avoid floating-point precision errors
        if (Math.abs(currentUnits) < EPSILON) {
          currentUnits = 0;
        }
        if (Math.abs(investedAmount) < EPSILON) {
          investedAmount = 0;
        }

        console.log(
          `Final Computed Values - ISIN: ${isin}, Invested Amount: ${investedAmount}, Current Units: ${currentUnits}`,
        );

        schemeInvestments.push({
          isin,
          invested_amount: Number(investedAmount.toFixed(4)),
        });
      }

      folioInvestments.push({
        folio_number: folioNumber,
        scheme_investments: schemeInvestments,
      });
    }

    console.log('Final Investment Data:', folioInvestments);
    return { status: HttpStatus.OK, data: folioInvestments };
  }

  async getTransactions(
    investmentAccountId?: string,
    folios?: string[],
    asOn?: string,
  ) {
    console.log('Investment Account id', investmentAccountId);
    console.log('Folios', folios);
    console.log('As on', asOn);

    let queryBuilder = this.transactionReportsRepository.createQueryBuilder(
      'transaction_reports',
    );

    if (investmentAccountId) {
      queryBuilder = queryBuilder.andWhere(
        'transaction_reports.user_id = :investmentAccountId',
        {
          investmentAccountId,
        },
      );
    }

    if (folios && folios.length > 0) {
      queryBuilder = queryBuilder.andWhere(
        'transaction_reports.folio_number IN (:...folios)',
        { folios },
      );
    }

    if (asOn) {
      const asOnDate = new Date(asOn);
      asOnDate.setHours(23, 59, 59, 999);
      queryBuilder = queryBuilder.andWhere(
        'transaction_reports.traded_on <= :asOnDate',
        { asOnDate },
      );
    }

    queryBuilder = queryBuilder.orderBy('transaction_reports.traded_on', 'ASC');

    const transactions = await queryBuilder.getMany();
    console.log('Transactions', transactions);

    // Extract unique ISINs
    const Isins = Array.from(
      new Set(transactions.map((scheme) => scheme.isin)),
    );
    console.log('Unique ISINs', Isins);

    // Fetch fund details based on the unique ISINs
    const funds = await this.mutualfundsService.getFundDetailsByIsins(Isins);
    console.log('Funds returned', funds);

    // Ensure 'data' exists in the response
    if ('data' in funds && Array.isArray(funds.data)) {
      // Map through the funds and attach them to the transactions
      const transactionsWithFunds = transactions.map((transaction) => {
        // Find the matching fund for the transaction
        const matchingFund = funds['data'].find(
          (fund) => fund.isinCode === transaction.isin,
        );

        // Return the transaction with the attached fund (or null if not found)
        return {
          ...transaction,
          fund: matchingFund || null,
        };
      });

      // console.log("Funds and Transactions", transactionsWithFunds);
      return {
        status: HttpStatus.OK,
        data: transactionsWithFunds,
      };
    } else {
      console.log(
        'Unexpected response structure: funds does not contain data.',
      );
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Failed to retrieve fund data',
      };
    }
  }

  async calculateHoldings(transactions: any[]) {
    let unit = 0;
    let lockedUnits = 0;

    console.log('Calculating Holdings for Transactions:', transactions);

    transactions.forEach((transaction) => {
      const today = new Date();
      const tradedOnDate = new Date(transaction.traded_on);

      const daysSinceTraded =
        (today.getTime() - tradedOnDate.getTime()) / (1000 * 60 * 60 * 24);

      const { type, units, amount } = transaction;
      const lockin = transaction?.fund?.lockInPeriodDays;
      console.log('Processing Transaction:', { type, units, lockin, amount });

      if (
        [
          'purchase',
          'switch in',
          'ticob',
          'transfer in',
          'bonus',
          'switch over in',
          'systematic investment',
          'dividend reinvestment',
          'lateral shift in',
        ]
          .map((t) => t.toLowerCase())
          .some((t) => type.toLowerCase().includes(t))
      ) {
        unit += units;
        console.log(
          `Added Units. Type: ${type}, Units: ${units}, Total Units: ${unit} , Amount:${amount}`,
        );

        if (lockin) {
          if (lockin < daysSinceTraded) {
            lockedUnits += units;
            console.log(
              `Locked Units Incremented. Locked Units: ${lockedUnits}`,
            );
          }
        }
      } else if (
        ['redemption', 'switch out', 'transfer out', 'lateral shift out']
          .map((t) => t.toLowerCase())
          .some((t) => type.toLowerCase().includes(t))
      ) {
        unit -= units;
        console.log(
          `Subtracted Units. Type: ${type}, Units: ${units}, Total Units: ${unit}`,
        );
      }
    });

    const redeemableUnits = unit - lockedUnits;
    console.log('Final Calculated Values:', {
      unit,
      lockedUnits,
      redeemableUnits,
    });

    return {
      unit: parseFloat(unit.toString()),
      redeemable_units: parseFloat(redeemableUnits.toString()),
    };
  }

  async getCurrentInvestedAmountbasedOnScheme(
    investmentAccountId?: string,
    scheme?: string[],
    asOn?: string,
  ) {
    const EPSILON = 1e-10; // Small value to handle floating-point precision issues
    const whereClause: any = {};

    if (investmentAccountId) {
      whereClause.user_id = investmentAccountId;

      if (!scheme) {
        const result = await this.transactionReportsRepository.find({
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

    const transactions = await this.transactionReportsRepository.find({
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
            const source = await this.sourceRepository.findOne({
              where: {
                transaction_report_id: transaction.id,
              },
              relations: ['source_transaction'],
            });

            if (source) {
              const sourceUnits = Number(source.source_transaction.units) || 0;
              const redemptionRatio =
                sourceUnits !== 0 ? transactionUnits / sourceUnits : 0;

              const purchaseTransaction = isinTransactions.find(
                (t) => t.id === source.source_transaction_id,
              );

              if (purchaseTransaction) {
                const purchaseAmount = Number(purchaseTransaction.amount) || 0;
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

  async get_transactions_report(
    folioNumbers?: string[],
    transactionTypes?: string[],
    from?: string,
    to?: string,
  ) {
    try {
      const query = this.transactionReportsRepository.createQueryBuilder(
        'transaction_reports',
      );
      console.log('Starting query for folio numbers:', folioNumbers);

      if (folioNumbers) {
        query.where('transaction_reports.folio_number IN (:...folios)', {
          folios: folioNumbers,
        });
      }

      if (transactionTypes && transactionTypes.length) {
        console.log('Filtering by transaction types:', transactionTypes);
        query.andWhere('transaction_reports.type IN (:...types)', {
          types: transactionTypes,
        });
      }

      if (from) {
        console.log('Filtering by date from:', from);
        query.andWhere('transaction_reports.traded_on >= :from', { from });
      }

      if (to) {
        console.log('Filtering by date to:', to);
        query.andWhere('transaction_reports.traded_on <= :to', { to });
      }

      query.orderBy('transaction_reports.traded_on', 'DESC');
      console.log('Query constructed:', query.getQueryAndParameters());

      // 1. Get all data for Excel export
      const allData = await query.getMany();
      console.log(
        'Fetched all data for Excel export:',
        allData.length,
        'records found.',
      );

      if (allData.length === 0) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'No transactions found',
        };
      }

      // Get paginated results
      const result = await query.getMany();
      const totalCount = allData.length; // Total count remains from all the data
      console.log('Paginated results:', result.length, 'records found.');

      // Return the API response with paginated data and Excel file link
      // const excelLink = `${process.env.BASE_URL}/uploads/downloads/${uniqueFileName}`;
      // console.log('Returning response with Excel file link:', excelLink);

      return {
        status: HttpStatus.OK,
        data: result,
      };
    } catch (err) {
      console.error('Error occurred:', err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
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
}
