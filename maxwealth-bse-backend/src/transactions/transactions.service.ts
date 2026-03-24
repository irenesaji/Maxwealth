import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import xirr from 'xirr';
import { CamsTransactionDetails } from 'src/cams_investor_master_folios/entities/cams_transaction.entity';
import { In, LessThanOrEqual, Like, Repository } from 'typeorm';
import { TransactionReports } from 'src/investor-details/entities/transaction-details.entity';
import { Source } from 'src/investor-details/entities/sources.entity';
import { CreateSourceDto } from 'src/investor-details/dto/sources.dto';
import { MutualfundsService } from 'src/utils/mutualfunds/mutualfunds.service';
import { AggregatedScheme, Scheme } from './types/transaction.types';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Import UUID to generate a unique ID
import axios from 'axios';
import * as cheerio from 'cheerio';
import { error } from 'console';
import { CostInflationIndex } from './entities/cii.entity';
import { ConfigService } from '@nestjs/config';
import e from 'express';
import { FundDetail } from 'src/fund_details/entities/fund_detail.entity';
import { Users } from 'src/users/entities/users.entity';
import { Not } from 'typeorm';

@Injectable()
export class TransactionsService {
  mf_base_url: string;
  filepath = process.env.FILE_PATH;
  configService: any;
  constructor(
    @InjectRepository(CamsTransactionDetails)
    private camsTransactionRepo: Repository<CamsTransactionDetails>,
    @InjectRepository(TransactionReports)
    private transactionReportsRepository: Repository<TransactionReports>,
    @InjectRepository(Source)
    private sourceRepository: Repository<Source>,
    @InjectRepository(CostInflationIndex)
    private readonly ciiRepository: Repository<CostInflationIndex>,
    @InjectRepository(FundDetail)
    private readonly fundDetailRepository: Repository<FundDetail>,
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    private readonly mutualfundsService: MutualfundsService,
  ) {
    this.configService = new ConfigService();
    this.mf_base_url = this.configService.get('MF_BASE_URL');
  }

  file_path = process.env.FILE_PATH;

  async findTransaction(
    page?: number,
    limit?: number,
    folioNumbers?: string[],
    transactionTypes?: string[],
    from?: string,
    to?: string,
  ) {
    try {
      let query = this.transactionReportsRepository
        .createQueryBuilder('transaction_reports')
        .leftJoinAndSelect('transaction_reports.users', 'user');
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

      // 2. Generate a unique file name using UUID and current timestamp
      const uniqueFileName = `transactions_${uuidv4()}_${Date.now()}.xlsx`;
      console.log('Generated unique file name:', uniqueFileName);

      // Ensure the 'files' directory exists
      const folder_path = path.join(`${this.file_path}`, 'uploads');
      const directoryPath = path.join(folder_path, 'downloads');
      console.log('Checking if the directory exists at:', directoryPath);

      if (!fs.existsSync(directoryPath)) {
        console.log('Directory does not exist. Creating it...');
        fs.mkdirSync(directoryPath, { recursive: true }); // Create the directory if it doesn't exist
      } else {
        console.log('Directory already exists.');
      }

      // 3. Generate Excel File with all data
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(allData); // Convert all data to sheet

      // Convert headers (first row) to uppercase
      const range = XLSX.utils.decode_range(ws['!ref']); // Get the range of the worksheet
      if (range && range.s && range.e) {
        const headerRow = range.s.r; // First row index
        for (let c = range.s.c; c <= range.e.c; c++) {
          // Iterate through all columns in the first row
          const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c });
          const cell = ws[cellAddress];
          if (cell && typeof cell.v === 'string') {
            cell.v = cell.v.toUpperCase(); // Convert cell value to uppercase
          }
        }
      }

      // Reassign the modified worksheet back
      XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

      // Define file path with unique file name
      const filePath = path.join(directoryPath, uniqueFileName); // Save in the 'files' directory
      console.log('Saving Excel file to:', filePath);
      XLSX.writeFile(wb, filePath);

      // 4. Apply Pagination for the API Response
      if (page != null && limit != null) {
        const skip = (page - 1) * limit;
        console.log('Applying pagination: skip:', skip, 'limit:', limit);
        query = query.skip(skip).take(limit);
      }

      // Get paginated results
      const result = await query.getMany();
      const totalCount = allData.length; // Total count remains from all the data
      console.log('Paginated results:', result.length, 'records found.');

      // Return the API response with paginated data and Excel file link
      const excelLink = `${process.env.BASE_URL}/uploads/downloads/${uniqueFileName}`;
      console.log('Returning response with Excel file link:', excelLink);

      return {
        status: HttpStatus.OK,
        result,
        totalCount,
        excelLink, // URL to download the unique Excel file
      };
    } catch (err) {
      console.error('Error occurred:', err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async findTransactionByYear(year: number, page = 1, limit = 10) {
    try {
      // Construct the query

      let query = this.transactionReportsRepository
        .createQueryBuilder('transaction_reports')
        .select([
          'DATE_FORMAT(transaction_reports.traded_on, "%M") AS month',
          'COUNT(*) AS transaction_count',
          'SUM(transaction_reports.amount) AS total_amount',
        ]);

      // Apply year filter only if a valid year is provided
      if (year) {
        query = query.where('YEAR(transaction_reports.traded_on) = :year', {
          year,
        });
      }

      query = query.andWhere(
        'LOWER(transaction_reports.type) NOT IN (:...excludedTypes)',
        {
          excludedTypes: ['redemption', 'switch out', 'lateral shift out'].map(
            (type) => type.toLowerCase(),
          ),
        },
      );

      query = query
        .groupBy('DATE_FORMAT(transaction_reports.traded_on, "%M")')
        .orderBy('MIN(transaction_reports.traded_on)', 'ASC');

      console.log('Year:', year);
      console.log('Page:', page);
      console.log('Limit:', limit);

      // Fetch all data for Excel generation
      const allData = await query.getRawMany();
      console.log(
        'Fetched all data for Excel export:',
        allData.length,
        'records found.',
      );

      if (allData.length === 0) {
        return { status: HttpStatus.OK, result: [] };
      }

      // Generate a unique file name for the Excel file
      const uniqueFileName = `transactions_year_${year}_${uuidv4()}_${Date.now()}.xlsx`;
      console.log('Generated unique file name:', uniqueFileName);

      // Ensure the 'files' directory exists in the root folder
      const folder_path = path.join(`${this.file_path}`, 'uploads');
      const directoryPath = path.join(folder_path, 'downloads');
      console.log('Checking if the directory exists at:', directoryPath);

      if (!fs.existsSync(directoryPath)) {
        console.log('Directory does not exist. Creating it...');
        fs.mkdirSync(directoryPath, { recursive: true });
      } else {
        console.log('Directory already exists.');
      }

      // Generate the Excel file
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(allData);

      // Convert headers to uppercase
      const range = XLSX.utils.decode_range(ws['!ref']);
      if (range && range.s && range.e) {
        const headerRow = range.s.r;
        for (let c = range.s.c; c <= range.e.c; c++) {
          const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c });
          const cell = ws[cellAddress];
          if (cell && typeof cell.v === 'string') {
            cell.v = cell.v.toUpperCase();
          }
        }
      }

      XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

      // Save the Excel file in the root 'files' folder
      const filePath = path.join(directoryPath, uniqueFileName);
      console.log('Saving Excel file to:', filePath);
      XLSX.writeFile(wb, filePath);

      // Apply pagination for API response
      if (page != null && limit != null) {
        const skip = (page - 1) * limit;
        console.log('Applying pagination: skip:', skip, 'limit:', limit);
        query = query.skip(skip).take(limit);
      }

      // Get paginated results
      const result = await query.getRawMany();
      const totalCount = allData.length;
      console.log('Paginated results:', result.length, 'records found.');

      // Return API response with paginated data and Excel link
      const excelLink = `${process.env.BASE_URL}/uploads/downloads/${uniqueFileName}`;
      console.log('Returning response with Excel file link:', excelLink);

      return {
        status: HttpStatus.OK,
        result,
        totalCount,
        excelLink, // URL to download the Excel file
      };
    } catch (err) {
      console.error('Error occurred:', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async findYearlyTransactionsSummaryByType() {
    try {
      console.log('Fetching distinct years...');
      const yearsResult = await this.transactionReportsRepository
        .createQueryBuilder('transaction_reports')
        .select('DISTINCT YEAR(transaction_reports.traded_on)', 'year')
        .getRawMany();

      const years = yearsResult.map((y) => y.year).filter((y) => y !== null);
      console.log('Filtered years:', years);

      if (years.length === 0) {
        console.log('No transactions found.');
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'No transactions found.',
        };
      }

      const finalData = [];

      for (const year of years) {
        console.log(`Processing year: ${year}`);

        const result = await this.transactionReportsRepository
          .createQueryBuilder('transaction_reports')
          .select([
            'transaction_reports.type AS type',
            'COUNT(*) AS transaction_count',
            'SUM(transaction_reports.amount) AS total_amount',
          ])
          .where('YEAR(transaction_reports.traded_on) = :year', { year })
          .andWhere(
            'LOWER(transaction_reports.type) NOT IN (:...excludedTypes)',
            {
              excludedTypes: [
                'redemption',
                'switch out',
                'lateral shift out',
              ].map((type) => type.toLowerCase()),
            },
          )
          .groupBy('transaction_reports.type')
          .getRawMany();

        console.log(`Transaction summary for year ${year}:`, result);

        if (result.length === 0) continue;

        // Merge data into finalData array
        result.forEach((item) => {
          finalData.push({
            year,
            category: item.type,
            transaction_count: item.transaction_count,
            totalInvestment: item.total_amount,
          });
        });
      }

      if (finalData.length === 0) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'No transactions available for export.',
        };
      }

      // Prepare folder
      const folderPath = path.join(this.file_path, 'uploads', 'downloads');
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Prepare Excel file
      const uniqueFileName = `transactions_summary_all_years_${uuidv4()}_${Date.now()}.xlsx`;
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(finalData);
      XLSX.utils.book_append_sheet(wb, ws, 'All Transactions Summary');
      const filePath = path.join(folderPath, uniqueFileName);
      XLSX.writeFile(wb, filePath);

      const excelLink = `${process.env.BASE_URL}/uploads/downloads/${uniqueFileName}`;

      console.log('Final data for Excel:', finalData);
      console.log('Excel file created:', excelLink);

      return {
        status: HttpStatus.OK,
        data: finalData,
        excelLink, // now a single link
      };
    } catch (err) {
      console.error('Error occurred:', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async updateSource(folioNumber) {
    try {
      const transactions = await this.transactionReportsRepository.find({
        where: { folio_number: folioNumber, is_processed: false },
      });
      console.log('All transactions with folio_number:', transactions);

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

      let purchaseUnitsLeft = purchaseTransactions.map((p) => ({
        ...p,
        unitsLeft: p.units_left !== null ? p.units_left : p.units,
      }));

      const results = await Promise.all(
        redemptionTransactions.map(async (redemption) => {
          const redeemedUnits = redemption.units;
          const redemptionAmount = redemption.amount;
          let realizedGains = 0;
          let remainingUnits = redeemedUnits;
          const redemptionSources = [];
          const redemptionDate = redemption.traded_on;

          console.log(`\nProcessing Redemption ID: ${redemption.id}`);
          console.log(
            `Redeemed Units: ${redeemedUnits}, Redemption Amount: ${redemptionAmount}`,
          );

          for (const purchase of purchaseUnitsLeft) {
            if (remainingUnits <= 0) break;

            const unitsFromPurchase = Math.min(
              purchase.unitsLeft,
              remainingUnits,
            );
            const gain =
              (redemption.traded_at - purchase.traded_at) * unitsFromPurchase;
            realizedGains += gain;

            redemptionSources.push({
              sourceTransactionId: purchase.id,
              units: unitsFromPurchase,
              gain: gain,
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

            console.log(
              `Units Left in Purchase ID ${purchase.id}: ${purchase.unitsLeft}`,
            );
            console.log(`Remaining Units to Redeem: ${remainingUnits}`);
            console.log('Purchase units left value....1', purchase.unitsLeft);

            await this.transactionReportsRepository.update(purchase.id, {
              units_left: purchase.unitsLeft,
            });

            console.log('Purchase units left value....2');
            console.log('Purchase units left value....', purchase.unitsLeft);

            if (purchase.unitsLeft == 0) {
              console.log('Came IN');
              await this.transactionReportsRepository.update(purchase.id, {
                is_processed: true,
              });
            }
            await this.transactionReportsRepository.update(redemption.id, {
              is_processed: true,
            });
          }

          purchaseUnitsLeft = purchaseUnitsLeft.filter(
            (purchase) => purchase.unitsLeft > 0,
          );

          const cost = redemptionAmount - realizedGains;
          const averageCost = cost / redeemedUnits;

          console.log(
            `Total Realized Gains for Redemption ID ${redemption.id}: ${realizedGains}`,
          );
          console.log(`Cost for Redemption ID ${redemption.id}: ${cost}`);
          console.log(
            `Average Cost for Redemption ID ${
              redemption.id
            }: ${averageCost.toFixed(4)}`,
          );

          return {
            redemptionTransactionId: redemption.id,
            realizedGains: realizedGains,
            cost: cost,
            averageCost: averageCost.toFixed(4),
            redemptionDate: redemptionDate,
            sources: redemptionSources,
          };
        }),
      );

      const sourcedtos = results.flatMap((result) =>
        result.sources.map((source) => ({
          transaction_report_id: result.redemptionTransactionId,
          gain: source.gain,
          units: source.units,
          days_held:
            Math.floor(
              (new Date(result.redemptionDate).getTime() -
                new Date(source.purchasedOn).getTime()) /
                (1000 * 60 * 60 * 24),
            ) + 1,
          purchased_at: source.purchasedAt,
          purchased_on: source.purchasedOn
            ? new Date(source.purchasedOn)
            : null,
          source_transaction_id: source.sourceTransactionId,
        })),
      );

      for (const dto of sourcedtos) {
        console.log('DTO', dto);
        await this.sourceRepository.save(dto);
      }

      return { status: HttpStatus.OK, result: results };
    } catch (err) {
      console.log('Error:', err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  // async updateSourceDirect() {
  //   try {
  //     let transactions = await this.transactionReportsRepository.find({
  //       where: { is_processed: false },
  //       order: {
  //         traded_on: 'ASC' // or 'DESC' for descending order
  //       }
  //     });

  //     let purchaseTransactions = transactions.filter(t =>
  //       !t.type.toLowerCase().includes('redemption') &&
  //       !t.type.toLowerCase().includes('switch out') &&
  //       !t.type.toLowerCase().includes('lateral shift out')
  //     );

  //     let redemptionTransactions = transactions.filter(t =>
  //       t.type.toLowerCase().includes('redemption') ||
  //       t.type.toLowerCase().includes('switch out') ||
  //       t.type.toLowerCase().includes('lateral shift out')
  //     );

  //     console.log("Purchase transactions:", purchaseTransactions);
  //     console.log("Redemption transactions:", redemptionTransactions);

  //     let purchaseUnitsLeft = purchaseTransactions.map(p => ({
  //       ...p,
  //       unitsLeft: p.units_left !== null ? p.units_left : p.units
  //     }));

  //     let results = await Promise.all(redemptionTransactions.map(async redemption => {
  //       let redeemedUnits = redemption.units;
  //       let redemptionAmount = redemption.amount;
  //       let realizedGains = 0;
  //       let remainingUnits = redeemedUnits;
  //       let redemptionSources = [];
  //       let redemptionDate = redemption.traded_on;

  //       console.log(`\nProcessing Redemption ID: ${redemption.id}`);
  //       console.log(`Redeemed Units: ${redeemedUnits}, Redemption Amount: ${redemptionAmount}`);

  //       for (let purchase of purchaseUnitsLeft) {
  //         if (remainingUnits <= 0) break;

  //         if (purchase.folio_number !== redemption.folio_number) continue;

  //         if (purchase.traded_on > redemption.traded_on) continue;

  //         let unitsFromPurchase = Math.min(purchase.unitsLeft, remainingUnits);
  //         let gain = (redemption.traded_at - purchase.traded_at) * unitsFromPurchase;
  //         realizedGains += gain;

  //         redemptionSources.push({
  //           sourceTransactionId: purchase.id,
  //           units: unitsFromPurchase,
  //           gain: gain,
  //           purchasedAt: purchase.traded_at,
  //           purchasedOn: purchase.traded_on
  //         });

  //         console.log(`Matching Purchase ID: ${purchase.id}`);
  //         console.log(`Units from Purchase: ${unitsFromPurchase}, Gain: ${gain}`);
  //         console.log(`Accumulated Realized Gains: ${realizedGains}`);

  //         purchase.unitsLeft -= unitsFromPurchase;
  //         remainingUnits -= unitsFromPurchase;

  //         console.log(`Units Left in Purchase ID ${purchase.id}: ${purchase.unitsLeft}`);
  //         console.log(`Remaining Units to Redeem: ${remainingUnits}`);

  //         await this.transactionReportsRepository.update(purchase.id, { units_left: purchase.unitsLeft });

  //         if (purchase.unitsLeft === 0) {
  //           await this.transactionReportsRepository.update(purchase.id, { is_processed: true });
  //         }
  //         await this.transactionReportsRepository.update(redemption.id, { is_processed: true });
  //       }

  //       purchaseUnitsLeft = purchaseUnitsLeft.filter(purchase => purchase.unitsLeft > 0);

  //       let cost = redemptionAmount - realizedGains;
  //       let averageCost = cost / redeemedUnits;

  //       console.log(`Total Realized Gains for Redemption ID ${redemption.id}: ${realizedGains}`);
  //       console.log(`Cost for Redemption ID ${redemption.id}: ${cost}`);
  //       console.log(`Average Cost for Redemption ID ${redemption.id}: ${averageCost.toFixed(4)}`);

  //       return {
  //         redemptionTransactionId: redemption.id,
  //         realizedGains: realizedGains,
  //         cost: cost,
  //         averageCost: averageCost.toFixed(4),
  //         redemptionDate: redemptionDate,
  //         sources: redemptionSources
  //       };

  //     }));

  //     const sourcedtos = results.flatMap(result =>
  //       result.sources.map(source => ({
  //         transaction_report_id: result.redemptionTransactionId,
  //         gain: source.gain,
  //         units: source.units,
  //         days_held: Math.floor((new Date(result.redemptionDate).getTime() - new Date(source.purchasedOn).getTime()) / (1000 * 60 * 60 * 24)),
  //         purchased_at: source.purchasedAt,
  //         purchased_on: source.purchasedOn ? new Date(source.purchasedOn) : null,
  //         source_transaction_id: source.sourceTransactionId
  //       }))
  //     );

  //     for (const dto of sourcedtos) {
  //       console.log("DTO", dto)
  //       await this.sourceRepository.save(dto);
  //     }

  //     return { status: HttpStatus.OK, result: results };

  //   } catch (err) {
  //     console.log("Error:", err.message);
  //     return { status: HttpStatus.BAD_REQUEST, error: err.message };
  //   }
  // }

  async updateSourceDirect() {
    try {
      // Fetch transactions sorted by trade date
      const transactions = await this.transactionReportsRepository.find({
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
            await this.transactionReportsRepository.update(purchase.id, {
              units_left: Number(purchase.unitsLeft.toFixed(4)),
            });

            if (purchase.unitsLeft <= 0.0001) {
              await this.transactionReportsRepository.update(purchase.id, {
                is_processed: true,
              });
            }
          }

          // Log if no purchases are left to fulfill the redemption
          if (remainingUnits > 0) {
            console.log(
              `No purchases left to fulfill redemption for Folio: ${folio_number}`,
            );
          }

          // Mark redemption as processed
          await this.transactionReportsRepository.update(redemption.id, {
            is_processed: true,
          });

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
          await this.sourceRepository.save(dto);
        }
      }

      return { status: HttpStatus.OK, result: results };
    } catch (err) {
      console.error('Error:', err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async getTransactions(
    investmentAccountId?: string,
    filter?: string,
    folios?: string[],
    asOn?: string,
  ) {
    try {
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

      if (filter == 'sip') {
        queryBuilder = queryBuilder.andWhere(
          'transaction_reports.type LIKE :type',
          { type: '%Systematic%' },
        );
      }

      queryBuilder = queryBuilder.orderBy(
        'transaction_reports.traded_on',
        'ASC',
      );

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
    } catch (err) {
      console.error('Error:', err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async getTransactionswithUser(
    investmentAccountId?: string,
    filter?: string,
    folios?: string[],
    asOn?: string,
  ) {
    try {
      console.log('Investment Account id', investmentAccountId);
      console.log('Folios', folios);
      console.log('As on', asOn);

      let queryBuilder = this.transactionReportsRepository
        .createQueryBuilder('transaction_reports')
        .leftJoinAndSelect('transaction_reports.users', 'user'); // include User relation

      if (investmentAccountId) {
        queryBuilder = queryBuilder.andWhere(
          'transaction_reports.user_id = :investmentAccountId',
          { investmentAccountId },
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

      if (filter === 'sip') {
        queryBuilder = queryBuilder.andWhere(
          'transaction_reports.type LIKE :type',
          { type: '%Systematic%' },
        );
      }

      queryBuilder = queryBuilder.orderBy(
        'transaction_reports.traded_on',
        'ASC',
      );

      const transactions = await queryBuilder.getMany();
      console.log('Transactions with User relation', transactions);

      // Extract unique ISINs
      const isins = Array.from(
        new Set(transactions.map((scheme) => scheme.isin)),
      );
      console.log('Unique ISINs', isins);

      // Fetch fund details based on unique ISINs
      const funds = await this.mutualfundsService.getFundDetailsByIsins(isins);
      console.log('Funds returned', funds);

      if ('data' in funds && Array.isArray(funds.data)) {
        // Map through the transactions and attach fund details
        const transactionsWithFunds = transactions.map((transaction) => {
          const matchingFund = funds.data.find(
            (fund) => fund.isinCode === transaction.isin,
          );
          return {
            ...transaction,
            fund: matchingFund || null,
          };
        });

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
    } catch (err) {
      console.error('Error:', err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  // async getCurrentInvestedAmount(
  //   investmentAccountId?: string,
  //   folios?: string[],
  //   asOn?: string,
  // ) {
  //   let folioNumbers
  //   // Build where clause based on input parameters
  //   const whereClause: any = {};
  //   if (investmentAccountId && !folios) {
  //     whereClause.user_id = investmentAccountId;
  //     const result = await this.transactionReportsRepository.find({
  //       where: { user_id: parseInt(investmentAccountId) },
  //       select: ['folio_number']
  //     });

  //     // Extract and deduplicate folio_number values
  //     folioNumbers = [...new Set(result.map(record => record.folio_number))];

  //     console.log(folioNumbers);
  //   }
  //   folios = folioNumbers

  //   if (folios && folios.length > 0) {
  //     whereClause.folio_number = In(folios);
  //   }

  //   if (asOn) {
  //     whereClause.traded_on = LessThanOrEqual(asOn);
  //   }

  //   // Get all transactions matching the criteria
  //   const transactions = await this.transactionReportsRepository.find({
  //     where: whereClause,
  //     order: {
  //       traded_on: 'ASC',
  //       traded_at: 'ASC',
  //     },
  //   });

  //   // Initialize totals and breakdown
  //   let totalInvestedAmount: number = 0;
  //   let totalCurrentUnits: number = 0;

  //   // Group transactions by folio
  //   const transactionsByFolio = transactions.reduce((acc, transaction) => {

  //     if (!acc[transaction.folio_number]) {
  //       acc[transaction.folio_number] = [];
  //     }
  //     acc[transaction.folio_number].push(transaction);
  //     return acc;
  //   }, {} as Record<string, TransactionReports[]>);
  //   console.log("transactionsByFolio", transactionsByFolio)
  //   // Process each folio
  //   for (const [folioNumber, folioTransactions] of Object.entries(transactionsByFolio)) {
  //     let folioInvestedAmount: number = 0;
  //     let folioCurrentUnits: number = 0;

  //     // Process each transaction within the folio
  //     for (const transaction of folioTransactions) {
  //       const type = transaction.type
  //       // Ensure values are converted to numbers
  //       const transactionUnits = Number(transaction.units) || 0;
  //       const transactionAmount = Number(transaction.amount) || 0;
  //       console.log("transactionUnits", transactionUnits)
  //       console.log("transactionAmount", transactionAmount)

  //       if (['purchase', 'switch in', 'transfer in', 'bonus', 'systematic investment', 'dividend reinvestment', 'lateral shift in']
  //         .map(t => t.toLowerCase())
  //         .some(t => type.toLowerCase().includes(t))) {
  //         folioCurrentUnits += transactionUnits;
  //         folioInvestedAmount += transactionAmount;
  //       } else if (['redemption', 'switch out', 'transfer out', 'lateral shift out']
  //         .map(t => t.toLowerCase())
  //         .some(t => type.toLowerCase().includes(t))) {
  //         const source = await this.sourceRepository.findOne({
  //           where: {
  //             transaction_report_id: transaction.id,
  //           },
  //         });
  //         console.log("source", source)
  //         if (source) {
  //           const sourceUnits = Number(source.units) || 0;
  //           const redemptionRatio = sourceUnits !== 0 ? transactionUnits / sourceUnits : 0;
  //           console.log("sourceUnits", sourceUnits)
  //           console.log("redemptionRatio", redemptionRatio)

  //           const purchaseTransaction = folioTransactions.find(
  //             (t) => t.id === source.source_transaction_id,
  //           );
  //           console.log("purchaseTransaction", purchaseTransaction)

  //           if (purchaseTransaction) {
  //             const purchaseAmount = Number(purchaseTransaction.amount) || 0;
  //             folioInvestedAmount -= purchaseAmount * redemptionRatio;
  //           }
  //         }

  //         folioCurrentUnits -= transactionUnits;
  //       }
  //     }

  //     // Handle edge cases for this folio
  //     folioCurrentUnits = Math.max(0, folioCurrentUnits);
  //     folioInvestedAmount = Math.max(0, folioInvestedAmount);
  //     console.log("folioCurrentUnits", folioCurrentUnits)
  //     console.log("folioInvestedAmount", folioInvestedAmount)

  //     // Add to totals (ensure we're adding numbers)
  //     totalInvestedAmount += folioInvestedAmount;
  //     totalCurrentUnits += folioCurrentUnits;
  //     console.log("totalInvestedAmount", totalInvestedAmount)
  //     console.log("totalCurrentUnits", totalCurrentUnits)
  //   }

  //   // Ensure final values are valid numbers before formatting
  //   const finalInvestedAmount = Number(totalInvestedAmount) || 0;
  //   const finalCurrentUnits = Number(totalCurrentUnits) || 0;
  //   console.log("finalInvestedAmount", finalInvestedAmount)
  //   console.log("finalCurrentUnits", finalCurrentUnits)

  //   return {
  //     investedAmount: Number(finalInvestedAmount.  (2)),
  //     currentUnits: Number(finalCurrentUnits.toFixed(4))
  //   };
  // }

  async getCurrentInvestedAmount(
    investmentAccountId?: string,
    filter?: string,
    folios?: string[],
    asOn?: string,
  ) {
    try {
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

      // if (filter == "sip") {
      //   whereClause.type = Like(`%Systematic%`);
      // }

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

        const schemeInvestments: { isin: string; invested_amount: number }[] =
          [];

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
                const sourceUnits =
                  Number(source.source_transaction.units) || 0;
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
                  const purchaseAmount =
                    Number(purchaseTransaction.amount) || 0;
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
    } catch (err) {
      console.error('Error:', err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async getCurrentInvestedAmountbasedOnScheme(
    investmentAccountId?: string,
    scheme?: string[],
    asOn?: string,
  ) {
    try {
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
    } catch (err) {
      console.error('Error:', err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  // async getCurrentInvestedAmount(
  //   investmentAccountId?: string,
  //   folios?: string[],
  //   asOn?: string
  // ) {
  //   const EPSILON = 1e-10; // Small value to handle floating-point precision issues
  //   const whereClause: any = {};

  //   if (investmentAccountId) {
  //     whereClause.user_id = investmentAccountId;

  //     if (!folios) {
  //       const result = await this.transactionReportsRepository.find({
  //         where: { user_id: parseInt(investmentAccountId) },
  //         select: ['folio_number']
  //       });

  //       console.log("Results", result);

  //       folios = [...new Set(result.map(record => record.folio_number))];
  //       console.log("Folio Numbers", folios);
  //     }
  //   }

  //   if (folios && folios.length > 0) {
  //     whereClause.folio_number = In(folios);
  //   }

  //   if (asOn) {
  //     whereClause.traded_on = LessThanOrEqual(asOn);
  //   }

  //   const transactions = await this.transactionReportsRepository.find({
  //     where: whereClause,
  //     order: {
  //       traded_on: 'ASC',
  //       traded_at: 'ASC',
  //     },
  //   });
  //   console.log("Transactions", transactions);

  //   const transactionsByFolio = transactions.reduce((acc, transaction) => {
  //     if (!acc[transaction.folio_number]) {
  //       acc[transaction.folio_number] = [];
  //     }
  //     acc[transaction.folio_number].push(transaction);
  //     return acc;
  //   }, {} as Record<string, TransactionReports[]>);

  //   console.log("Transactions by Folio", transactionsByFolio);

  //   const folioInvestments: { folio_number: string; invested_amount: number }[] = [];

  //   for (const [folioNumber, folioTransactions] of Object.entries(transactionsByFolio)) {
  //     let folioInvestedAmount = 0;
  //     let folioCurrentUnits = 0;

  //     for (const transaction of folioTransactions) {
  //       console.log("Transaction in for loop", transaction);
  //       const type = transaction.type;
  //       const transactionUnits = Number(transaction.units) || 0;
  //       const transactionAmount = Number(transaction.amount) || 0;

  //       if (
  //         [
  //           'purchase',
  //           'switch in',
  //           'transfer in',
  //           'bonus',
  //           'switch over in',
  //           'systematic investment',
  //           'dividend reinvestment',
  //           'lateral shift in',
  //           'ticob',
  //         ]
  //           .map(t => t.toLowerCase())
  //           .some(t => type.toLowerCase().includes(t))
  //       ) {
  //         folioCurrentUnits += transactionUnits;
  //         folioInvestedAmount += transactionAmount;
  //         console.log("Folio Current Units and Folio Amount After purchase", folioCurrentUnits, folioInvestedAmount);
  //       } else if (
  //         ['redemption', 'switch out', 'transfer out', 'lateral shift out']
  //           .map(t => t.toLowerCase())
  //           .some(t => type.toLowerCase().includes(t))
  //       ) {
  //         const source = await this.sourceRepository.findOne({
  //           where: {
  //             transaction_report_id: transaction.id,
  //           },
  //         });
  //         console.log("Source in else if ", source);

  //         if (source) {
  //           const sourceUnits = Number(source.units) || 0;
  //           const redemptionRatio = sourceUnits !== 0 ? transactionUnits / sourceUnits : 0;

  //           const purchaseTransaction = folioTransactions.find(
  //             t => t.id === source.source_transaction_id
  //           );

  //           if (purchaseTransaction) {
  //             const purchaseAmount = Number(purchaseTransaction.amount) || 0;
  //             folioInvestedAmount -= purchaseAmount * redemptionRatio;
  //           }
  //         }

  //         folioCurrentUnits -= transactionUnits;
  //         if (folioCurrentUnits < EPSILON) {
  //           folioCurrentUnits = 0;
  //           folioInvestedAmount = 0;
  //         }

  //         console.log("Folio Current Units and Folio Amount After redemption", folioCurrentUnits, folioInvestedAmount);
  //       }
  //     }

  //     console.log("Folio Current Units and Folio Amount After Loop", folioCurrentUnits, folioInvestedAmount);

  //     folioCurrentUnits = Math.max(0, folioCurrentUnits);
  //     folioInvestedAmount = Math.max(0, folioInvestedAmount);

  //     // Avoid very small floating-point precision errors
  //     if (Math.abs(folioCurrentUnits) < EPSILON) {
  //       folioCurrentUnits = 0;
  //     }
  //     if (Math.abs(folioInvestedAmount) < EPSILON) {
  //       folioInvestedAmount = 0;
  //     }

  //     folioInvestments.push({
  //       folio_number: folioNumber,
  //       invested_amount: Number(folioInvestedAmount.toFixed(4)),
  //     });
  //   }

  //   // return folioInvestments
  //   return { status: HttpStatus.OK, data: folioInvestments };
  // }

  async calculateHoldings(transactions: any[]) {
    try {
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
    } catch (err) {
      console.error('Error:', err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async generateHoldingsReport(
    filter?: string,
    investmentAccountId?: string,
    folios?: string[],
    asOn?: string,
    page?: number,
    limit?: number,
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
        filter,
        folios,
        asOn,
      );
      console.log('Invested Amount', invested_amount.data);

      // Retrieve transactions for the given investmentAccountId or folios with pagination
      const transactions = await this.getTransactions(
        investmentAccountId,
        filter,
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
                      user_detail: {
                        id: '',
                        name: '',
                        email: '',
                        mobile: '',
                        role: '',
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

                  const user = await this.transactionReportsRepository.findOne({
                    where: { folio_number: transaction.folio_number },
                    relations: ['users'],
                  });
                  console.log('User found', user);
                  if (user.users) {
                    acc[isin].user_detail.id = user.users.id;
                    acc[isin].user_detail.name = user.users.full_name;
                    acc[isin].user_detail.email = user.users.email;
                    acc[isin].user_detail.mobile = user.users.mobile;
                    acc[isin].user_detail.role = user.users.role;
                  }

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

              return {
                folio_number: folioNumber,
                schemes: Object.values(holdings).filter(
                  (scheme: any) => scheme.holdings.units > 0,
                ),
              };
            },
          ),
        );

        console.log('Final Holdings Data:', holdingsData);

        const excelLink = await this.generateExcelForHoldingsReport(
          holdingsData,
        );

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
          result: holdingsData,
          excelDownloadLink: excelLink,
        };
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: transactions.error };
      }
    } catch (err) {
      console.log('Error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async generateExcelForHoldingsReport(holdingsData: any[]): Promise<string> {
    try {
      const rows = [];

      // Flatten holdings data into rows for Excel
      for (const folio of holdingsData) {
        const folioNumber = folio.folio_number;
        for (const scheme of folio.schemes) {
          rows.push({
            'Folio Number': folioNumber,
            ISIN: scheme.isin,
            'Scheme Name': scheme.name,
            'Plan Type': scheme.type,
            'As On': scheme.holdings.as_on,
            NAV: scheme.nav.value,
            Units: scheme.holdings.units,
            'Redeemable Units': scheme.holdings.redeemable_units,
            'Market Value': scheme.market_value.amount,
            'Redeemable Amount': scheme.market_value.redeemable_amount,
            'Invested Value': scheme.invested_value.amount,
          });
        }
      }

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Holdings Report');

      // Setup directory structure
      const directory = path.join(`${this.filepath}`, 'uploads');
      const downloadDirectory = path.join(directory, 'downloads');

      if (!fs.existsSync(downloadDirectory)) {
        console.log('Directory does not exist. Creating it...');
        fs.mkdirSync(downloadDirectory, { recursive: true });
      } else {
        console.log('Directory already exists.');
      }

      // Create unique file name
      const uniqueFileName = `Holdings_Report_${Date.now()}.xlsx`;
      const filePath = path.join(downloadDirectory, uniqueFileName);

      // Write workbook to file
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

  async getSchemeReturns(
    investmentAccountId?: string,
    tradedOnTo?: string,
    page?: number,
    limit?: number,
  ) {
    try {
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
      let query = this.transactionReportsRepository
        .createQueryBuilder('transaction_reports')
        .leftJoinAndSelect('transaction_reports.users', 'user')
        .select('transaction_reports.isin', 'isin')
        .addSelect('MAX(transaction_reports.rta_scheme_name)', 'scheme_name')
        .addSelect('MAX(transaction_reports.folio_number)', 'folio_number')
        .addSelect('MAX(transaction_reports.type)', 'plan_type')
        .addSelect(
          'MAX(transaction_reports.rta_investment_option)',
          'investment_option',
        )
        .addSelect('ANY_VALUE(user.id)', 'user_id')
        .addSelect('ANY_VALUE(user.full_name)', 'user_name')
        .addSelect('ANY_VALUE(user.email)', 'user_email');

      console.log('type ', typeof investmentAccountId);
      console.log('Inves', investmentAccountId);

      if (investmentAccountId !== null && investmentAccountId !== undefined) {
        console.log('INN users');

        query
          .addSelect('ANY_VALUE(user.id)', 'user_id')
          .addSelect('ANY_VALUE(user.full_name)', 'user_name')
          .addSelect('ANY_VALUE(user.email)', 'user_email')
          .where('transaction_reports.user_id = :investmentAccountId', {
            investmentAccountId,
          });
      }
      query.groupBy('transaction_reports.isin');

      // Apply pagination if page and limit are provided
      if (page != null && limit != null) {
        const skip = (page - 1) * limit;
        query = query.skip(skip).take(limit);
      }

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

      const fund: any = await this.mutualfundsService.getFundDetailsByIsins(
        isin,
      );
      console.log('Funds', fund);

      const mappedSchemes = await Promise.all(
        schemes
          .filter((scheme) => scheme.isin && scheme.isin.length > 0)
          .map(async (scheme) => {
            const funds = fund.data.find(
              (item) => item.isinCode === scheme.isin,
            );
            console.log('Funds details', funds);

            const currentValue = scheme.units * funds?.nav;

            const cashFlows = await this.transactionReportsRepository
              .createQueryBuilder('transaction_reports')
              .leftJoinAndSelect('transaction_reports.users', 'user')
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
              folio_number: scheme.folio_number,
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
              user: {
                id: scheme.user_id,
                name: scheme.user_name,
                email: scheme.user_email,
              },
              // xirr: xirrValue
            };
          }),
      );

      const excelLink = await this.generateExcelforSchemeWise(mappedSchemes);

      // Return paginated result with metadata
      return {
        status: HttpStatus.OK,
        result: mappedSchemes,
        excelDownloadLink: excelLink,
        meta: {
          total: isin.length,
          totalPages: Math.ceil(isin.length / limit),
        },
      };
    } catch (err) {
      console.error('Error:', err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async generateExcelforSchemeWise(folios: any[]): Promise<string> {
    try {
      const rows = [];

      // Flatten folio data into rows for Excel
      for (const folio of folios) {
        rows.push({
          ISIN: folio.isin,
          'Scheme Name': folio.scheme_name,
          'Plan Type': folio.plan_type,
          'Investment Option': folio.investment_option,
          'As On': folio.as_on,
          Nav: folio.nav,
          'Invested amount': folio.invested_amount,
          'Current value': folio.current_value,
          'Unrealised Gain': folio.unrealized_gain,
          'Absolute Gain': folio.absolute_gain,
          'Average buying value': folio.average_buying_value,
          Units: folio.units,
        });
      }

      const worksheet = XLSX.utils.json_to_sheet(rows);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Scheme Wise');

      const directory = path.join(`${this.filepath}`, 'uploads');

      const downloaddirectory = path.join(directory, 'downloads');
      if (!fs.existsSync(downloaddirectory)) {
        console.log('Directory does not exist. Creating it...');
        fs.mkdirSync(downloaddirectory, { recursive: true }); // Create the directory if it doesn't exist
      } else {
        console.log('Directory already exists.');
      }
      const uniqueFileName = `Schemewise_${Date.now()}.xlsx`;

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

  // async capital_gains(
  //   accountId: string,
  //   folios?: string[],
  //   scheme?: string,
  //   traded_on_from?: string,
  //   traded_on_to?: string,
  //   page?: number,
  //   limit?: number
  // ) {
  //   const today = new Date().toISOString().split('T')[0];

  //   const queryBuilder = this.sourceRepository
  //     .createQueryBuilder('sources')
  //     .leftJoinAndSelect('sources.transactionReport', 'transactionReport')
  //     .leftJoinAndSelect('sources.source_transaction', 'source_transaction')
  //     .where('transactionReport.user_id = :accountId', { accountId });

  //   // Filter by folios
  //   if (folios && folios.length > 0) {
  //     queryBuilder.andWhere('transactionReport.folio_number IN (:...folios)', { folios });
  //   }

  //   // Filter by scheme
  //   if (scheme) {
  //     queryBuilder.andWhere('transactionReport.rta_scheme_name = :scheme', { scheme });
  //   }

  //   // Filter by traded_on date range
  //   if (traded_on_from) {
  //     queryBuilder.andWhere('transactionReport.traded_on >= :traded_on_from', { traded_on_from });
  //   }
  //   if (traded_on_to) {
  //     queryBuilder.andWhere('transactionReport.traded_on <= :traded_on_to', { traded_on_to });
  //   }

  //   // Apply pagination if page and limit are provided
  //   if (page != null && limit != null) {
  //     const skip = (page - 1) * limit;
  //     queryBuilder.skip(skip).take(limit);
  //   }

  //   // Execute the query to get the transactions
  //   const transactions = await queryBuilder.getMany();

  //   console.log('Transactions', transactions);

  //   // Get the total count of transactions to calculate total pages
  //   const totalCount = await queryBuilder.getCount();
  //   console.log('Total Count of Transactions:', totalCount);

  //   // Calculate capital gains for each transaction
  //   let result = transactions.map((txn) => {
  //     const daysHeld = txn.days_held;
  //     const actualGain = txn.gain;
  //     const taxableGain = actualGain;
  //     const indexedCost = txn.purchased_at * 0.5;  // Sample index factor
  //     const indexedCapitalGains = txn.transactionReport.traded_at * txn.units - indexedCost;

  //     return {
  //       folio_number: txn.transactionReport.folio_number,
  //       isin: txn.transactionReport.isin,
  //       scheme_name: txn.transactionReport.rta_scheme_name,
  //       type: txn.transactionReport.type,
  //       amount: txn.transactionReport.amount,
  //       units: txn.transactionReport.units,
  //       traded_on: txn.transactionReport.traded_on,
  //       traded_at: txn.transactionReport.traded_at,
  //       source_days_held: txn.days_held,
  //       source_purchased_on: txn.purchased_on,
  //       source_purchased_at: txn.purchased_at,
  //       source_actual_gain: actualGain,
  //       source_taxable_gain: taxableGain,
  //       grand_fathering: false,
  //       grand_fathering_nav: 0,
  //       indexed_cost_of_acquisition: indexedCost.toFixed(4),
  //       indexed_capital_gains: indexedCapitalGains.toFixed(4),
  //     };
  //   });

  //   // Return paginated result with metadata
  //   return {
  //     status: HttpStatus.OK,
  //     result,
  //     meta: {
  //       total: totalCount,
  //       totalPages: Math.ceil(totalCount / limit)
  //     }
  //   };
  // }

  async capital_gains(
    accountId: string,
    folios?: string[],
    scheme?: string,
    traded_on_from?: string,
    traded_on_to?: string,
    page?: number,
    limit?: number,
  ) {
    try {
      if (accountId == 'null') {
        accountId = null;
      }
      const today = new Date().toISOString().split('T')[0];

      const queryBuilder = this.sourceRepository
        .createQueryBuilder('sources')
        .leftJoinAndSelect('sources.transactionReport', 'transactionReport')
        .leftJoinAndSelect('transactionReport.users', 'user')
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
        queryBuilder.andWhere(
          'transactionReport.folio_number IN (:...folios)',
          { folios },
        );
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
        queryBuilder.andWhere(
          'transactionReport.traded_on >= :traded_on_from',
          { traded_on_from },
        );
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

      // Filter out invalid ISINs (empty or whitespace only)
      const validIsins = isin.filter((item) => item && item.trim() !== '');

      console.log('Valid ISINs', validIsins);

      // If no valid ISINs are found, log a message but don't return an error
      if (!validIsins.length) {
        console.log('No valid ISINs found.');
      } else {
        console.log('All valid ISINs:', validIsins);
      }

      console.log('Total Count of Valid Schemes:', validIsins.length);

      const fund: any = await this.mutualfundsService.getFundDetailsByIsins(
        isin,
      );
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
          user: txn.transactionReport.users,
        });
      }
      const excelDownloadLink = await this.generateExcelforCapitalGains(result);

      //Add pagination here

      let paginatedResult = result;
      if (page != null && limit != null) {
        paginatedResult = result.slice((page - 1) * limit, page * limit);
      }

      // Return paginated result with metadata
      return {
        status: HttpStatus.OK,
        result: paginatedResult,
        excelDownloadLink,
        meta: {
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    } catch (err) {
      console.error('Error:', err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async generateExcelforCapitalGains(folios: any[]): Promise<string> {
    try {
      const rows = [];

      // Flatten folio data into rows for Excel
      for (const folio of folios) {
        rows.push({
          'Folio Number': folio.folio_number,
          ISIN: folio.isin,
          'Scheme Name': folio.scheme_name,
          Type: folio.type,
          Amount: folio.amount,
          Units: folio.units,
          'Traded On': folio.traded_on,
          'Traded At': folio.traded_at,
          'Days Held': folio.source_days_held,
          'Purchased On': folio.source_purchased_on,
          'Purchased At': folio.source_purchased_at,
          'Actual Gain': folio.source_actual_gain,
          'Taxable Gain': folio.source_taxable_gain,
          Grandfathered: folio.grand_fathering,
          'Grandfathering NAV': folio.grand_fathering_nav,
          'Indexed Cost of Acquisition': folio.indexed_cost_of_acquisition,
          'Indexed Capital Gains': folio.indexed_capital_gains,
        });
      }

      const worksheet = XLSX.utils.json_to_sheet(rows);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Capital Gains');

      const directory = path.join(`${this.filepath}`, 'uploads');

      const downloaddirectory = path.join(directory, 'downloads');
      if (!fs.existsSync(downloaddirectory)) {
        console.log('Directory does not exist. Creating it...');
        fs.mkdirSync(downloaddirectory, { recursive: true }); // Create the directory if it doesn't exist
      } else {
        console.log('Directory already exists.');
      }
      const uniqueFileName = `Capital_Gains_${Date.now()}.xlsx`;

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

  async investment_account_wise_returns_for_portfolio_service(
    accountId: string,
    traded_on_to?: string,
    page?: number,
    limit?: number,
  ) {
    try {
      console.log('Original accountId:', accountId);

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

      const queryBuilder = this.transactionReportsRepository
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
        const funds = fund?.data?.find((item) => item.isinCode === scheme.isin);

        if (!aggregatedSchemes[scheme.investment_account_id]) {
          aggregatedSchemes[scheme.investment_account_id] = {
            investment_account_id: scheme.investment_account_id,
            invested_amount: 0,
            current_value: 0,
            units: 0,
            unrealized_gain: 0,
            user: {
              id: '',
              name: '',
              email: '',
              mobile: '',
              role: '',
            },
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

      console.log('Aggregated Schemes', aggregatedSchemes);
      // Map aggregated schemes to a more readable format
      const mappedSchemes = Object.values(aggregatedSchemes).map((scheme) => ({
        investment_account_id: scheme.investment_account_id,
        invested_amount: scheme.invested_amount,
        current_value: scheme.current_value,
        unrealized_gain: scheme.unrealized_gain,
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
      const result = separateKeysAndValues(accountId, paginatedSchemes[0]);

      // Return the paginated result with metadata
      return {
        status: HttpStatus.OK,
        data: { data: result },
        meta: {
          total: totalCount,
          totalPages: limit ? Math.ceil(totalCount / limit) : 1,
          currentPage: page || 1,
        },
      };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err };
    }
  }

  async investment_account_wise_returns(
    accountId: string,
    from?: string,
    traded_on_to?: string,
    page?: number,
    limit?: number,
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

      const from_date = from
        ? new Date(from).toISOString().split('T')[0]
        : null;
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
      if (from) {
        countQuery.andWhere('transaction_reports.traded_on >= :from_date', {
          from_date,
        });
      }
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
      if (from) {
        queryBuilder.andWhere('transaction_reports.traded_on >= :from_date', {
          from_date,
        });
      }
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

      console.log('Pagination params: page =', page, ', limit =', limit);

      // Apply pagination AFTER all calculations
      let paginatedSchemes = mappedSchemes;
      if (page != null && limit != null) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        paginatedSchemes = mappedSchemes.slice(startIndex, endIndex);
      }

      console.log('Paginated data', paginatedSchemes);

      let excelfilepath = null;
      if (paginatedSchemes.length > 0) {
        excelfilepath = await this.generateExcelforInvestmentAccount(
          mappedSchemes,
        );
      }

      return {
        status: HttpStatus.OK,
        data: paginatedSchemes,
        excelDownloadLink: excelfilepath,
        meta: {
          total: parseInt(totalInvestmentAccounts || '0'),
          totalPages: limit ? Math.ceil(totalInvestmentAccounts / limit) : 1,
          currentPage: page || 1,
        },
      };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err };
    }
  }

  async generateExcelforInvestmentAccount(folios: any[]): Promise<string> {
    try {
      const rows = [];

      // Flatten folio data into rows for Excel
      for (const folio of folios) {
        rows.push({
          'Investment Account Id': folio.investment_account_id,
          'Invested Amount': folio.invested_amount,
          'Current Value': folio.current_value,
          'Unrealised Gain': folio.unrealized_gain,
          'Absolute Gain': folio.absolute_gain,
          CAGR: folio.cagr,
        });
      }

      const worksheet = XLSX.utils.json_to_sheet(rows);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Investment Account Wise',
      );

      const directory = path.join(`${this.filepath}`, 'uploads');

      const downloaddirectory = path.join(directory, 'downloads');
      if (!fs.existsSync(downloaddirectory)) {
        console.log('Directory does not exist. Creating it...');
        fs.mkdirSync(downloaddirectory, { recursive: true }); // Create the directory if it doesn't exist
      } else {
        console.log('Directory already exists.');
      }
      const uniqueFileName = `IA_wise_${Date.now()}.xlsx`;

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

  async transaction_type_wise_returns(
    partner: string,
    traded_on_from: string,
    traded_on_to: string,
    page?: number,
    limit?: number,
  ) {
    try {
      const tradedOnDate = traded_on_to
        ? new Date(traded_on_to).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      // Start QueryBuilder
      const query = this.transactionReportsRepository
        .createQueryBuilder('transaction_reports')
        .select('transaction_reports.type', 'type')
        .addSelect('SUM(transaction_reports.amount)', 'total')
        .groupBy('transaction_reports.type');

      // Apply filters if provided
      if (partner) {
        query.andWhere('transaction_reports.partner = :partner', { partner });
      }

      if (traded_on_from) {
        query.andWhere('transaction_reports.traded_on >= :traded_on_from', {
          traded_on_from,
        });
      }

      if (traded_on_to) {
        query.andWhere('transaction_reports.traded_on <= :traded_on_to', {
          tradedOnDate,
        });
      }

      // Apply pagination if provided
      if (page != null && limit != null) {
        const skip = (page - 1) * limit;
        query.skip(skip).take(limit);
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

      const excelLink = await this.generateExcelforTransactionType(
        aggregatedData,
      );

      // Return the paginated result with metadata
      return {
        status: HttpStatus.OK,
        data: aggregatedData,
        excelDownloadLink: excelLink,
        meta: {
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    } catch (err) {
      console.log('Error occurred', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async generateExcelforTransactionType(folios: any[]): Promise<string> {
    try {
      const rows = [];

      // Flatten folio data into rows for Excel
      for (const folio of folios) {
        rows.push({
          Type: folio.type,
          Total: folio.total,
        });
      }

      const worksheet = XLSX.utils.json_to_sheet(rows);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Transaction Type Wise',
      );

      const directory = path.join(`${this.filepath}`, 'uploads');

      const downloaddirectory = path.join(directory, 'downloads');
      if (!fs.existsSync(downloaddirectory)) {
        console.log('Directory does not exist. Creating it...');
        fs.mkdirSync(downloaddirectory, { recursive: true }); // Create the directory if it doesn't exist
      } else {
        console.log('Directory already exists.');
      }
      const uniqueFileName = `Transaction_type_wise_${Date.now()}.xlsx`;

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

  async fund_scheme_category_wise(
    partner: string,
    traded_on_from: string,
    traded_on_to: string,
    page?: number,
    limit?: number,
  ) {
    try {
      console.log('Starting fund_scheme_category_wise with parameters:', {
        partner,
        traded_on_from,
        traded_on_to,
      });

      // Determine traded_on_to date
      const tradedOnDate = traded_on_to
        ? new Date(traded_on_to).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      console.log('Computed tradedOnDate:', tradedOnDate);

      // Fetch purchase transactions
      const transactionsQuery = this.transactionReportsRepository
        .createQueryBuilder('transaction_reports')
        .select('transaction_reports.isin', 'isin')
        .addSelect('SUM(transaction_reports.amount)', 'total_investment')
        .where('LOWER(transaction_reports.type) NOT IN (:...excludedTypes)', {
          excludedTypes: ['redemption', 'switch out', 'lateral shift out'].map(
            (type) => type.toLowerCase(),
          ),
        }) // Filter for purchase transactions
        .groupBy('transaction_reports.isin');

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
          { tradedOnDate },
        );

      // Apply pagination if provided
      const skip = (page - 1) * limit;
      transactionsQuery.skip(skip).take(limit);

      console.log('Executing transactions query...');
      const purchaseTransactions = await transactionsQuery.getRawMany();

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
        console.log('fundDetail category', fundDetail.category);
        const category = fundDetail?.category?.primaryCategoryName || 'Unknown';

        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += parseFloat(txn.total_investment);

        return acc;
      }, {});

      // Transform result to array format
      const detailedResults = Object.keys(investmentsByCategory).map(
        (category) => ({
          category,
          totalInvestment: investmentsByCategory[category],
        }),
      );

      const excelfilepath = await this.generateExcelforFundScheme(
        detailedResults,
      );

      // Calculate the total count of records for pagination metadata
      const totalCount = detailedResults.length;

      console.log('Function executed successfully. Returning results.');
      return {
        status: HttpStatus.OK,
        data: detailedResults,
        excelDownloadLink: excelfilepath,
        meta: {
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    } catch (err) {
      console.log('Error occurred', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async generateExcelforFundScheme(folios: any[]): Promise<string> {
    try {
      const rows = [];

      // Flatten folio data into rows for Excel
      for (const folio of folios) {
        rows.push({
          Category: folio.category,
          'Total Investment': folio.totalInvestment,
        });
      }

      const worksheet = XLSX.utils.json_to_sheet(rows);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Fund Scheme Category Wise',
      );

      const directory = path.join(`${this.filepath}`, 'uploads');

      const downloaddirectory = path.join(directory, 'downloads');
      if (!fs.existsSync(downloaddirectory)) {
        console.log('Directory does not exist. Creating it...');
        fs.mkdirSync(downloaddirectory, { recursive: true }); // Create the directory if it doesn't exist
      } else {
        console.log('Directory already exists.');
      }
      const uniqueFileName = `Fund_Scheme_Category_Wise_${Date.now()}.xlsx`;

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

  async getInvestorDetails(partner: string, page?: number, limit?: number) {
    try {
      console.log('Fetching investor details for partner:', partner);

      if (partner == 'null') {
        partner = null;
      }

      // Query to fetch investor details with pagination
      const queryBuilder = this.transactionReportsRepository
        .createQueryBuilder('transaction_reports')
        .innerJoin('users', 'users', 'transaction_reports.user_id = users.id')
        .innerJoin(
          'user_onboarding_details',
          'user_onboarding_details',
          'users.id = user_onboarding_details.user_id',
        )
        .select('users.email', 'email')
        .addSelect('users.mobile', 'mobile')
        .addSelect('users.full_name', 'investor_name')
        .addSelect('user_onboarding_details.pan', 'pan_number');
      if (partner !== null && partner !== undefined) {
        console.log('INN users');
        queryBuilder.where('transaction_reports.user_id = :partner', {
          partner,
        });
      }
      queryBuilder.groupBy(
        'users.email, users.mobile, users.full_name, user_onboarding_details.pan',
      );

      // Apply pagination if page and limit are provided
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);

      // Execute the query
      const investorDetails = await queryBuilder.getRawMany();

      const excelfilepath = await this.generateExcelforInvestorDetails(
        investorDetails,
      );

      // Calculate the total number of records for pagination metadata
      const totalCount = await investorDetails.length;

      console.log('Investor details fetched successfully.');
      return {
        status: HttpStatus.OK,
        data: investorDetails,
        excelDownloadLink: excelfilepath,
        meta: {
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    } catch (err) {
      console.error('Error occurred while fetching investor details:', err);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: err.message };
    }
  }

  async generateExcelforInvestorDetails(folios: any[]): Promise<string> {
    try {
      const rows = [];

      // Flatten folio data into rows for Excel
      for (const folio of folios) {
        rows.push({
          'Investor Name': folio.investor_name,
          Email: folio.email,
          Mobile: folio.mobile,
          PAN: folio.pan,
        });
      }

      const worksheet = XLSX.utils.json_to_sheet(rows);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Investor Details');

      const directory = path.join(`${this.filepath}`, 'uploads');

      const downloaddirectory = path.join(directory, 'downloads');
      if (!fs.existsSync(downloaddirectory)) {
        console.log('Directory does not exist. Creating it...');
        fs.mkdirSync(downloaddirectory, { recursive: true }); // Create the directory if it doesn't exist
      } else {
        console.log('Directory already exists.');
      }
      const uniqueFileName = `Investor_details_${Date.now()}.xlsx`;

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

  // async getInvestmentByIsin(user_id, isin) {
  //   try {
  //     const types = [
  //       'purchase', 'switch in', 'ticob', 'transfer in', 'bonus',
  //       'switch over in', 'systematic investment', 'dividend reinvestment', 'lateral shift in'
  //     ];

  //     const transactions = await this.transactionReportsRepository.find({
  //       where: {
  //         user_id: user_id,
  //         isin: isin,
  //         type: In(types)
  //       },
  //       order: {
  //         traded_on: 'DESC'  // or 'ASC' if you want oldest first
  //       }
  //     });

  //     return {
  //       status: HttpStatus.OK,
  //       data: transactions
  //     };
  //   } catch (error) {
  //     console.error("Error occurred while fetching investments by ISIN:", error.message);
  //     throw error;
  //   }
  // }

  // async getInvestmentByIsin(user_id: number, isin, folio_number) {
  //   try {
  //     // const types = [
  //     //   'purchase', 'switch in', 'ticob', 'transfer in', 'bonus',
  //     //   'switch over in', 'systematic investment', 'dividend reinvestment', 'lateral shift in'
  //     // ];

  //     // Fetch all transactions for user_id and isin
  //     console.log('User_id', user_id)
  //     const transactions = await this.transactionReportsRepository.find({
  //       where: {
  //         user_id: user_id,
  //         isin: isin,
  //         folio_number: folio_number
  //         // type: In(types)
  //       },
  //       order: {
  //         traded_on: 'DESC'
  //       }
  //     });

  //     // Filter using includes() in JS
  //     // const filteredTransactions = transactions.filter(transaction =>
  //     //   types.some(type => transaction.type.toLowerCase().includes(type.toLowerCase()))
  //     // );

  //     return {
  //       status: HttpStatus.OK,
  //       data: transactions
  //       // data: filteredTransactions
  //     };

  //   } catch (error) {
  //     console.error("Error occurred while fetching investments by ISIN:", error.message);
  //     throw error;
  //   }
  // }

  async getInvestmentByIsin(user_id: number, isin, folio_number) {
    try {
      console.log('User_id', user_id);

      const transactions = await this.transactionReportsRepository.find({
        where: {
          user_id: user_id,
          isin: isin,
          folio_number: folio_number,
          type: Not('Pledging'),
        },
        order: {
          traded_on: 'DESC',
        },
      });

      return {
        status: HttpStatus.OK,
        data: transactions,
      };
    } catch (error) {
      console.error(
        'Error occurred while fetching investments by ISIN:',
        error.message,
      );
      throw error;
    }
  }
}

// async getTransactions(investmentAccountId ?: string, folios ?: string[], asOn ?: string) {
//   console.log("Investment Account id", investmentAccountId)
//   console.log("Folios", folios)
//   console.log("As on", asOn)

//   let queryBuilder = this.transactionReportsRepository
//     .createQueryBuilder('transaction_reports');

//   if (investmentAccountId) {
//     queryBuilder = queryBuilder
//       .andWhere('transaction_reports.user_id = :investmentAccountId', {
//         investmentAccountId,
//       });
//   }

//   if (folios && folios.length > 0) {
//     queryBuilder = queryBuilder
//       .andWhere('transaction_reports.folio_number IN (:...folios)', { folios });
//   }

//   if (asOn) {
//     const asOnDate = new Date(asOn);
//     asOnDate.setHours(23, 59, 59, 999);
//     queryBuilder = queryBuilder
//       .andWhere('transaction_reports.traded_on <= :asOnDate', { asOnDate });
//   }
//   queryBuilder = queryBuilder.orderBy('transaction_reports.traded_on', 'ASC');

//   const transactions = await queryBuilder.getMany();
//   console.log("Transactions", transactions)

//   const isin = transactions.map(scheme => scheme.isin);
//   console.log("ISINs", isin);

//   let fund = await this.mutualfundsService.getFundDetailsByIsins(isin);
//   console.log("Funds returned", fund);

//   // Create a map of funds by their ISIN for quick lookup
//   let fundMap = {};
//   if ('data' in fund && Array.isArray(fund.data)) {
//     fund.data.forEach(f => {
//       fundMap[f.isin] = f; // Assuming `isin` is the key to match funds
//     });
//   }
//   // Map each transaction to its corresponding fund
//   let transactionsWithFunds = await Promise.all(
//     transactions.map(async transaction => {
//       const matchingFund = fundMap[transaction.isin]; // Match by `isin`
//       console.log("Matching fund for transaction", matchingFund);

//       return {
//         ...transaction,
//         fund: matchingFund || null
//       };
//     })
//   );

//   console.log("Transactions with funds", transactionsWithFunds);
//   return transactionsWithFunds;
// }

async function fetchCII(year: number): Promise<number> {
  try {
    console.log('Year:', year);

    // URL of the CII page
    const url =
      'https://incometaxindia.gov.in/charts%20%20tables/cost-inflation-index.htm';

    // Fetch the webpage content
    const response = await axios.get(url);
    const html = response.data;

    // Load the HTML content using Cheerio
    const $ = cheerio.load(html);

    // Select the table rows containing CII data
    const rows = $('table tr');

    // Iterate over rows to find the matching year
    for (let i = 1; i < rows.length; i++) {
      // Skip header row
      const cells = $(rows[i]).find('td');
      const financialYear = $(cells[1]).text().trim(); // Extract year from second column
      const ciiValue = $(cells[2]).text().trim(); // Extract CII value from third column

      // Match the given year with the financial year
      if (financialYear.startsWith(year.toString())) {
        return parseFloat(ciiValue);
      }
    }

    // If the year is not found, throw an error
    throw new Error(`CII value for year ${year} not found.`);
  } catch (error) {
    console.error(`Error fetching CII for year ${year}:`, error.message);
    throw new Error('Unable to fetch CII values. Please try again later.');
  }
}

function separateKeysAndValues(
  accountId: any,
  obj: Record<string, any>,
): { rows: any[]; columns: any[] } {
  try {
    console.log('Objects', obj);
    if (obj == undefined || obj == null) {
      const rows = [accountId, 0, 0, 0, 0, 0];
      const columns = [
        'investment_account_id',
        'invested_amount',
        'current_value',
        'unrealized_gain',
        'absolute_return',
        'cagr',
      ];
      return { rows, columns };
    }
    const rows = Object.values(obj); // Extract keys
    const columns = Object.keys(obj); // Extract values

    console.log('ROWWS', rows);
    console.log('col', columns);

    return { rows, columns };
  } catch (err) {
    console.error('Error:', err.message);
    throw new Error(err.message);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
