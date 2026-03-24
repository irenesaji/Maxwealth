import { HttpStatus, Injectable } from '@nestjs/common';
import { AddOccupationDetailsDto } from 'src/onboarding/dtos/add-occupation-details.dto';
import { AddPersonalDetailsDto } from 'src/onboarding/dtos/add-personal-details.dto';
import { CheckKycResponseDto } from 'src/onboarding/dtos/check-kyc-response.dto';
import { CheckKycDto } from 'src/onboarding/dtos/check-kyc.dto';
import { ConfirmPanDetailsDto } from 'src/onboarding/dtos/confirm-pan-details.dto';
import { GetConfirmPanDetailsDto } from 'src/onboarding/dtos/get-confirm-pan-details.dto';
import { GetPersonalDetailsDto } from 'src/onboarding/dtos/get-personal-details.dto';
import { KycStatusDetail } from 'src/onboarding/entities/kyc_status_details.entity';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { EmailAddressRepository } from 'src/repositories/email_address.repository';
import { KycStatusRepository } from 'src/repositories/kyc_status.repository';
import { KycStatusDetailRepository } from 'src/repositories/kyc_status_details.repository';
import { PhoneNumberRepository } from 'src/repositories/phone_number.repository';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { SignzyKycObjectRepository } from 'src/repositories/signzy_kyc_object.repository';
import { TransactionBasketItemsRepository } from 'src/repositories/transaction_basket_item.repository';
import { UserAddressDetailsRepository } from 'src/repositories/user_address_details.repository';
import { UserBankDetailsRepository } from 'src/repositories/user_bank_details.repository';
import { UserNomineeDetailsRepository } from 'src/repositories/user_nominee_details.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { UsersService } from 'src/users/users.service';
import { CamsService } from 'src/utils/cams/cams.service';
import { PichainService } from 'src/utils/pichain/pichain.service';
import { SignzyService } from 'src/utils/signzy/signzy.service';
import { In } from 'typeorm';
import { format } from 'date-fns';
import { GetOccupationDetailsDto } from 'src/onboarding/dtos/get-occupation-details.dto';
import { GetPhotoDto } from 'src/onboarding/dtos/get-photo.dto';
import { GetSignatureDto } from 'src/onboarding/dtos/get-signature.dto';
import { cwd } from 'process';
import { AddAddressDetailsDto } from 'src/onboarding/address/dtos/add-address-details.dto';
import { UserAddressDetails } from 'src/onboarding/address/entities/user_address_details.entity';
import { ConfigService } from '@nestjs/config';
import { buffer } from 'stream/consumers';
import path from 'path';
import { ensureDir } from 'fs-extra';
import * as fs from 'fs-extra';
import { createCanvas, loadImage } from 'canvas';
import { PDFCheckBox, PDFDocument, PDFTextField } from 'pdf-lib';
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import { writeFile } from 'fs';
import { FintupleService } from 'src/utils/fintuple/fintuple.service';
const execAsync = promisify(exec);

const genderMap: { [key: string]: string } = {
  male: 'M',
  female: 'F',
  transgender: 'T',
};

const maritalStatusMap: { [key: string]: string } = {
  married: '01',
  unmarried: '02',
  others: '03',
};

const occupationMap: { [key: string]: string } = {
  'private sector service': '01',
  'public sector': '02',
  business: '03',
  professional: '04',
  agriculturist: '05',
  retired: '06',
  housewife: '07',
  student: '08',
  'forex dealer': '09',
  'government service': '10',
  others: '99',
  'self employed': '11',
  'not categorized': '12',
};

const residencyStatusMap: { [key: string]: string } = {
  'resident indian': 'R',
  'non-resident indian': 'N',
  'foreign national': 'P',
  'person of indian origin': 'I',
};

export const stateCodeMapping: { [key: string]: string } = {
  'Jammu and Kashmir': '001',
  'Himachal Pradesh': '002',
  Punjab: '003',
  Chandigarh: '004',
  Uttarakhand: '005',
  Haryana: '006',
  Delhi: '007',
  Rajasthan: '008',
  'Uttar Pradesh': '009',
  Bihar: '010',
  Sikkim: '011',
  'Arunachal Pradesh': '012',
  Assam: '013',
  Manipur: '014',
  Mizoram: '015',
  Tripura: '016',
  Meghalaya: '017',
  Nagaland: '018',
  'West Bengal': '019',
  Jharkhand: '020',
  Odisha: '021',
  Chhattisgarh: '022',
  'Madhya Pradesh': '023',
  Gujarat: '024',
  'Daman and Diu': '025',
  'Dadra and Nagar Haveli': '026',
  Maharashtra: '027',
  'Andhra Pradesh': '028',
  Karnataka: '029',
  Goa: '030',
  Lakshadweep: '031',
  Kerala: '032',
  'Tamil Nadu': '033',
  Puducherry: '034',
  'Andaman and Nicobar Islands': '035',
  Telangana: '037',
  Others: '099',
};

const stateForForm: { [key: string]: string } = {
  'Andaman & Nicobar': 'AN',
  'Andhra Pradesh': 'AP',
  'Arunachal Pradesh': 'AR',
  Assam: 'AS',
  Bihar: 'BR',
  Chandigarh: 'CH',
  Chhattisgarh: 'CG',
  'Dadra and Nagar Haveli': 'DN',
  'Daman & Diu': 'DD',
  Delhi: 'DL',
  Goa: 'GA',
  Gujarat: 'GJ',
  Haryana: 'HR',
  'Himachal Pradesh': 'HP',
  'Jammu & Kashmir': 'JK',
  Jharkhand: 'JH',
  Karnataka: 'KA',
  Kerala: 'KL',
  Lakshadweep: 'LD',
  'Madhya Pradesh': 'MP',
  Maharashtra: 'MH',
  Manipur: 'MN',
  Meghalaya: 'ML',
  Mizoram: 'MZ',
  Nagaland: 'NL',
  Odisha: 'OR',
  Puducherry: 'PY',
  Punjab: 'PB',
  Rajasthan: 'RJ',
  Sikkim: 'SK',
  'Tamil Nadu': 'TN',
  Telangana: 'TS',
  Tripura: 'TR',
  'Uttar Pradesh': 'UP',
  Uttarakhand: 'UK',
  'West Bengal': 'WB',
  Other: 'XX',
};

const countryCodeMapping: { [key: string]: string } = {
  Afghanistan: '001',
  'Aland Islands': '002',
  Albania: '003',
  Algeria: '004',
  'American Samoa': '005',
  Andorra: '006',
  Angola: '007',
  Anguilla: '008',
  Antarctica: '009',
  'Antigua And Barbuda': '010',
  Argentina: '011',
  Armenia: '012',
  Aruba: '013',
  Australia: '014',
  Austria: '015',
  Azerbaijan: '016',
  Bahamas: '017',
  Bahrain: '018',
  Bangladesh: '019',
  Barbados: '020',
  Belarus: '021',
  Belgium: '022',
  Belize: '023',
  Benin: '024',
  Bermuda: '025',
  Bhutan: '026',
  Bolivia: '027',
  'Bosnia And Herzegovina': '028',
  Botswana: '029',
  'Bouvet Island': '030',
  Brazil: '031',
  'British Indian Ocean Territory': '032',
  'Brunei Darussalam': '033',
  Bulgaria: '034',
  'Burkina Faso': '035',
  Burundi: '036',
  Cambodia: '037',
  Cameroon: '038',
  Canada: '039',
  'Cape Verde': '040',
  'Cayman Islands': '041',
  'Central African Republic': '042',
  Chad: '043',
  Chile: '044',
  China: '045',
  'Christmas Island': '046',
  'Cocos (Keeling) Islands': '047',
  Colombia: '048',
  Comoros: '049',
  Congo: '050',
  'Congo, The Democratic Republic Of The': '051',
  'Cook Islands': '052',
  'Costa Rica': '053',
  "Cote D'Ivoire": '054',
  Croatia: '055',
  Cuba: '056',
  Cyprus: '057',
  'Czech Republic': '058',
  Denmark: '059',
  Djibouti: '060',
  Dominica: '061',
  'Dominican Republic': '062',
  Ecuador: '063',
  Egypt: '064',
  'El Salvador': '065',
  'Equatorial Guinea': '066',
  Eritrea: '067',
  Estonia: '068',
  Ethiopia: '069',
  'Falkland Islands (Malvinas)': '070',
  'Faroe Islands': '071',
  Fiji: '072',
  Finland: '073',
  France: '074',
  'French Guiana': '075',
  'French Polynesia': '076',
  'French Southern Territories': '077',
  Gabon: '078',
  Gambia: '079',
  Georgia: '080',
  Germany: '081',
  Ghana: '082',
  Gibraltar: '083',
  Greece: '084',
  Greenland: '085',
  Grenada: '086',
  Guadeloupe: '087',
  Guam: '088',
  Guatemala: '089',
  Guernsey: '090',
  Guinea: '091',
  'Guinea-Bissau': '092',
  Guyana: '093',
  Haiti: '094',
  'Heard Island And Mcdonald Islands': '095',
  'Holy See (Vatican City State)': '096',
  Honduras: '097',
  'Hong Kong': '098',
  Hungary: '099',
  Iceland: '100',
  India: '101',
  Indonesia: '102',
  'Iran, Islamic Republic Of': '103',
  Iraq: '104',
  Ireland: '105',
  'Isle Of Man': '106',
  Israel: '107',
  Italy: '108',
  Jamaica: '109',
  Japan: '110',
  Jersey: '111',
  Jordan: '112',
  Kazakhstan: '113',
  Kenya: '114',
  Kiribati: '115',
  "Korea, Democratic People's Republic Of": '116',
  'Korea, Republic Of': '117',
  Kuwait: '118',
  Kyrgyzstan: '119',
  "Lao People's Democratic Republic": '120',
  Latvia: '121',
  Lebanon: '122',
  Lesotho: '123',
  Liberia: '124',
  'Libyan Arab Jamahiriya': '125',
  Liechtenstein: '126',
  Lithuania: '127',
  Luxembourg: '128',
  Macao: '129',
  'Macedonia, The Former Yugoslav Republic Of': '130',
  Madagascar: '131',
  Malawi: '132',
  Malaysia: '133',
  Maldives: '134',
  Mali: '135',
  Malta: '136',
  'Marshall Islands': '137',
  Martinique: '138',
  Mauritania: '139',
  Mauritius: '140',
  Mayotte: '141',
  Mexico: '142',
  'Micronesia, Federated States Of': '143',
  'Moldova, Republic Of': '144',
  Monaco: '145',
  Mongolia: '146',
  Montserrat: '147',
  Morocco: '148',
  Mozambique: '149',
  Myanmar: '150',
  Namibia: '151',
  Nauru: '152',
  Nepal: '153',
  Netherlands: '154',
  'Netherlands Antilles': '155',
  'New Caledonia': '156',
  'New Zealand': '157',
  Nicaragua: '158',
  Niger: '159',
  Nigeria: '160',
  Niue: '161',
  'Norfolk Island': '162',
  'Northern Mariana Islands': '163',
  Norway: '164',
  Oman: '165',
  Pakistan: '166',
  Palau: '167',
  'Palestinian Territory, Occupied': '168',
  Panama: '169',
  'Papua New Guinea': '170',
  Paraguay: '171',
  Peru: '172',
  Philippines: '173',
  Pitcairn: '174',
  Poland: '175',
  Portugal: '176',
  'Puerto Rico': '177',
  Qatar: '178',
  Reunion: '179',
  Romania: '180',
  'Russian Federation': '181',
  Rwanda: '182',
  'Saint Helena': '183',
  'Saint Kitts And Nevis': '184',
  'Saint Lucia': '185',
  'Saint Pierre And Miquelon': '186',
  'Saint Vincent And The Grenadines': '187',
  Samoa: '188',
  'San Marino': '189',
  'Sao Tome And Principe': '190',
  'Saudi Arabia': '191',
  Senegal: '192',
  'Serbia And Montenegro': '193',
  Seychelles: '194',
  'Sierra Leone': '195',
  Singapore: '196',
  Slovakia: '197',
  Slovenia: '198',
  'Solomon Islands': '199',
  Somalia: '200',
  'South Africa': '201',
  Spain: '203',
  'Sri Lanka': '204',
  Sudan: '205',
  Suriname: '206',
  Sweden: '209',
  Switzerland: '210',
  Yemen: '241',
  Zambia: '242',
  Zimbabwe: '243',
  "Côte D'Ivoire": 'CI',
};

@Injectable()
export class Onboardingv2Service {
  base_url: string;
  constructor(
    // @InjectRepository(UserOnboardingDetails)
    // private userOnboardingDetailsRepository: Repository<UserOnboardingDetails>,
    // @InjectRepository(UserAddressDetails)
    // private userAddressDetailsRepository: Repository<UserAddressDetails>,
    // @InjectRepository(UserNomineeDetails)
    // private userNomineeDetailsRepository: Repository<UserNomineeDetails>,
    // @InjectRepository(TransactionBasketItems)
    // private readonly transactionBasketItemsRepository:Repository<TransactionBasketItems>,
    // @InjectRepository(UserBankDetails)
    // private userBankDetailsRepository: Repository<UserBankDetails>,
    // @InjectRepository(Purchase)
    // private readonly purchaseRepository: Repository<Purchase>,

    private userOnboardingDetailsRepository: UserOnboardingDetailsRepository,
    private userAddressDetailsRepository: UserAddressDetailsRepository,
    private userNomineeDetailsRepository: UserNomineeDetailsRepository,
    private transactionBasketItemsRepository: TransactionBasketItemsRepository,
    private userBankDetailsRepository: UserBankDetailsRepository,
    private purchaseRepository: PurchaseRepository,
    private phoneNumbersRepository: PhoneNumberRepository,
    private signzyKycObjectRepository: SignzyKycObjectRepository,
    private kycStatusDetailRepository: KycStatusDetailRepository,
    private emailAddressesRepository: EmailAddressRepository,
    private kycstatusRepository: KycStatusRepository,

    private readonly camsService: CamsService,
    private readonly signzyService: SignzyService,
    private readonly usersService: UsersService,
    private readonly finTupleService: FintupleService,
  ) {
    const configService = new ConfigService();
    this.base_url = configService.get('BASE_URL');
  }

  async check_kyc(checkKycDto: CheckKycDto) {
    try {
      let user: any;
      const check_pan = await this.userOnboardingDetailsRepository.findOne({
        where: { pan: checkKycDto.pan },
      });
      console.log('Check PAN', check_pan);
      if (check_pan) {
        if (
          check_pan.user_id != checkKycDto.user_id &&
          check_pan.status != 'not_started'
        ) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error:
              'The PAN card number you entered is already associated with an existing account. Please use a different PAN card',
          };
        }
      }
      const result = await this.camsService.check_kyc(checkKycDto.pan);
      console.log('result 1', result);

      const kraKeys = Object.keys(result?.data?.verifyPanResponse).filter(
        (key) => key.endsWith('kra'),
      );

      let selectedKra = 'camskra'; // Default to camskra

      for (const key of kraKeys) {
        if (result?.data?.verifyPanResponse[key] !== '05') {
          selectedKra = key;
          break; // Pick the first matching one
        }
      }

      console.log('The current selected KRA', selectedKra);
      if (result.data.verifyPanResponse[selectedKra] == 99) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'KRA web service is not reachable',
        };
      }
      const kyc_status = await this.kycstatusRepository.findOneBy({
        id: result.data.verifyPanResponse[selectedKra],
      });
      console.log('kyc_status', kyc_status);

      if (result.status == 200) {
        const userData = await this.usersService.findOneById(
          checkKycDto.user_id,
        );
        user = userData.user;
        console.log('user out', user);
        let userOboardingDetail =
          await this.userOnboardingDetailsRepository.findOneBy({ user: user });
        console.log('userOboardingDetail', userOboardingDetail);
        if (user) {
          console.log('user', user);
          // let onboarding = await this.userOnboardingDetailsRepository.findOne({ where: { pan: checkKycDto.pan } })
          // if (onboarding) {
          //     return { "status": HttpStatus.BAD_REQUEST, "error": "The PAN card number you entered is already associated with an existing account. Please use a different PAN card" }
          // }
          // if (result.data.verifyPanResponse.camskra == 2) {
          if (!userOboardingDetail) {
            userOboardingDetail = new UserOnboardingDetails();
            userOboardingDetail.user = user;
          }
          userOboardingDetail.pan = checkKycDto.pan;
          if (result.data.verifyPanResponse.camskra == '07') {
            userOboardingDetail.is_kyc_compliant = true;
          } else if (result.data.verifyPanResponse.cvlkra == '07') {
            userOboardingDetail.is_kyc_compliant = true;
          } else if (result.data.verifyPanResponse.ndmlkra == '07') {
            userOboardingDetail.is_kyc_compliant = true;
          } else if (result.data.verifyPanResponse.dotexkra == '07') {
            userOboardingDetail.is_kyc_compliant = true;
          } else if (result.data.verifyPanResponse.karvykra == '07') {
            userOboardingDetail.is_kyc_compliant = true;
          } else if (result.data.verifyPanResponse.bsekra == '07') {
            userOboardingDetail.is_kyc_compliant = true;
          } else {
            userOboardingDetail.is_kyc_compliant = false;
          }
          if (
            kyc_status.status_description == 'KYC REJECTED' ||
            kyc_status.status_description == 'KYC REGISTERED' ||
            kyc_status.status_description == 'ON HOLD' ||
            kyc_status.status_description == 'UNDER_PROCESS'
          ) {
            userOboardingDetail.status = 'not_started';
          } else {
            userOboardingDetail.status = 'kyc_check';
          }
          await this.userOnboardingDetailsRepository.save(userOboardingDetail);
          console.log('userOboardingDetail inside', userOboardingDetail);
          // }
        } else {
          return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
        }

        const checkKycResponse = new CheckKycResponseDto();
        checkKycResponse.name = result.data.verifyPanResponse.name;
        checkKycResponse.pan = checkKycDto.pan;
        checkKycResponse.status =
          kyc_status.status_description === 'KYC Validated' ? true : false;
        checkKycResponse.kyc_status = kyc_status.status_description;
        checkKycResponse.user_id = user.id;
        // checkKycResponse.user_onboarding_detail_id = userOboardingDetail.id;
        checkKycResponse.pan_details = result.data.verifyPanResponse;

        return { status: HttpStatus.OK, data: checkKycResponse };
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      console.log('fecs', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async confirm_pan_details(confirmPanDetailsDto: ConfirmPanDetailsDto) {
    try {
      console.log('confirmPanDetailsDto', confirmPanDetailsDto);
      console.log(
        'confirmPanDetailsDto DOB',
        confirmPanDetailsDto.date_of_birth,
      );

      const userData = await this.usersService.findOneById(
        confirmPanDetailsDto.user_id,
      );
      const user = userData.user;

      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user.id },
        });
        if (!onboarding) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Please check your KYC compliance first',
          };
        }
        onboarding.full_name = confirmPanDetailsDto.full_name;
        onboarding.date_of_birth = confirmPanDetailsDto.date_of_birth;
        onboarding.aadhaar_number = confirmPanDetailsDto.aadhar_number;
        onboarding.status = 'confirm_pan';
        onboarding.fp_kyc_status = 'pending';
        console.log('onboarding', onboarding);

        await this.userOnboardingDetailsRepository.save(onboarding);

        return { status: HttpStatus.OK, message: 'Updated the details' };
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_confirm_pan_details(user_id: number) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          { user_id: user.id },
        );
        const confirmPanDetailsDto = new GetConfirmPanDetailsDto();
        console.log(onboarding);
        if (onboarding) {
          confirmPanDetailsDto.id = onboarding.id;
          confirmPanDetailsDto.full_name = onboarding.full_name;
          confirmPanDetailsDto.date_of_birth = onboarding.date_of_birth;
          confirmPanDetailsDto.pan = onboarding.pan;
          confirmPanDetailsDto.aadhar_number = onboarding.aadhaar_number;
          confirmPanDetailsDto.user_id = user.id;
          confirmPanDetailsDto.kyc_id = onboarding.kyc_id;
          confirmPanDetailsDto.is_kyc_compliant = onboarding.is_kyc_compliant;
          console.log('CONF', confirmPanDetailsDto);
          return { status: HttpStatus.OK, data: confirmPanDetailsDto };
        } else {
          return { status: HttpStatus.NOT_FOUND, error: 'No Onboarding found' };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async add_personal_details(addPersonalDetailsDto: AddPersonalDetailsDto) {
    try {
      const userData = await this.usersService.findOneById(
        addPersonalDetailsDto.user_id,
      );
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user.id },
        });
        if (!onboarding) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Please check your KYC compliance first',
          };
        }
        onboarding.father_name = addPersonalDetailsDto.father_name;
        onboarding.mother_name = addPersonalDetailsDto.mother_name;
        onboarding.marital_status = addPersonalDetailsDto.marital_status;
        onboarding.gender = addPersonalDetailsDto.gender;
        onboarding.status = 'personal_details';

        await this.userOnboardingDetailsRepository.save(onboarding);
        console.log('Onboarding:', onboarding);
        return { status: HttpStatus.OK, message: 'Updated the details' };
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_personal_details(user_id: number) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user.id },
          relations: ['kyc_status_details'],
        });
        const personalDetailsDto = new GetPersonalDetailsDto();
        console.log(onboarding);
        if (onboarding) {
          personalDetailsDto.id = onboarding.id;
          personalDetailsDto.father_name = onboarding.father_name;
          personalDetailsDto.mother_name = onboarding.mother_name;
          personalDetailsDto.marital_status = onboarding.marital_status;
          personalDetailsDto.gender = onboarding.gender;
          personalDetailsDto.user_id = user_id;
          personalDetailsDto.kyc_id = onboarding.kyc_id;
          personalDetailsDto.is_kyc_compliant = onboarding.is_kyc_compliant;
          return { status: HttpStatus.OK, data: personalDetailsDto };
        } else {
          return { status: HttpStatus.NOT_FOUND, error: 'No Onboarding found' };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_onboarding_details(user_id: number) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user.id },
          relations: ['user.risk_profile'],
        });
        console.log('On-onboard');

        // console.log("Onboarding", onboarding);
        if (onboarding) {
          delete onboarding.pan_buffer;
          delete onboarding.pdf_buffers;
          delete onboarding.photo_buffer;
          delete onboarding.address_proof_buffer;
          delete onboarding.signature_buffer;
          delete onboarding.aadhar_xml;
          delete onboarding.cheque_buffer;

          onboarding['risk_profile'] = false;
          if (onboarding?.user?.risk_profile) {
            delete onboarding.user;
            onboarding['risk_profile'] = true;
          } else {
            delete onboarding.user;
          }

          if (
            onboarding.fp_kyc_reject_reasons != null ||
            onboarding.fp_kyc_reject_reasons != ''
          ) {
            onboarding.fp_kyc_reject_reasons = JSON.parse(
              onboarding.fp_kyc_reject_reasons,
            );
          }

          onboarding['mobile'] = user.mobile;
          onboarding['email'] = user.email;

          const transaction_basket_item_ids =
            await this.transactionBasketItemsRepository.find({
              select: { id: true },
              where: [
                { transaction_type: 'lumpsum', user_id: user_id },
                { transaction_type: 'sip', user_id: user_id },
                { transaction_type: 'no_mandate_sip', user_id: user_id },
              ],
            });

          console.log('Transabas', transaction_basket_item_ids);
          const item_ids = transaction_basket_item_ids.map((item) => {
            return item.id;
          });

          onboarding['is_investment_done'] = false;
          // if (transaction_basket_item_ids.length > 0) {
          //   let purchases = await this.purchaseRepository.find({ where: { transaction_basket_item_id: In(item_ids), state: "successful" } })
          //   console.log("purfes", purchases)
          //   if (purchases.length > 0) {
          //     onboarding["is_investment_done"] = true;
          //   }
          // }
          const transactionsWithPurchases =
            await this.transactionBasketItemsRepository
              .createQueryBuilder('transaction_basket_items')
              .leftJoin(
                'purchases',
                'p',
                'p.transaction_basket_item_id = transaction_basket_items.id AND p.folio_number IS NOT NULL',
              )
              .where('transaction_basket_items.user_id = :user_id', { user_id })
              .andWhere(
                'transaction_basket_items.transaction_type IN (:...types)',
                { types: ['lumpsum', 'sip', 'no_mandate_sip'] },
              )
              .select('transaction_basket_items.id', 'id')
              .addSelect('p.id', 'purchase_id')
              .getRawMany();
          // Extract transaction IDs
          // let item_ids = transactionsWithPurchases.map(item => item.id);
          // Check if any purchase exists

          onboarding['is_investment_done'] = transactionsWithPurchases.some(
            (item) => item.purchase_id !== null,
          );

          return { status: HttpStatus.OK, data: onboarding };
        } else {
          return { status: HttpStatus.NOT_FOUND, error: 'No Onboarding found' };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      console.log('Error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async add_occupation_details(
    addOccupationDetailsDto: AddOccupationDetailsDto,
  ) {
    try {
      const userData = await this.usersService.findOneById(
        addOccupationDetailsDto.user_id,
      );
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user.id },
        });
        if (!onboarding) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Please check your KYC compliance first',
          };
        }
        console.log('1');
        onboarding.occupation = addOccupationDetailsDto.occupation;
        onboarding.annual_income = addOccupationDetailsDto.annual_income;
        onboarding.nationality = addOccupationDetailsDto.nationality;
        console.log('2', onboarding);

        onboarding.status = 'occupation_details';
        if (!onboarding.is_kyc_compliant) {
          console.log(onboarding);
          // they are only allowed to use the pan used in previous step - check kyc
          console.log('kyc ', onboarding.kyc_id);

          await this.userOnboardingDetailsRepository.save(onboarding);
          console.log('Onbooarding:', onboarding);
          // let kyc_data_resp = await this.signzyService.update_kyc_data(user, signzy_kyc_object, kyc_status_detail);
          // console.log(kyc_data_resp);
          // let pdf_resp = await this.signzyService.create_pdf(onboarding, signzy_kyc_object, kyc_status_detail);
          // console.log(pdf_resp);

          return { status: HttpStatus.OK, message: 'Updated the details' };
          // let result = await this.fintechService.update_occupation_details_kyc(addOccupationDetailsDto, onboarding.kyc_id);

          // if (result.status == 200) {
          //     let temp_onboarding = await this.userOnboardingDetailsRepository.findOneBy({ user_id: user.id });
          //     onboarding.kyc_id = temp_onboarding.kyc_id;
          //     onboarding.fp_kyc_status = temp_onboarding.fp_kyc_status;
          //     await this.userOnboardingDetailsRepository.save(onboarding);
          //     return { "status": HttpStatus.OK, "message": "Updated the details" };
          // } else {
          //     return result;
          // }
        }
        await this.userOnboardingDetailsRepository.save(onboarding);
        return { status: HttpStatus.OK, message: 'Updated the details' };
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_occupation_details(user_id: number) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          { user_id: user.id },
        );
        const occupationDetailsDto = new GetOccupationDetailsDto();
        console.log(onboarding);
        if (onboarding) {
          occupationDetailsDto.id = onboarding.id;
          occupationDetailsDto.annual_income = onboarding.annual_income;
          occupationDetailsDto.nationality = onboarding.nationality;
          occupationDetailsDto.occupation = onboarding.occupation;
          occupationDetailsDto.user_id = user_id;
          occupationDetailsDto.kyc_id = onboarding.kyc_id;
          occupationDetailsDto.is_kyc_compliant = onboarding.is_kyc_compliant;
          return { status: HttpStatus.OK, data: occupationDetailsDto };
        } else {
          return { status: HttpStatus.NOT_FOUND, error: 'No Onboarding found' };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_photo_details(user_id: number) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          { user_id: user.id },
        );
        const respDto = new GetPhotoDto();
        console.log(onboarding);
        if (onboarding) {
          respDto.id = onboarding.id;
          respDto.fp_photo_file_id = onboarding.fp_photo_file_id;
          respDto.photo_url = `${onboarding.photo_url}`;
          respDto.photo_buffer = onboarding.photo_buffer;
          respDto.user_id = user_id;
          respDto.kyc_id = onboarding.kyc_id;
          respDto.is_kyc_compliant = onboarding.is_kyc_compliant;
          return { status: HttpStatus.OK, data: respDto };
        } else {
          return { status: HttpStatus.NOT_FOUND, error: 'No Onboarding found' };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_aadhar_details(user_id: number) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          { user_id: user.id },
        );
        const respDto = new GetPhotoDto();
        console.log(onboarding);
        if (onboarding) {
          respDto.id = onboarding.id;
          respDto.fp_photo_file_id = onboarding.fp_photo_file_id;
          respDto.photo_url = `${onboarding.aadhaar_url}`;
          respDto.photo_buffer = onboarding.address_proof_buffer;
          respDto.user_id = user_id;
          respDto.kyc_id = onboarding.kyc_id;
          respDto.is_kyc_compliant = onboarding.is_kyc_compliant;
          return { status: HttpStatus.OK, data: respDto };
        } else {
          return { status: HttpStatus.NOT_FOUND, error: 'No Onboarding found' };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async add_photo(user_id: number, file: Express.Multer.File) {
    try {
      // Find user and validate
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;

      if (!user) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found',
        };
      }

      // Check onboarding status
      const onboarding = await this.userOnboardingDetailsRepository.findOne({
        where: { user_id: user.id },
        relations: ['kyc_status_details'],
      });

      if (!onboarding) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Please check your KYC compliance first',
        };
      }

      // Create upload directory if it doesn't exist
      const uploadDir = path.resolve('./uploads/profile');
      await ensureDir(uploadDir);

      // Generate unique filename
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      const ext = file.mimetype.split('/')[1];
      const fileName = `${randomName}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      // Save file to disk using async fs
      await fs.writeFile(filePath, file.buffer);

      // Generate public URL
      const imagePath = `uploads/profile/${fileName}`;

      // Convert to base64 if needed
      const fileBuffer = await this.convertPdfToBase64(file.buffer);

      // Update onboarding record
      onboarding.status = 'photo';
      onboarding.photo_url = imagePath;
      onboarding.photo_buffer = fileBuffer.data;
      await this.userOnboardingDetailsRepository.save(onboarding);

      return {
        status: HttpStatus.OK,
        message: 'Updated the details',
      };
    } catch (error) {
      console.error('Error uploading PAN photo:', error);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      };
    }
  }

  async add_pan_photo(user_id: number, file: Express.Multer.File) {
    try {
      // Find user and validate
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;

      if (!user) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found',
        };
      }

      // Check onboarding status
      const onboarding = await this.userOnboardingDetailsRepository.findOne({
        where: { user_id: user.id },
        relations: ['kyc_status_details'],
      });

      if (!onboarding) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Please check your KYC compliance first',
        };
      }

      // Create upload directory if it doesn't exist
      const uploadDir = path.resolve('./uploads/pan');
      await ensureDir(uploadDir);

      // Generate unique filename
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      const ext = file.mimetype.split('/')[1];
      const fileName = `${randomName}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      // Save file to disk using async fs
      await fs.writeFile(filePath, file.buffer);

      // Generate public URL
      const imagePath = `uploads/pan/${fileName}`;

      // Convert to base64 if needed
      const fileBuffer = await this.convertPdfToBase64(file.buffer);

      // Update onboarding record
      if (
        onboarding.aadhar_xml &&
        onboarding.verified_aadhaar_number == onboarding.aadhaar_number
      ) {
        onboarding.status = 'digilocker';
      } else {
        onboarding.status = 'pan_image';
      }
      onboarding.pan_url = imagePath;
      onboarding.pan_buffer = fileBuffer.data;
      await this.userOnboardingDetailsRepository.save(onboarding);

      return {
        status: HttpStatus.OK,
        message: 'Updated the details',
      };
    } catch (error) {
      console.error('Error uploading PAN photo:', error);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      };
    }
  }

  async add_aadhar(user_id: number, file: Express.Multer.File) {
    try {
      // Find user and validate
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;

      if (!user) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found',
        };
      }

      // Check onboarding status
      const onboarding = await this.userOnboardingDetailsRepository.findOne({
        where: { user_id: user.id },
        relations: ['kyc_status_details'],
      });

      if (!onboarding) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Please check your KYC compliance first',
        };
      }

      // Create upload directory if it doesn't exist
      const uploadDir = path.resolve('./uploads/aadhaar');
      await ensureDir(uploadDir);

      // Generate unique filename
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      const ext = file.mimetype.split('/')[1];
      const fileName = `${randomName}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      // Save file to disk using async fs
      await fs.writeFile(filePath, file.buffer);

      // Generate public URL
      const imagePath = `uploads/aadhaar/${fileName}`;

      // Convert to base64 if needed
      const fileBuffer = await this.convertPdfToBase64(file.buffer);

      // Update onboarding record
      onboarding.status = 'aadhaar';
      onboarding.aadhaar_url = imagePath;
      onboarding.address_proof_buffer = fileBuffer.data;
      await this.userOnboardingDetailsRepository.save(onboarding);

      return {
        status: HttpStatus.OK,
        message: 'Updated the details',
      };
    } catch (error) {
      console.error('Error uploading PAN photo:', error);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      };
    }
  }

  async add_cancelled_cheque(user_id: number, file: Express.Multer.File) {
    try {
      // Find user and validate
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;

      if (!user) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found',
        };
      }

      // Check onboarding status
      const onboarding = await this.userOnboardingDetailsRepository.findOne({
        where: { user_id: user.id },
        relations: ['kyc_status_details'],
      });

      if (!onboarding) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Please check your KYC compliance first',
        };
      }

      // Create upload directory if it doesn't exist
      const uploadDir = path.resolve('./uploads/cheque');
      await ensureDir(uploadDir);

      // Generate unique filename
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      const ext = file.mimetype.split('/')[1];
      const fileName = `${randomName}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      // Save file to disk using async fs
      await fs.writeFile(filePath, file.buffer);

      // Generate public URL
      const imagePath = `uploads/cheque/${fileName}`;

      // Convert to base64 if needed
      const fileBuffer = await this.convertPdfToBase64(file.buffer);

      // Update onboarding record
      onboarding.status = 'cheque';
      onboarding.cheque_url = imagePath;
      onboarding.cheque_buffer = fileBuffer.data;
      await this.userOnboardingDetailsRepository.save(onboarding);

      return {
        status: HttpStatus.OK,
        message: 'Updated the details',
      };
    } catch (error) {
      console.error('Error uploading PAN photo:', error);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      };
    }
  }

  async add_signature(user_id: number, signature: Express.Multer.File) {
    try {
      // Find user and validate
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;

      if (!user) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found',
        };
      }

      // Check onboarding status
      const onboarding = await this.userOnboardingDetailsRepository.findOne({
        where: { user_id: user.id },
        relations: ['kyc_status_details'],
      });

      if (!onboarding) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Please check your KYC compliance first',
        };
      }

      // Create upload directory if it doesn't exist
      const uploadDir = path.resolve('./uploads/signature');
      await ensureDir(uploadDir);

      // Generate unique filename
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      const ext = signature.mimetype.split('/')[1];
      const fileName = `${randomName}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      // Save file to disk using async fs
      await fs.writeFile(filePath, signature.buffer);

      // Generate public URL
      const imagePath = `uploads/signature/${fileName}`;

      // Convert to base64 if needed
      const fileBuffer = await this.convertPdfToBase64(signature.buffer);

      // Update onboarding record
      onboarding.status = 'signature';
      onboarding.signature_url = imagePath;
      onboarding.signature_buffer = fileBuffer.data;

      await this.userOnboardingDetailsRepository.save(onboarding);

      return {
        status: HttpStatus.OK,
        message: 'Updated the details',
      };
    } catch (error) {
      console.error('Error uploading PAN photo:', error);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      };
    }
  }

  async get_pan_details(user_id: number) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          { user_id: user.id },
        );
        const respDto = new GetPhotoDto();
        console.log(onboarding);
        if (onboarding) {
          respDto.id = onboarding.id;
          respDto.fp_photo_file_id = onboarding.fp_photo_file_id;
          respDto.photo_buffer = onboarding.pan_buffer;
          respDto.photo_url = `${onboarding.pan_url}`;
          respDto.user_id = user_id;
          respDto.kyc_id = onboarding.kyc_id;
          respDto.is_kyc_compliant = onboarding.is_kyc_compliant;
          return { status: HttpStatus.OK, data: respDto };
        } else {
          return { status: HttpStatus.NOT_FOUND, error: 'No Onboarding found' };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_cheque_details(user_id: number) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          { user_id: user.id },
        );
        const respDto = new GetPhotoDto();
        console.log(onboarding);
        if (onboarding) {
          respDto.id = onboarding.id;
          respDto.fp_photo_file_id = onboarding.fp_photo_file_id;
          respDto.photo_url = `${onboarding.cheque_url}`;
          respDto.photo_buffer = onboarding.cheque_buffer;
          respDto.user_id = user_id;
          respDto.kyc_id = onboarding.kyc_id;
          respDto.is_kyc_compliant = onboarding.is_kyc_compliant;
          return { status: HttpStatus.OK, data: respDto };
        } else {
          return { status: HttpStatus.NOT_FOUND, error: 'No Onboarding found' };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_signature_details(user_id: number) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          { user_id: user.id },
        );
        const respDto = new GetSignatureDto();
        console.log(onboarding);
        if (onboarding) {
          respDto.id = onboarding.id;
          respDto.fp_signature_file_id = onboarding.fp_signature_file_id;
          respDto.signature_url = onboarding.signature_url;
          respDto.user_id = user_id;
          respDto.kyc_id = onboarding.kyc_id;
          respDto.is_kyc_compliant = onboarding.is_kyc_compliant;
          return { status: HttpStatus.OK, data: respDto };
        } else {
          return { status: HttpStatus.NOT_FOUND, error: 'No Onboarding found' };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_address_details(user_id: number) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          { user_id: user.id },
        );
        if (!onboarding) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Please check your KYC compliance first',
          };
        }
        const addressDetails =
          await this.userAddressDetailsRepository.findOneBy({
            user_id: user.id,
          });

        if (addressDetails) {
          return { status: HttpStatus.OK, data: addressDetails };
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'No Address Details found',
          };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async add_address_details(addAddressDetailsDto: AddAddressDetailsDto) {
    try {
      const userData = await this.usersService.findOneById(
        addAddressDetailsDto.user_id,
      );
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user.id },
          order: { created_at: 'DESC' },
        });
        if (!onboarding) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Please check your KYC compliance first',
          };
        }
        onboarding.status = 'address_details';

        let userAddress = await this.userAddressDetailsRepository.findOneBy({
          user_id: user.id,
        });
        console.log('hello');

        if (!userAddress) {
          userAddress = new UserAddressDetails();
        }
        userAddress.user = user;
        userAddress.line_1 = addAddressDetailsDto.line_1;
        userAddress.line_2 = addAddressDetailsDto.line_2;
        userAddress.line_3 = addAddressDetailsDto.line_3;
        userAddress.state = addAddressDetailsDto.state;
        userAddress.city = addAddressDetailsDto.city;
        userAddress.pincode = addAddressDetailsDto.pincode;
        userAddress.user_onboarding_detail_id = onboarding.id;

        if (onboarding.fp_investor_id != null) {
          // let address_result = await this.fintechService.create_address(onboarding.fp_investor_id,userAddress);
          // if(address_result.status ==200){
          //     // userAddress.fp_id = address_result.data.id;
          //     this.userAddressDetailsRepository.save(userAddress);
          // }else{
          //     return address_result;
          // }
        }

        await this.userAddressDetailsRepository.save(userAddress);

        await this.userOnboardingDetailsRepository.save(onboarding);
        return { status: HttpStatus.OK, message: 'Updated the details' };
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async final_upload(user_id: number) {
    try {
      console.log('User_id', user_id);
      const userData = await this.usersService.findOneById(user_id);
      console.log('User_data', userData);
      const user = userData.user;
      const today = new Date();
      const formattedDate = format(today, 'dd-MMM-yyyy');
      let applicantTile = 'Mr';

      console.log(formattedDate); // e.g., 14-Feb-2025
      if (user) {
        // let createpdf = await this.createpdf(user_id)
        // console.log("Created Pdf")

        const onboarding = await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user.id },
        });
        console.log('onboarding', onboarding);
        const user_address_details =
          await this.userAddressDetailsRepository.findOne({
            where: { user_id: user.id },
          });
        console.log('user_address_details', user_address_details);

        switch (onboarding.gender.toLowerCase()) {
          case 'male':
            applicantTile = 'Mr';
          case 'female':
            applicantTile =
              onboarding.marital_status == 'married' ? 'Mrs' : 'Ms';
        }

        if (onboarding) {
          const body = {
            uploadType: '03',
            pan: onboarding.pan,
            dob: onboarding.date_of_birth
              ? format(new Date(onboarding.date_of_birth), 'dd-MMM-yyyy')
              : null,
            amc: 'MFS',
            ipvDate: formattedDate,
            uidNo: onboarding.aadhaar_number,
            applicantTile: applicantTile,
            applicantFirstName: onboarding.full_name,
            applicantMiddleName: '',
            applicantLastName: '',
            relationship: 'F',
            fatherTitle: 'Mr',
            fatherFirstName: onboarding.father_name,
            fatherMiddleName: '',
            fatherLastName: '',
            motherTitle: 'Mrs',
            motherFirstName: '',
            motherMiddleName: '',
            motherLastName: '',
            maidenTitle: '',
            maidenFirstName: '',
            maidenMiddleName: '',
            maidenLastName: '',
            gender: genderMap[onboarding.gender] || 'M',
            maritalStatus: maritalStatusMap[onboarding.marital_status] || '01',
            occupation:
              occupationMap[onboarding.occupation.toLowerCase()] || '99',
            applicantCitizenship:
              onboarding.nationality == 'indian' ? '01' : '02',
            applicantOtherCitizen: '010',
            applicantStatus: 'R', //Kept default R
            idProof: '02',
            idProofIdentityNo: onboarding.aadhaar_number,
            applicantKycNo: '',
            aaplicantKycAccType: '01',
            commAddress1: user_address_details.line_1,
            commAddress2: '',
            commAddress3: '',
            commpincode: user_address_details.pincode,
            commCity: user_address_details.city,
            commDistrict: user_address_details.city,
            commState:
              stateCodeMapping[
                Object.keys(stateCodeMapping).find(
                  (key) =>
                    key.toLowerCase() ===
                    user_address_details.state.toLowerCase(),
                )
              ] || '99',

            commCountry: '101', //kept default india
            commTellNoOffCode: '',
            commTellNoOff: '',
            commTellNoRescode: '',
            commTellNoRes: '',
            commMobileNoCode: '91',
            commMobileNo: user.mobile,
            commFaxCode: '',
            commFax: '',
            commEmailId: user.email,
            comAddresstype: '02', // hardcoded no idea
            commAddressProof: '31', //adhar card
            commIdentityNo: onboarding.aadhaar_number,
            commAddressProofExpirydate: '',
            perAddress1: user_address_details.line_1,
            perAddress2: '',
            perAddress3: '',
            perPincode: user_address_details.pincode,
            perCity: user_address_details.city,
            perDistrict: user_address_details.city,
            perState:
              stateCodeMapping[
                Object.keys(stateCodeMapping).find(
                  (key) =>
                    key.toLowerCase() ===
                    user_address_details.state.toLowerCase(),
                )
              ] || '99',

            perCountry: '101', //kept default india
            perAddressProof: '31', //adhar card
            peridentityNo: onboarding.aadhaar_number,
            perAddressproofExpiryDate: '',
            fatcataxJurisdiction: 'N', //hardcoded no
            fatcacountryofJurisdiction: '',
            fatcaPlaceBirth: '',
            fatcaCountryBirth: '',
            fatcaTin: '',
            fatcaAddress1: '',
            fatcaAddress2: '',
            fatcaAddress3: '',
            fatcaPincode: '',
            fatcaCity: '',
            fatcaDistrict: '',
            fatcaState: '',
            fatcacountry: '',
            fatcaRelPerson: 'N', //hardcoded no
            relPerKycNo: '',
            relPerTitle: '',
            relFirstName: '',
            relMiddleName: '',
            relLastName: '',
            relPerType: '',
            relPerAddressType: '',
            relPerAddressTypeExpiryDate: '',
            relPerIdentityNo: '',
            dobDeclaration: onboarding.date_of_birth
              ? format(new Date(onboarding.date_of_birth), 'dd-MMM-yyyy')
              : null,
            placeDeclaration: user_address_details.city,
            ekycType: onboarding.type == 'individual' ? 'I' : 'N',
            docPan: onboarding.pan_buffer ? onboarding.pan_buffer : '',
            docAddressProof: onboarding.address_proof_buffer
              ? onboarding.address_proof_buffer
              : null,
            docPhoto: onboarding.photo_buffer ? onboarding.photo_buffer : null,
            docCancelledCheque: onboarding.cheque_buffer
              ? onboarding.cheque_buffer
              : null,
            docSign: onboarding.signature_buffer
              ? onboarding.signature_buffer
              : null,
            docPerVerVideo: '',
            ipvEmployeeName: 'Digilocker',
            ipvEmployeeCode: '1313', //hardcode
            ipvEmployeeDesignation: 'EDR', //hardcode
            ipvEmployeeBranch: 'TESS', //hardcode
            ipvInstitutionCode: 'MFS',
            ipvInstitutionName: 'MFS',
            ipvDoneBy: 'MFS',
            kycDate: formattedDate,
            kycEmployeeName: 'MFS',
            kycEmployeeCode: 'MFS',
            kycEmployeeBranch: 'MFS',
            kycEmployeeDesignation: 'MFS',
            kycInstitutionCode: 'MFS',
            kycInstitutionName: 'MFS',
            kraInfo: 'eKYC-eIPV',
            panCopy: 'Y',
            exmtCat: 'N',
            docEsignForm: onboarding.pdf_buffers,
            kycMode: '',
            kycType: '5',
            esignpdf: '',
            aadharXml: onboarding.aadhar_xml,
            aadharPasscode: '',
            aadharDigit: '',
            appDocAddrProofCorrespondence: '',
            appFatcaCountryResidency1: 'Y', //hardcode
            appFatcaTaxIdentificationNo1: '',
            appFatcaTaxExemptFlag1: '',
            appFatcaTaxExemptReason1: '',
            appFatcaCountryResidency2: '',
            appFatcaTaxIdentificationNo2: '',
            appFatcaTaxExemptFlag2: '',
            appFatcaTaxExemptReason2: '',
            appFatcaCountryResidency3: '',
            appFatcaTaxIdentificationNo3: '',
            appFatcaTaxExemptFlag3: '',
            appFatcaTaxExemptReason3: '',
            appFatcaCountryResidency4: '',
            appFatcaTaxIdentificationNo4: '',
            appFatcaTaxExemptFlag4: '',
            appFatcaTaxExemptReason4: '',
            appFatcaDateDeclaration: '',
            appIncome: '',
            appPolConn: '',
            appNetWrth: '',
            appNetWorthDt: '',
          };

          console.log('Body', body);

          const result = await this.camsService.upload_pan(body);
          console.log('Result', result);

          onboarding.status = 'kyc_review';
          const save_status = await this.userOnboardingDetailsRepository.save(
            onboarding,
          );
          console.log('Status changed to esign successfully', save_status);

          return { status: HttpStatus.OK, data: result.data };
        } else {
          return { status: HttpStatus.NOT_FOUND, error: 'No Onboarding found' };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      console.log('Error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async findOccupationCode(occupationDesc: string) {
    const normalizedDesc = occupationDesc.toLowerCase();

    for (const key in occupationMap) {
      if (normalizedDesc.includes(key)) {
        return occupationMap[key];
      }
    }

    return null; // If no match is found
  }

  async findstateCode(state: string) {
    const normalizedDesc = state.toLowerCase();

    for (const key in stateCodeMapping) {
      if (normalizedDesc.includes(key)) {
        return stateCodeMapping[key];
      }
    }

    return null; // If no match is found
  }

  async findCountry(country: string) {
    const normalizedDesc = country.toLowerCase();

    for (const key in countryCodeMapping) {
      if (normalizedDesc.includes(key)) {
        return countryCodeMapping[key];
      }
    }

    return null; // If no match is found
  }

  async convertPdfToBase64(fileBuffer: Buffer) {
    console.log('Buffer', fileBuffer);
    console.log('FileBuffer', fileBuffer.toString('base64'));
    const bufferdata = fileBuffer.toString('base64');
    console.log('Buffer data', bufferdata);
    // let onboarding = await this.userOnboardingDetailsRepository.findOneBy({ user_id: user_id });

    // onboarding.pan_buffer = bufferdata
    // let res = await this.userOnboardingDetailsRepository.save(onboarding)
    // console.log("Saved", res)
    return { status: HttpStatus.OK, data: fileBuffer.toString('base64') }; // Convert file buffer to Base64
  }

  // async process_url(url) {
  //   try {
  //     // Read the file as a Buffer
  //     console.log("Url :", url)
  //     const fileBuffer = await fs.readFile(url);
  //     console.log("Buffer", fileBuffer)
  //     // Convert to Base64
  //     const result = await this.convertPdfToBase64(fileBuffer);

  //     console.log("Base64 Data:", result.data);
  //     return result.data;
  //   } catch (error) {
  //     console.error("Error reading the file:", error);
  //     return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: "File read error" };
  //   }
  // }

  async createpdf(user_id: number, tenant_id: string) {
    //Existing
    try {
      const user_onboarding_details =
        await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user_id },
          relations: ['user'],
        });
      const user_address_details =
        await this.userAddressDetailsRepository.findOne({
          where: { user_id: user_id },
        });
      const date = formatToDateStringmmddyyy(new Date());
      console.log('user_onboarding_details', user_onboarding_details);

      let prefix;
      if (
        user_onboarding_details.gender == 'male' ||
        user_onboarding_details.gender == 'Male'
      ) {
        prefix = 'MR';
      } else {
        prefix = 'MRS';
      }

      const name = user_onboarding_details.user.full_name
        .toUpperCase()
        .split(' ');
      const father_name = user_onboarding_details.father_name
        .toUpperCase()
        .split(' ');
      const mother_name = user_onboarding_details.mother_name
        .toUpperCase()
        .split(' ');

      console.log('Name', name);
      console.log('F Name', father_name);
      console.log('M Name', mother_name);

      const aadhaarNumber = user_onboarding_details.aadhaar_number;
      let poa_poi = '';
      if (aadhaarNumber) {
        poa_poi = aadhaarNumber.slice(-4);
        console.log(poa_poi); // Outputs last 4 digits
      }

      const placeholders = {
        prefix_1: prefix,
        first_name_1: name[0],
        last_name_1: name[name.length - 1],
        prefix_3: 'MR',
        first_name_3: father_name[0],
        last_name_3: father_name[father_name.length - 1],
        prefix_4: 'MRS',
        first_name_4: mother_name[0],
        last_name_4: mother_name[mother_name.length - 1],
        dob_date: user_onboarding_details.date_of_birth.getDate(),
        dob_month: user_onboarding_details.date_of_birth.getMonth(),
        dob_year: user_onboarding_details.date_of_birth.getFullYear(),
        pan_number: user_onboarding_details.pan.toUpperCase(),
        pan_number_1: user_onboarding_details.pan.toUpperCase(),
        line_1_address: user_address_details.line_1.toUpperCase(),
        line_2_address: user_address_details.line_2.toUpperCase(),
        line_3_address: user_address_details.line_3.toUpperCase(),
        city: user_address_details.city.toUpperCase(),
        district: user_address_details.city.toUpperCase(),
        pincode: user_address_details.pincode,
        statecode:
          stateForForm[
            Object.keys(stateForForm).find(
              (key) =>
                key.toLowerCase() === user_address_details.state.toLowerCase(),
            )
          ] || 'XX',
        country_code: 'I  N',
        email: user_onboarding_details.user.email.toUpperCase(),
        mobile: user_onboarding_details.user.mobile,
        country_name: 'INDIA',
        date: date,
        place: user_address_details.city.toUpperCase(),
        place1: user_address_details.city.toUpperCase(),
        name: user_onboarding_details.user.full_name.toUpperCase(),
        place_of_birth: user_address_details.city.toUpperCase(),
        country_of_birth: 'India',
        gender: user_onboarding_details.gender,
        marital_status: user_onboarding_details.marital_status,
        occupation: user_onboarding_details.occupation,
        annual_income: user_onboarding_details.annual_income,
        poa_poi: poa_poi,
      };

      console.log('place    text it', placeholders);
      const docxPath = path.resolve(__dirname, '../../../aof/CAMS.pdf');

      let signaturePath = user_onboarding_details.signature_url;
      let photoPath = user_onboarding_details.photo_url;
      let aadharPath = user_onboarding_details.aadhaar_url;
      let panPath = user_onboarding_details.pan_url;

      // Now resolve the paths correctly
      signaturePath = path.resolve(__dirname, `../../../${signaturePath}`);
      photoPath = path.resolve(__dirname, `../../../${photoPath}`);
      aadharPath = path.resolve(__dirname, `../../../${aadharPath}`);
      panPath = path.resolve(__dirname, `../../../${panPath}`);

      console.log('Initial Signature Path:', signaturePath);
      console.log('Initial Photo Path:', photoPath);
      console.log('Initial Aadhar Path:', aadharPath);
      console.log('Initial Pan Path:', panPath);

      signaturePath = await convertToPNG(signaturePath);
      photoPath = await convertToPNG(photoPath);
      aadharPath = await convertToPNG(aadharPath);
      panPath = await convertToPNG(panPath);

      console.log('Final Signature Path:', signaturePath);
      console.log('Final Photo Path:', photoPath);
      console.log('Final Aadhar Path:', aadharPath);
      console.log('Final Pan Path:', panPath);

      const data = await this.generatePDFWithSignature(
        user_id,
        docxPath,
        signaturePath,
        photoPath,
        placeholders,
        aadharPath,
        panPath,
        tenant_id,
      );
      return { status: HttpStatus.OK, data: data };
    } catch (err) {
      console.log('err', err);
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'sorry something went wrong ' + err.message,
      };
    }
  }

  async generatePDFWithSignature(
    user_id,
    htmlPath: string,
    signaturePath: string,
    photoPath: string,
    data: any,
    aadhaarImagePath: string,
    panImagePath: string,
    tenant_id: string,
  ) {
    try {
      console.log('Processing Data:', data);

      const pdfBytes = await fs.readFile(htmlPath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const form = pdfDoc.getForm();

      // Define placeholders for text fields and checkboxes
      const placeholders = {
        prefix_1: data.prefix_1,
        first_name_1: data.first_name_1,
        last_name_1: data.last_name_1,
        prefix_3: data.prefix_3,
        first_name_3: data.first_name_3,
        last_name_3: data.last_name_3,
        prefix_4: data.prefix_4,
        first_name_4: data.first_name_4,
        last_name_4: data.last_name_4,
        dob_date: data.dob_date.toString().padStart(2, '0'),
        dob_month: data.dob_month.toString().padStart(2, '0'),
        dob_year: data.dob_year.toString(),
        pan_number: data.pan_number,
        pan_number_1: data.pan_number,
        line_1_address: data.line_1_address,
        line_2_address: data.line_2_address,
        line_3_address: data.line_3_address,
        city: data.city,
        district: data.district,
        pincode: data.pincode,
        statecode: data.statecode,
        ccode: data.country_code,
        coun_code: data.country_code,
        email: data.email,
        mobile: data.mobile,
        date: data.date,
        date_1: data.date,
        date_2: data.date,
        date_3: data.date,
        place: data.city,
        place1: data.city,
        name: data.name,
        place_of_birth: data.place_of_birth,
        country_of_birth: data.country_of_birth,
        poa_poi: data.poa_poi,
      };

      // Gender checkboxes
      if (data.gender === 'male') placeholders['gen_male'] = 'X';
      else if (data.gender === 'female') placeholders['gen_female'] = 'X';
      else placeholders['gen_trans'] = 'X';

      // Marital Status placeholderses
      if (data.marital_status === 'married') placeholders['marry'] = 'X';
      else if (data.marital_status === 'unmarried')
        placeholders['unmarry'] = 'X';
      else placeholders['unknown'] = 'X';

      // Income placeholderses
      const incomeMap = {
        above_1lakh_upto_5lakh: '15l',
        above_5lakh_upto_10lakh: '510l',
        above_10lakh_upto_25lakh: '1025l',
        above_25lakh_upto_1cr: '251c',
        above_1cr: '1ca',
        below_1_lakh: 'b1l',
      };
      placeholders[incomeMap[data.annual_income] || 'b1l'] = 'X';

      // Occupation placeholderses
      const occupationMap = {
        'Private Sector Service': 'pri_sec',
        Business: 'bussiness',
        Professional: 'proff',
        'Public Sector Service': 'pub_sec',
        'Government Service': 'gov_sec',
        Housewife: 'hwife',
        Student: 'std',
        Retired: 'ret',
        Others: 'oth',
      };
      placeholders[occupationMap[data.occupation] || 'oth'] = 'X';

      // Default Selections
      placeholders['india'] = 'X';
      placeholders['india_1'] = 'X';
      placeholders['resi'] = 'X';
      placeholders['resi_1'] = 'X';
      placeholders['same'] = 'X';
      placeholders['na'] = 'X';
      placeholders['nope'] = 'X';
      placeholders['aadhar'] = 'X';
      placeholders['kyc_data'] = 'X';

      placeholders['institution_name'] = 'HDFC ASSET MANAGEMENT COMPANY LTD';
      placeholders['institution_code'] = 'HDFC ASSET MANAGEMENT COMPANY LTD';
      placeholders['institution'] = 'HDFC ASSET MANAGEMENT COMPANY LTD';
      placeholders['digilocker_kyc'] = 'DIGILOCKER KYC';

      console.log('Processing Placeholders:', placeholders);

      // Loop through placeholders and set values
      for (const [field, value] of Object.entries(placeholders)) {
        console.log('Setting Field:', field, 'Value:', value);

        const fieldObject = form.getField(field);
        if (fieldObject instanceof PDFTextField) {
          fieldObject.setText(value);
        }
      }

      // Convert updated PDF back to buffer
      const pdfBuffer = await pdfDoc.save();
      console.log('PDF Saved');
      console.log('Addhar Image path', aadhaarImagePath);
      console.log('PAN Image path', panImagePath);
      const newPdfDoc = await PDFDocument.load(pdfBuffer);

      // Load signature and photo
      const signatureImage = await pdfDoc.embedPng(
        await fs.readFile(signaturePath),
      );
      console.log('Signature', signatureImage);
      const photoImage = await pdfDoc.embedPng(await fs.readFile(photoPath));
      console.log('Photo', photoImage);
      const aadhaarImage = await pdfDoc.embedPng(
        await fs.readFile(aadhaarImagePath),
      );
      console.log('aadhar', aadhaarImage);
      const panImage = await pdfDoc.embedPng(await fs.readFile(panImagePath));
      console.log('pan', panImage);
      const pages = pdfDoc.getPages();

      // Add signature and photo
      if (pages.length > 0) {
        pages[0].drawImage(photoImage, {
          x: 486,
          y: 348,
          width: 81,
          height: 86,
        });
      }
      if (pages.length > 1) {
        pages[1].drawImage(signatureImage, {
          x: 410,
          y: 575,
          width: 150,
          height: 60,
        });
      }
      if (pages.length > 4) {
        pages[4].drawImage(signatureImage, {
          x: 334,
          y: 167,
          width: 193,
          height: 29,
        });
      }

      const aadhaarPage = pdfDoc.addPage();
      aadhaarPage.drawImage(aadhaarImage, {
        x: 50,
        y: 400,
        width: 500,
        height: 300,
      });

      const panPage = pdfDoc.addPage();
      panPage.drawImage(panImage, { x: 50, y: 400, width: 500, height: 300 });

      form.flatten();
      // Save final PDF
      const finalPdf = await pdfDoc.save();
      // Generate file name
      const fileName = `CAMS-${Date.now()}.pdf`;

      // Define the output directory
      const outputDir = path.join(__dirname, '../../../uploads/cams');

      console.log('PDF SAVED IN ', outputDir);

      // Ensure the directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true }); // Creates parent directories if missing
      }

      // Define the full file path
      const outputFilePath = path.join(outputDir, fileName);
      await fs.writeFile(outputFilePath, finalPdf);
      // ✅ Compress the PDF using Ghostscript
      const compressedFilePath = outputFilePath.replace(
        '.pdf',
        '_compressed.pdf',
      );
      try {
        // Use aggressive compression settings
        await execAsync(
          `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -dDownsampleColorImages=true -dColorImageResolution=150 -dGrayImageResolution=150 -dMonoImageResolution=150 -sOutputFile=${compressedFilePath} ${outputFilePath}`,
        );

        // Check if the compressed file is less than 2MB
        const stats = await fs.promises.stat(compressedFilePath);
        if (stats.size > 2 * 1024 * 1024) {
          console.warn(
            'Compressed PDF is still larger than 2MB. Applying additional compression.',
          );
          // Apply even more aggressive settings
          await execAsync(
            `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -dDownsampleColorImages=true -dColorImageResolution=100 -dGrayImageResolution=100 -dMonoImageResolution=100 -sOutputFile=${compressedFilePath} ${outputFilePath}`,
          );
        }
      } catch (compressionError) {
        console.error('PDF compression failed:', compressionError);
        throw new Error('Failed to compress PDF');
      }

      // Save compressed PDF to DB
      let initiate, generate_consent, url;
      const onboarding = await this.userOnboardingDetailsRepository.findOne({
        where: { user_id: user_id },
      });
      if (onboarding) {
        const compressedPdfBytes = await fs.promises.readFile(
          compressedFilePath,
        );
        onboarding.pdf_buffers = compressedPdfBytes.toString('base64');
        await this.userOnboardingDetailsRepository.save(onboarding);
        initiate = await this.finTupleService.initiate_esign(user_id);
        console.log('Initiated', initiate);
        generate_consent = await this.finTupleService.generate_consent(
          initiate.data[0].transactionId,
        );
        console.log('Consent', generate_consent);
        onboarding.esign_transaction_id = initiate.data[0].transactionId;
        onboarding.esign_html = generate_consent.data;
        await this.userOnboardingDetailsRepository.save(onboarding);
        url =
          process.env.BASE_URL +
          '/api/v2/onboarding/esign/postback/' +
          tenant_id +
          '?user_id=' +
          user_id;
      }

      return {
        // buffer: (await fs.promises.readFile(compressedFilePath)).toString('base64'),
        path: compressedFilePath,
        filename: path.basename(compressedFilePath),
        url: url,
      };
    } catch (error) {
      console.log('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  async esignPage(user_id: number) {
    try {
      const user_onboarding =
        await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user_id },
        });
      console.log('DADADA', user_onboarding);
      return { status: HttpStatus.OK, data: user_onboarding.esign_html };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, message: err.message };
    }
  }

  async update_pdf(user_id: number) {
    try {
      const user_onboarding =
        await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user_id },
        });
      const get_pdf = await this.finTupleService.get_pdf(
        user_onboarding.esign_transaction_id,
      );
      console.log('GEt PDF', get_pdf.data);
      // user_onboarding.pdf_buffers =
      // console.log("DADADA", user_onboarding)
      return { status: HttpStatus.OK, result: 'PDF Saved successfully' };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, message: err.message };
    }
  }

  // async createpdf_v2(user_id: number) {
  //   try {
  //     let user_onboarding_details = await this.userOnboardingDetailsRepository.findOne({ where: { user_id: user_id }, relations: ['user'] });
  //     let user_address_details = await this.userAddressDetailsRepository.findOne({ where: { user_id: user_id } });
  //     let date = formatToDateStringmmddyyy(new Date());

  //     let prefix = user_onboarding_details.gender.toLowerCase() === "male" ? "MR" : "MRS";

  //     let placeholders = {
  //       "prefix_1": prefix,
  //       "first_name_1": user_onboarding_details.user.full_name.toUpperCase().split(" ")[0],
  //       "last_name_1": user_onboarding_details.user.full_name.toUpperCase().split(" ").slice(-1)[0],
  //       "date": date,
  //       "email": user_onboarding_details.user.email.toUpperCase(),
  //       "mobile": user_onboarding_details.user.mobile
  //     };

  //     const docxPath = path.resolve(__dirname, '../../../aof/CAMS.pdf');
  //     let signaturePath = await convertToPNG(path.resolve(__dirname, `../../../${user_onboarding_details.signature_url.replace(/^https?:\/\/[^\/]+:3021\//, '')}`));
  //     let photoPath = await convertToPNG(path.resolve(__dirname, `../../../${user_onboarding_details.photo_url.replace(/^https?:\/\/[^\/]+:3021\//, '')}`));

  //     // Fetch Aadhaar and PAN images
  //     let aadhaarImagePath = await this.downloadAndSaveImage(user_onboarding_details.aadhaar_url, 'aadhaar.png');
  //     let panImagePath = await this.downloadAndSaveImage(user_onboarding_details.pan_url, 'pan.png');

  //     let data = await this.generatePDFWithSignature_v2(user_id, docxPath, signaturePath, photoPath, placeholders, aadhaarImagePath, panImagePath);
  //     return { status: HttpStatus.OK, data: data };
  //   } catch (err) {
  //     console.log("Error:", err);
  //     return { status: HttpStatus.BAD_REQUEST, message: "Sorry, something went wrong: " + err.message };
  //   }
  // }

  // // Function to download an image and save it locally
  // async downloadAndSaveImage(imageUrl: string, filename: string): Promise<string> {
  //   try {
  //     console.log("Image url", imageUrl)
  //     let imageurl = `${imageUrl}`
  //     console.log("URLL", imageurl)
  //     console.log("File name", filename)
  //     const response = await axios.get(imageurl, { responseType: 'arraybuffer' });
  //     const outputDir = path.join(__dirname, '../../../temp');
  //     if (!fs.existsSync(outputDir)) {
  //       fs.mkdirSync(outputDir, { recursive: true }); // Creates parent directories if missing
  //     }
  //     const imagePath = path.resolve(__dirname, `../../../temp/${filename}`);
  //     await fs.writeFile(imagePath, response.data);
  //     return imagePath;
  //   } catch (error) {
  //     console.error(`Failed to download ${imageUrl}:`, error.message);
  //     throw new Error("Image download failed");
  //   }
  // }

  // async generatePDFWithSignature_v2(
  //   user_id,
  //   htmlPath: string,
  //   signaturePath: string,
  //   photoPath: string,
  //   data: any,
  //   aadhaarImagePath: string,
  //   panImagePath: string
  // ) {
  //   try {
  //     console.log("Processing Data:", data);

  //     const pdfBytes = await fs.readFile(htmlPath);
  //     const pdfDoc = await PDFDocument.load(pdfBytes);
  //     const form = pdfDoc.getForm();

  //     // Define placeholders for text fields
  //     let placeholders = {
  //       prefix_1: data.prefix_1,
  //       first_name_1: data.first_name_1,
  //       last_name_1: data.last_name_1,
  //       dob_date: data.dob_date.toString().padStart(2, "0"),
  //       dob_month: data.dob_month.toString().padStart(2, "0"),
  //       dob_year: data.dob_year.toString(),
  //       pan_number: data.pan_number,
  //       line_1_address: data.line_1_address,
  //       city: data.city,
  //       email: data.email,
  //       mobile: data.mobile,
  //       date: data.date,
  //       place: data.city,
  //       name: data.name,
  //       country_of_birth: data.country_of_birth,
  //     };

  //     // Set gender checkboxes
  //     placeholders[data.gender === "male" ? "gen_male" : data.gender === "female" ? "gen_female" : "gen_trans"] = "X";

  //     // Set marital status checkboxes
  //     placeholders[data.marital_status === "married" ? "marry" : data.marital_status === "unmarried" ? "unmarry" : "unknown"] = "X";

  //     // Set placeholders in form
  //     for (const [field, value] of Object.entries(placeholders)) {
  //       const fieldObject = form.getField(field);
  //       if (fieldObject instanceof PDFTextField) {
  //         fieldObject.setText(value);
  //       }
  //     }

  //     // Convert updated PDF back to buffer
  //     let pdfBuffer = await pdfDoc.save();
  //     let newPdfDoc = await PDFDocument.load(pdfBuffer);

  //     // Load images
  //     const signatureImage = await pdfDoc.embedPng(await fs.readFile(signaturePath));
  //     const photoImage = await pdfDoc.embedPng(await fs.readFile(photoPath));
  //     const aadhaarImage = await pdfDoc.embedPng(await fs.readFile(aadhaarImagePath));
  //     const panImage = await pdfDoc.embedPng(await fs.readFile(panImagePath));

  //     const pages = pdfDoc.getPages();

  //     // Add signature and photo
  //     if (pages.length > 0) {
  //       pages[0].drawImage(photoImage, { x: 486, y: 348, width: 81, height: 86 });
  //     }
  //     if (pages.length > 1) {
  //       pages[1].drawImage(signatureImage, { x: 410, y: 575, width: 150, height: 60 });
  //     }
  //     if (pages.length > 4) {
  //       pages[4].drawImage(signatureImage, { x: 334, y: 167, width: 193, height: 29 });
  //     }

  //     // Add new pages for Aadhaar and PAN
  //     const aadhaarPage = pdfDoc.addPage();
  //     aadhaarPage.drawImage(aadhaarImage, { x: 50, y: 400, width: 500, height: 300 });

  //     const panPage = pdfDoc.addPage();
  //     panPage.drawImage(panImage, { x: 50, y: 400, width: 500, height: 300 });

  //     form.flatten();

  //     // Save final PDF
  //     const finalPdf = await pdfDoc.save();
  //     const fileName = `CAMS-${Date.now()}.pdf`;

  //     // Define output directory
  //     const outputDir = path.join(__dirname, '../../../uploads/cams');
  //     if (!fs.existsSync(outputDir)) {
  //       fs.mkdirSync(outputDir, { recursive: true });
  //     }

  //     // Save the uncompressed PDF
  //     const outputFilePath = path.join(outputDir, fileName);
  //     await fs.writeFile(outputFilePath, finalPdf);

  //     // Compress the PDF
  //     const compressedFilePath = outputFilePath.replace('.pdf', '_compressed.pdf');
  //     try {
  //       await execAsync(
  //         `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -dDownsampleColorImages=true -dColorImageResolution=150 -dGrayImageResolution=150 -dMonoImageResolution=150 -sOutputFile=${compressedFilePath} ${outputFilePath}`
  //       );

  //       // Check if further compression is needed
  //       const stats = await fs.promises.stat(compressedFilePath);
  //       if (stats.size > 2 * 1024 * 1024) {
  //         await execAsync(
  //           `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -dDownsampleColorImages=true -dColorImageResolution=100 -dGrayImageResolution=100 -dMonoImageResolution=100 -sOutputFile=${compressedFilePath} ${outputFilePath}`
  //         );
  //       }
  //     } catch (compressionError) {
  //       console.error("PDF compression failed:", compressionError);
  //       throw new Error("Failed to compress PDF");
  //     }

  //     // Save compressed PDF to DB
  //     const onboarding = await this.userOnboardingDetailsRepository.findOne({ where: { user_id: user_id } });
  //     if (onboarding) {
  //       const compressedPdfBytes = await fs.promises.readFile(compressedFilePath);
  //       onboarding.pdf_buffers = compressedPdfBytes.toString('base64');
  //       await this.userOnboardingDetailsRepository.save(onboarding);
  //     }

  //     return {
  //       buffer: (await fs.promises.readFile(compressedFilePath)).toString('base64'),
  //       path: compressedFilePath,
  //       filename: path.basename(compressedFilePath),
  //     };
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //     throw new Error('Failed to generate PDF');
  //   }
  // }
}

function formatToDateStringmmddyyy(date: Date): string {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

async function convertToPNG(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') {
    const newPath = filePath.replace(/\.(jpg|jpeg)$/i, '.png');

    try {
      const image = await loadImage(filePath); // Load the image
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');

      ctx.drawImage(image, 0, 0); // Draw the image on the canvas

      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(newPath, buffer); // Save as PNG

      console.log(`Converted ${filePath} to ${newPath}`);
      return newPath;
    } catch (error) {
      console.error(`Error converting ${filePath}:`, error);
      return filePath;
    }
  }
  return filePath;
}
