import { HttpStatus, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InvestorDetail } from './entities/investor-detail.entity';
import { CreateInvestorDetailDto } from './dto/create-investor-detail.dto';
import path from 'path';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionReports } from './entities/transaction-details.entity';
import { CreateSourceDto } from './dto/sources.dto';
import { Source } from './entities/sources.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import * as cheerio from 'cheerio';
import * as xlsx from 'xlsx';
import { ISINLookupResult } from 'src/transactions/types/transaction.types';
import { ISINLookupService } from 'src/isinlookup/isinlookup.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Users } from 'src/users/entities/users.entity';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';

@Injectable()
export class InvestorDetailsService {
  mf_base_url: string;
  constructor(
    @InjectRepository(InvestorDetail)
    private readonly investorDetailsRepository: Repository<InvestorDetail>,
    @InjectRepository(TransactionReports)
    private readonly transactionReportsRepository: Repository<TransactionReports>,
    @InjectRepository(Source)
    private readonly sourceRepository: Repository<Source>,
    @InjectRepository(UserOnboardingDetails)
    private readonly usersonboardingRepository: Repository<UserOnboardingDetails>,
    private readonly transactionsService: TransactionsService,
    private readonly isinLookupService: ISINLookupService,
  ) {
    const configService = new ConfigService();
    this.mf_base_url = configService.get('MF_BASE_URL');
  }

  async Camsinvestors(filepath: string) {
    const ext = path.extname(filepath).toLowerCase();
    const invdata: CreateInvestorDetailDto[] = [];

    const fileContent = fs.readFileSync(filepath, 'utf-8');

    let parser = require('csv-parse');

    // console.log("filecontent", fileContent, "end");
    parser = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ',',
      quote: "'",
      // relax_quotes: true,
      // relax_column_count: true,
    });

    // let rowCount = 0
    for await (const record of parser) {
      // if (rowCount === 0) {
      //   console.log('CSV Headers:', Object.keys(record));
      // }
      // console.log('Sample Record:', record);
      // rowCount++;
      // if (rowCount > 5) break

      // const investorDetail = new InvestorDetail();

      const newdto: CreateInvestorDetailDto = {
        user_id: null, //userid
        object: 'mf_folio',
        amc: 'AMC', //AMC
        number: record['FOLIOCHK'] as string,
        dp_id: record['DP_ID'] as string,
        client_id: 'ClientID',
        primary_investor_pan: record['PAN_NO'] as string,
        secondary_investor_pan: record['JOINT1_PAN'] as string,
        third_investor_pan: record['JOINT2_PAN'] as string,
        holding_pattern: record['HOLDING_NATURE'] as string,
        primary_investor_name: record['INV_NAME'] as string,
        secondary_investor_name: record['JNT_NAME1'] as string,
        third_investor_name: record['JNT_NAME2'] as string,
        primary_investor_dob: record['INV_DOB']
          ? new Date(
              convertDateFormat(record['INV_DOB'], 'DD-MM-YYYY', 'YYYY-MM-DD'),
            )
          : null,
        secondary_investor_dob: null,
        third_investor_dob: null,
        primary_investor_gender: null,
        secondary_investor_gender: null,
        third_investor_gender: null,
        primary_investor_tax_status: null,
        primary_investor_occupation: record['OCCUPATION'] as string,
        guardian_name: record['GUARD_NAME'] as string,

        guardian_gender: null,
        guardian_pan: record['GUARD_PAN'] as string,
        // guardian_dob: record['GUARDIAN_DOB'] ? new Date(convertDateFormat(record['GUARDIAN_DOB'], 'DD-MM-YYYY', 'YYYY-MM-DD')),
        guardian_relationship: null,

        nominee1_name: record['NOM_NAME'] as string,
        nominee1_relationship: record['RELATION'] as string,
        nominee1_allocation_percentage: record['NOM_PERCENTAGE']
          ? parseFloat(record['NOM_PERCENTAGE'])
          : null,
        // nominee1_dob: null,
        nominee1_guardian_dob: null,
        nominee1_guardian: null,

        nominee2_name: record['NOM2_NAME'] as string,
        nominee2_relationship: record['NOM2_RELATION'] as string,
        nominee2_allocation_percentage: record['NOM2_PERCENTAGE']
          ? parseFloat(record['NOM2_PERCENTAGE'])
          : null,
        // nominee1_dob: null,
        nominee2_guardian_dob: null,
        nominee2_guardian: null,

        nominee3_name: record['NOM3_NAME'] as string,
        nominee3_relationship: record['NOM3_RELATION'] as string,
        nominee3_allocation_percentage: record['NOM3_PERCENTAGE']
          ? parseFloat(record['NOM3_PERCENTAGE'])
          : null,
        // nominee1_dob: null,
        nominee3_guardian_dob: null,
        nominee3_guardian: null,

        scheme: record['SCH_NAME'] as string,
        scheme_code: record['PRODUCT'] as string,

        bank_account_name: record['BANK_NAME'] as string,
        bank_account_ifsc: record['IFSC_CODE'] as string,
        bank_account_type: record['AC_TYPE'] as string,
        bank_account_number: record['AC_NO'] as string,

        address_line1: record['ADDRESS1'] as string,
        address_line2: record['ADDRESS2'] as string,
        address_line3: record['ADDRESS3'] as string,
        city: record['CITY'] as string,
        state: 'KA',
        postal_code: record['PINCODE'] as string,
        country_ansi_code: null,
        country_name: record['COUNTRY'] as string,
        email_address: record['EMAIL'] as string,
        mobile_number: record['MOBILE_NO'] as string,
        guardian_dob: record['GUARDIAN_DOB']
          ? new globalThis.Date(
              convertDateFormat(
                record['GUARDIAN_DOB'],
                'DD-MM-YYYY',
                'YYYY-MM-DD',
              ),
            )
          : null,
        nominee1_dob: record['NOM1_DOB']
          ? new globalThis.Date(
              convertDateFormat(record['NOM1_DOB'], 'DD-MM-YYYY', 'YYYY-MM-DD'),
            )
          : null,
        nominee2_dob: record['NOM2_DOB']
          ? new globalThis.Date(
              convertDateFormat(record['NOM2_DOB'], 'DD-MM-YYYY', 'YYYY-MM-DD'),
            )
          : null,
        nominee3_dob: record['NOM3_DOB']
          ? new globalThis.Date(
              convertDateFormat(record['NOM3_DOB'], 'DD-MM-YYYY', 'YYYY-MM-DD'),
            )
          : null,
        // rep_date: record['REP_DATE'] ? new Date(convertDateFormat(record['REP_DATE'], 'DD-MM-YYYY', 'YYYY-MM-DD')) : null,
        // clos_bal: record['CLOS_BAL'] ? parseFloat(record['CLOS_BAL']) : null,
        // rupee_bal: record['RUPEE_BAL'] ? parseFloat(record['RUPEE_BAL']) : null,
        // phone_off: record['PHONE_OFF'] as string,
        // phone_res: record['PHONE_RES'] as string,
        // uin_no: record['UIN_NO'] as string,
        // tax_status: record['TAX_STATUS'] as string,
        // broker_code: record['BROKER_CODE'] as string,
        // subbroker: record['SUBBROKER'] as string,
        // reinv_flag: record['REINV_FLAG'] as string,
        // branch: record['BRANCH'] as string,
        // b_address1: record['B_ADDRESS1'] as string,
        // b_address2: record['B_ADDRESS2'] as string,
        // b_address3: record['B_ADDRESS3'] as string,
        // b_city: record['B_CITY'] as string,
        // b_pincode: record['B_PINCODE'] as string,
        // b_pincode: record['b_pincode'] ? parseInt(record['b_pincode'], 10) : null,
        // inv_iin: record['INV_IIN'] as string,
        // nom_addr1: record['NOM_ADDR1'] as string,
        // nom_addr2: record['NOM_ADDR2'] as string,
        // nom_addr3: record['NOM_ADDR3'] as string,
        // nom_city: record['NOM_CITY'] as string,
        // nom_state: record['NOM_STATE'] as string,
        // nom_pincode: record['NOM_PINCODE'] as string,
        // nom_pincode: record['nom_pincode'] ? parseInt(record['nom_pincode'], 10) : null,
        // nom_ph_off: record['NOM_PH_OFF'] as string,
        // nom_ph_res: record['NOM_PH_RES'] as string,
        // nom_email: record['NOM_EMAIL'] as string,

        // nom2_addr1: record['NOM2_ADDR1'] as string,
        // nom2_addr2: record['NOM2_ADDR2'] as string,
        // nom2_addr3: record['NOM2_ADDR3'] as string,
        // nom2_city: record['NOM2_CITY'] as string,
        // nom2_state: record['NOM2_STATE'] as string,
        // nom2_pincode: record['NOM2_PINCODE'] as string,
        // // nom2_pincode: record['nom2_pincode'] ? parseInt(record['nom2_pincode'], 10) : null,
        // nom2_ph_off: record['NOM2_PH_OFF'] as string,
        // nom2_ph_res: record['NOM2_PH_RES'] as string,
        // nom2_email: record['NOM2_EMAIL'] as string,

        // nom3_addr1: record['NOM3_ADDR1'] as string,
        // nom3_addr2: record['NOM3_ADDR2'] as string,
        // nom3_addr3: record['NOM3_ADDR3'] as string,
        // nom3_city: record['NOM3_CITY'] as string,
        // nom3_state: record['NOM3_STATE'] as string,
        // nom3_pincode: record['NOM3_PINCODE'] as string,
        // // nom3_pincode: record['nom3_pincode'] ? parseInt(record['nom3_pincode'], 10) : null,
        // nom3_ph_off: record['NOM3_PH_OFF'] as string,
        // nom3_ph_res: record['NOM3_PH_RES'] as string,
        // nom3_email: record['NOM3_EMAIL'] as string,

        // demat: record['DEMAT'] as string,

        // brokcode: record['BROKCODE'] as string,
        // folio_date: record['FOLIO_DATE'] ? new Date(convertDateFormat(record['FOLIO_DATE'], 'DD-MM-YYYY', 'YYYY-MM-DD')) : null,
        // aadhaar: record['AADHAAR'] as string,
        // tpa_linked: record['TPA_LINKED'] as string,
        // fh_ckyc_no: record['FH_CKYC_NO'] as string,
        // jh1_ckyc: record['JH1_CKYC'] as string,
        // jh2_ckyc: record['JH2_CKYC'] as string,
        // g_ckyc_no: record['G_CKYC_NO'] as string,
        // jh1_dob: record['JH1_DOB'] ? new Date(convertDateFormat(record['JH1_DOB'], 'DD-MM-YYYY', 'YYYY-MM-DD')) : null,
        // jh2_dob: record['JH2_DOB'] ? new Date(convertDateFormat(record['JH2_DOB'], 'DD-MM-YYYY', 'YYYY-MM-DD')) : null,
        // guardian_dob: record['GUARDIAN_DOB'] ? new Date(convertDateFormat(record['GUARDIAN_DOB'], 'DD-MM-YYYY', 'YYYY-MM-DD')) : null,
        // amc: record['AMC_CODE'] as string,
        // gst_state_code: record['GST_STATE_CODE'] ? parseInt(record['GST_STATE_CODE'], 10) : null,
        // folio_old: record['FOLIO_OLD'] as string,
        // scheme_folio_number: record['SCHEME_FOLIO_NUMBER'] as string,
      };

      invdata.push(newdto);
    }

    const result = [];
    for (const record of invdata) {
      const checkdup = await this.investorDetailsRepository.find({
        where: { primary_investor_pan: record.primary_investor_pan },
      });
      if (checkdup.length > 0) {
        console.log('Duplicate found');
        continue;
      }

      await this.investorDetailsRepository.save(record);
      result.push(record);
    }
    return {
      status: 200,
      message: 'File processed successfully',
      result: result,
    };
  }

  // async Camstransactions(filepath: string) {
  //   let ext = path.extname(filepath).toLowerCase();
  //   let invdata: CreateTransactionDto[] = [];
  //   let srcdata: CreateSourceDto[] = [];

  //   let fileContent = fs.readFileSync(filepath, 'utf-8');

  //   let parser = require('csv-parse');

  //   console.log("filecontent", fileContent, "end");
  //   parser = parse(fileContent, {
  //     columns: true,
  //     skip_empty_lines: true,
  //     trim: true,
  //     delimiter: ",",
  //     quote: "'"
  //     // relax_quotes: true,
  //     // relax_column_count: true,
  //   });

  //   // let rowCount = 0
  //   for await (const record of parser) {
  //     // if (rowCount === 0) {
  //     //   console.log('CSV Headers:', Object.keys(record));
  //     // }
  //     // console.log('Sample Record:', record);
  //     // rowCount++;
  //     // if (rowCount > 5) break

  //     const newdto: CreateTransactionDto = {

  //       user_id: null,  //userid
  //       object: "transaction",
  //       folio_number: record['FOLIO_NO'] as string,
  //       isin: "",
  //       type: record['TRXN_TYPE_'] as string  ,
  //       units: record['UNITS'] as number,
  //       amount: record['AMOUNT'] as number,
  //       traded_on: record['TRADDATE'] ? new Date(record['TRADDATE']) : null,
  //       traded_at: record['PURPRICE'] as number,
  //       order: null,
  //       corporate_action: null,
  //       related_transaction_id: null,
  //       rta_order_reference: record['TRXNNO'] as string,
  //       rta_product_code: record['PRODCODE'] as string,
  //       rta_investment_option: record['SCHEME_TYP'] as string,
  //       rta_scheme_name: record['SCHEME'] as string,
  //       is_processed: false,
  //       units_left: null

  //     };

  //     invdata.push(newdto);

  //     // const sourcedto: CreateSourceDto = {
  //     //   transaction_report_id: null,
  //     //   gain: null,
  //     //   days_held: null,
  //     //   units: record['UNITS'] as number,
  //     //   purchased_at: record['PURPRICE'] as number,
  //     //   purchased_on: record['TRADDATE'] ? new Date(record['TRADDATE']) : null

  //     // }
  //     // srcdata.push(sourcedto)
  //   }

  //   const result = [];
  //   for (let i = 0; i < invdata.length; i++) {
  //     const transaction = invdata[i];
  //     try {
  //       let res = await this.transactionReportsRepository.save(transaction);
  //       result.push({ transaction: res });
  //     } catch (error) {
  //       console.error('Error processing transaction and source:', error);
  //       return { status: 500, message: 'Error saving transaction and source data' };
  //     }
  //   }

  //   return { status: 200, message: 'File processed successfully', result };
  // }

  async Camstransactions(filepath: string, file_id: number) {
    console.log(`Starting CAMS transactions processing for file: ${filepath}`);
    const invdata: CreateTransactionDto[] = [];
    const schemeToIsinMap = new Map<string, string>();

    // Step 1: Read the ISIN mapping from the Excel file
    console.log('Reading ISIN mapping from Excel file');
    const workbook = xlsx.readFile(filepath);
    const sheetName = workbook.SheetNames[0];
    console.log(`Using sheet: ${sheetName}`);
    const worksheet = workbook.Sheets[sheetName];
    const isinData = xlsx.utils.sheet_to_json(worksheet);
    console.log(`Total ISIN mapping rows: ${isinData.length}`);

    isinData.forEach((row: any) => {
      const prodCode = row['PRODCODE']; // Adjust column name as needed
      const isin = row['ISIN']; // Adjust column name as needed
      if (prodCode && isin) {
        schemeToIsinMap.set(prodCode.trim(), isin.trim());
        console.log(
          `Mapped scheme: ${prodCode.trim()} to ISIN: ${isin.trim()}`,
        );
      }
    });
    console.log(`Initial ISIN map size: ${schemeToIsinMap.size}`);

    // Step 2: Read and parse the CSV file
    console.log('Reading and parsing CSV file');
    const fileContent = fs.readFileSync(filepath, 'utf-8');
    const parser = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ',',
      quote: "'",
    });

    const uniqueSchemes: Set<string> = new Set();
    console.log('Processing transaction records');
    let processedRecordsCount = 0;

    for await (const record of parser) {
      const prodCode = (record['PRODCODE'] as string).trim();
      uniqueSchemes.add(prodCode);

      const userPan = record['PAN'] as string;

      // Fetch user_id from repository using the PAN number
      const user = await this.usersonboardingRepository.findOne({
        where: { pan: userPan },
      });
      const userId = user ? user.user_id : null; // Avoids error if user is null

      const newdto: CreateTransactionDto = {
        user_id: userId,
        user_pan: record['PAN'] as string,
        object: 'transaction',
        folio_number: record['FOLIO_NO'] as string,
        isin: schemeToIsinMap.get(prodCode) || '', // Use existing mapping if available
        type: record['TRXN_TYPE_'] as string,
        units: parseFloat(parseFloat(record['UNITS']).toFixed(3)) || 0, // Ensure 3 decimal places and convert to number
        amount: parseFloat(parseFloat(record['AMOUNT']).toFixed(3)) || 0, // Ensure 3 decimal places and convert to number
        traded_on: record['TRADDATE'] ? new Date(record['TRADDATE']) : null,
        traded_at: parseFloat(parseFloat(record['PURPRICE']).toFixed(3)) || 0, // Ensure 3 decimal places and convert to number
        order: null,
        corporate_action: null,
        related_transaction_id: null,
        rta_order_reference: record['TRXNNO'] as string,
        rta_product_code: record['PRODCODE'] as string,
        rta_investment_option: record['SCHEME_TYP'] as string,
        rta_scheme_name: record['SCHEME_NAME'] as string,
        usr_trx_no: record['USRTRXNO'] as string,
        is_processed: false,
        units_left: null,
        file_processed_id: file_id,
      };

      invdata.push(newdto);
      processedRecordsCount++;
    }
    console.log(`Total processed records: ${processedRecordsCount}`);

    // Step 3: Batch ISIN lookup for schemes without ISINs using API
    const schemesWithoutIsin = [...uniqueSchemes].filter(
      (scheme) => !schemeToIsinMap.has(scheme),
    );

    if (schemesWithoutIsin.length > 0) {
      console.log(`Schemes needing ISIN lookup: ${schemesWithoutIsin.length}`);

      const apiUrl =
        this.mf_base_url +
        '/api/v1/mutual_funds/explore/explore_mutual_funds_by_rta_codes';
      try {
        const response = await axios.post(apiUrl, {
          rtaCodes: schemesWithoutIsin,
        });
        const webLookupResults = response.data;

        webLookupResults.data.forEach((result) => {
          if (result.isinCode) {
            schemeToIsinMap.set(result.rtaCode, result.isinCode);
            console.log(
              `Updated ISIN for scheme ${result.rtaCode}: ${result.isinCode}`,
            );
          } else {
            console.warn(`No ISIN found for scheme: ${result.rtaCode}`);
          }
        });

        let updatedTransactionsCount = 0;
        invdata.forEach((transaction) => {
          const webIsin = schemeToIsinMap.get(transaction.rta_product_code);
          if (webIsin && !transaction.isin) {
            transaction.isin = webIsin;
            updatedTransactionsCount++;
          }
        });
        console.log(
          `Total transactions updated with web-looked-up ISINs: ${updatedTransactionsCount}`,
        );
      } catch (error) {
        console.error('Error during ISIN lookup API call:', error);
        return {
          status: 500,
          message: 'Error during ISIN lookup API call',
          error,
        };
      }
    }

    // Step 4: Group transactions and aggregate

    console.log('Sorting transactions by traded_on date');
    invdata.sort((a, b) => {
      if (!a.traded_on || !b.traded_on) return 0; // Handle cases where traded_on might be null
      return new Date(a.traded_on).getTime() - new Date(b.traded_on).getTime();
    });
    console.log('Sorting completed.');

    console.log(
      'Starting transaction processing. Total transactions:',
      invdata.length,
    );

    const groupedData = invdata.reduce((acc, transaction, index) => {
      const key = `${transaction.usr_trx_no}-${transaction.type}`;
      console.log(`Processing transaction #${index + 1}:`, transaction);

      if (!acc[key]) {
        acc[key] = { ...transaction };
      } else {
        for (const field of ['amount', 'units', 'traded_at']) {
          if (transaction[field] !== undefined) {
            const value = Number(transaction[field]);
            if (!isNaN(value)) {
              acc[key][field] = parseFloat(
                (Number(acc[key][field]) + value).toFixed(2),
              );
            } else {
              console.warn(
                `Skipping field ${field} for usr_trx_no ${key}: Cannot convert value to a number.`,
              );
            }
          }
        }
      }
      return acc;
    }, {});

    console.log(
      'Grouping completed. Grouped transactions:',
      Object.keys(groupedData).length,
    );

    const result = [];
    for (const key in groupedData) {
      const transaction = groupedData[key];
      try {
        const checkdup = await this.transactionReportsRepository.find({
          where: {
            usr_trx_no: transaction.usr_trx_no,
            type: transaction.type,
            user_pan: transaction.user_pan,
          },
        });
        if (checkdup.length > 0) {
          console.log('Duplicate found');
          continue;
        }
        const res = await this.transactionReportsRepository.save(transaction);
        result.push({ transaction: res });
        console.log(
          `Successfully saved transaction for scheme: ${transaction.isin}`,
        );
      } catch (error) {
        console.error(`Failed to save transaction for key: ${key}`, error);
      }
    }

    console.log('All transactions processed. Total saved rows:', result.length);
  }

  async Karvyinvestors(filepath: string) {
    const ext = path.extname(filepath).toLowerCase();
    const invdata: CreateInvestorDetailDto[] = [];

    const fileContent = fs.readFileSync(filepath, 'utf-8');

    let parser = require('csv-parse');

    // console.log("filecontent", fileContent, "end");
    parser = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ',',
      quote: '"',
      // relax_quotes: true,
      // relax_column_count: true,
    });

    // let rowCount = 0
    for await (const record of parser) {
      // if (rowCount === 0) {
      //   console.log('CSV Headers:', Object.keys(record));
      // }
      console.log('Sample Record:', record);
      // rowCount++;
      // if (rowCount > 5) break

      // const investorDetail = new InvestorDetail();

      const newdto: CreateInvestorDetailDto = {
        user_id: null, //userid
        object: 'mf_folio',
        amc: 'AMC', //AMC
        number: record['Folio'] as string,
        dp_id: record['DPID'] as string,
        client_id: record['Client ID'] as string,
        primary_investor_pan: record['PAN Number'] as string,
        secondary_investor_pan: record['PAN2'] as string,
        third_investor_pan: record['PAN3'] as string,
        holding_pattern: record['Mode of Holding Description'] as string,
        primary_investor_name: record['Investor Name'] as string,
        secondary_investor_name: record['Joint Name 1'] as string,
        third_investor_name: record['Joint Name 2'] as string,
        primary_investor_dob: record['Date of Birth']
          ? new Date(
              convertDateFormatv2(
                record['Date of Birth'],
                'YYYYMMDD',
                'YYYY-MM-DD',
              ),
            )
          : null,
        secondary_investor_dob: null,
        third_investor_dob: null,
        primary_investor_gender: null,
        secondary_investor_gender: null,
        third_investor_gender: null,
        primary_investor_tax_status: record['Tax Status'] as string,
        primary_investor_occupation: record['Occupation Description'] as string,
        guardian_name: record['GuardianName'] as string,

        guardian_gender: null,
        guardian_pan: record['GuardPanNo'] as string,
        // guardian_dob: record['GUARDIAN_DOB'] ? new Date(convertDateFormat(record['GUARDIAN_DOB'], 'YYYYMMDD', 'YYYY-MM-DD')),
        guardian_relationship: null,

        nominee1_name: record['Nominee'] as string,
        nominee1_relationship: record['Nominee Relation'] as string,
        nominee1_allocation_percentage: record['Nominee Ratio']
          ? parseFloat(record['Nominee Ratio'])
          : null,
        // nominee1_dob: null,
        nominee1_guardian_dob: null,
        nominee1_guardian: record['Nominee Guardian Name'] as string,

        nominee2_name: record['Nominee2'] as string,
        nominee2_relationship: record['Nominee2 Relation'] as string,
        nominee2_allocation_percentage: record['Nominee2 Ratio']
          ? parseFloat(record['Nominee2 Ratio'])
          : null,
        // nominee1_dob: null,
        nominee2_guardian_dob: null,
        nominee2_guardian: null,

        nominee3_name: record['Nominee3'] as string,
        nominee3_relationship: record['Nominee3 Relation'] as string,
        nominee3_allocation_percentage: record['Nominee3 Ratio']
          ? parseFloat(record['Nominee3 Ratio'])
          : null,
        // nominee1_dob: null,
        nominee3_guardian_dob: null,
        nominee3_guardian: null,

        scheme: record['Fund Description'] as string,
        scheme_code: record['Product Code'] as string,

        bank_account_name: record['Bank Name'] as string,
        bank_account_ifsc: record['IFSC Code'] as string,
        bank_account_type: record['Account Type'] as string,
        bank_account_number: record['BankAccno'] as string,

        address_line1: record['Address #1'] as string,
        address_line2: record['Address #2'] as string,
        address_line3: record['Address #3'] as string,
        city: record['City'] as string,
        state: record['State'] as string,
        postal_code: record['Pincode'] as string,
        country_ansi_code: null,
        country_name: record['Country'] as string,
        email_address: record['Email'] as string,
        mobile_number: record['Mobile Number'] as string,
        guardian_dob: record['GUARDIAN_DOB']
          ? new globalThis.Date(
              convertDateFormatv2(
                record['GUARDIAN_DOB'],
                'YYYYMMDD',
                'YYYY-MM-DD',
              ),
            )
          : null,
        nominee1_dob: record['Nominee DOB']
          ? new globalThis.Date(
              convertDateFormatv2(
                record['Nominee DOB'],
                'YYYYMMDD',
                'YYYY-MM-DD',
              ),
            )
          : null,
        nominee2_dob: record['NOM2_DOB']
          ? new globalThis.Date(
              convertDateFormatv2(record['NOM2_DOB'], 'YYYYMMDD', 'YYYY-MM-DD'),
            )
          : null,
        nominee3_dob: record['NOM3_DOB']
          ? new globalThis.Date(
              convertDateFormatv2(record['NOM3_DOB'], 'YYYYMMDD', 'YYYY-MM-DD'),
            )
          : null,
        // rep_date: record['REP_DATE'] ? new Date(convertDateFormat(record['REP_DATE'], 'YYYYMMDD', 'YYYY-MM-DD')) : null,
        // clos_bal: record['CLOS_BAL'] ? parseFloat(record['CLOS_BAL']) : null,
        // rupee_bal: record['RUPEE_BAL'] ? parseFloat(record['RUPEE_BAL']) : null,
        // phone_off: record['PHONE_OFF'] as string,
        // phone_res: record['PHONE_RES'] as string,
        // uin_no: record['UIN_NO'] as string,
        // tax_status: record['TAX_STATUS'] as string,
        // broker_code: record['BROKER_CODE'] as string,
        // subbroker: record['SUBBROKER'] as string,
        // reinv_flag: record['REINV_FLAG'] as string,
        // branch: record['BRANCH'] as string,
        // b_address1: record['B_ADDRESS1'] as string,
        // b_address2: record['B_ADDRESS2'] as string,
        // b_address3: record['B_ADDRESS3'] as string,
        // b_city: record['B_CITY'] as string,
        // b_pincode: record['B_PINCODE'] as string,
        // b_pincode: record['b_pincode'] ? parseInt(record['b_pincode'], 10) : null,
        // inv_iin: record['INV_IIN'] as string,
        // nom_addr1: record['NOM_ADDR1'] as string,
        // nom_addr2: record['NOM_ADDR2'] as string,
        // nom_addr3: record['NOM_ADDR3'] as string,
        // nom_city: record['NOM_CITY'] as string,
        // nom_state: record['NOM_STATE'] as string,
        // nom_pincode: record['NOM_PINCODE'] as string,
        // nom_pincode: record['nom_pincode'] ? parseInt(record['nom_pincode'], 10) : null,
        // nom_ph_off: record['NOM_PH_OFF'] as string,
        // nom_ph_res: record['NOM_PH_RES'] as string,
        // nom_email: record['NOM_EMAIL'] as string,

        // nom2_addr1: record['NOM2_ADDR1'] as string,
        // nom2_addr2: record['NOM2_ADDR2'] as string,
        // nom2_addr3: record['NOM2_ADDR3'] as string,
        // nom2_city: record['NOM2_CITY'] as string,
        // nom2_state: record['NOM2_STATE'] as string,
        // nom2_pincode: record['NOM2_PINCODE'] as string,
        // // nom2_pincode: record['nom2_pincode'] ? parseInt(record['nom2_pincode'], 10) : null,
        // nom2_ph_off: record['NOM2_PH_OFF'] as string,
        // nom2_ph_res: record['NOM2_PH_RES'] as string,
        // nom2_email: record['NOM2_EMAIL'] as string,

        // nom3_addr1: record['NOM3_ADDR1'] as string,
        // nom3_addr2: record['NOM3_ADDR2'] as string,
        // nom3_addr3: record['NOM3_ADDR3'] as string,
        // nom3_city: record['NOM3_CITY'] as string,
        // nom3_state: record['NOM3_STATE'] as string,
        // nom3_pincode: record['NOM3_PINCODE'] as string,
        // // nom3_pincode: record['nom3_pincode'] ? parseInt(record['nom3_pincode'], 10) : null,
        // nom3_ph_off: record['NOM3_PH_OFF'] as string,
        // nom3_ph_res: record['NOM3_PH_RES'] as string,
        // nom3_email: record['NOM3_EMAIL'] as string,

        // demat: record['DEMAT'] as string,
        // nominee1_dob: null,
        // brokcode: record['BROKCODE'] as string,
        // folio_date: record['FOLIO_DATE'] ? new Date(convertDateFormat(record['FOLIO_DATE'], 'YYYYMMDD', 'YYYY-MM-DD')) : null,
        // aadhaar: record['AADHAAR'] as string,
        // tpa_linked: record['TPA_LINKED'] as string,
        // fh_ckyc_no: record['FH_CKYC_NO'] as string,
        // jh1_ckyc: record['JH1_CKYC'] as string,
        // jh2_ckyc: record['JH2_CKYC'] as string,
        // g_ckyc_no: record['G_CKYC_NO'] as string,
        // jh1_dob: record['JH1_DOB'] ? new Date(convertDateFormat(record['JH1_DOB'], 'YYYYMMDD', 'YYYY-MM-DD')) : null,
        // jh2_dob: record['JH2_DOB'] ? new Date(convertDateFormat(record['JH2_DOB'], 'YYYYMMDD', 'YYYY-MM-DD')) : null,
        // guardian_dob: record['GUARDIAN_DOB'] ? new Date(convertDateFormat(record['GUARDIAN_DOB'], 'YYYYMMDD', 'YYYY-MM-DD')) : null,
        // amc: record['AMC_CODE'] as string,
        // gst_state_code: record['GST_STATE_CODE'] ? parseInt(record['GST_STATE_CODE'], 10) : null,
        // folio_old: record['FOLIO_OLD'] as string,
        // scheme_folio_number: record['SCHEME_FOLIO_NUMBER'] as string,
      };

      invdata.push(newdto);
    }

    const result = [];
    for (const record of invdata) {
      console.log('data', invdata);
      const checkdup = await this.investorDetailsRepository.find({
        where: { primary_investor_pan: record.primary_investor_pan },
      });
      if (checkdup.length > 0) {
        console.log('Duplicate found');
        continue;
      }
      await this.investorDetailsRepository.save(record);
      result.push(record);
    }
    return {
      status: 200,
      message: 'File processed successfully',
      result: result,
    };
  }

  async Karvytransactions(filepath: string, file_id) {
    const ext = path.extname(filepath).toLowerCase();
    const invdata: CreateTransactionDto[] = [];
    const result = [];

    try {
      const fileContent = fs.readFileSync(filepath, 'utf-8');

      let parser = require('csv-parse');

      // console.log("filecontent", fileContent, "end");
      parser = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        delimiter: ',',
        quote: "'",
        // relax_quotes: true,
        // relax_column_count: true,
      });

      console.log('Starting CSV parsing...');

      for await (const record of parser) {
        const userPan = record['PAN1'] as string;

        // Fetch user_id from repository using the PAN number
        const user = await this.usersonboardingRepository.findOne({
          where: { pan: userPan },
        });
        const userId = user ? user.user_id : null; // Avoids error if user is null

        const newdto: CreateTransactionDto = {
          user_id: userId,
          user_pan: record['PAN1'] as string,
          object: 'transaction',
          folio_number: record['Folio Number'] as string,
          isin: record['ISIN'] as string,
          type: record['Transaction Description'] as string,
          amount: parseFloat(record['Amount']),
          units: parseFloat(record['Units']),
          traded_on: record['Transaction Date']
            ? parseDDMMYYYY(record['Transaction Date'])
            : null,
          traded_at: parseFloat(record['Nav']),
          order: record['Transaction ID'] as string,
          corporate_action: null,
          related_transaction_id: null,
          rta_order_reference: null,
          rta_product_code: record['Product Code'] as string,
          rta_investment_option: record['Transaction Type'] as string,
          rta_scheme_name: record['Fund Description'] as string,
          usr_trx_no: record['Application Number'] as string,
          is_processed: false,
          units_left: null,
          file_processed_id: file_id,
        };
        invdata.push(newdto);
      }
      console.log('Sorting transactions by traded_on date');
      invdata.sort((a, b) => {
        if (!a.traded_on || !b.traded_on) return 0; // Handle cases where traded_on might be null
        return (
          new Date(a.traded_on).getTime() - new Date(b.traded_on).getTime()
        );
      });
      console.log('Sorting completed.');

      console.log('Total transactions parsed:', invdata.length);

      // Step 1: Separate transactions into positive and negative
      const negativeTransactions = invdata.filter((trx) => trx.amount < 0);
      const positiveTransactions = invdata.filter((trx) => trx.amount > 0);

      console.log('Negative transactions count:', negativeTransactions.length);
      console.log('Positive transactions count:', positiveTransactions.length);

      // Step 2: Remove pairs (negative transaction and its positive match)
      const pairedTransactions = new Set();
      for (const negTrx of negativeTransactions) {
        const matchingPosTrx = positiveTransactions.find(
          (posTrx) =>
            posTrx.amount === Math.abs(negTrx.amount) &&
            posTrx.rta_investment_option.substring(0, 3) ===
              negTrx.rta_investment_option.substring(0, 3),
        );

        if (matchingPosTrx) {
          pairedTransactions.add(negTrx);
          pairedTransactions.add(matchingPosTrx);
          positiveTransactions.splice(
            positiveTransactions.indexOf(matchingPosTrx),
            1,
          ); // Remove matched positive transaction
        }
      }

      console.log(
        'Paired transactions count (removed):',
        pairedTransactions.size,
      );
      console.log('Paired transactions', pairedTransactions);

      // Step 3: Save the remaining transactions
      const remainingTransactions = invdata.filter(
        (trx) => !pairedTransactions.has(trx),
      );

      console.log(
        'Remaining transactions count:',
        remainingTransactions.length,
      );

      for (const transaction of remainingTransactions) {
        try {
          const checkdup = await this.transactionReportsRepository.find({
            where: {
              order: transaction.order,
              type: transaction.type,
              user_pan: transaction.user_pan,
            },
          });
          console.log(
            'checkdata',
            transaction.order,
            transaction.type,
            transaction.user_pan,
          );
          console.log(
            'chekcdup',
            checkdup.map((item) => item.id),
          );
          if (checkdup.length > 0) {
            console.log('Duplicate found');
            continue;
          }
          console.log(
            `Saving transaction for usr_trx_no: ${transaction.usr_trx_no}`,
            transaction,
          );
          const res = await this.transactionReportsRepository.save(transaction);
          result.push(res);
        } catch (error) {
          console.error(
            `Failed to save transaction for usr_trx_no: ${transaction.usr_trx_no}`,
            error,
          );
        }
      }

      console.log(
        'All transactions processed. Total saved rows:',
        result.length,
      );

      return { status: 200, message: 'File processed successfully', result };
    } catch (error) {
      console.error('Error processing file:', error);
      return {
        status: 500,
        message: 'An error occurred while processing the file',
        error,
      };
    }
  }
}

function convertDateFormat(
  dateString: string,
  fromFormat: string,
  toFormat: string,
): string {
  const dateDelimiter = /[-/.]/; // Handles different delimiters: '-', '/', '.'
  const fromParts = fromFormat.split(dateDelimiter);
  const dateParts = dateString.split(dateDelimiter);

  if (fromParts.length !== 3 || dateParts.length !== 3) {
    throw new Error('Invalid date format');
  }

  const day = dateParts[fromParts.indexOf('DD')];
  const month = dateParts[fromParts.indexOf('MM')];
  const year = dateParts[fromParts.indexOf('YYYY')];

  return toFormat.replace('DD', day).replace('MM', month).replace('YYYY', year);
}

function convertDateFormatv2(
  dateString: string,
  fromFormat: string,
  toFormat: string,
): string {
  const delimiterRegex = /[-/.]/;

  // Case 1: Delimited date (e.g., "14/04/2025")
  if (delimiterRegex.test(dateString)) {
    const fromParts = fromFormat.split(delimiterRegex);
    const dateParts = dateString.split(delimiterRegex);

    if (fromParts.length !== 3 || dateParts.length !== 3) {
      throw new Error('Invalid date format');
    }

    const map = fromParts.reduce((acc, part, index) => {
      acc[part] = dateParts[index];
      return acc;
    }, {} as Record<string, string>);
    console.log(
      'date to format',
      toFormat
        .replace('YYYY', map['YYYY'])
        .replace('MM', map['MM'])
        .replace('DD', map['DD']),
    );
    return toFormat
      .replace('YYYY', map['YYYY'])
      .replace('MM', map['MM'])
      .replace('DD', map['DD']);
  }

  // Case 2: Non-delimited date (e.g., "20250414")
  const fromFormatMap = {
    YYYY: fromFormat.indexOf('YYYY'),
    MM: fromFormat.indexOf('MM'),
    DD: fromFormat.indexOf('DD'),
  };

  const extract = (token: string): string => {
    const pos = fromFormatMap[token];
    if (pos === -1) throw new Error(`Token ${token} not found in format`);
    return dateString.slice(pos, pos + token.length);
  };

  const day = extract('DD');
  const month = extract('MM');
  const year = extract('YYYY');
  console.log(
    'date to format 2',
    toFormat.replace('YYYY', year).replace('MM', month).replace('DD', day),
  );
  return toFormat.replace('YYYY', year).replace('MM', month).replace('DD', day);
}

function parseDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day); // month is 0-based
}
