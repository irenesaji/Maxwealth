import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateKfintechTransactionMasterFolioDto } from './dto/create-kfintech_transaction_master_folio.dto';
import { UpdateKfintechTransactionMasterFolioDto } from './dto/update-kfintech_transaction_master_folio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { KfintechTransactionMasterFolios } from './entities/kfintech_transaction_master_folio.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import * as path from 'path';
import * as Exceljs from 'exceljs';
import * as fs from 'fs';
// import parse from 'csv-parse';
import { parse } from 'csv-parse';
import * as XLSX from 'xlsx';

@Injectable()
export class KfintechTransactionMasterFoliosService {
  constructor(
    @InjectRepository(KfintechTransactionMasterFolios)
    private kfintechTransactionMasterFolioRepo: Repository<KfintechTransactionMasterFolios>,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
  ) {}
  async create(filepath: string) {
    console.log('File Received', filepath);
    // let productCode= await this.kfintechInvestorMasterFolioRepo.findOne({where:{product_code}})
    const ext = path.extname(filepath).toLowerCase();
    const data = [];

    try {
      if (ext === '.csv') {
        const fileContent = fs.readFileSync(filepath, 'utf-8');

        try {
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
            console.log('Sample Record:', record);
            // rowCount++;
            // if (rowCount > 5) break
            console.log(
              'Processing record:',
              new Date(record['Transaction Date']),
            );
            // Extract each field from the CSV record
            const dto: CreateKfintechTransactionMasterFolioDto = {
              FMCODE: record['Product Code'] as string,
              TD_FUND: record['Fund'] as string,
              TD_ACNO: record['Folio Number'] as string,
              SCHPLN: record['Scheme Code'] as string,
              FUNDDESC: record['Fund Description'] as string,
              TD_PURRED: record['Transaction Head'] as string,
              TD_TRNO: record['Transaction Number'] as string,
              SMCODE: record['Switch_Ref. No.'] as string,
              CHQNO: record['Instrument Number'] as string,
              INVNAME: record['Investor Name'] as string,
              TRNMODE: record['Transaction Mode'] as string,
              TRNSTAT: record['Transaction Status'] as string,
              TD_BRANCH: record['Branch Name'] as string,
              ISCTRNO: record['Branch Transaction No'] as string,
              TD_TRDT: record['Transaction Date']
                ? parseDDMMYYYY(record['Transaction Date'])
                : null,
              TD_PRDT: record['Process Date']
                ? parseDDMMYYYY(record['Process Date'])
                : null,
              TD_POP: record['Price'] ? parseFloat(record['Price']) : null,
              TD_UNITS: record['Units'] ? parseFloat(record['Units']) : null,
              TD_AMT: record['Amount'] ? parseFloat(record['Amount']) : null,
              TD_AGENT: record['Agent Code'] as string,
              TD_BROKER: record['Sub-Broker Code'] as string,
              BROKPER: record['Brokerage Percentage']
                ? parseFloat(record['Brokerage Percentage'])
                : null,
              BROKCOMM: record['Commission']
                ? parseFloat(record['Commission'])
                : null,
              INVID: record['Investor ID'] as string,
              CRDATE: record['Report Date']
                ? parseDDMMYYYY(record['Report Date'])
                : null,
              CRTIME: record['Report Time'] as string,
              TRNSUB: record['Transaction Sub'] as string,
              TD_APPNO: record['Application Number'] as string,
              UNQNO: record['Transaction ID'] as string,
              TRDESC: record['Transaction Description'] as string,
              TD_TRTYPE: record['Transaction Type'] as string,
              CHQDATE: record['Instrument Date']
                ? parseDDMMYYYY(record['Instrument Date'])
                : null,
              CHQBANK: record['Instrument Bank'] as string,
              DIVOPT: record['Dividend Option'] as string,
              TRFLAG: record['Transaction Flag'] as string,
              TD_NAV: record['Nav'] ? parseFloat(record['Nav']) : null,
              STT: record['STT'] ? parseFloat(record['STT']) : null,
              LOAD1: record['Load Amount']
                ? parseFloat(record['Load Amount'])
                : null,
              IHNO: record['Ihno'] as string,
              BRANCHCODE: record['Branch Code'] as string,
              INWARDNUM0: record['Inward Number'] as string,
              PAN1: record['PAN1'] as string,
              NCTREMARKS: record['Remarks'] as string,
              NAVDATE: record['Nav Date']
                ? parseDDMMYYYY(record['Nav Date'])
                : null,
              PAN2: record['PAN2'] as string,
              PAN3: record['PAN3'] as string,
              TDSAMOUNT: record['TDSAmount']
                ? parseFloat(record['TDSAmount'])
                : null,
              SCH1: record['sch1'] as string,
              PLN1: record['pln1'] as string,
              PRCODE1: record['ToProductCode'] as string,
              TD_TRXNMO1: record['td_trxnmode'] as string,
              CLIENTID: record['ClientId'] as string,
              DPID: record['DpId'] as string,
              STATUS: record['Status'] as string,
              REJTRNOOR2: record['RejTrnoOrgNo'] as string,
              SUBTRTYPE: record['SubTranType'] as string,
              TRCHARGES: record['TrCharges']
                ? parseFloat(record['TrCharges'])
                : null,
              ATMCARDST3: record['ATMCardStatus'] as string,
              ATMCARDRE4: record['ATMCardRemarks'] as string,
              BROK_ENTDT: record['NCT Change Date']
                ? parseDDMMYYYY(record['NCT Change Date'])
                : null,
              SCHEMEISIN: record['ISIN'] as string,
              CITYCATEG5: record['CityCategory'] as string,
              PORTDT: record['PortDate']
                ? parseDDMMYYYY(record['PortDate'])
                : null,
              NEWUNQNO: record['NewUnqno'] as string,
              EUIN: record['EUIN'] as string,
              SUBARNCODE: record['Sub Broker ARN Code'] as string,
              EVALID: record['EUIN Valid Indicator'] as string,
              EDECLFLAG:
                record['EUIN Declaration Indicator'] === 'Y' ? true : false,
              ASSETTYPE: record['AssetType'] as string,
              SIPREGDT: record['SIP Regn Date']
                ? parseDDMMYYYY(record['SIP Regn Date'])
                : null,
              TD_SCHEME: record['Scheme'] as string,
              TD_PLAN: record['Plan'] as string,
              INSAMOUNT: record['Insure Amount']
                ? parseFloat(record['Insure Amount'])
                : null,
              BROK_VALU6: record['Agent Code Change request Date']
                ? parseFloat(record['Agent Code Change request Date'])
                : null,
              DIVPER: record['DivPer'] ? parseFloat(record['DivPer']) : null,
              CAN: record['Common Account Number'] as string,
              EXCHORGTR7: record['Exchange OrgTrType'] as string,
              ELECTRXNF8: record['Electronic transaction Flag'] as string,
              SIPREGSLNO: record['sipregslno'] as string,
              CLEARED: record['chequeclearnce'] === 'Y' ? true : false,
              INVSTATE: record['InvestorState'] as string,
              STAMPDUTY: record['Stamp Duty Charges']
                ? parseFloat(record['Stamp Duty Charges'])
                : null,
              FEEDTYPE: record['Feed Type'] as string,
            };

            data.push(dto);
          }
          console.log('Sorting transactions by traded_on date');
          data.sort((a, b) => {
            if (!a.TD_TRD || !b.TD_TRD) return 0; // Handle cases where  TD_TRD might be null
            return new Date(a.TD_TRD).getTime() - new Date(b.TD_TRD).getTime();
          });
          console.log('Sorting completed.');
        } catch (error) {
          console.error('Error while parsing CSV:', error);
        }
        console.log('Parsed XLS data:', data);

        // Process the data after parsing is complete

        const result = [];
        for (const record of data) {
          console.log('data', data);
          // const existingRecord = await this.kfintechTransactionMasterFolioRepo.findOne({ where: { TD_ACNO: record.TD_ACNO } });

          // console.log("jgykvuo", existingRecord)
          // if (existingRecord) {
          //   // Update existing record
          //   Object.assign(existingRecord, record)
          //   await this.kfintechTransactionMasterFolioRepo.save(existingRecord);
          //   result.push(existingRecord)
          // } else {
          // Create new record
          console.log('Entered Here', record);
          const datasaved = await this.kfintechTransactionMasterFolioRepo.save(
            record,
          );
          console.log('Data Saved', datasaved);
          result.push(record);
          console.log('adafdda');
          // }
        }

        return {
          status: 200,
          message: 'File processed successfully',
          result: result,
        };
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unsupported file type',
        };
      }
    } catch (error) {
      console.log('Error:', error);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Error processing file: ' + error.message,
      };
    }
  }

  findAll() {
    return `This action returns all kfintechTransactionMasterFolios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kfintechTransactionMasterFolio`;
  }

  update(
    id: number,
    updateKfintechTransactionMasterFolioDto: UpdateKfintechTransactionMasterFolioDto,
  ) {
    return `This action updates a #${id} kfintechTransactionMasterFolio`;
  }

  remove(id: number) {
    return `This action removes a #${id} kfintechTransactionMasterFolio`;
  }
}

function excelSerialDateToJSDate(serial: number): Date {
  const utc_days = Math.floor(serial - 25569);
  const date = new Date(utc_days * 86400 * 1000);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function convertDateFormat(
  dateString: string,
  fromFormat: string,
  toFormat: string,
): string {
  const dateDelimiter = /[-/.]/; // Handles different delimiters: '-', '/', '.'
  const fromParts = fromFormat.split(dateDelimiter);
  const dateParts = dateString.split(dateDelimiter);

  // Validate format length
  if (fromParts.length !== 3 || dateParts.length !== 3) {
    throw new Error(
      `Invalid date format: ${dateString}. Expected format: ${fromFormat}`,
    );
  }

  const day = dateParts[fromParts.indexOf('DD')];
  const month = dateParts[fromParts.indexOf('MM')];
  const year = dateParts[fromParts.indexOf('YYYY')];

  // Check for valid date components
  if (
    !day ||
    !month ||
    !year ||
    isNaN(Number(day)) ||
    isNaN(Number(month)) ||
    isNaN(Number(year))
  ) {
    throw new Error(`Invalid date components in date: ${dateString}`);
  }

  // Zero-padding for single-digit day or month
  const formattedDay = day.padStart(2, '0');
  const formattedMonth = month.padStart(2, '0');

  return toFormat
    .replace('DD', formattedDay)
    .replace('MM', formattedMonth)
    .replace('YYYY', year);
}

function parseDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day); // month is 0-based
}
