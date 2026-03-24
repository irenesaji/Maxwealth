import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateKfintechInvestorMasterFolioDto } from './dto/create-kfintech_investor_master_folio.dto';
import { UpdateKfintechInvestorMasterFolioDto } from './dto/update-kfintech_investor_master_folio.dto';
import { KfintechInvestorMasterFolios } from './entities/kfintech_investor_master_folio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import * as path from 'path';
import * as Exceljs from 'exceljs';
import * as fs from 'fs';
// import parse from 'csv-parse';
import * as XLSX from 'xlsx';
import { parse } from 'csv-parse';
import csv from 'csv-parser';

@Injectable()
export class KfintechInvestorMasterFoliosService {
  constructor(
    @InjectRepository(KfintechInvestorMasterFolios)
    private kfintechInvestorMasterFolioRepo: Repository<KfintechInvestorMasterFolios>,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
  ) {}
  async create(filepath: string) {
    // let user = await this.usersRepo.findOne({ where: { id: user_id } })
    // let productCode= await this.kfintechInvestorMasterFolioRepo.findOne({where:{product_code}})
    const ext = path.extname(filepath).toLowerCase();
    const data: CreateKfintechInvestorMasterFolioDto[] = [];

    try {
      if (ext === '.xlsx') {
        console.log('Excel Karvy logic');
        const workbook = new Exceljs.Workbook();
        await workbook.xlsx.readFile(filepath);
        const worksheet = workbook.worksheets[0];
        const data: CreateKfintechInvestorMasterFolioDto[] = [];

        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          if (rowNumber > 1) {
            const dto: CreateKfintechInvestorMasterFolioDto = {
              product_code: row.getCell(1).value as string,
              fund: row.getCell(2).value as string,
              folio: row.getCell(3).value as string,
              fund_description: row.getCell(4).value as string,
              investor_name: row.getCell(5).value as string,
              joint_name_1: row.getCell(6).value as string,
              joint_name_2: row.getCell(7).value as string,
              address_1: row.getCell(8).value as string,
              address_2: row.getCell(9).value as string,
              address_3: row.getCell(10).value as string,
              city: row.getCell(11).value as string,
              pincode: row.getCell(12).value as string,
              state: row.getCell(13).value as string,
              country: row.getCell(14).value as string,
              tpin: row.getCell(15).value as string,
              date_of_birth: new Date(row.getCell(16).value as string),
              f_name: row.getCell(17).value as string,
              m_name: row.getCell(18).value as string,
              phone_residence: row.getCell(19).value as string,
              phone_res_1: row.getCell(20).value as string,
              phone_res_2: row.getCell(21).value as string,
              phone_office: row.getCell(22).value as string,
              phone_off_1: row.getCell(23).value as string,
              phone_off_2: row.getCell(24).value as string,
              fax_residence: row.getCell(25).value as string,
              fax_office: row.getCell(26).value as string,
              tax_status: row.getCell(27).value as string,
              occ_code: parseInt(row.getCell(28).value as string),
              email: row.getCell(29).value as string,
              bank_acc_no: row.getCell(30).value as string,
              bank_name: row.getCell(31).value as string,
              account_type: row.getCell(32).value as string,
              branch: row.getCell(33).value as string,
              bank_address_1: row.getCell(34).value as string,
              bank_address_2: row.getCell(35).value as string,
              bank_address_3: row.getCell(36).value as string,
              bank_city: row.getCell(37).value as string,
              bank_phone: row.getCell(38).value as string,
              bank_state: row.getCell(39).value as string,
              bank_country: row.getCell(40).value as string,
              investor_id: row.getCell(41).value as string,
              broker_code: row.getCell(42).value as string,
              report_date: new Date(row.getCell(43).value as string),
              report_time: row.getCell(44).value as string,
              pan_number: row.getCell(45).value as string,
              mobile_number: row.getCell(46).value as string,
              dividend_option: row.getCell(47).value as string,
              occupation_description: row.getCell(48).value as string,
              mode_of_holding_description: row.getCell(49).value as string,
              mapin_id: row.getCell(50).value as string,
              pan_2: row.getCell(51).value as string,
              pan_3: row.getCell(52).value as string,
              category: parseInt(row.getCell(53).value as string),
              guardian_name: row.getCell(54).value as string,
              nominee: row.getCell(55).value as string,
              client_id: row.getCell(56).value as string,
              dpid: row.getCell(57).value as string,
              category_desc: row.getCell(58).value as string,
              status_desc: row.getCell(59).value as string,
              ifsc_code: row.getCell(60).value as string,
              nominee_2: row.getCell(61).value as string,
              nominee_3: row.getCell(62).value as string,
              kyc_1_flag: row.getCell(63).value as string,
              kyc_2_flag: row.getCell(64).value as string,
              kyc_3_flag: row.getCell(65).value as string,
              guard_pan_no: row.getCell(66).value as string,
              last_updated_date: new Date(row.getCell(67).value as string),
              common_acc_no: row.getCell(68).value as string,
              nominee_relation: row.getCell(69).value as string,
              nominee_2_relation: row.getCell(70).value as string,
              nominee_3_relation: row.getCell(71).value as string,
              nominee_ratio: parseFloat(row.getCell(72).value as string),
              nominee_2_ratio: parseFloat(row.getCell(73).value as string),
              nominee_3_ratio: parseFloat(row.getCell(74).value as string),
              holder_1_aadhaar_info: row.getCell(75).value as string,
              holder_2_aadhaar_info: row.getCell(76).value as string,
              holder_3_aadhaar_info: row.getCell(77).value as string,
              guardian_aadhaar_info: row.getCell(78).value as string,
              nominee_address_1: row.getCell(79).value as string,
              nominee_address_2: row.getCell(80).value as string,
              nominee_address_3: row.getCell(81).value as string,
              nominee_city: row.getCell(82).value as string,
              nominee_state: row.getCell(83).value as string,
              nominee_pincode: row.getCell(84).value as string,
              nominee_phone_residence: row.getCell(85).value as string,
              nominee_email: row.getCell(86).value as string,
              nominee_2_address_1: row.getCell(87).value as string,
              nominee_2_address_2: row.getCell(88).value as string,
              nominee_2_address_3: row.getCell(89).value as string,
              nominee_2_city: row.getCell(90).value as string,
              nominee_2_state: row.getCell(91).value as string,
              nominee_2_pincode: row.getCell(92).value as string,
              nominee_2_phone_residence: row.getCell(93).value as string,
              nominee_2_email: row.getCell(94).value as string,
              nominee_3_address_1: row.getCell(95).value as string,
              nominee_3_address_2: row.getCell(96).value as string,
              nominee_3_address_3: row.getCell(97).value as string,
              nominee_3_city: row.getCell(98).value as string,
              nominee_3_state: row.getCell(99).value as string,
              nominee_3_pincode: row.getCell(100).value as string,
              nominee_3_phone_residence: row.getCell(101).value as string,
              nominee_3_email: row.getCell(102).value as string,
              ckyc_no: row.getCell(103).value as string,
              jh1_ckyc: row.getCell(104).value as string,
              jh2_ckyc: row.getCell(105).value as string,
              guardian_ckyc_no: row.getCell(106).value as string,
              joint_holder_1st_resi_phone_no: row.getCell(107).value as string,
              joint_holder_2nd_resi_phone_no: row.getCell(108).value as string,
              investors_resi_fax_no: row.getCell(109).value as string,
              kyc_g_flag: row.getCell(110).value as string,
              demat_folio_flag: row.getCell(111).value as string,
              nominee_opt_out_flag: row.getCell(112).value as string,
              nominee_dob: new Date(row.getCell(113).value as string),
              joint_holder_1_contact_number: row.getCell(114).value as string,
              joint_holder_1_email_id: row.getCell(115).value as string,
              joint_holder_2_contact_number: row.getCell(116).value as string,
              joint_holder_2_email_id: row.getCell(117).value as string,
              nominee_guardian_name: row.getCell(118).value as string,
              email_concern: row.getCell(119).value as string,
              email_relationship: row.getCell(120).value as string,
              mobile_relationship: row.getCell(121).value as string,
              ubo_flag: row.getCell(122).value as string,
              npo_flag: row.getCell(123).value as string,
            };
            data.push(dto);
          }
        });
      } else if (ext === '.csv') {
        const fileContent = fs.readFileSync(filepath, 'utf-8');
        console.log('CSV Karvy logic');
        try {
          const results = [];
          console.log('try 1');
          // fs.createReadStream(filepath)
          //   .pipe(csv())
          //   .on('data', (data) => results.push(data))
          //   .on('end', () => {
          //     console.log("try 2")
          //     // let rowCount = 0
          //     for (const record of results) {

          //       // if (rowCount === 0) {
          //       //   // console.log('CSV Headers:', Object.keys(record));
          //       // }
          //       console.log('Sample Record:', record);

          //       // if (rowCount > 2) break;
          //       let dto: CreateKfintechInvestorMasterFolioDto = {
          //         product_code: record['Product Code'] as string,
          //         fund: record['Fund'] as string,
          //         folio: record['Folio'] as string,
          //         fund_description: record['Fund Description'] as string,
          //         investor_name: record['Investor Name'] as string,
          //         joint_name_1: record['Joint Name 1'] as string,
          //         joint_name_2: record['Joint Name 2'] as string,
          //         address_1: record['Address #1'] as string,
          //         address_2: record['Address #2'] as string,
          //         address_3: record['Address #3'] as string,
          //         city: record['City'] as string,
          //         pincode: record['Pincode'] as string,
          //         state: record['State'] as string,
          //         country: record['Country'] as string,
          //         tpin: record['TPIN'] as string,
          //         date_of_birth: record['Date of Birth'] ? new Date(convertDateFormat((record['Date of Birth']), 'YYYYMMDD', 'YYYY-MM-DD')) : null,
          //         f_name: record['F Name'] as string,
          //         m_name: record['M Name'] as string,
          //         // branch_transaction_no: record['branch_transaction_no'] ? parseInt(record['branch_transaction_no'], 10) : null,
          //         // transaction_date: record['transaction_date'] ? new Date(record['transaction_date']) : null,
          //         // units: record['units'] ? parseFloat(record['units']) : null,
          //         phone_residence: record['Phone Residence'] as string,
          //         phone_res_1: record['Phone Res#1'] as string,
          //         phone_res_2: record['Phone Res#2'] as string,
          //         phone_office: record['Phone Office'] as string,
          //         phone_off_1: record['Phone Off#1'] as string,
          //         phone_off_2: record['Phone Off#2'] as string,
          //         fax_residence: record['Fax Residence'] as string,
          //         fax_office: record['Fax Office'] as string,
          //         tax_status: record['Tax Status'] as string,
          //         occ_code: record['Occ Code'] ? parseInt(record['Occ Code'], 10) : null,
          //         email: record['Email'] as string,
          //         bank_acc_no: record['BankAccno'] as string,
          //         bank_name: record['Bank Name'] as string,
          //         account_type: record['Account Type'] as string,
          //         branch: record['Branch'] as string,
          //         bank_address_1: record['Bank Address #1'] as string,
          //         bank_address_2: record['Bank Address #2'] as string,
          //         bank_address_3: record['Bank Address #3'] as string,
          //         bank_city: record['Bank City'] as string,
          //         bank_phone: record['Bank Phone'] as string,
          //         bank_state: record['Bank State'] as string,
          //         bank_country: record['Bank Country'] as string,
          //         investor_id: record['Investor ID'] as string,
          //         broker_code: record['Broker Code'] as string,
          //         report_date: record['Report Date'] ? new Date(convertDateFormat(record['Report Date'], 'YYYYMMDD', 'YYYY-MM-DD')) : null,
          //         report_time: record['Report Time'] as string,
          //         pan_number: record['PAN Number'] as string,
          //         mobile_number: record['Mobile Number'] as string,
          //         dividend_option: record['Dividend Option'] as string,
          //         occupation_description: record['Occupation Description'] as string,
          //         mode_of_holding_description: record['Mode of Holding Description'] as string,
          //         mapin_id: record['Mapin Id'] as string,
          //         pan_2: record['PAN2'] as string,
          //         pan_3: record['PAN3'] as string,
          //         category: record['Category'] ? parseInt(record['Category'], 10) : null,
          //         guardian_name: record['GuardianName'] as string,
          //         nominee: record['Nominee'] as string,
          //         client_id: record['Client ID'] as string,
          //         dpid: record['DPID'] as string,
          //         category_desc: record['CategoryDesc'] as string,
          //         status_desc: record['StatusDesc'] as string,
          //         ifsc_code: record['IFSC Code'] as string,
          //         nominee_2: record['Nominee2'] as string,
          //         nominee_3: record['Nominee3'] as string,
          //         kyc_1_flag: record['Kyc1Flag'] as string,
          //         kyc_2_flag: record['Kyc2Flag'] as string,
          //         kyc_3_flag: record['Kyc3Flag'] as string,
          //         guard_pan_no: record['GuardPanNo'] as string,
          //         last_updated_date: record['LastUpdatedDate'] ? new Date(convertDateFormat(record['LastUpdatedDate'], 'YYYYMMDD', 'YYYY-MM-DD')) : null,
          //         common_acc_no: record['CommonAccNo'] as string,
          //         nominee_relation: record['Nominee Relation'] as string,
          //         nominee_2_relation: record['Nominee2 Relation'] as string,
          //         nominee_3_relation: record['Nominee3 Relation'] as string,
          //         nominee_ratio: record['Nominee Ratio'] ? parseInt(record['Nominee Ratio'], 10) : null,
          //         nominee_2_ratio: record['Nominee2 Ratio'] ? parseInt(record['Nominee2 Ratio'], 10) : null,
          //         nominee_3_ratio: record['Nominee3 Ratio'] ? parseInt(record['Nominee3 Ratio'], 10) : null,
          //         holder_1_aadhaar_info: record['Holder 1 Aadhaar info'] as string,
          //         holder_2_aadhaar_info: record['Holder 2 Aadhaar info'] as string,
          //         holder_3_aadhaar_info: record['Holder 3 Aadhaar info'] as string,
          //         guardian_aadhaar_info: record['Guardian Aadhaar info'] as string,
          //         nominee_address_1: record['Nominee Address1'] as string,
          //         nominee_address_2: record['Nominee Address2'] as string,
          //         nominee_address_3: record['Nominee Address3'] as string,
          //         nominee_city: record['Nominee City'] as string,
          //         nominee_state: record['Nominee State'] as string,
          //         nominee_pincode: record['Nominee Pin code'] as string,
          //         nominee_phone_residence: record['Nominee phone residence'] as string,
          //         nominee_email: record['Nominee Email'] as string,
          //         nominee_2_address_1: record['Nominee2 Address1'] as string,
          //         nominee_2_address_2: record['Nominee2 Address2'] as string,
          //         nominee_2_address_3: record['Nominee2 Address3'] as string,
          //         nominee_2_city: record['Nominee2 City'] as string,
          //         nominee_2_state: record['Nominee2 State'] as string,
          //         nominee_2_pincode: record['Nominee2 Pin code'] as string,
          //         nominee_2_phone_residence: record['Nominee2 phone residence'] as string,
          //         nominee_2_email: record['Nominee2 Email'] as string,
          //         nominee_3_address_1: record['Nominee3 Address1'] as string,
          //         nominee_3_address_2: record['Nominee3 Address2'] as string,
          //         nominee_3_address_3: record['Nominee3 Address3'] as string,
          //         nominee_3_city: record['Nominee3 City'] as string,
          //         nominee_3_state: record['Nominee3 State'] as string,
          //         nominee_3_pincode: record['Nominee3 Pin code'] as string,
          //         nominee_3_phone_residence: record['Nominee3 phone residence'] as string,
          //         nominee_3_email: record['Nominee3 Email'] as string,
          //         ckyc_no: record['CKYC NO'] as string,
          //         jh1_ckyc: record['JH1 CKYC'] as string,
          //         jh2_ckyc: record['JH2 CKYC'] as string,
          //         guardian_ckyc_no: record['Guardian CKYC NO'] as string,
          //         joint_holder_1st_resi_phone_no: record['Joint Holder 1st Resi Phone No'] as string,
          //         joint_holder_2nd_resi_phone_no: record['Joint Holder 2nd Resi Phone No'] as string,
          //         investors_resi_fax_no: record['Investors Resi FaxNo'] as string,
          //         kyc_g_flag: record['KycGFlag'] as string,
          //         demat_folio_flag: record['Demat Folio flag'] as string,
          //         nominee_opt_out_flag: record['Nominee Opt Out flag'] as string,
          //         nominee_dob: record['Nominee DOB'] ? new Date(record['Nominee DOB']) : null,
          //         joint_holder_1_contact_number: record['Joint holder 1 contact number'] as string,
          //         joint_holder_1_email_id: record['Joint holder 1 Email id'] as string,
          //         joint_holder_2_contact_number: record['Joint holder 2 contact number'] as string,
          //         joint_holder_2_email_id: record['Joint holder 2 Email id'] as string,
          //         nominee_guardian_name: record['Nominee Guardian Name'] as string,
          //         email_concern: record['emailconcern'] as string,
          //         email_relationship: record['emailrelationship'] as string,
          //         mobile_relationship: record['MobileRelationship'] as string,
          //         ubo_flag: record['UBO Flag'] as string,
          //         npo_flag: record['NPO Flag'] as string,
          //       };

          //       data.push(dto);

          //       // rowCount++;
          //     }
          //     console.log("pushed data", data)

          //   })

          // console.log("Parsed CSV data before:", data);

          const parser = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            // delimiter: '~'
          });
          for await (const record of parser) {
            // let rowCount = 0
            // if (rowCount === 0) {
            //   // console.log('CSV Headers:', Object.keys(record));
            // }
            console.log('Sample Record:', record);
            // rowCount++;
            // if (rowCount > 2) break;
            const dto: CreateKfintechInvestorMasterFolioDto = {
              product_code: record['Product Code'] as string,
              fund: record['Fund'] as string,
              folio: record['Folio'] as string,
              fund_description: record['Fund Description'] as string,
              investor_name: record['Investor Name'] as string,
              joint_name_1: record['Joint Name 1'] as string,
              joint_name_2: record['Joint Name 2'] as string,
              address_1: record['Address #1'] as string,
              address_2: record['Address #2'] as string,
              address_3: record['Address #3'] as string,
              city: record['City'] as string,
              pincode: record['Pincode'] as string,
              state: record['State'] as string,
              country: record['Country'] as string,
              tpin: record['TPIN'] as string,
              date_of_birth: record['Date of Birth']
                ? new Date(
                    convertDateFormat(
                      record['Date of Birth'],
                      'YYYYMMDD',
                      'YYYY-MM-DD',
                    ),
                  )
                : null,
              f_name: record['F Name'] as string,
              m_name: record['M Name'] as string,
              // branch_transaction_no: record['branch_transaction_no'] ? parseInt(record['branch_transaction_no'], 10) : null,
              // transaction_date: record['transaction_date'] ? new Date(record['transaction_date']) : null,
              // units: record['units'] ? parseFloat(record['units']) : null,
              phone_residence: record['Phone Residence'] as string,
              phone_res_1: record['Phone Res#1'] as string,
              phone_res_2: record['Phone Res#2'] as string,
              phone_office: record['Phone Office'] as string,
              phone_off_1: record['Phone Off#1'] as string,
              phone_off_2: record['Phone Off#2'] as string,
              fax_residence: record['Fax Residence'] as string,
              fax_office: record['Fax Office'] as string,
              tax_status: record['Tax Status'] as string,
              occ_code: record['Occ Code']
                ? parseInt(record['Occ Code'], 10)
                : null,
              email: record['Email'] as string,
              bank_acc_no: record['BankAccno'] as string,
              bank_name: record['Bank Name'] as string,
              account_type: record['Account Type'] as string,
              branch: record['Branch'] as string,
              bank_address_1: record['Bank Address #1'] as string,
              bank_address_2: record['Bank Address #2'] as string,
              bank_address_3: record['Bank Address #3'] as string,
              bank_city: record['Bank City'] as string,
              bank_phone: record['Bank Phone'] as string,
              bank_state: record['Bank State'] as string,
              bank_country: record['Bank Country'] as string,
              investor_id: record['Investor ID'] as string,
              broker_code: record['Broker Code'] as string,
              report_date: record['Report Date']
                ? new Date(
                    convertDateFormat(
                      record['Report Date'],
                      'YYYYMMDD',
                      'YYYY-MM-DD',
                    ),
                  )
                : null,
              report_time: record['Report Time'] as string,
              pan_number: record['PAN Number'] as string,
              mobile_number: record['Mobile Number'] as string,
              dividend_option: record['Dividend Option'] as string,
              occupation_description: record[
                'Occupation Description'
              ] as string,
              mode_of_holding_description: record[
                'Mode of Holding Description'
              ] as string,
              mapin_id: record['Mapin Id'] as string,
              pan_2: record['PAN2'] as string,
              pan_3: record['PAN3'] as string,
              category: record['Category']
                ? parseInt(record['Category'], 10)
                : null,
              guardian_name: record['GuardianName'] as string,
              nominee: record['Nominee'] as string,
              client_id: record['Client ID'] as string,
              dpid: record['DPID'] as string,
              category_desc: record['CategoryDesc'] as string,
              status_desc: record['StatusDesc'] as string,
              ifsc_code: record['IFSC Code'] as string,
              nominee_2: record['Nominee2'] as string,
              nominee_3: record['Nominee3'] as string,
              kyc_1_flag: record['Kyc1Flag'] as string,
              kyc_2_flag: record['Kyc2Flag'] as string,
              kyc_3_flag: record['Kyc3Flag'] as string,
              guard_pan_no: record['GuardPanNo'] as string,
              last_updated_date: record['LastUpdatedDate']
                ? new Date(
                    convertDateFormat(
                      record['LastUpdatedDate'],
                      'YYYYMMDD',
                      'YYYY-MM-DD',
                    ),
                  )
                : null,
              common_acc_no: record['CommonAccNo'] as string,
              nominee_relation: record['Nominee Relation'] as string,
              nominee_2_relation: record['Nominee2 Relation'] as string,
              nominee_3_relation: record['Nominee3 Relation'] as string,
              nominee_ratio: record['Nominee Ratio']
                ? parseInt(record['Nominee Ratio'], 10)
                : null,
              nominee_2_ratio: record['Nominee2 Ratio']
                ? parseInt(record['Nominee2 Ratio'], 10)
                : null,
              nominee_3_ratio: record['Nominee3 Ratio']
                ? parseInt(record['Nominee3 Ratio'], 10)
                : null,
              holder_1_aadhaar_info: record['Holder 1 Aadhaar info'] as string,
              holder_2_aadhaar_info: record['Holder 2 Aadhaar info'] as string,
              holder_3_aadhaar_info: record['Holder 3 Aadhaar info'] as string,
              guardian_aadhaar_info: record['Guardian Aadhaar info'] as string,
              nominee_address_1: record['Nominee Address1'] as string,
              nominee_address_2: record['Nominee Address2'] as string,
              nominee_address_3: record['Nominee Address3'] as string,
              nominee_city: record['Nominee City'] as string,
              nominee_state: record['Nominee State'] as string,
              nominee_pincode: record['Nominee Pin code'] as string,
              nominee_phone_residence: record[
                'Nominee phone residence'
              ] as string,
              nominee_email: record['Nominee Email'] as string,
              nominee_2_address_1: record['Nominee2 Address1'] as string,
              nominee_2_address_2: record['Nominee2 Address2'] as string,
              nominee_2_address_3: record['Nominee2 Address3'] as string,
              nominee_2_city: record['Nominee2 City'] as string,
              nominee_2_state: record['Nominee2 State'] as string,
              nominee_2_pincode: record['Nominee2 Pin code'] as string,
              nominee_2_phone_residence: record[
                'Nominee2 phone residence'
              ] as string,
              nominee_2_email: record['Nominee2 Email'] as string,
              nominee_3_address_1: record['Nominee3 Address1'] as string,
              nominee_3_address_2: record['Nominee3 Address2'] as string,
              nominee_3_address_3: record['Nominee3 Address3'] as string,
              nominee_3_city: record['Nominee3 City'] as string,
              nominee_3_state: record['Nominee3 State'] as string,
              nominee_3_pincode: record['Nominee3 Pin code'] as string,
              nominee_3_phone_residence: record[
                'Nominee3 phone residence'
              ] as string,
              nominee_3_email: record['Nominee3 Email'] as string,
              ckyc_no: record['CKYC NO'] as string,
              jh1_ckyc: record['JH1 CKYC'] as string,
              jh2_ckyc: record['JH2 CKYC'] as string,
              guardian_ckyc_no: record['Guardian CKYC NO'] as string,
              joint_holder_1st_resi_phone_no: record[
                'Joint Holder 1st Resi Phone No'
              ] as string,
              joint_holder_2nd_resi_phone_no: record[
                'Joint Holder 2nd Resi Phone No'
              ] as string,
              investors_resi_fax_no: record['Investors Resi FaxNo'] as string,
              kyc_g_flag: record['KycGFlag'] as string,
              demat_folio_flag: record['Demat Folio flag'] as string,
              nominee_opt_out_flag: record['Nominee Opt Out flag'] as string,
              nominee_dob: record['Nominee DOB']
                ? new Date(record['Nominee DOB'])
                : null,
              joint_holder_1_contact_number: record[
                'Joint holder 1 contact number'
              ] as string,
              joint_holder_1_email_id: record[
                'Joint holder 1 Email id'
              ] as string,
              joint_holder_2_contact_number: record[
                'Joint holder 2 contact number'
              ] as string,
              joint_holder_2_email_id: record[
                'Joint holder 2 Email id'
              ] as string,
              nominee_guardian_name: record['Nominee Guardian Name'] as string,
              email_concern: record['emailconcern'] as string,
              email_relationship: record['emailrelationship'] as string,
              mobile_relationship: record['MobileRelationship'] as string,
              ubo_flag: record['UBO Flag'] as string,
              npo_flag: record['NPO Flag'] as string,
            };

            data.push(dto);
          }
          console.log('pushed data', data);

          console.log('Parsed xCSV data:', data);
        } catch (error) {
          console.error('Error while parsing CSV:', error);
        }
      } else if (ext === '.xls') {
        // let data = []
        const workbook = XLSX.readFile(filepath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // console.log(worksheet)
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        jsonData.forEach((record: any) => {
          const dto: CreateKfintechInvestorMasterFolioDto = {
            product_code: record['product_code'] as string,
            fund: record['fund'] as string,
            folio: record['folio'] as string,
            fund_description: record['fund_description'] as string,
            investor_name: record['investor_name'] as string,
            joint_name_1: record['joint_name_1'] as string,
            joint_name_2: record['joint_name_2'] as string,
            address_1: record['address_1'] as string,
            address_2: record['address_2'] as string,
            address_3: record['address_3'] as string,
            city: record['city'] as string,
            pincode: record['pincode'] as string,
            state: record['state'] as string,
            country: record['country'] as string,
            tpin: record['tpin'] as string,
            date_of_birth: record['date_of_birth']
              ? new Date(record['transaction_date'])
              : null,
            f_name: record['f_name'] as string,
            m_name: record['m_name'] as string,
            // branch_transaction_no: record['branch_transaction_no'] ? parseInt(record['branch_transaction_no'], 10) : null,
            // transaction_date: record['transaction_date'] ? new Date(record['transaction_date']) : null,
            // units: record['units'] ? parseFloat(record['units']) : null,
            phone_residence: record['phone_residence'] as string,
            phone_res_1: record['phone_res_1'] as string,
            phone_res_2: record['phone_res_2'] as string,
            phone_office: record['phone_office'] as string,
            phone_off_1: record['phone_off_1'] as string,
            phone_off_2: record['phone_off_2'] as string,
            fax_residence: record['fax_residence'] as string,
            fax_office: record['fax_office'] as string,
            tax_status: record['tax_status'] as string,
            occ_code: record['occ_code']
              ? parseInt(record['occ_code'], 10)
              : null,
            email: record['email'] as string,
            bank_acc_no: record['bank_acc_no'] as string,
            bank_name: record['bank_name'] as string,
            account_type: record['account_type'] as string,
            branch: record['branch'] as string,
            bank_address_1: record['bank_address_1'] as string,
            bank_address_2: record['bank_address_2'] as string,
            bank_address_3: record['bank_address_3'] as string,
            bank_city: record['bank_city'] as string,
            bank_phone: record['bank_phone'] as string,
            bank_state: record['bank_state'] as string,
            bank_country: record['bank_country'] as string,
            investor_id: record['investor_id'] as string,
            broker_code: record['broker_code'] as string,
            report_date: record['report_date']
              ? new Date(record['report_date'])
              : null,
            report_time: record['report_time'] as string,
            pan_number: record['pan_number'] as string,
            mobile_number: record['mobile_number'] as string,
            dividend_option: record['dividend_option'] as string,
            occupation_description: record['occupation_description'] as string,
            mode_of_holding_description: record[
              'mode_of_holding_description'
            ] as string,
            mapin_id: record['mapin_id'] as string,
            pan_2: record['pan_2'] as string,
            pan_3: record['pan_3'] as string,
            category: record['category']
              ? parseInt(record['category'], 10)
              : null,
            guardian_name: record['guardian_name'] as string,
            nominee: record['nominee'] as string,
            client_id: record['client_id'] as string,
            dpid: record['dpid'] as string,
            category_desc: record['category_desc'] as string,
            status_desc: record['status_desc'] as string,
            ifsc_code: record['ifsc_code'] as string,
            nominee_2: record['nominee_2'] as string,
            nominee_3: record['nominee_3'] as string,
            kyc_1_flag: record['kyc_1_flag'] as string,
            kyc_2_flag: record['kyc_2_flag'] as string,
            kyc_3_flag: record['kyc_3_flag'] as string,
            guard_pan_no: record['guard_pan_no'] as string,
            last_updated_date: record['last_updated_date']
              ? new Date(record['last_updated_date'])
              : null,
            common_acc_no: record['common_acc_no'] as string,
            nominee_relation: record['nominee_relation'] as string,
            nominee_2_relation: record['nominee_2_relation'] as string,
            nominee_3_relation: record['nominee_3_relation'] as string,
            nominee_ratio: record['nominee_ratio']
              ? parseInt(record['nominee_ratio'], 10)
              : null,
            nominee_2_ratio: record['nominee_2_ratio']
              ? parseInt(record['nominee_2_ratio'], 10)
              : null,
            nominee_3_ratio: record['nominee_3_ratio']
              ? parseInt(record['nominee_3_ratio'], 10)
              : null,
            holder_1_aadhaar_info: record['holder_1_aadhaar_info'] as string,
            holder_2_aadhaar_info: record['holder_2_aadhaar_info'] as string,
            holder_3_aadhaar_info: record['holder_3_aadhaar_info'] as string,
            guardian_aadhaar_info: record['guardian_aadhaar_info'] as string,
            nominee_address_1: record['nominee_address_1'] as string,
            nominee_address_2: record['nominee_address_2'] as string,
            nominee_address_3: record['nominee_address_3'] as string,
            nominee_city: record['nominee_city'] as string,
            nominee_state: record['nominee_state'] as string,
            nominee_pincode: record['nominee_pincode'] as string,
            nominee_phone_residence: record[
              'nominee_phone_residence'
            ] as string,
            nominee_email: record['nominee_email'] as string,
            nominee_2_address_1: record['nominee_2_address_1'] as string,
            nominee_2_address_2: record['nominee_2_address_2'] as string,
            nominee_2_address_3: record['nominee_2_address_3'] as string,
            nominee_2_city: record['nominee_2_city'] as string,
            nominee_2_state: record['nominee_2_state'] as string,
            nominee_2_pincode: record['nominee_2_pincode'] as string,
            nominee_2_phone_residence: record[
              'nominee_2_phone_residence'
            ] as string,
            nominee_2_email: record['nominee_2_email'] as string,
            nominee_3_address_1: record['nominee_3_address_1'] as string,
            nominee_3_address_2: record['nominee_3_address_2'] as string,
            nominee_3_address_3: record['nominee_3_address_3'] as string,
            nominee_3_city: record['nominee_3_city'] as string,
            nominee_3_state: record['nominee_3_state'] as string,
            nominee_3_pincode: record['nominee_3_pincode'] as string,
            nominee_3_phone_residence: record[
              'nominee_3_phone_residence'
            ] as string,
            nominee_3_email: record['nominee_3_email'] as string,
            ckyc_no: record['ckyc_no'] as string,
            jh1_ckyc: record['jh1_ckyc'] as string,
            jh2_ckyc: record['jh2_ckyc'] as string,
            guardian_ckyc_no: record['guardian_ckyc_no'] as string,
            joint_holder_1st_resi_phone_no: record[
              'joint_holder_1st_resi_phone_no'
            ] as string,
            joint_holder_2nd_resi_phone_no: record[
              'joint_holder_2nd_resi_phone_no'
            ] as string,
            investors_resi_fax_no: record['investors_resi_fax_no'] as string,
            kyc_g_flag: record['kyc_g_flag'] as string,
            demat_folio_flag: record['demat_folio_flag'] as string,
            nominee_opt_out_flag: record['nominee_opt_out_flag'] as string,
            nominee_dob: record['nominee_dob']
              ? new Date(record['nominee_dob'])
              : null,
            joint_holder_1_contact_number: record[
              'joint_holder_1_contact_number'
            ] as string,
            joint_holder_1_email_id: record[
              'joint_holder_1_email_id'
            ] as string,
            joint_holder_2_contact_number: record[
              'joint_holder_2_contact_number'
            ] as string,
            joint_holder_2_email_id: record[
              'joint_holder_2_email_id'
            ] as string,
            nominee_guardian_name: record['nominee_guardian_name'] as string,
            email_concern: record['email_concern'] as string,
            email_relationship: record['email_relationship'] as string,
            mobile_relationship: record['mobile_relationship'] as string,
            ubo_flag: record['ubo_flag'] as string,
            npo_flag: record['npo_flag'] as string,
          };

          data.push(dto);
        });

        // console.log('Parsed XLS data:', data);
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unsupported file type',
        };
      }

      console.log('Data data Last', data);
      const result = [];
      for (const record of data) {
        console.log('rec', record);
        const existingRecord =
          await this.kfintechInvestorMasterFolioRepo.findOne({
            where: { product_code: record.product_code },
          });
        console.log('jgykvuo', existingRecord);
        if (existingRecord) {
          Object.assign(existingRecord, record);
          await this.kfintechInvestorMasterFolioRepo.save(existingRecord);
          result.push(existingRecord);
        } else {
          await this.kfintechInvestorMasterFolioRepo.save(record);
          result.push(record);
        }
      }

      return {
        status: 200,
        message: 'File processed successfully',
        result: result,
      };
    } catch (error) {
      console.log('error in created KfintechInvestorMasterFolioService', error);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Error processing file: ' + error.message,
      };
    }
  }

  findAll() {
    return `This action returns all kfintechInvestorMasterFolios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kfintechInvestorMasterFolio`;
  }

  update(
    id: number,
    updateKfintechInvestorMasterFolioDto: UpdateKfintechInvestorMasterFolioDto,
  ) {
    return `This action updates a #${id} kfintechInvestorMasterFolio`;
  }

  remove(id: number) {
    return `This action removes a #${id} kfintechInvestorMasterFolio`;
  }

  async buildXML(
    amc: string,
    brok_code: string,
    user_code: string,
    usr_txn_no: string,
    appl_no: string,
    folio_no: string,
    scheme_code: string,
    fh_name: string,
    add1: string,
    add2: string,
    add3: string,
    city: string,
    pincode: string,
    phone_off: string,
    trxn_date: Date,
    trxn_time: Date,
    units: number,
    amount: number,
    fh_dob: Date,
    guardian: string,
    tax_number: string,
    email: string,
    acct_no: string,
    account_type: string,
    bank_name: string,
    branch_name: string,
    bank_city: string,
    reinv_tag: string,
    occ_code: string,
    sub_transaction_type: string,
    pay_mec: string,
    nom_name: string,
    relationship: string,
    guard_pan: string,
    gender: string,
    sip_rgdt: Date,
    ifsc_code: string,
    nom_per: number,
    sip_rfno: string,
    no_of_inst: number,
    frequency: string,
    start_date: Date,
    end_date: Date,
    inst_no: number,
    nom_dob: Date,
    nom_guard: string,
    euin: string,
    gd_dob: Date,
    log_wt: Date,
    isin: string,
    sip_new: string,
    sip_amt: number,
    deposit_bank_name: string,
    deposit_account_no: string,
    dep_date: number,
    dep_rfno: string,
    trxn_mode: string,
  ) {
    try {
      const data = {
        AMC_CODE: amc,
        BROKE_CD: brok_code,
        // SBBR_CODE: 'AQWER43774',
        USER_CODE: user_code,
        USR_TXN_NO: usr_txn_no,
        APPL_NO: appl_no,
        FOLIO_NO: folio_no,
        // CK_DIG_NO: 15,
        TRXN_TYPE: 'P',
        SCH_CODE: scheme_code,
        FH_NAME: fh_name,
        // J1_NAME: 'joint holder1',
        // J2_NAME: 'joint holder2',
        ADD1: add1,
        ADD2: add2,
        ADD3: add3,
        CITY: city,
        PINCODE: pincode,
        PHONE_OFF: phone_off,
        TRXN_DATE: trxn_date,
        TRXN_TIME: trxn_time,
        UNITS: units,
        AMOUNT: amount,
        // CLOS_AC_CH: 'A',
        FH_DOB: fh_dob,
        GUARDIAN: guardian,
        TAX_NUMBER: tax_number,
        // PHONE_RES: '9876543219',
        // FAX_OFF: '87690765',
        // FAX_RES: '8773248',
        EMAIL: email,
        ACCT_NO: acct_no,
        ACCT_TYPE: account_type,
        BANK_NAME: bank_name,
        BR_NAME: branch_name,
        BANK_CITY: bank_city,
        REINV_TAG: reinv_tag,
        HOLD_NATUR: 'SI',
        OCC_CODE: occ_code,
        TAX_STATUS: 1,
        // REMARKS: 'NA',
        STATE: 15,
        SUB_TRXN_T: sub_transaction_type,
        // MICR_CD: '400229048',
        PAY_MEC: 'D',
        // PRICING: 'Y',
        // PAN_2_HLDR: 'PAN2',
        // PAN_3_HLDR: 'PAN3',
        NOM_NAME: nom_name,
        NOM_RELA: relationship,
        GUARD_PAN: guard_pan,
        FH_GNDR: gender,
        SIP_RGDT: sip_rgdt,
        IFSC_CODE: ifsc_code,
        MOBILE_NO: phone_off,
        // DP_ID: 'HADYFHYY6765G122',
        // NRI_ADD1: 'Mumbai',
        // NRI_ADD2: 'Mumbai',
        // NRI_ADD3: 'Mumbai',
        // NRI_CITY: 'mumbai',
        // NRI_STATE: 'Maharashtra',
        // NRI_CON: 'India',
        // NRI_PIN: '565350',
        NOM_PER: nom_per,
        // NOM2_NAME: 'NOM2',
        // NOM2_REL: 'Father',
        // NOM2_PER: 0,
        // NOM3_NAME: 'NOM2',
        // NOM3_REL: 'Sister',
        // NOM3_PER: 0,
        // NRI_ADD_FL: address_flag,
        // FIRC_STAT: 'N',
        SIP_RFNO: sip_rfno,
        NO_INST: no_of_inst,
        SIP_FQ: frequency,
        SIP_ST_DT: start_date,
        SIP_END_DT: end_date,
        INST_NUM: inst_no,
        NOM1_DOB: nom_dob,
        // NOM1_MIN_F: 'N',
        NOM1_GUARD: nom_guard,
        // NOM2_DOB: '10/02/1960',
        // NOM2_MIN_F: 'N',
        // NOM2_GUARD: 'Nom2 guard',
        // NOM3_DOB: '16/04/1997',
        // NOM3_MIN_F: 'N',
        // NOM3_GUARD: 'nom3 guard',
        FH_PAN_EXM: 'N',
        // J1_PAN_EXM: 'Y',
        // J2_PAN_EXM: 'N',
        // GD_PAN_EXM: 'Y',
        // FH_EXM_CAT: 'NU',
        // J1_EXM_CAT: 'NA',
        // J2_EXM_CAT: 'AA',
        // GD_EXM_CAT: 'SS',
        // FH_KRA_EXM: 'AS',
        // J1_KRA_EXM: 'QW',
        // J2_KRA_EXM: 'ER',
        // GD_KRA_EXM: 'KJ',
        EUIN_OPT: 'Y',
        EUIN: 'E275865',
        NOM_OPT: 'N',
        // SUB_ARN: 'HGHFDSDJ76548',
        // IIN_NO: '6745723390',
        // FH_CKYC_NO: 'RFUKJUKH5675',
        // J1_CKYC_NO: 'YTFCKIOG786',
        // J2_CKYC_NO: 'JGFGDHJ8767764',
        // GD_CKYC_NO: 'RDFIKDOHM678340',
        // J1_DOB: '16/08/2000',
        // J2_DOB: '13/09/2005',
        GD_DOB: gd_dob,
        // BROK_TYPE: 'NOR',
        // INV_DP_ID: '786823649834',
        // INV_PIN_CD: '567104',
        CUST_CONST: 0,
        LOG_WT: log_wt,
        // AOF_REF: '67566768',
        NRI_SOF: acct_no,
        FATCA_FLAG: 'N',
        // DPC: 'N',
        // US_CN_DCL: 'Y',
        // ISIN: isin,
        CREDIT_FL: 'Y',
        SLF_FAM_FL: 'SE',
        // STLMNT_NO: 'HFDIUGFD765',
        PAP_LES_FL: 'Z',
        TAC_FLAG: 'Y',
        // ALTMT_MODE: 'P',
        SIP_NEW: sip_new,
        SIP_AMT: sip_amt,
        // FT_ACNO: '781283256478',
        DEPBANK: deposit_bank_name,
        DEP_ACNO: deposit_account_no,
        DEP_DATE: dep_date,
        DEP_RFNO: dep_rfno,
        // SUPPL_FLAG: 'Y',
        TH_PTY_PAY: 'N',
        // LOC_CD: 'YTDRSUJT788675',
        // INSTR_NO: 'TYESHFXCCFC77897',
        KYC_FLG: 'Y',
        TRXN_MODE: trxn_mode,
        // DUMMY_1: '',
        // DUMMY_2: '',
        // DUMMY_3: '',
        // DUMMY_4: '',
        // DUMMY_5: '',
        // DUMMY_6: '',
        // DUMMY_7: '',
        DUMMY_8: 'M',
        // DUMMY_9: '',
        // DUMMY_10: '',
        DUMMY_11: 'E',
        DUMMY_12: 'SB',
        DUMMY_13: ifsc_code,
        DUMMY_14: bank_name,
        DUMMY_15: 'SE',
        // DUMMY_16: '',
        // DUMMY_17: '',
        // DUMMY_18: '',
        // DUMMY_19: '',
        // DUMMY_20: '',
        // DUMMY_21: '',
        // DUMMY_22: '',
        // DUMMY_23: '',
        // DUMMY_24: '',
        // DUMMY_25: '',
        // DUMMY_26: '',
        // DUMMY_27: '',
        // NPO_FORM: 'T',
        // NPO_DCL: 'Y',
        // NPO_RGNO: 'HGHTDGHVHIIJ6567',
        PAH_NAME: fh_name,
        // UBO_DCL: 'Y',
        // DUMMY_33: '',
        // DUMMY_34: '',
        // DUMMY_35: '',
        // DUMMY_36: '',
        // DUMMY_37: '',
        // DUMMY_38: '',
        // DUMMY_39: '',
        // DUMMY_40: '',
        // DUMMY_41: '',
        // DUMMY_42: '',
        // DUMMY_43: '',
        // DUMMY_44: '',
        // DUMMY_45: '',
        // DUMMY_46: '',
        // DUMMY_47: '',
        // DUMMY_48: '',
        // DUMMY_49: '',
        // DUMMY_50: '',
        // DUMMY_51: '',
        // DUMMY_52: '',
        // DUMMY_53: '',
        // DUMMY_54: '',
        // DUMMY_55: '',
        // DUMMY_56: '',
        // DUMMY_57: '',
        // DUMMY_58: '',
        // DUMMY_59: '',
      };

      const xmlString = buildXML(data);
      console.log('xml', xmlString);
      return { status: HttpStatus.OK, xmlString: xmlString };
    } catch (err) {
      return { staus: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }
}

function excelSerialDateToJSDate(serial: number): Date {
  const utc_days = Math.floor(serial - 25569);
  const date = new Date(utc_days * 86400 * 1000);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

// function convertDateFormat(dateString: string, fromFormat: string, toFormat: string): string {
//   const dateDelimiter = /[-/.]/; // Handles different delimiters: '-', '/', '.'
//   const fromParts = fromFormat.split(dateDelimiter);
//   const dateParts = dateString.split(dateDelimiter);

//   if (fromParts.length !== 3 || dateParts.length !== 3) {
//     throw new Error('Invalid date format');
//   }

//   const day = dateParts[fromParts.indexOf('DD')];
//   const month = dateParts[fromParts.indexOf('MM')];
//   const year = dateParts[fromParts.indexOf('YYYY')];

//   return toFormat
//     .replace('DD', day)
//     .replace('MM', month)
//     .replace('YYYY', year);
// }
function convertDateFormat(
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

function buildXML(data: object) {
  const rootElement = 'Request_dtl';
  // const Data = {}

  let xml = `<${rootElement}>`;
  for (const [key, value] of Object.entries(data)) {
    xml += `<${key}>${value}</${key}>\n`;
  }
  xml += `</${rootElement}>`;

  return xml;
}
