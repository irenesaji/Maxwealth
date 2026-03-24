import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCamsInvestorMasterFolioDto } from './dto/create-cams_investor_master_folio.dto';
import { UpdateCamsInvestorMasterFolioDto } from './dto/update-cams_investor_master_folio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CamsInvestorMasterFolios } from './entities/cams_investor_master_folio.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import * as path from 'path';
import * as Exceljs from 'exceljs';
// import parse from 'csv-parse';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { parse } from 'csv-parse';
import { CreateTransactionReportDto } from './dto/cams-transaction-details.dto';
import { CamsTransactionDetails } from './entities/cams_transaction.entity';

@Injectable()
export class CamsInvestorMasterFoliosService {
  constructor(
    @InjectRepository(CamsInvestorMasterFolios)
    private camsInvestorMasterFoliosrepo: Repository<CamsInvestorMasterFolios>,
    @InjectRepository(CamsTransactionDetails)
    private camsTransactiondetailsRepo: Repository<CamsTransactionDetails>,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
  ) {}

  private cleanCsv(data: string): string {
    return data.replace(/,(?=\S)/g, ' ').replace(/['"]+/g, '"');
  }

  // private async parseCsv(cleanedContent: string): Promise<any[]> {
  //   return new Promise((resolve, reject) => {
  //     parse(cleanedContent, {
  //       columns: true,
  //       skip_empty_lines: true,
  //       trim: true,
  //       relax_column_count: true,
  //       // relax_quotes: true,
  //     }, (err, records) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(records);
  //       }
  //     });
  //   });
  // }

  async investor_reports(filepath: string) {
    // let user = await this.usersRepo.findOne({ where: { id: user_id } })
    const ext = path.extname(filepath).toLowerCase();
    const data: CreateCamsInvestorMasterFolioDto[] = [];
    if (ext === 'xlsx') {
      const workbook = new Exceljs.Workbook();
      await workbook.xlsx.readFile(filepath);
      const worksheet = workbook.worksheets[0];

      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber > 1) {
          const dto: CreateCamsInvestorMasterFolioDto = {
            folio: row.getCell(1).value as string,
            inv_name: row.getCell(2).value as string,
            address1: row.getCell(3).value as string,
            address2: row.getCell(4).value as string,
            address3: row.getCell(5).value as string,
            city: row.getCell(6).value as string,
            pincode: row.getCell(7).value as string,
            product: row.getCell(8).value as string,
            sch_name: row.getCell(9).value as string,
            rep_date: new Date(row.getCell(10).value as string),
            clos_bal: parseFloat(row.getCell(11).value as string),
            rupee_bal: parseFloat(row.getCell(12).value as string),
            jnt_name1: row.getCell(13).value as string,
            jnt_name2: row.getCell(14).value as string,
            phone_off: row.getCell(15).value as string,
            phone_res: row.getCell(16).value as string,
            email: row.getCell(17).value as string,
            holding_nature: row.getCell(18).value as string,
            uin_no: row.getCell(19).value as string,
            pan_no: row.getCell(20).value as string,
            joint1_pan: row.getCell(21).value as string,
            joint2_pan: row.getCell(22).value as string,
            guard_pan: row.getCell(23).value as string,
            tax_status: row.getCell(24).value as string,
            broker_code: row.getCell(25).value as string,
            subbroker: row.getCell(26).value as string,
            reinv_flag: row.getCell(27).value as string,
            bank_name: row.getCell(28).value as string,
            branch: row.getCell(29).value as string,
            ac_type: row.getCell(30).value as string,
            ac_no: row.getCell(31).value as string,
            b_address1: row.getCell(32).value as string,
            b_address2: row.getCell(33).value as string,
            b_address3: row.getCell(34).value as string,
            b_city: row.getCell(35).value as string,
            b_pincode: row.getCell(36).value as string,
            inv_dob: new Date(row.getCell(37).value as string),
            mobile_no: row.getCell(38).value as string,
            occupation: row.getCell(39).value as string,
            inv_iin: row.getCell(40).value as string,
            nom_name: row.getCell(41).value as string,
            relation: row.getCell(42).value as string,
            nom_addr1: row.getCell(43).value as string,
            nom_addr2: row.getCell(44).value as string,
            nom_addr3: row.getCell(45).value as string,
            nom_city: row.getCell(46).value as string,
            nom_state: row.getCell(47).value as string,
            nom_pincode: row.getCell(48).value as string,
            nom_ph_off: row.getCell(49).value as string,
            nom_ph_res: row.getCell(50).value as string,
            nom_email: row.getCell(51).value as string,
            nom_percentage: parseFloat(row.getCell(52).value as string),
            nom2_name: row.getCell(53).value as string,
            nom2_relation: row.getCell(54).value as string,
            nom2_addr1: row.getCell(55).value as string,
            nom2_addr2: row.getCell(56).value as string,
            nom2_addr3: row.getCell(57).value as string,
            nom2_city: row.getCell(58).value as string,
            nom2_state: row.getCell(59).value as string,
            nom2_pincode: row.getCell(60).value as string,
            nom2_ph_off: row.getCell(61).value as string,
            nom2_ph_res: row.getCell(62).value as string,
            nom2_email: row.getCell(63).value as string,
            nom2_percentage: parseFloat(row.getCell(64).value as string),
            nom3_name: row.getCell(65).value as string,
            nom3_relation: row.getCell(66).value as string,
            nom3_addr1: row.getCell(67).value as string,
            nom3_addr2: row.getCell(68).value as string,
            nom3_addr3: row.getCell(69).value as string,
            nom3_city: row.getCell(70).value as string,
            nom3_state: row.getCell(71).value as string,
            nom3_pincode: row.getCell(72).value as string,
            nom3_ph_off: row.getCell(73).value as string,
            nom3_ph_res: row.getCell(74).value as string,
            nom3_email: row.getCell(75).value as string,
            nom3_percentage: parseFloat(row.getCell(76).value as string),
            ifsc_code: row.getCell(77).value as string,
            dp_id: row.getCell(78).value as string,
            demat: row.getCell(79).value as string,
            guard_name: row.getCell(80).value as string,
            brokcode: row.getCell(81).value as string,
            folio_date: new Date(row.getCell(82).value as string),
            aadhaar: row.getCell(83).value as string,
            tpa_linked: row.getCell(84).value as string,
            fh_ckyc_no: row.getCell(85).value as string,
            jh1_ckyc: row.getCell(86).value as string,
            jh2_ckyc: row.getCell(87).value as string,
            g_ckyc_no: row.getCell(88).value as string,
            jh1_dob: new Date(row.getCell(89).value as string),
            jh2_dob: new Date(row.getCell(90).value as string),
            guardian_dob: new Date(row.getCell(91).value as string),
            amc_code: row.getCell(92).value as string,
            gst_state_code: parseInt(row.getCell(93).value as string),
            folio_old: row.getCell(94).value as string,
            scheme_folio_number: row.getCell(95).value as string,
          };
          data.push(dto);
        }
      });
    } else if (ext === '.csv') {
      const fileContent = fs.readFileSync(filepath, 'utf-8');

      try {
        // fileContent = this.cleanCsv(fileContent);
        // fileContent = fileContent.replace(/"/g, '');
        // const cleanedContent = fileContent.split('\n').map(line => line.replace(/,\s*$/, '')).join('\n');
        // const records = await this.parseCsv(cleanedContent);
        // fileContent = fileContent.replace(/"([^"]*)"/g, '$1');
        // fileContent = fileContent.replace(/"(.*?)"/g, (match) => {
        //   // Remove commas inside the quoted content
        //   return match.replace(/,/g, '');
        // });
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

          // const cleanedRecord = {};
          // for (const [key, value] of Object.entries(record)) {
          //   if (value !== '' && value !== null && value !== undefined) {
          //     cleanedRecord[key] = value;
          //   }
          // }

          // console.log('Cleaned Record:', cleanedRecord);
          // const cleanedRecords = record.map(record => {
          //   // Remove empty columns in each row
          //   Object.keys(record).forEach(key => {
          //     if (record[key] === '' || record[key] === null || record[key] === undefined) {
          //       delete record[key];  // Delete columns with empty values
          //     }
          //   });
          //   return record;
          // });
          // console.log('Cleaned Data:', cleanedRecords);

          const dto: CreateCamsInvestorMasterFolioDto = {
            folio: record['FOLIOCHK'] as string,
            inv_name: record['INV_NAME'] as string,
            address1: record['ADDRESS1'] as string,
            address2: record['ADDRESS2'] as string,
            address3: record['ADDRESS3'] as string,
            city: record['CITY'] as string,
            pincode: record['PINCODE'] as string,
            // pincode: record['pincode'] ? parseInt(record['pincode'], 10) : null,
            product: record['PRODUCT'] as string,
            sch_name: record['SCH_NAME'] as string,
            rep_date: record['REP_DATE']
              ? new Date(
                  convertDateFormat(
                    record['REP_DATE'],
                    'DD-MM-YYYY',
                    'YYYY-MM-DD',
                  ),
                )
              : null,
            clos_bal: record['CLOS_BAL']
              ? parseFloat(record['CLOS_BAL'])
              : null,
            rupee_bal: record['RUPEE_BAL']
              ? parseFloat(record['RUPEE_BAL'])
              : null,
            jnt_name1: record['JNT_NAME1'] as string,
            jnt_name2: record['JNT_NAME2'] as string,
            phone_off: record['PHONE_OFF'] as string,
            phone_res: record['PHONE_RES'] as string,
            email: record['EMAIL'] as string,
            holding_nature: record['HOLDING_NATURE'] as string,
            uin_no: record['UIN_NO'] as string,
            pan_no: record['PAN_NO'] as string,
            joint1_pan: record['JOINT1_PAN'] as string,
            joint2_pan: record['JOINT2_PAN'] as string,
            guard_pan: record['GUARD_PAN'] as string,
            tax_status: record['TAX_STATUS'] as string,
            broker_code: record['BROKER_CODE'] as string,
            subbroker: record['SUBBROKER'] as string,
            reinv_flag: record['REINV_FLAG'] as string,
            bank_name: record['BANK_NAME'] as string,
            branch: record['BRANCH'] as string,
            ac_type: record['AC_TYPE'] as string,
            ac_no: record['AC_NO'] as string,
            b_address1: record['B_ADDRESS1'] as string,
            b_address2: record['B_ADDRESS2'] as string,
            b_address3: record['B_ADDRESS3'] as string,
            b_city: record['B_CITY'] as string,
            b_pincode: record['B_PINCODE'] as string,
            // b_pincode: record['b_pincode'] ? parseInt(record['b_pincode'], 10) : null,
            inv_dob: record['INV_DOB']
              ? new Date(
                  convertDateFormat(
                    record['INV_DOB'],
                    'DD-MM-YYYY',
                    'YYYY-MM-DD',
                  ),
                )
              : null,
            mobile_no: record['MOBILE_NO'] as string,
            occupation: record['OCCUPATION'] as string,
            inv_iin: record['INV_IIN'] as string,
            nom_name: record['NOM_NAME'] as string,
            relation: record['RELATION'] as string,
            nom_addr1: record['NOM_ADDR1'] as string,
            nom_addr2: record['NOM_ADDR2'] as string,
            nom_addr3: record['NOM_ADDR3'] as string,
            nom_city: record['NOM_CITY'] as string,
            nom_state: record['NOM_STATE'] as string,
            nom_pincode: record['NOM_PINCODE'] as string,
            // nom_pincode: record['nom_pincode'] ? parseInt(record['nom_pincode'], 10) : null,
            nom_ph_off: record['NOM_PH_OFF'] as string,
            nom_ph_res: record['NOM_PH_RES'] as string,
            nom_email: record['NOM_EMAIL'] as string,
            nom_percentage: record['NOM_PERCENTAGE']
              ? parseFloat(record['NOM_PERCENTAGE'])
              : null,
            nom2_name: record['NOM2_NAME'] as string,
            nom2_relation: record['NOM2_RELATION'] as string,
            nom2_addr1: record['NOM2_ADDR1'] as string,
            nom2_addr2: record['NOM2_ADDR2'] as string,
            nom2_addr3: record['NOM2_ADDR3'] as string,
            nom2_city: record['NOM2_CITY'] as string,
            nom2_state: record['NOM2_STATE'] as string,
            nom2_pincode: record['NOM2_PINCODE'] as string,
            // nom2_pincode: record['nom2_pincode'] ? parseInt(record['nom2_pincode'], 10) : null,
            nom2_ph_off: record['NOM2_PH_OFF'] as string,
            nom2_ph_res: record['NOM2_PH_RES'] as string,
            nom2_email: record['NOM2_EMAIL'] as string,
            nom2_percentage: record['NOM2_PERCENTAGE']
              ? parseFloat(record['NOM2_PERCENTAGE'])
              : null,
            nom3_name: record['NOM3_NAME'] as string,
            nom3_relation: record['NOM3_RELATION'] as string,
            nom3_addr1: record['NOM3_ADDR1'] as string,
            nom3_addr2: record['NOM3_ADDR2'] as string,
            nom3_addr3: record['NOM3_ADDR3'] as string,
            nom3_city: record['NOM3_CITY'] as string,
            nom3_state: record['NOM3_STATE'] as string,
            nom3_pincode: record['NOM3_PINCODE'] as string,
            // nom3_pincode: record['nom3_pincode'] ? parseInt(record['nom3_pincode'], 10) : null,
            nom3_ph_off: record['NOM3_PH_OFF'] as string,
            nom3_ph_res: record['NOM3_PH_RES'] as string,
            nom3_email: record['NOM3_EMAIL'] as string,
            nom3_percentage: record['NOM3_PERCENTAGE']
              ? parseFloat(record['NOM3_PERCENTAGE'])
              : null,
            ifsc_code: record['IFSC_CODE'] as string,
            dp_id: record['DP_ID'] as string,
            demat: record['DEMAT'] as string,
            guard_name: record['GUARD_NAME'] as string,
            brokcode: record['BROKCODE'] as string,
            folio_date: record['FOLIO_DATE']
              ? new Date(
                  convertDateFormat(
                    record['FOLIO_DATE'],
                    'DD-MM-YYYY',
                    'YYYY-MM-DD',
                  ),
                )
              : null,
            aadhaar: record['AADHAAR'] as string,
            tpa_linked: record['TPA_LINKED'] as string,
            fh_ckyc_no: record['FH_CKYC_NO'] as string,
            jh1_ckyc: record['JH1_CKYC'] as string,
            jh2_ckyc: record['JH2_CKYC'] as string,
            g_ckyc_no: record['G_CKYC_NO'] as string,
            jh1_dob: record['JH1_DOB']
              ? new Date(
                  convertDateFormat(
                    record['JH1_DOB'],
                    'DD-MM-YYYY',
                    'YYYY-MM-DD',
                  ),
                )
              : null,
            jh2_dob: record['JH2_DOB']
              ? new Date(
                  convertDateFormat(
                    record['JH2_DOB'],
                    'DD-MM-YYYY',
                    'YYYY-MM-DD',
                  ),
                )
              : null,
            guardian_dob: record['GUARDIAN_DOB']
              ? new Date(
                  convertDateFormat(
                    record['GUARDIAN_DOB'],
                    'DD-MM-YYYY',
                    'YYYY-MM-DD',
                  ),
                )
              : null,
            amc_code: record['AMC_CODE'] as string,
            gst_state_code: record['GST_STATE_CODE']
              ? parseInt(record['GST_STATE_CODE'], 10)
              : null,
            folio_old: record['FOLIO_OLD'] as string,
            scheme_folio_number: record['SCHEME_FOLIO_NUMBER'] as string,
          };

          data.push(dto);
        }

        console.log('Parsed CSV data:', data);
      } catch (error) {
        console.error('Error while parsing CSV:', error);
      }
      //     }else if (ext === '.csv') {
      //       let fileContent = fs.readFileSync(filepath, 'utf-8');
      // fileContent = this.cleanCsv(fileContent);
      // fileContent = fileContent.replace(/"/g, '');  // Remove all quotes

      // let parser = require('csv-parse');

      // parser = parse(fileContent, {
      //   columns: true,            // Use first row as column headers
      //   skip_empty_lines: true,    // Skip empty rows
      //   trim: true,                // Trim spaces around fields
      //   relax_quotes: true,        // Relax the quoting rules
      //   relax_column_count: true,  // Handle rows with different column lengths
      // });

      // (async () => {
      //   try {
      //     const data = [];
      //     let rowCount = 0;

      //     for await (const record of parser) {
      //       if (rowCount === 0) {
      //         console.log('CSV Headers:', Object.keys(record));  // Log CSV headers
      //       }
      //       console.log('Sample Record:', record);  // Log a few rows of the raw CSV data
      //       rowCount++;
      //       if (rowCount > 5) break;  // Stop after logging a few rows

      //       // Clean the record by removing any empty or undefined values
      //       const cleanedRecord = {};
      //       for (const [key, value] of Object.entries(record)) {
      //         if (value !== '' && value !== null && value !== undefined) {
      //           cleanedRecord[key] = value;
      //         }
      //       }

      //       // Log cleaned record
      //       console.log('Cleaned Record:', cleanedRecord);

      //       // Map fields to DTO
      //       const dto: CreateCamsInvestorMasterFolioDto = {
      //         folio: cleanedRecord['FOLIOCHK'],
      //         inv_name: cleanedRecord['INV_NAME'],
      //         address1: cleanedRecord['ADDRESS1'],
      //         address2: cleanedRecord['ADDRESS2'],
      //         address3: cleanedRecord['ADDRESS3'],
      //         city: cleanedRecord['CITY'],
      //         pincode: cleanedRecord['PINCODE'],
      //         product: cleanedRecord['PRODUCT'],
      //         sch_name: cleanedRecord['SCH_NAME'],
      //         rep_date: cleanedRecord['rep_date'] ? new Date(cleanedRecord['rep_date']) : null,
      //         clos_bal: cleanedRecord['clos_bal'] ? parseFloat(cleanedRecord['clos_bal']) : null,
      //         rupee_bal: cleanedRecord['rupee_bal'] ? parseFloat(cleanedRecord['rupee_bal']) : null,
      //         jnt_name1: cleanedRecord['jnt_name1'],
      //         jnt_name2: cleanedRecord['jnt_name2'],
      //         phone_off: cleanedRecord['phone_off'],
      //         phone_res: cleanedRecord['phone_res'],
      //         email: cleanedRecord['email'],
      //         holding_nature: cleanedRecord['holding_nature'],
      //         uin_no: cleanedRecord['uin_no'],
      //         pan_no: cleanedRecord['pan_no'],
      //         joint1_pan: cleanedRecord['joint1_pan'],
      //         joint2_pan: cleanedRecord['joint2_pan'],
      //         guard_pan: cleanedRecord['guard_pan'],
      //         tax_status: cleanedRecord['tax_status'],
      //         broker_code: cleanedRecord['broker_code'],
      //         subbroker: cleanedRecord['subbroker'],
      //         reinv_flag: cleanedRecord['reinv_flag'],
      //         bank_name: cleanedRecord['bank_name'],
      //         branch: cleanedRecord['branch'],
      //         ac_type: cleanedRecord['ac_type'],
      //         ac_no: cleanedRecord['ac_no'],
      //         b_address1: cleanedRecord['b_address1'],
      //         b_address2: cleanedRecord['b_address2'],
      //         b_address3: cleanedRecord['b_address3'],
      //         b_city: cleanedRecord['b_city'],
      //         b_pincode: cleanedRecord['b_pincode'] ,
      //         inv_dob: cleanedRecord['inv_dob'] ? new Date(cleanedRecord['inv_dob']) : null,
      //         mobile_no: cleanedRecord['mobile_no'],
      //         occupation: cleanedRecord['occupation'],
      //         inv_iin: cleanedRecord['inv_iin'],
      //         nom_name: cleanedRecord['nom_name'],
      //         relation: cleanedRecord['relation'],
      //         nom_addr1: cleanedRecord['nom_addr1'],
      //         nom_addr2: cleanedRecord['nom_addr2'],
      //         nom_addr3: cleanedRecord['nom_addr3'],
      //         nom_city: cleanedRecord['nom_city'],
      //         nom_state: cleanedRecord['nom_state'],
      //         nom_pincode: cleanedRecord['nom_pincode'] ,
      //         nom_ph_off: cleanedRecord['nom_ph_off'],
      //         nom_ph_res: cleanedRecord['nom_ph_res'],
      //         nom_email: cleanedRecord['nom_email'],
      //         nom_percentage: cleanedRecord['nom_percentage'] ? parseFloat(cleanedRecord['nom_percentage']) : null,
      //         nom2_name: cleanedRecord['nom2_name'] as string,
      //               nom2_relation: cleanedRecord['nom2_relation'] as string,
      //               nom2_addr1: cleanedRecord['nom2_addr1'] as string,
      //               nom2_addr2: cleanedRecord['nom2_addr2'] as string,
      //               nom2_addr3: cleanedRecord['nom2_addr3'] as string,
      //               nom2_city: cleanedRecord['nom2_city'] as string,
      //               nom2_state: cleanedRecord['nom2_state'] as string,
      //               nom2_pincode: cleanedRecord['nom2_pincode'] as string,
      //               // nom2_pincode: cleanedRecord['nom2_pincode'] ? parseInt(cleanedRecord['nom2_pincode'], 10) : null,
      //               nom2_ph_off: cleanedRecord['nom2_ph_off'] as string,
      //               nom2_ph_res: cleanedRecord['nom2_ph_res'] as string,
      //               nom2_email: cleanedRecord['nom2_email'] as string,
      //               nom2_percentage: cleanedRecord['nom2_percentage'] ? parseFloat(cleanedRecord['nom2_percentage']) : null,
      //               nom3_name: cleanedRecord['nom3_name'] as string,
      //               nom3_relation: cleanedRecord['nom3_relation'] as string,
      //               nom3_addr1: cleanedRecord['nom3_addr1'] as string,
      //               nom3_addr2: cleanedRecord['nom3_addr2'] as string,
      //               nom3_addr3: cleanedRecord['nom3_addr3'] as string,
      //               nom3_city: cleanedRecord['nom3_city'] as string,
      //               nom3_state: cleanedRecord['nom3_state'] as string,
      //               nom3_pincode: cleanedRecord['nom3_pincode'] as string,
      //               // nom3_pincode: cleanedRecord['nom3_pincode'] ? parseInt(cleanedRecord['nom3_pincode'], 10) : null,
      //               nom3_ph_off: cleanedRecord['nom3_ph_off'] as string,
      //               nom3_ph_res: cleanedRecord['nom3_ph_res'] as string,
      //               nom3_email: cleanedRecord['nom3_email'] as string,
      //               nom3_percentage: cleanedRecord['nom3_percentage'] ? parseFloat(cleanedRecord['nom3_percentage']) : null,
      //               ifsc_code: cleanedRecord['ifsc_code'] as string,
      //               dp_id: cleanedRecord['dp_id'] as string,
      //               demat: cleanedRecord['demat'] as string,
      //               guard_name: cleanedRecord['guard_name'] as string,
      //               brokcode: cleanedRecord['brokcode'] as string,
      //               folio_date: cleanedRecord['folio_date'] ? new Date(cleanedRecord['folio_date']) : null,
      //               aadhaar: cleanedRecord['aadhaar'] as string,
      //               tpa_linked: cleanedRecord['tpa_linked'] as string,
      //               fh_ckyc_no: cleanedRecord['fh_ckyc_no'] as string,
      //               jh1_ckyc: cleanedRecord['jh1_ckyc'] as string,
      //               jh2_ckyc: cleanedRecord['jh2_ckyc'] as string,
      //               g_ckyc_no: cleanedRecord['g_ckyc_no'] as string,
      //               jh1_dob: cleanedRecord['jh1_dob'] ? new Date(cleanedRecord['jh1_dob']) : null,
      //               jh2_dob: cleanedRecord['jh2_dob'] ? new Date(cleanedRecord['jh2_dob']) : null,
      //               guardian_dob: cleanedRecord['guardian_dob'] ? new Date(cleanedRecord['guardian_dob']) : null,
      //               amc_code: cleanedRecord['amc_code'] as string,
      //               gst_state_code: cleanedRecord['gst_state_code'] ? parseInt(cleanedRecord['gst_state_code'], 10) : null,
      //               folio_old: cleanedRecord['folio_old'] as string,
      //               scheme_folio_number: cleanedRecord['scheme_folio_number'] as string,
      //       };

      //       data.push(dto);
      //     }

      //     // Log the parsed data
      //     console.log('Parsed CSV data:', data);
      //   } catch (error) {
      //     console.error('Error while parsing CSV:', error);
      //   }
      // })();
    } else if (ext === '.xls') {
      const data = [];
      const workbook = XLSX.readFile(filepath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      jsonData.forEach((record: any) => {
        const dto: CreateCamsInvestorMasterFolioDto = {
          folio: record['folio'] as string,
          inv_name: record['inv_name'] as string,
          address1: record['address1'] as string,
          address2: record['address2'] as string,
          address3: record['address3'] as string,
          city: record['city'] as string,
          pincode: record['pincode'] as string,
          product: record['product'] as string,
          sch_name: record['sch_name'] as string,
          rep_date: record['rep_date']
            ? excelSerialDateToJSDate(record['rep_date'])
            : null,
          clos_bal: record['clos_bal'] ? parseFloat(record['clos_bal']) : null,
          rupee_bal: record['rupee_bal']
            ? parseFloat(record['rupee_bal'])
            : null,
          jnt_name1: record['jnt_name1'] as string,
          jnt_name2: record['jnt_name2'] as string,
          phone_off: record['phone_off'] as string,
          phone_res: record['phone_res'] as string,
          email: record['email'] as string,
          holding_nature: record['holding_nature'] as string,
          uin_no: record['uin_no'] as string,
          pan_no: record['pan_no'] as string,
          joint1_pan: record['joint1_pan'] as string,
          joint2_pan: record['joint2_pan'] as string,
          guard_pan: record['guard_pan'] as string,
          tax_status: record['tax_status'] as string,
          broker_code: record['broker_code'] as string,
          subbroker: record['subbroker'] as string,
          reinv_flag: record['reinv_flag'] as string,
          bank_name: record['bank_name'] as string,
          branch: record['branch'] as string,
          ac_type: record['ac_type'] as string,
          ac_no: record['ac_no'] as string,
          b_address1: record['b_address1'] as string,
          b_address2: record['b_address2'] as string,
          b_address3: record['b_address3'] as string,
          b_city: record['b_city'] as string,
          b_pincode: record['b_pincode'] as string,
          inv_dob: record['inv_dob']
            ? excelSerialDateToJSDate(record['inv_dob'])
            : null,
          mobile_no: record['mobile_no'] as string,
          occupation: record['occupation'] as string,
          inv_iin: record['inv_iin'] as string,
          nom_name: record['nom_name'] as string,
          relation: record['relation'] as string,
          nom_addr1: record['nom_addr1'] as string,
          nom_addr2: record['nom_addr2'] as string,
          nom_addr3: record['nom_addr3'] as string,
          nom_city: record['nom_city'] as string,
          nom_state: record['nom_state'] as string,
          nom_pincode: record['nom_pincode'] as string,
          nom_ph_off: record['nom_ph_off'] as string,
          nom_ph_res: record['nom_ph_res'] as string,
          nom_email: record['nom_email'] as string,
          nom_percentage: record['nom_percentage']
            ? parseFloat(record['nom_percentage'])
            : null,
          nom2_name: record['nom2_name'] as string,
          nom2_relation: record['nom2_relation'] as string,
          nom2_addr1: record['nom2_addr1'] as string,
          nom2_addr2: record['nom2_addr2'] as string,
          nom2_addr3: record['nom2_addr3'] as string,
          nom2_city: record['nom2_city'] as string,
          nom2_state: record['nom2_state'] as string,
          nom2_pincode: record['nom2_pincode'] as string,
          nom2_ph_off: record['nom2_ph_off'] as string,
          nom2_ph_res: record['nom2_ph_res'] as string,
          nom2_email: record['nom2_email'] as string,
          nom2_percentage: record['nom2_percentage']
            ? parseFloat(record['nom2_percentage'])
            : null,
          nom3_name: record['nom3_name'] as string,
          nom3_relation: record['nom3_relation'] as string,
          nom3_addr1: record['nom3_addr1'] as string,
          nom3_addr2: record['nom3_addr2'] as string,
          nom3_addr3: record['nom3_addr3'] as string,
          nom3_city: record['nom3_city'] as string,
          nom3_state: record['nom3_state'] as string,
          nom3_pincode: record['nom3_pincode'] as string,
          nom3_ph_off: record['nom3_ph_off'] as string,
          nom3_ph_res: record['nom3_ph_res'] as string,
          nom3_email: record['nom3_email'] as string,
          nom3_percentage: record['nom3_percentage']
            ? parseFloat(record['nom3_percentage'])
            : null,
          ifsc_code: record['ifsc_code'] as string,
          dp_id: record['dp_id'] as string,
          demat: record['demat'] as string,
          guard_name: record['guard_name'] as string,
          brokcode: record['brokcode'] as string,
          folio_date: record['folio_date']
            ? excelSerialDateToJSDate(record['folio_date'])
            : null,
          aadhaar: record['aadhaar'] as string,
          tpa_linked: record['tpa_linked'] as string,
          fh_ckyc_no: record['fh_ckyc_no'] as string,
          jh1_ckyc: record['jh1_ckyc'] as string,
          jh2_ckyc: record['jh2_ckyc'] as string,
          g_ckyc_no: record['g_ckyc_no'] as string,
          jh1_dob: record['jh1_dob']
            ? excelSerialDateToJSDate(record['jh1_dob'])
            : null,
          jh2_dob: record['jh2_dob']
            ? excelSerialDateToJSDate(record['jh2_dob'])
            : null,
          guardian_dob: record['guardian_dob']
            ? excelSerialDateToJSDate(record['guardian_dob'])
            : null,
          amc_code: record['amc_code'] as string,
          gst_state_code: record['gst_state_code']
            ? parseInt(record['gst_state_code'], 10)
            : null,
          folio_old: record['folio_old'] as string,
          scheme_folio_number: record['scheme_folio_number'] as string,
        };

        data.push(dto);
      });

      console.log('Parsed XLS data:', data);
    } else {
      return { status: HttpStatus.BAD_REQUEST, error: 'Unsupported file type' };
    }
    const result = [];
    for (const record of data) {
      console.log('data', data);
      // const existingRecord = await this.camsInvestorMasterFoliosrepo.findOne({ where: { folio: record.folio } });
      // console.log("jgykvuo", existingRecord)
      // if (existingRecord) {
      //   Object.assign(existingRecord, record)
      //   await this.camsInvestorMasterFoliosrepo.save(existingRecord);
      //   result.push(existingRecord)
      // } else {

      await this.camsInvestorMasterFoliosrepo.save(record);
      result.push(record);
      // }
    }
    console.log('ALL DATA Addeds');
    return {
      status: 200,
      message: 'File processed successfully',
      result: result,
    };
  }

  async transaction_reports(filepath: string) {
    // let user = await this.usersRepo.findOne({ where: { id: user_id } })
    const ext = path.extname(filepath).toLowerCase();
    const data: CreateTransactionReportDto[] = [];

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
        //   if (rowCount === 0) {
        //     console.log('CSV Headers:', Object.keys(record));
        //   }
        //   console.log('Sample Record:', record);
        //   rowCount++;
        //   if (rowCount > 5) break

        const dto: CreateTransactionReportDto = {
          amc_code: record['AMC_CODE'] as string,
          folio_no: record['FOLIO_NO'] as string,
          prod_code: record['PRODCODE'] as string,
          scheme: record['SCHEME'] as string,
          inv_name: record['INV_NAME'] as string,
          trxn_type: record['TRXNTYPE'] as string,
          trxn_no: record['TRXNNO'] as string,
          trxn_mode: record['TRXNMODE'] as string,
          trxn_stat: record['TRXNSTAT'] as string,
          user_code: record['USERCODE'] as string,
          usr_trx_no: record['USRTRXNO'] as string,
          trad_date: record['TRADDATE'] ? new Date(record['TRADDATE']) : null,
          post_date: record['POSTDATE'] ? new Date(record['POSTDATE']) : null,
          pur_price: record['PURPRICE'] ? parseFloat(record['PURPRICE']) : null,
          units: record['UNITS'] ? parseFloat(record['UNITS']) : null,
          amount: record['AMOUNT'] ? parseFloat(record['AMOUNT']) : null,
          brok_code: record['BROKCODE'] as string,
          sub_brok: record['SUBBROK'] as string,
          brok_perc: record['BROKPERC'] ? parseFloat(record['BROKPERC']) : null,
          brok_comm: record['BROKCOMM'] ? parseFloat(record['BROKCOMM']) : null,
          alt_folio: record['ALTFOLIO'] as string,
          rep_date: record['REP_DATE'] ? new Date(record['REP_DATE']) : null,
          time1: record['TIME1'] as string,
          trxn_sub_typ: record['TRXNSUBTYP'] as string,
          applicatio: record['APPLICATIO'] as string,
          trxn_natur: record['TRXN_NATUR'] as string,
          tax: record['TAX'] ? parseFloat(record['TAX']) : null,
          total_tax: record['TOTAL_TAX']
            ? parseFloat(record['TOTAL_TAX'])
            : null,
          te15h: record['TE_15H'] as string,
          micr_no: record['MICR_NO'] as string,
          remarks: record['REMARKS'] as string,
          sw_flag: record['SWFLAG'] as string,
          old_folio: record['OLD_FOLIO'] as string,
          seq_no: record['SEQ_NO'] ? parseInt(record['SEQ_NO'], 10) : null,
          reinvest_f: record['REINVEST_F'] as string,
          mult_brok: record['MULT_BROK'] as string,
          stt: record['STT'] ? parseFloat(record['STT']) : null,
          location: record['LOCATION'] as string,
          scheme_typ: record['SCHEME_TYP'] as string,
          tax_status: record['TAX_STATUS'] as string,
          load: record['LOAD'] ? parseFloat(record['LOAD']) : null,
          scan_ref_no: record['SCANREFNO'] as string,
          pan: record['PAN'] as string,
          inv_iin: record['INV_IIN'] as string,
          targ_src_s: record['TARG_SRC_S'] as string,
          trxn_type_: record['TRXN_TYPE_'] as string,
          ticob_trty: record['TICOB_TRTY'] as string,
          ticob_trno: record['TICOB_TRNO'] as string,
          ticob_post: record['TICOB_POST']
            ? new Date(record['TICOB_POST'])
            : null,
          dp_id: record['DP_ID'] as string,
          trxn_charg: record['TRXN_CHARG']
            ? parseFloat(record['TRXN_CHARG'])
            : null,
          eligib_amt: record['ELIGIB_AMT']
            ? parseFloat(record['ELIGIB_AMT'])
            : null,
          src_of_txn: record['SRC_OF_TXN'] as string,
          trxn_suffi: record['TRXN_SUFFI'] as string,
          sip_trxn_no: record['SIPTRXNNO'] as string,
          ter_locati: record['TER_LOCATI'] as string,
          euin: record['EUIN'] as string,
          euin_valid: record['EUIN_VALID'] === 'true',
          euin_opted: record['EUIN_OPTED'] === 'true',
          sub_brk_ar: record['SUB_BRK_AR'] as string,
          exch_dc_fl: record['EXCH_DC_FL'] as string,
          src_brk_co: record['SRC_BRK_CO'] as string,
          sys_regn_d: record['SYS_REGN_D']
            ? new Date(record['SYS_REGN_D'])
            : null,
          ac_no: record['AC_NO'] as string,
          bank_name: record['BANK_NAME'] as string,
          reversal_c: record['REVERSAL_C'] as string,
          exchange_f: record['EXCHANGE_F'] as string,
          ca_initiat: record['CA_INITIAT'] as string,
          gst_state_: record['GST_STATE_'] as string,
          igst_amount: record['IGST_AMOUN']
            ? parseFloat(record['IGST_AMOUN'])
            : null,
          cgst_amount: record['CGST_AMOUN']
            ? parseFloat(record['CGST_AMOUN'])
            : null,
          sgst_amount: record['SGST_AMOUN']
            ? parseFloat(record['SGST_AMOUN'])
            : null,
          rev_remark: record['REV_REMARK'] as string,
          original_t: record['ORIGINAL_T'] as string,
          stamp_duty: record['STAMP_DUTY']
            ? parseFloat(record['STAMP_DUTY'])
            : null,
          folio_old: record['FOLIO_OLD'] as string,
          scheme_fol: record['SCHEME_FOL'] as string,
          amc_ref_no: record['AMC_REF_NO'] as string,
          request_re: record['REQUEST_RE'] as string,
        };
        data.push(dto);
      }
      console.log('Sorting transactions by traded_on date');
      data.sort((a, b) => {
        if (!a.trad_date || !b.trad_date) return 0; // Handle cases where trad_date might be null
        return (
          new Date(a.trad_date).getTime() - new Date(b.trad_date).getTime()
        );
      });
      console.log('Sorting completed.');

      console.log('Sorted and Parsed CSV data:', data);
    } catch (error) {
      console.error('Error while parsing CSV:', error);
    }
    const result = [];
    for (const record of data) {
      console.log('data', data);
      // const existingRecord = await this.camsTransactiondetailsRepo.findOne({ where: { folio_no: record.folio_no } });
      // console.log("jgykvuo", existingRecord)
      // if (existingRecord) {
      //   Object.assign(existingRecord, record)
      //   await this.camsTransactiondetailsRepo.save(existingRecord);
      //   result.push(existingRecord)
      // } else {

      await this.camsTransactiondetailsRepo.save(record);
      result.push(record);
      // }
    }
    return {
      status: 200,
      message: 'File processed successfully',
      result: result,
    };
  }

  findAll() {
    return `This action returns all camsInvestorMasterFolios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} camsInvestorMasterFolio`;
  }

  update(
    id: number,
    updateCamsInvestorMasterFolioDto: UpdateCamsInvestorMasterFolioDto,
  ) {
    return `This action updates a #${id} camsInvestorMasterFolio`;
  }

  remove(id: number) {
    return `This action removes a #${id} camsInvestorMasterFolio`;
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

  // Check for valid date format length
  if (fromParts.length !== 3 || dateParts.length !== 3) {
    throw new Error(
      `Invalid date format: ${dateString}. Expected format: ${fromFormat}`,
    );
  }

  const day = dateParts[fromParts.indexOf('DD')];
  const month = dateParts[fromParts.indexOf('MM')];
  const year = dateParts[fromParts.indexOf('YYYY')];

  // Check for valid date values
  if (!day || !month || !year) {
    throw new Error(`Invalid date components in date: ${dateString}`);
  }

  return toFormat.replace('DD', day).replace('MM', month).replace('YYYY', year);
}
