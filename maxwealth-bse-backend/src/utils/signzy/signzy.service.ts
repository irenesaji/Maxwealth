import { HttpService } from '@nestjs/axios';
import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  Scope,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import FormData from 'form-data';
import * as qs from 'qs';
import { catchError, lastValueFrom, map } from 'rxjs';
import { AddUserBankDetailsDto } from 'src/onboarding/bank/dtos/add-user-bank-details.dto';
import { KycStatusDetail } from 'src/onboarding/entities/kyc_status_details.entity';
import { SignzyKycObject } from 'src/onboarding/entities/signzy_kyc_object.entity';
import { IncomeRangeRepository } from 'src/repositories/income_range.repository';
import { KycStatusDetailRepository } from 'src/repositories/kyc_status_details.repository';
import { OccupationRepository } from 'src/repositories/occupation.repository';
import { SignzyKycObjectRepository } from 'src/repositories/signzy_kyc_object.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';

import { Users } from 'src/users/entities/users.entity';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { random } from 'mathjs';
import { UserBankDetailsRepository } from 'src/repositories/user_bank_details.repository';

@Injectable({ scope: Scope.REQUEST })
export class SignzyService {
  signzy_base_url: string;
  base_url: string;
  signzy_channel_username: string;
  signzy_channel_password: string;

  constructor(
    private readonly httpService: HttpService,
    private signzyKycObjectRepository: SignzyKycObjectRepository,
    private userOnboardingDetailsRepository: UserOnboardingDetailsRepository,
    private incomeRangeRepository: IncomeRangeRepository,
    private occupationRepository: OccupationRepository,
    private kycStatusDetailRepository: KycStatusDetailRepository,
    private userBankDetailsRepository: UserBankDetailsRepository,
  ) {
    const configService = new ConfigService();
    this.signzy_base_url = configService.get('SIGNZY_BASE_URL');
    this.signzy_channel_username = configService.get('SIGNZY_USERNAME');
    this.signzy_channel_password = configService.get('SIGNZY_PASSWORD');
    this.base_url = configService.get('BASE_URL');
  }

  async channel_login() {
    try {
      console.log('this.body!!! none');
      const headersRequest = {};

      const bodyRequest = qs.stringify({
        username: this.signzy_channel_username,
        password: this.signzy_channel_password,
      });

      console.log('this.body!!!', bodyRequest);
      const response = this.httpService
        .post(this.signzy_base_url + '/api/channels/login', bodyRequest, {
          headers: headersRequest,
        })
        .pipe(
          map((resp) => {
            console.log('signzy  ' + resp);
            return resp.data;
          }),
        )
        .pipe(
          catchError((e) => {
            console.log('error in signzy auth ', e);

            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (err) {
      console.log(
        'Error11',
        'Third party APIs are down. Please try after sometime or if issue persists contact support.  ' +
          err.response.data.error.message,
      );

      return {
        status: HttpStatus.BAD_REQUEST,
        error:
          'Third party APIs are down. Please try after sometime or if issue persists contact support.  ',
      };
    }
  }

  generateDateTimeBasedCode(): number {
    const now = new Date();

    // Get date components
    const year = now.getFullYear().toString().slice(-2); // Last 2 digits of the year
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month (01-12)
    const day = now.getDate().toString().padStart(2, '0'); // Day of the month (01-31)

    // Get time components
    const hours = now.getHours().toString().padStart(2, '0'); // Hours (00-23)
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Minutes (00-59)
    const seconds = now.getSeconds().toString().padStart(2, '0'); // Seconds (00-59)

    // Generate a random 2-digit number
    const randomPart = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, '0');

    // Combine components
    const code = `${year}${month}${day}${hours}${minutes}${seconds}${randomPart}`;

    // Take the last 8 digits to ensure it's exactly 8 digits
    const truncatedCode = code.slice(-8);
    return parseInt(truncatedCode, 10); // Convert to a number
  }

  async create_onboarding_object(user: Users) {
    try {
      const channel_login_response = await this.channel_login();

      if (channel_login_response.status == HttpStatus.OK) {
        //username format - user_id + _ + phone_number + _ + sequence

        const signzy_objs = await this.signzyKycObjectRepository
          .createQueryBuilder('signzy_kyc_objects')
          .where('signzy_kyc_objects.username LIKE :username', {
            username: `%${user.id + '_' + user.mobile}%`,
          })
          .getMany();

        const username =
          user.id +
          '_' +
          user.mobile +
          '_' +
          (signzy_objs.length + 1).toString() +
          '_' +
          this.generateDateTimeBasedCode();

        const body = {
          email: user.email,
          username: username,
          phone: user.mobile,
          name: user.full_name,
        };

        const result = await this.post_request(
          this.signzy_base_url +
            '/api/channels/' +
            channel_login_response.userId +
            '/onboardings',
          channel_login_response.id,
          body,
        );

        return result;
      } else {
        return channel_login_response;
      }
    } catch (err) {
      console.log(
        'Error11',
        'Third party APIs are down. Please try after sometime or if issue persists contact support.  ' +
          err.response.data.error.message,
      );
      return {
        status: HttpStatus.BAD_REQUEST,
        error:
          'Third party APIs are down. Please try after sometime or if issue persists contact support.  ',
      };
    }
  }

  async create_investor_login(username: string, password: string) {
    try {
      const channel_login_response = await this.channel_login();

      if (channel_login_response.status == HttpStatus.OK) {
        const body = {
          username: username,
          password: password,
        };
        const result = await this.post_request(
          this.signzy_base_url +
            '/api/onboardings/login?ns=icici_mileswealth_preprod',
          channel_login_response.id,
          body,
        );
        return result;
      } else {
        return channel_login_response;
      }
    } catch (err) {
      console.log('investor login error', err.data);

      return {
        status: HttpStatus.BAD_REQUEST,
        error:
          'Third party APIs are down. Please try after sometime or if issue persists contact support.  ',
      };
    }
  }

  async update_kyc_data(
    user: Users,
    signzy_kyc_object: SignzyKycObject,
    kyc_status_detail: KycStatusDetail,
  ) {
    try {
      if (
        kyc_status_detail.pan &&
        kyc_status_detail.full_name &&
        kyc_status_detail.date_of_birth &&
        kyc_status_detail.father_name &&
        kyc_status_detail.mother_name &&
        kyc_status_detail.marital_status &&
        kyc_status_detail.gender &&
        kyc_status_detail.occupation &&
        kyc_status_detail.annual_income &&
        kyc_status_detail.nationality
      ) {
        console.log('1 signzy');

        const investor_login = await this.create_investor_login(
          signzy_kyc_object.username,
          signzy_kyc_object.password,
        );

        if (investor_login.status == HttpStatus.OK) {
          console.log('2 signzy login');

          const url = this.signzy_base_url + '/api/onboardings/updateForm';
          const user_onboarding_detail =
            await this.userOnboardingDetailsRepository.findOneBy({
              user_id: user.id,
            });
          const incomeRange = await this.incomeRangeRepository.findOneBy({
            income_range_identifier: user_onboarding_detail.annual_income,
          });
          console.log('3 signzy login', incomeRange);

          let occupation = await this.occupationRepository.findOneBy({
            occupation_identifier: user_onboarding_detail.occupation,
          });
          if (!occupation) {
            occupation = await this.occupationRepository.findOneBy({
              occupation_identifier: 'not_categorized',
            });
          }
          console.log('4 signzy login');

          const body = {
            merchantId: signzy_kyc_object.password,

            save: 'formData',

            type: 'kycdata',

            data: {
              type: 'kycdata',
              kycData: {
                gender: user_onboarding_detail.gender == 'male' ? 'M' : 'F',
                maritalStatus:
                  user_onboarding_detail.marital_status.toUpperCase(),
                emailId: user.email,
                annualIncome: incomeRange.code,
                nomineeRelationShip: 'FATHER',
                fatherName: user_onboarding_detail.father_name,
                fatherTitle: 'Mr.',
                motherName: user_onboarding_detail.mother_name,
                motherTitle: 'Mrs.',
                panNumber: user_onboarding_detail.pan,
                // "aadhaarNumber":"000000009900",
                citizenshipCountryCode: '101',
                citizenshipCountry: 'India',
                residentialStatus: 'Resident Individual',
                occupationCode: occupation.code,
                occupationDescription: occupation.occupation_description,
                countryCode: 91,
                mobileNumber: user.mobile,
                permanentAddressCode: '02',
                permanentAddressType: 'Residential',
                communicationAddressCode: '02',
                communicationAddressType: 'Residential',
                applicationStatusCode: 'R',
                applicationStatusDescription: 'Resident Indian',
                kycAccountCode: '01',
                kycAccountDescription: 'New',
              },
            },
          };
          console.log('5 signzy login');

          const result = await this.post_request(
            url,
            investor_login.data.id,
            body,
          );
          console.log('6 signzy login');
          if (result.status == HttpStatus.OK) {
            kyc_status_detail.signzy_kyc_data_updated = true;
            await this.kycStatusDetailRepository.save(kyc_status_detail);
          }
          return result;
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            error:
              'Third party APIs are down. Please try after sometime or if issue persists contact support.(investor login failed)',
          };
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'data is not complete',
        };
      }
    } catch (err) {
      console.log(
        'Error12',
        'Third party APIs are down. Please try after sometime or if issue persists contact support.  ' +
          err.response.data.error.message,
      );

      return {
        status: HttpStatus.BAD_REQUEST,
        error:
          'Third party APIs are down. Please try after sometime or if issue persists contact support.  ',
      };
    }
  }

  async update_bank_details(
    user_bank_details: AddUserBankDetailsDto,
    signzy_kyc_object: SignzyKycObject,
    kyc_status_detail: KycStatusDetail,
  ) {
    try {
      const investor_login = await this.create_investor_login(
        signzy_kyc_object.username,
        signzy_kyc_object.password,
      );

      if (investor_login.status == HttpStatus.OK) {
        const body = {
          merchantId: signzy_kyc_object.password,

          save: 'formData',

          type: 'bankAccount',

          data: {
            name: user_bank_details.account_holder_name,
            accountNumber: user_bank_details.account_number,
            ifsc: user_bank_details.ifsc_code,
          },
        };
        console.log('body', body);
        const result = await this.post_request(
          this.signzy_base_url + '/api/onboardings/updateForm',
          investor_login.data.id,
          body,
        );
        if (result.status == HttpStatus.OK) {
          kyc_status_detail.signzy_bank_updated = true;
          await this.kycStatusDetailRepository.save(kyc_status_detail);
        }
        return result;
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Third party APIs are down. Please try after sometime or if issue persists contact support.(investor login failed)',
        };
      }
    } catch (err) {
      console.log(
        'Error11',
        'Third party APIs are down. Please try after sometime or if issue persists contact support.  ' +
          err.response.data.error.message,
      );

      return {
        status: HttpStatus.BAD_REQUEST,
        error:
          'Third party APIs are down. Please try after sometime or if issue persists contact support.  ',
      };
    }
  }
  async generate_digilocker_url(
    tenant_id,
    signzy_kyc_object,
    kyc_status_detail: KycStatusDetail,
  ) {
    try {
      console.log('investor_login1');
      const investor_login = await this.create_investor_login(
        signzy_kyc_object.username,
        signzy_kyc_object.password,
      );
      console.log('investor_login2', investor_login);

      if (investor_login.status == HttpStatus.OK) {
        const body = {
          merchantId: signzy_kyc_object.password,

          inputData: {
            service: 'identity',

            type: 'aadhaarDigiLocker',
            task: 'createUrl',
            essentials: {
              redirectUrl:
                this.base_url +
                '/api/onboarding/identity_postback/' +
                tenant_id,
            },
            data: {
              images: [],
              proofType: 'identity',
            },
          },
        };
        console.log('body', body);
        const result = await this.post_request(
          this.signzy_base_url + '/api/onboardings/execute',
          investor_login.data.id,
          body,
        );
        if (result.status == HttpStatus.OK) {
          kyc_status_detail.signzy_poi_poa_link_generated = true;
          await this.kycStatusDetailRepository.save(kyc_status_detail);
        }
        return result;
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Third party APIs are down. Please try after sometime or if issue persists contact support.(investor login failed)',
        };
      }
    } catch (err) {
      console.log(
        'Error11',
        'Third party APIs are down. Please try after sometime or if issue persists contact support.  ' +
          err.response.data.error.message,
      );

      return {
        status: HttpStatus.BAD_REQUEST,
        error:
          'Third party APIs are down. Please try after sometime or if issue persists contact support.  ',
      };
    }
  }

  async fetch_digilocker_details(
    user,
    signzy_kyc_object,
    kyc_status_detail: KycStatusDetail,
  ) {
    try {
      const investor_login = await this.create_investor_login(
        signzy_kyc_object.username,
        signzy_kyc_object.password,
      );

      if (investor_login.status == HttpStatus.OK) {
        const body = {
          merchantId: signzy_kyc_object.password,

          inputData: {
            service: 'identity',

            type: 'aadhaarDigiLocker',
            task: 'getDetails',
            data: {
              images: [],
              proofType: 'identity',
            },
          },
        };
        console.log('body', body);
        const result = await this.post_request(
          this.signzy_base_url + '/api/onboardings/execute',
          investor_login.data.id,
          body,
        );
        // if(result.status == HttpStatus.OK){

        //     await this.kycStatusDetailRepository.save(kyc_status_detail);
        // }
        return result;
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Third party APIs are down. Please try after sometime or if issue persists contact support.(investor login failed)',
        };
      }
    } catch (err) {
      console.log(
        'Error14',
        'Third party APIs are down. Please try after sometime or if issue persists contact support.  ' +
          err.response.data.error.message,
      );

      return {
        status: HttpStatus.BAD_REQUEST,
        error:
          'Third party APIs are down. Please try after sometime or if issue persists contact support.  ',
      };
    }
  }

  async update_address_details(
    user,
    signzy_kyc_object,
    kyc_status_detail: KycStatusDetail,
    address_output,
  ) {
    try {
      const investor_login = await this.create_investor_login(
        signzy_kyc_object.username,
        signzy_kyc_object.password,
      );

      if (investor_login.status == HttpStatus.OK) {
        const body = {
          merchantId: signzy_kyc_object.password,

          save: 'formData',

          type: 'addressProof',

          data: {
            type: 'aadhaarDigiLocker',
            name: address_output.name,
            uid: address_output.uid,
            address: address_output.address,
            city: address_output.splitAddress.city[0],
            state: address_output.splitAddress.state[0][0],
            district: address_output.splitAddress.district[0],
            pincode: address_output.splitAddress.pincode,
            dob: address_output.dob,
          },
        };
        console.log('body', body);
        console.log('going forward to update in signzy');
        const result = await this.post_request(
          this.signzy_base_url + '/api/onboardings/updateForm',
          investor_login.data.id,
          body,
        );
        console.log('done going forward to update in signzy', result);
        if (result.status == HttpStatus.OK) {
          console.log('done going forward succesfully');
          kyc_status_detail.signzy_poi_poa_updated = true;
          await this.kycStatusDetailRepository.save(kyc_status_detail);
        }
        return result;
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Third party APIs are down. Please try after sometime or if issue persists contact support.(investor login failed)',
        };
      }
    } catch (err) {
      console.log(
        'Error11',
        'Third party APIs are down. Please try after sometime or if issue persists contact support.  ' +
          err.response.data.error.message,
      );

      return {
        status: HttpStatus.BAD_REQUEST,
        error:
          'Third party APIs are down. Please try after sometime or if issue persists contact support.  ',
      };
    }
  }

  async update_photo_upload(
    user,
    signzy_kyc_object,
    kyc_status_detail: KycStatusDetail,
    photo_upload_url,
  ) {
    try {
      const investor_login = await this.create_investor_login(
        signzy_kyc_object.username,
        signzy_kyc_object.password,
      );

      if (investor_login.status == HttpStatus.OK) {
        const body = {
          merchantId: signzy_kyc_object.password,

          save: 'formData',

          type: 'userPhoto',

          data: {
            photoUrl: photo_upload_url,
          },
        };
        console.log('body', body);
        const result = await this.post_request(
          this.signzy_base_url + '/api/onboardings/updateForm',
          investor_login.data.id,
          body,
        );
        if (result.status == HttpStatus.OK) {
          kyc_status_detail.signzy_photo_updated = true;
          await this.kycStatusDetailRepository.save(kyc_status_detail);
        }
        return result;
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Third party APIs are down. Please try after sometime or if issue persists contact support.(investor login failed)',
        };
      }
    } catch (err) {
      console.log(
        'Error11',
        'Third party APIs are down. Please try after sometime or if issue persists contact support.  ' +
          err.response.data.error.message,
      );

      return {
        status: HttpStatus.BAD_REQUEST,
        error:
          'Third party APIs are down. Please try after sometime or if issue persists contact support.  ',
      };
    }
  }

  async update_signature_upload(
    user,
    signzy_kyc_object,
    kyc_status_detail: KycStatusDetail,
    signature_upload_url,
  ) {
    try {
      const investor_login = await this.create_investor_login(
        signzy_kyc_object.username,
        signzy_kyc_object.password,
      );

      if (investor_login.status == HttpStatus.OK) {
        const body = {
          merchantId: signzy_kyc_object.password,

          save: 'formData',

          type: 'signature',

          data: {
            type: 'signature',
            signatureImageUrl: signature_upload_url,
          },
        };
        console.log('body', body);
        const result = await this.post_request(
          this.signzy_base_url + '/api/onboardings/updateForm',
          investor_login.data.id,
          body,
        );
        if (result.status == HttpStatus.OK) {
          kyc_status_detail.signzy_signature_updated = true;
          await this.kycStatusDetailRepository.save(kyc_status_detail);
        }
        return result;
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Third party APIs are down. Please try after sometime or if issue persists contact support.(investor login failed)',
        };
      }
    } catch (err) {
      console.log(
        'Error11',
        'Third party APIs are down. Please try after sometime or if issue persists contact support.  ' +
          err.response.data.error.message,
      );

      return {
        status: HttpStatus.BAD_REQUEST,
        error:
          'Third party APIs are down. Please try after sometime or if issue persists contact support.  ',
      };
    }
  }

  async create_pdf(
    userOnboardingDetail: UserOnboardingDetails,
    signzy_kyc_object: SignzyKycObject,
    kyc_status_detail: KycStatusDetail,
  ) {
    try {
      if (
        kyc_status_detail.signzy_signature_updated &&
        kyc_status_detail.signzy_poi_poa_updated &&
        kyc_status_detail.signzy_photo_updated &&
        kyc_status_detail.signzy_bank_updated &&
        kyc_status_detail.signzy_kyc_data_updated
      ) {
        const investor_login = await this.create_investor_login(
          signzy_kyc_object.username,
          signzy_kyc_object.password,
        );

        if (investor_login.status == HttpStatus.OK) {
          const body = {
            merchantId: signzy_kyc_object.password,

            inputData: {
              service: 'esign',
              task: 'createPdf',
            },
          };
          console.log('body', body);
          const result = await this.post_request(
            this.signzy_base_url + '/api/onboardings/execute',
            investor_login.data.id,
            body,
          );
          if (result.status == HttpStatus.OK) {
            kyc_status_detail.signzy_generate_pdf = true;
            await this.kycStatusDetailRepository.save(kyc_status_detail);

            userOnboardingDetail.pdf_url =
              result.data.object.result.combinedPdf;
            await this.userOnboardingDetailsRepository.save(
              userOnboardingDetail,
            );
          }
          return result;
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            error:
              'Third party APIs are down. Please try after sometime or if issue persists contact support. (investor login failed)',
          };
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'please complete the steps needed to enable pdf creation',
        };
      }
    } catch (err) {
      console.log(
        'Error11',
        'Third party APIs are down. Please try after sometime or if issue persists contact support.  ' +
          err.response.data.error.message,
      );

      return {
        status: HttpStatus.BAD_REQUEST,
        error:
          'Third party APIs are down. Please try after sometime or if issue persists contact support.  ',
      };
    }
  }

  async generate_esign(
    tenant_id,
    onboarding: UserOnboardingDetails,
    signzy_kyc_object: SignzyKycObject,
    kyc_status_detail: KycStatusDetail,
  ) {
    try {
      if (!kyc_status_detail.signzy_generate_pdf) {
        const pdf_resp = await this.create_pdf(
          onboarding,
          signzy_kyc_object,
          kyc_status_detail,
        );
        if (pdf_resp.status != HttpStatus.OK) {
          return pdf_resp;
        } else {
          kyc_status_detail.signzy_generate_pdf = true;
          await this.kycStatusDetailRepository.save(kyc_status_detail);

          onboarding.pdf_url = pdf_resp['data'].object.result.combinedPdf;
          await this.userOnboardingDetailsRepository.save(onboarding);
        }
      }

      const investor_login = await this.create_investor_login(
        signzy_kyc_object.username,
        signzy_kyc_object.password,
      );

      if (investor_login.status == HttpStatus.OK) {
        const body = {
          merchantId: signzy_kyc_object.password,

          inputData: {
            service: 'esign',
            task: 'createEsignUrl',
            data: {
              inputFile: onboarding.pdf_url,
              signatureType: 'aadhaaresign',
              redirectUrl:
                this.base_url +
                '/api/onboarding/esign_postback/' +
                tenant_id +
                '?onboarding_id=' +
                onboarding.id.toString(),
              eventCallbackUrl:
                this.base_url +
                '/api/onboarding/esign_postback/' +
                tenant_id +
                '?onboarding_id=' +
                onboarding.id.toString(),
            },
          },
        };
        console.log('body', body);
        const result = await this.post_request(
          this.signzy_base_url + '/api/onboardings/execute',
          investor_login.data.id,
          body,
        );
        if (result.status == HttpStatus.OK) {
          kyc_status_detail.signzy_generate_aadhar_esign_url = true;
          await this.kycStatusDetailRepository.save(kyc_status_detail);
        }
        return result;
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Third party APIs are down. Please try after sometime or if issue persists contact support. (investor login failed)',
        };
      }
    } catch (err) {
      console.log(
        'Error11',
        'Third party APIs are down. Please try after sometime or if issue persists contact support.  ' +
          err.response.data.error.message,
      );

      return {
        status: HttpStatus.BAD_REQUEST,
        error:
          'Third party APIs are down. Please try after sometime or if issue persists contact support.  ',
      };
    }
  }

  async post_request(url, token, body) {
    console.log('bodyboy', body, typeof body);
    const headersReq = {
      'Content-Type': 'application/json', // afaik this one is not needed
      Authorization: token,
    };
    const response = this.httpService
      .post(url, body, { headers: headersReq })
      .pipe(
        map((resp) => {
          // console.log("SIGNZY RESPONSE" + JSON.stringify(resp));
          // console.log("SIGNZY RESPONSE" + JSON.stringify(resp.data));

          return resp.data;
        }),
      )
      .pipe(
        catchError((e) => {
          console.log(' POST ERROR', e);

          console.log('kays', e.response);

          throw new ForbiddenException(
            e.response,
            'Third party APIs are down. Please try after sometime or if issue persists contact support.' +
              e.message,
          );
        }),
      );

    const result = await lastValueFrom(response);
    console.log('POST RESPONSE RESULT ', result);
    return { status: HttpStatus.OK, data: result };
  }

  async fileToUpload(signzy_kyc_object, file_path: string) {
    try {
      const investor_login = await this.create_investor_login(
        signzy_kyc_object.username,
        signzy_kyc_object.password,
      );

      if (investor_login.status == HttpStatus.OK) {
        const headersRequest = {
          Authorization: investor_login.data.id,
          'Content-Type': 'multipart/form-data',
        };

        const formData = new FormData();
        console.log(file_path);
        const fileBuffer = await readFileSync(file_path);
        formData.append('tls', '2592000');

        formData.append('file', fileBuffer, file_path);
        const response = this.httpService
          .post(this.signzy_base_url + '/api/onboardings/upload', formData, {
            headers: headersRequest,
          })
          .pipe(
            map((resp) => {
              console.log('FP RESPONSE' + resp);
              console.log('FP RESPONSE' + resp.data);

              return resp.data;
            }),
          )
          .pipe(
            catchError((e) => {
              console.log(' POST ERROR');

              console.log('kays', e.response);

              throw new ForbiddenException(
                e.response,
                'Third party APIs are down. Please try after sometime or if issue persists contact support.' +
                  e.message,
              );
            }),
          );

        const result = await lastValueFrom(response);

        return { status: HttpStatus.OK, data: result };
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Third party APIs are down. Please try after sometime or if issue persists contact support. Token Generation Issue',
        };
      }
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error:
          'Third party APIs are down. Please try after sometime or if issue persists contact support. ' +
          e.message,
      };
    }
  }

  async getIsOnboardingComplete(user_id: number) {
    try {
      const user_onboarding_details =
        await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user_id },
          order: {
            created_at: 'DESC',
          },
          relations: [
            'kyc_status_details',
            'user_bank_details',
            'user_address_details',
          ],
        });
      const user_bank_details = await this.userBankDetailsRepository.find({
        where: { user_id: user_id },
      });

      if (
        user_onboarding_details.is_onboarding_complete != null &&
        user_onboarding_details.is_onboarding_complete == true
      ) {
        return {
          status: HttpStatus.OK,
          data: {
            is_onboarding_complete:
              user_onboarding_details.is_onboarding_complete,
          },
        };
      } else {
        const kyc_status_detail =
          user_onboarding_details.kyc_status_details[
            user_onboarding_details.kyc_status_details.length - 1
          ];
        if (user_onboarding_details.is_kyc_compliant) {
          console.log(
            'user_onboarding_details',
            user_onboarding_details,
            user_onboarding_details.pan != null &&
              user_onboarding_details.full_name != null &&
              user_onboarding_details.date_of_birth != null &&
              user_onboarding_details.father_name != null &&
              user_onboarding_details.mother_name != null &&
              user_onboarding_details.marital_status != null &&
              user_onboarding_details.gender != null &&
              user_onboarding_details.occupation != null &&
              user_onboarding_details.nationality != null &&
              user_bank_details.length > 0 &&
              user_bank_details[0].account_number != null &&
              user_bank_details[0].account_holder_name != null &&
              user_bank_details[0].bank_name != null &&
              user_bank_details[0].ifsc_code != null,
          );
          if (
            user_onboarding_details.pan != null &&
            user_onboarding_details.full_name != null &&
            user_onboarding_details.date_of_birth != null &&
            user_onboarding_details.father_name != null &&
            user_onboarding_details.mother_name != null &&
            user_onboarding_details.marital_status != null &&
            user_onboarding_details.gender != null &&
            user_onboarding_details.occupation != null &&
            user_onboarding_details.nationality != null &&
            user_bank_details.length > 0 &&
            user_bank_details[0].account_number != null &&
            user_bank_details[0].account_holder_name != null &&
            user_bank_details[0].bank_name != null &&
            user_bank_details[0].ifsc_code != null
          ) {
            user_onboarding_details.is_onboarding_complete = true;
            await this.userOnboardingDetailsRepository.save(
              user_onboarding_details,
            );
            return {
              status: HttpStatus.OK,
              data: {
                is_onboarding_complete:
                  user_onboarding_details.is_onboarding_complete,
              },
            };
          } else {
            user_onboarding_details.is_onboarding_complete = false;
            await this.userOnboardingDetailsRepository.save(
              user_onboarding_details,
            );
            return {
              status: HttpStatus.OK,
              data: {
                is_onboarding_complete:
                  user_onboarding_details.is_onboarding_complete,
              },
            };
          }
        } else {
          if (kyc_status_detail.status == 'successful') {
            user_onboarding_details.is_onboarding_complete = true;
            await this.userOnboardingDetailsRepository.save(
              user_onboarding_details,
            );
          } else {
            user_onboarding_details.is_onboarding_complete = false;
            await this.userOnboardingDetailsRepository.save(
              user_onboarding_details,
            );
          }
          return {
            status: HttpStatus.OK,
            data: {
              is_onboarding_complete:
                user_onboarding_details.is_onboarding_complete,
            },
          };
        }
      }
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message:
          'Third party APIs are down. Please try after sometime or if issue persists contact support. ' +
          err.message,
      };
    }
  }
}
