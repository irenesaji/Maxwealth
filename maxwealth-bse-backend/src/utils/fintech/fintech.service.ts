import { HttpService } from '@nestjs/axios';

import {
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import FormData from 'form-data';
import { cwd } from 'process';
import { catchError, lastValueFrom, map } from 'rxjs';
import { AddAddressDetailsDto } from 'src/onboarding/address/dtos/add-address-details.dto';
import { AddUserBankDetailsDto } from 'src/onboarding/bank/dtos/add-user-bank-details.dto';
import { AddOccupationDetailsDto } from 'src/onboarding/dtos/add-occupation-details.dto';
import { AddPersonalDetailsDto } from 'src/onboarding/dtos/add-personal-details.dto';
import { Users } from 'src/users/entities/users.entity';

import { ConfirmPanDetailsDto } from '../../onboarding/dtos/confirm-pan-details.dto';
import { Proofs } from 'src/onboarding/proofs/entities/proofs.entity';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddGeoTagDto } from 'src/onboarding/dtos/add-geo-tag.dto';
import { AddAadhaarNumberDto } from 'src/onboarding/dtos/add-aadhaar-number.dto';
import { UserAddressDetails } from 'src/onboarding/address/entities/user_address_details.entity';
import { UserNomineeDetails } from 'src/onboarding/nominee/entities/user-nominee-details.entity';
import { UserBankDetails } from 'src/onboarding/bank/entities/user_bank_details.entity';
import { forEach } from 'mathjs';
import { error } from 'console';
import { GetAumReportDto } from './dtos/get_aum_report.dto';
import { TransactionListDto } from './dtos/transaction_list.dto';
import { ListFilterDto } from './dtos/list_filter.dto';
import { CapitalGainFilterDto } from './dtos/capital_gain_filter.dto';
import { ReturnsFilterDto } from './dtos/returns_filter.dto';
import { UserReturnsHistory } from 'src/portfolio/entities/user_returns_history.entity';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { ProofsRepository } from 'src/repositories/proofs.repository';
import { UserReturnsHistoryRepository } from 'src/repositories/user_returns_history.repository';
import * as qs from 'qs';
import { FolioDefaultsDTO } from './dtos/folio_defaults.dto';
import { UserAddressDetailsRepository } from 'src/repositories/user_address_details.repository';
import { UserNomineeDetailsRepository } from 'src/repositories/user_nominee_details.repository';
import { UserBankDetailsRepository } from 'src/repositories/user_bank_details.repository';
import { EmailAddressRepository } from 'src/repositories/email_address.repository';
import { PhoneNumberRepository } from 'src/repositories/phone_number.repository';
import { UsersRepository } from 'src/repositories/user.repository';

@Injectable({ scope: Scope.REQUEST })
export class FintechService {
  fp_base_url: string;
  fp_secret: string;
  fp_client_id: string;
  fp_tenant_id: string;
  fp_email: string;
  fp_password: string;
  base_url: string;
  tenant_id: string;

  constructor(
    @Inject('CONNECTION') dataSource,

    // @InjectRepository(UserOnboardingDetails)
    // private userOnboardingRepository:Repository<UserOnboardingDetails>,
    // @InjectRepository(Proofs)
    // private proofsRepository:Repository<Proofs>,
    // @InjectRepository(UserReturnsHistory)
    // private userReturnsHistoryRepository:Repository<UserReturnsHistory>,

    private userOnboardingRepository: UserOnboardingDetailsRepository,
    private proofsRepository: ProofsRepository,
    private userReturnsHistoryRepository: UserReturnsHistoryRepository,
    private userAddressDetailsRepository: UserAddressDetailsRepository,
    private userNomineeDetailsRepository: UserNomineeDetailsRepository,
    private userBankDetailsRepository: UserBankDetailsRepository,
    private emailAddressRepository: EmailAddressRepository,
    private phoneNumberRepository: PhoneNumberRepository,
    private usersRepository: UsersRepository,

    private readonly httpService: HttpService,
  ) {
    const configService = new ConfigService();

    const maxwealth_tenant_id = dataSource.options.database;
    console.log('knsdsd', maxwealth_tenant_id);

    this.fp_base_url = configService.get(
      maxwealth_tenant_id.toUpperCase() + '_FINTECH_BASE_URL',
    );

    this.fp_secret = configService.get(
      maxwealth_tenant_id.toUpperCase() + '_FINTECH_SECRET_KEY',
    );
    this.fp_client_id = configService.get(
      maxwealth_tenant_id.toUpperCase() + '_FINTECH_CLIENT_ID',
    );
    this.fp_tenant_id = configService.get(
      maxwealth_tenant_id.toUpperCase() + '_FINTECH_TENANT_ID',
    );
    console.log('tenantaaa', this.fp_tenant_id);
    this.fp_email = configService.get(
      maxwealth_tenant_id.toUpperCase() + '_FINTECH_EMAIL',
    );
    this.fp_password = configService.get(
      maxwealth_tenant_id.toUpperCase() + '_FINTECH_PASSWORD',
    );
    this.tenant_id = maxwealth_tenant_id;
    console.log('tenantaaa2', this.tenant_id);

    this.base_url = configService.get('BASE_URL');
  }

  // async get_fp_token(){

  //     try{
  //             const headersRequest = {
  //                 'Content-Type': 'application/json', // afaik this one is not needed
  //                 'x-tenant-id': this.fp_tenant_id,
  //                 };

  //                 const bodyRequest = {
  //                     "email":this.fp_email,
  //                     "password":this.fp_password
  //                 };

  //             var response =  this.httpService.post(this.fp_base_url+ '/api/auth/admin/login',bodyRequest,{headers:headersRequest}).pipe(
  //                 map((resp) => {
  //                     console.log("FP RESPONSE" + resp);
  //                     return resp.data;
  //                 }),
  //             ).pipe(
  //                 catchError((e) => {
  //                     console.log(e.response);

  //                 throw new ForbiddenException('FP API not available,'+ e.message);
  //                 }),
  //             );

  //             var result = await lastValueFrom(response);
  //             console.log(result);
  //             return {status: HttpStatus.OK,...result};
  //     }catch(e){

  //         return {status: HttpStatus.BAD_REQUEST,error: "Could not fetch FP Token"};
  //     }

  // }

  async get_fp_token() {
    try {
      const headersRequest = {
        // afaik this one is not needed
        'x-tenant-id': this.fp_tenant_id,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      };

      const bodyRequest = qs.stringify({
        client_id: this.fp_client_id,
        client_secret: this.fp_secret,
        grant_type: 'client_credentials',
      });

      console.log('this.fp_tenant_id', bodyRequest);
      const response = this.httpService
        .post(
          this.fp_base_url + '/v2/auth/' + this.fp_tenant_id + '/token',
          bodyRequest,
          { headers: headersRequest },
        )
        .pipe(
          map((resp) => {
            console.log('FRESPONSEP ' + resp);
            return resp.data;
          }),
        )
        .pipe(
          catchError((e) => {
            console.log('error in fp auth ', e);
            if (e.response && e.response.data && e.response.data.error) {
              console.log('Les', e.response.data.error);
              e.response.data.error.message = '';
              e.response.data.error.errors.map((er) => {
                e.response.data.error.message +=
                  er.field + ' : ' + er.message + '. ';
              });
            }

            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async create_kyc(confirmPanDetailsDto: ConfirmPanDetailsDto, user: Users) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const headersRequest = {
          'Content-Type': 'application/json', // afaik this one is not needed
          'x-tenant-id': this.fp_tenant_id,
          Authorization: 'Bearer ' + token_response.access_token,
        };
        const dob = confirmPanDetailsDto.date_of_birth
          ? new Date(confirmPanDetailsDto.date_of_birth)
              .toISOString()
              .split('T')[0]
          : confirmPanDetailsDto.date_of_birth;

        const bodyRequest = {
          name: confirmPanDetailsDto.full_name,
          pan: confirmPanDetailsDto.pan,
          email: user.email,
          date_of_birth: dob,
          mobile: {
            isd: user.country_code,
            number: user.mobile,
          },
        };
        console.log(bodyRequest);
        const response = this.httpService
          .post(this.fp_base_url + '/v2/kyc_requests', bodyRequest, {
            headers: headersRequest,
          })
          .pipe(
            map((resp) => {
              console.log('FP RESPONSE' + resp);
              return resp.data;
            }),
          )
          .pipe(
            catchError((e) => {
              console.log(e.response);
              // console.log(e.response.data.error.errors.join(","));
              let message = e.message;
              if (
                e.response.data &&
                e.response.data.error &&
                e.response.data.error.errors
              ) {
                console.log(
                  'oye! errors',
                  e.response.data.error.errors.toString(),
                );
                message = '';
                e.response.data.error.errors.forEach(function (error) {
                  console.log(error);
                  if (message == '') {
                    message = error.toString();
                  } else {
                    message += ' ,' + error.toString();
                  }
                });
              }

              if (
                e.response &&
                e.response.data &&
                e.response.data.error &&
                e.response.data.error.message
              ) {
                const message_array = e.response.data.error.message;
                message = '';
                for (const m of message_array) {
                  if (message == '') {
                    message = m.message;
                  } else {
                    message += ', ' + m.message;
                  }
                }
              }
              throw new ForbiddenException('FP API not available,' + e.message);
            }),
          );

        const result = await lastValueFrom(response);
        console.log(result);
        return { status: HttpStatus.OK, data: result };
      } else {
        return token_response;
      }
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Sorry something went wrong, ' + e.message,
      };
    }
  }

  async check_kyc(pan: string) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const headersRequest = {
          'Content-Type': 'application/json', // afaik this one is not needed
          'x-tenant-id': this.fp_tenant_id,
          Authorization: 'Bearer ' + token_response.access_token,
        };

        const bodyRequest = {
          pan: pan,
        };
        const response = this.httpService
          .post(this.fp_base_url + '/api/kyc/check', bodyRequest, {
            headers: headersRequest,
          })
          .pipe(
            map((resp) => {
              return resp.data;
            }),
          )
          .pipe(
            catchError((e) => {
              if (e.response && e.response.data && e.response.data.error) {
                console.log('recs', e.response.data.error);
                e.response.data.error.message = '';
                e.response.data.error.errors.map((er) => {
                  e.response.data.error.message +=
                    er.field + ' : ' + er.message + '. ';
                });
              }

              throw new ForbiddenException(e.response.data.error, e.message);
            }),
          );

        const result = await lastValueFrom(response);
        console.log('mes', result);
        return { status: HttpStatus.OK, data: result };
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Something went wrong with our third party integrations please wait and try again',
        };
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async update_personal_details_kyc(
    addPersonalDetailsDto: AddPersonalDetailsDto,
    kycId: string,
  ) {
    delete addPersonalDetailsDto['user_id'];
    return await this.update_kyc(addPersonalDetailsDto, kycId);
  }
  async update_occupation_details_kyc(
    addOccupationDetailsDto: AddOccupationDetailsDto,
    kycId: string,
  ) {
    const occupation_details = {
      occupation_type: addOccupationDetailsDto.occupation,
      residential_status: 'resident_individual',
    };

    return await this.update_kyc(occupation_details, kycId);
  }

  async update_address_details_identity_doc_kyc(
    addAddressDetailsDto: AddAddressDetailsDto,
    identity_document_id: string,
    kycId: string,
  ) {
    console.log(kycId);
    const addressObj = {
      line_1: addAddressDetailsDto.line_1,
      line_2: addAddressDetailsDto.line_2,
      line_3: addAddressDetailsDto.line_3,
      city: addAddressDetailsDto.city,
      // state:addAddressDetailsDto.state,
      pincode: addAddressDetailsDto.pincode,
      country: 'in',
      proof: identity_document_id,
      proof_type: 'aadhaar',
    };

    const address = {
      address: addressObj,
    };

    return await this.update_kyc(address, kycId);
  }

  async update_address_details_kyc(
    addAddressDetailsDto: AddAddressDetailsDto,
    proof: Proofs,
    kycId: string,
  ) {
    console.log(kycId);
    const addressObj = {
      line_1: addAddressDetailsDto.line_1,
      line_2: addAddressDetailsDto.line_2,
      line_3: addAddressDetailsDto.line_3,
      city: addAddressDetailsDto.city,
      // state:addAddressDetailsDto.state,
      pincode: addAddressDetailsDto.pincode,
      country: 'in',
      proof: proof.fp_front_side_file_id,
      proof_type: proof.document_type,
      proof_number: proof.document_id_number,
    };

    if (proof.fp_back_side_file_id) {
      addressObj['proof_back'] = proof.fp_back_side_file_id;
    }

    if (proof.proof_issue_date) {
      const m =
        proof.proof_issue_date.getMonth() + 1 > 9
          ? proof.proof_issue_date.getMonth() + 1
          : '0' + (proof.proof_issue_date.getMonth() + 1);
      let d = proof.proof_issue_date.getDate().toString();
      if (proof.proof_issue_date.getDate() < 10) {
        d = '0' + proof.proof_issue_date.getDate().toString();
      }
      addressObj['proof_issue_date'] =
        proof.proof_issue_date.getFullYear() + '-' + m + '-' + d;
    }

    if (proof.proof_expiry_date) {
      const m1 =
        proof.proof_expiry_date.getMonth() + 1 > 9
          ? proof.proof_expiry_date.getMonth() + 1
          : '0' + (proof.proof_expiry_date.getMonth() + 1);
      let day = proof.proof_expiry_date.getDate().toString();
      if (proof.proof_expiry_date.getDate() < 10) {
        day = '0' + proof.proof_expiry_date.getDate().toString();
      }
      addressObj['proof_expiry_date'] =
        proof.proof_expiry_date.getFullYear() + '-' + m1 + '-' + day;
    }

    const address = {
      address: addressObj,
    };

    return await this.update_kyc(address, kycId);
  }

  async update_geo_tag_kyc(addGeoTagDto: AddGeoTagDto, kycId: string) {
    const body = {
      geolocation: {
        latitude: addGeoTagDto.lat,
        longitude: addGeoTagDto.lng,
      },
    };
    const result = await this.update_kyc(body, kycId);
    return result;
  }

  async update_bank_details_kyc(
    addUserBankDetailsDto: AddUserBankDetailsDto,
    kycId: string,
  ) {
    //PLEASE DO PICHAIN PENNY DROP HERE.

    const proof_file_id = await this.fileToUpload(
      cwd() + '/src/assets/cheque.png',
    );
    if (proof_file_id.status == HttpStatus.OK) {
      addUserBankDetailsDto.proof = proof_file_id.data.id;

      const bank_details = {
        bank_account: {
          account_holder_name: addUserBankDetailsDto.account_holder_name,
          account_number: addUserBankDetailsDto.account_number,
          ifsc_code: addUserBankDetailsDto.ifsc_code,
          proof: addUserBankDetailsDto.proof,
        },
      };
      console.log('bank_details');
      console.log(bank_details);
      return await this.update_kyc(bank_details, kycId);
    } else {
      return proof_file_id;
    }
  }

  async update_proof_of_identity(proof: Proofs, kycId: string) {
    if (proof.type == 'proof_of_identity') {
      const body = {
        identity_proof: proof.fp_front_side_file_id,
      };
      const result = await this.update_kyc(body, kycId);
      return result;
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Proof Type Should be proof_of_identity ',
      };
    }
  }

  async update_photo_kyc(onboarding: UserOnboardingDetails) {
    // let body = {
    //     "photo": onboarding.fp_photo_file_id
    // };
    // let result = await this.update_kyc(body, onboarding.kyc_id);
    // return result;
  }

  async update_video_kyc(onboarding: UserOnboardingDetails) {
    // let body = {
    //     "ipv_video": onboarding.fp_video_file_id
    // };
    // let result = await this.update_kyc(body, onboarding.kyc_id);
    // return result;
  }

  async update_signature_kyc(onboarding: UserOnboardingDetails) {
    // let body = {
    //     "signature": onboarding.fp_signature_file_id
    // };
    // let result = await this.update_kyc(body, onboarding.kyc_id);
    // return result;
  }

  async update_aadhaar_number(addAadhaarNumberDto: AddAadhaarNumberDto, kycId) {
    const body = {
      aadhaar_number: addAadhaarNumberDto.aadhaar_number,
    };
    const result = await this.update_kyc(body, kycId);
    return result;
  }

  async update_kyc(body, kycId: string) {
    // try {
    //     let kyc = await this.fetch_kyc(kycId);
    //     let onboarding = await this.userOnboardingRepository.findOneBy({ 'kyc_id': kycId });
    //     let user = await this.usersRepository.findOneBy({ id: onboarding.user_id });
    //     let identity_proof = await this.proofsRepository.findOneBy({ user_id: onboarding.user_id, type: 'proof_of_identity' })
    //     let address_proof = await this.proofsRepository.findOneBy({ user_id: onboarding.user_id, type: 'proof_of_address' })
    //     let token_response = await this.get_fp_token();
    //     const headersRequest = {
    //         'Content-Type': 'application/json', // afaik this one is not needed
    //         'x-tenant-id': this.fp_tenant_id,
    //         "Authorization": "Bearer " + token_response.access_token
    //     };
    //     console.log("fp header", headersRequest);
    //     if (kyc.status == HttpStatus.OK) {
    //         if (kyc.data && (kyc.data.status == 'expired' || kyc.data.status == 'rejected')) {
    //             let status = kyc.data.status;
    //             delete kyc.data.status;
    //             delete kyc.data.object;
    //             delete kyc.data.id;
    //             delete kyc.data.object;
    //             delete kyc.data.created_at;
    //             delete kyc.data.expires_at;
    //             delete kyc.data.otp;
    //             delete kyc.data.requirements;
    //             delete kyc.data.redirect_url;
    //             delete kyc.data.verification;
    //             delete kyc.data.esign_required_at;
    //             delete kyc.data.fp_esign_status;
    //             delete kyc.data.fp_esign_id;
    //             delete kyc.data.submitted_at;
    //             delete kyc.data.successful_at;
    //             delete kyc.data.rejected_at;
    //             delete kyc.data.updated_at;
    //             console.log("UPDATE KYC START", kyc.data);
    //             if (status == 'rejected') {
    //                 let confirmPanDetailsDto = new ConfirmPanDetailsDto();
    //                 confirmPanDetailsDto.date_of_birth = onboarding.date_of_birth;
    //                 confirmPanDetailsDto.full_name = onboarding.full_name;
    //                 confirmPanDetailsDto.pan = onboarding.pan;
    //                 confirmPanDetailsDto.user_id = onboarding.user_id;
    //                 let result = await this.create_kyc(confirmPanDetailsDto, user);
    //                 console.log("REJECTED KYC START ");
    //                 if (result.status == 200) {
    //                     console.log("REJECTED KYC START success");
    //                     onboarding.kyc_id = result.data.id;
    //                     onboarding.fp_kyc_status = "pending";
    //                     onboarding.identity_document_id = null;
    //                     onboarding.identity_document_status = null;
    //                     onboarding.status = "confirm_pan";
    //                     onboarding.fp_kyc_status = "pending";
    //                     await this.userOnboardingRepository.save(onboarding);
    //                 } else {
    //                     console.log("REJECTED KYC START failed");
    //                     return result;
    //                 }
    //             } else {
    //                 // update kyc.data.identity_proof;
    //                 if (kyc.data.identity_proof && identity_proof && identity_proof.front_document_path) {
    //                     let proof_file_id = await this.fileToUpload(cwd() + "/" + identity_proof.front_document_path);
    //                     if (proof_file_id.status == HttpStatus.OK) {
    //                         identity_proof.fp_front_side_file_id = proof_file_id.data.id;
    //                         identity_proof.fp_front_document_url = proof_file_id.data.url;
    //                         this.proofsRepository.save(identity_proof);
    //                         kyc.data.identity_proof = proof_file_id.data.id
    //                     } else {
    //                         delete kyc.data.identity_proof;
    //                     }
    //                 } else {
    //                     delete kyc.data.identity_proof;
    //                 }
    //                 // update kyc.data.address_proof;
    //                 // update kyc.data.address_proof_back;
    //                 if (kyc.data.address && kyc.data.address.proof && address_proof && address_proof.front_document_path) {
    //                     let proof_file_id = await this.fileToUpload(cwd() + "/" + address_proof.front_document_path);
    //                     if (proof_file_id.status == HttpStatus.OK) {
    //                         address_proof.fp_front_side_file_id = proof_file_id.data.id;
    //                         address_proof.fp_front_document_url = proof_file_id.data.url;
    //                         this.proofsRepository.save(address_proof);
    //                         kyc.data.address.proof = proof_file_id.data.id
    //                     } else {
    //                         delete kyc.data.address;
    //                     }
    //                 } else {
    //                     delete kyc.data.address;
    //                 }
    //                 if (kyc.data.address && kyc.data.address.proof_back && address_proof && address_proof.back_document_path) {
    //                     let proof_file_id = await this.fileToUpload(cwd() + "/" + address_proof.back_document_path);
    //                     if (proof_file_id.status == HttpStatus.OK) {
    //                         address_proof.fp_back_side_file_id = proof_file_id.data.id;
    //                         address_proof.fp_back_document_url = proof_file_id.data.url;
    //                         this.proofsRepository.save(address_proof);
    //                         kyc.data.address.proof_back = proof_file_id.data.id
    //                     } else {
    //                         delete kyc.data.address;
    //                     }
    //                 } else {
    //                     delete kyc.data.address;
    //                 }
    //                 // delete kyc.data.bank_account_proof;
    //                 if (kyc.data.bank_account && kyc.data.bank_account.proof) {
    //                     let proof_file_id = await this.fileToUpload(cwd() + "/src/assets/cheque.png");
    //                     if (proof_file_id.status == HttpStatus.OK) {
    //                         kyc.data.bank_account.proof = proof_file_id.data.id
    //                     } else {
    //                         delete kyc.data.bank_account;
    //                     }
    //                 } else {
    //                     delete kyc.data.bank_account;
    //                 }
    //                 if (onboarding.lat == null || onboarding.lng == null) {
    //                     delete kyc.data.geolocation;
    //                 }
    //                 // delete kyc.data.photo;
    //                 if (kyc.data.photo && onboarding && onboarding.photo_url) {
    //                     let proof_file_id = await this.fileToUpload(cwd() + "/" + onboarding.photo_url);
    //                     if (proof_file_id.status == HttpStatus.OK) {
    //                         onboarding.fp_photo_file_id = proof_file_id.data.id;
    //                         await this.userOnboardingRepository.save(onboarding);
    //                         kyc.data.photo = proof_file_id.data.id
    //                     } else {
    //                         delete kyc.data.photo;
    //                     }
    //                 } else {
    //                     delete kyc.data.photo;
    //                 }
    //                 // delete kyc.data.signature;
    //                 if (kyc.data.signature && onboarding && onboarding.signature_url) {
    //                     let proof_file_id = await this.fileToUpload(cwd() + "/" + onboarding.signature_url);
    //                     if (proof_file_id.status == HttpStatus.OK) {
    //                         onboarding.fp_signature_file_id = proof_file_id.data.id;
    //                         await this.userOnboardingRepository.save(onboarding);
    //                         kyc.data.signature = proof_file_id.data.id
    //                     } else {
    //                         delete kyc.data.signature;
    //                     }
    //                 } else {
    //                     delete kyc.data.signature;
    //                 }
    //                 // delete kyc.data.ipv_video;
    //                 if (kyc.data.ipv_video && onboarding && onboarding.video_url) {
    //                     let proof_file_id = await this.fileToUpload(cwd() + "/" + onboarding.video_url);
    //                     if (proof_file_id.status == HttpStatus.OK) {
    //                         onboarding.fp_video_file_id = proof_file_id.data.id;
    //                         await this.userOnboardingRepository.save(onboarding);
    //                         kyc.data.ipv_video = proof_file_id.data.id
    //                     } else {
    //                         delete kyc.data.ipv_video;
    //                     }
    //                 } else {
    //                     delete kyc.data.ipv_video;
    //                 }
    //                 var create_kyc_response = this.httpService.post(this.fp_base_url + '/v2/kyc_requests', kyc.data, { headers: headersRequest }).pipe(
    //                     map((resp) => {
    //                         console.log(" KYC re-created!", resp.data);
    //                         return resp.data;
    //                     }),
    //                 ).pipe(
    //                     catchError((e) => {
    //                         console.log("oye! kyc expired recreate error : ", e.response);
    //                         console.log("oye!", e.response.error);
    //                         if (e.response.data && e.response.data.error && e.response.data.error.errors) {
    //                             console.log("oye! errors", e.response.data.error.errors.toString());
    //                             e.response.data.error.errors.forEach(function (error) {
    //                                 console.log(error);
    //                             });
    //                         }
    //                         throw new ForbiddenException('re-create Expired KYC request Failed, ' + e.message);
    //                     }),
    //                 );
    //                 var create_kyc_result = await lastValueFrom(create_kyc_response);
    //                 console.log("recreated kyc response", create_kyc_result);
    //                 console.log("recreated kyc response ID", create_kyc_result.id);
    //                 onboarding.kyc_id = create_kyc_result.id;
    //             }
    //             onboarding.identity_document_id = null;
    //             onboarding.identity_document_status = null;
    //             onboarding.status = "confirm_pan";
    //             onboarding.fp_kyc_status = "pending";
    //             let updateOnboarding = await this.userOnboardingRepository.save(onboarding);
    //             if (!updateOnboarding) {
    //                 return { status: HttpStatus.BAD_REQUEST, error: "Re-create Expired/Rejected KYC request Failed, please do over" };
    //             } else {
    //                 return { status: HttpStatus.BAD_REQUEST, error: "Expired/Rejected KYC request please do over." };
    //             }
    //             // kycId = onboarding.kyc_id;
    //         }
    //         console.log("POST Request fp url", this.fp_base_url + '/v2/kyc_requests/' + kycId);
    //         console.log("BODY : ", body);
    //         console.log("KYC ID : ", kycId);
    //         var response = this.httpService.post(this.fp_base_url + '/v2/kyc_requests/' + kycId, body, { headers: headersRequest }).pipe(
    //             map((resp) => {
    //                 console.log(resp);
    //                 return resp.data;
    //             }),
    //         ).pipe(
    //             catchError((e) => {
    //                 console.log("error!! check " + e);
    //                 if (e.response && e.response.data && e.response.data.error && e.response.data.error.errors) {
    //                     console.log(e.response.data.error);
    //                     e.response.data.error.message = "";
    //                     e.response.data.error.errors.map((er) => { e.response.data.error.message += er.field + " : " + er.message });
    //                 }
    //                 throw new ForbiddenException(e.response.data.error, 'FP API not available,' + e.message);
    //             }),
    //         );
    //         var result = await lastValueFrom(response);
    //         console.log(result);
    //         return { status: HttpStatus.OK, data: result };
    //     } else {
    //         return { status: HttpStatus.BAD_REQUEST, error: "Could not fetch KYC" };
    //     }
    // } catch (e) {
    //     return { status: HttpStatus.BAD_REQUEST, error: "Sorry something went wrong, " + e.message };
    // }
  }

  async fetch_kyc(kycId: string) {
    try {
      console.log('KYC ID : ', kycId);

      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const headersRequest = {
          'Content-Type': 'application/json', // afaik this one is not needed
          'x-tenant-id': this.fp_tenant_id,
          Authorization: 'Bearer ' + token_response.access_token,
        };

        const response = this.httpService
          .get(this.fp_base_url + '/v2/kyc_requests/' + kycId, {
            headers: headersRequest,
          })
          .pipe(
            map((resp) => {
              return resp.data;
            }),
          )
          .pipe(
            catchError((e) => {
              if (e.response && e.response.data && e.response.data.error) {
                console.log(e.response.data.error);
                e.response.data.error.message = '';
                e.response.data.error.errors.map((er) => {
                  e.response.data.error.message +=
                    er.field + ' : ' + er.message + '. ';
                });
              }

              throw new ForbiddenException(e.response.data.error, e.message);
            }),
          );

        const result = await lastValueFrom(response);
        console.log(result);
        return { status: HttpStatus.OK, data: result };
      }
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Sorry something went wrong, ' + e.message,
      };
    }
  }

  async fileToUpload(file_path: string) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const headersRequest = {
          'x-tenant-id': this.fp_tenant_id,
          Authorization: 'Bearer ' + token_response.access_token,
          'Content-Type': 'multipart/form-data',
        };

        const formData = new FormData();
        console.log(file_path);
        const fileBuffer = await readFileSync(file_path);

        formData.append('file', fileBuffer, 'check.jpeg');
        const response = this.httpService
          .post(this.fp_base_url + '/files', formData, {
            headers: headersRequest,
          })
          .pipe(
            map((resp) => {
              return resp.data;
            }),
          )
          .pipe(
            catchError((e) => {
              if (e.response && e.response.data && e.response.data.error) {
                console.log(e.response.data.error);
                e.response.data.error.message = '';
                e.response.data.error.errors.map((er) => {
                  e.response.data.error.message +=
                    er.field + ' : ' + er.message + '. ';
                });
              }

              throw new ForbiddenException(e.response.data.error, e.message);
            }),
          );

        const result = await lastValueFrom(response);

        return { status: HttpStatus.OK, data: result };
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Sorry something went wrong,Fp Token Generation Issue',
        };
      }
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Sorry something went wrong, ' + e.message,
      };
    }
  }

  async initiate_esign(kycId: string, tenant_id: string) {
    // try {
    // let kycResp = await this.fetch_kyc(kycId);
    // if (kycResp.status == HttpStatus.OK) {
    //     if (kycResp.data.status == 'esign_required') {
    //         let token_response = await this.get_fp_token();
    //         if (token_response.status == 200) {
    //             const headersRequest = {
    //                 'Content-Type': 'application/json', // afaik this one is not needed
    //                 'x-tenant-id': this.fp_tenant_id,
    //                 "Authorization": "Bearer " + token_response.access_token
    //             };
    //             const bodyRequest = {
    //                 "kyc_request": kycId,
    //                 "postback_url": this.base_url + "/api/onboarding/esign_postback/" + tenant_id
    //             };
    //             var response = this.httpService.post(this.fp_base_url + '/v2/esigns', bodyRequest, { headers: headersRequest }).pipe(
    //                 map((resp) => {
    //                     return resp.data;
    //                 }),
    //             ).pipe(
    //                 catchError((e) => {
    //                     if (e.response && e.response.data && e.response.data.error) {
    //                         console.log(e.response.data.error);
    //                         e.response.data.error.message = "";
    //                         e.response.data.error.errors.map((er) => { e.response.data.error.message += er.field + " : " + er.message + ". " });
    //                     }
    //                     throw new ForbiddenException(e.response.data.error, e.message);
    //                 }),
    //             );
    //             var result = await lastValueFrom(response);
    //             console.log(result);
    //             return { status: HttpStatus.OK, data: result };
    //         }
    //         else {
    //             return token_response;
    //         }
    //         } else {
    //             if (kycResp.data.status == 'submitted') {
    //                 return { status: HttpStatus.BAD_REQUEST, error: "KYC application is already submitted. Please await review." };
    //             }
    //             else if (kycResp.data.requirements.fields_needed.length == 0) {
    //                 return { status: HttpStatus.BAD_REQUEST, error: "Please try again in a few seconds we are processing your file" };
    //             } else {
    //                 return { status: HttpStatus.BAD_REQUEST, error: "Please upload the required information before attempting esign : " + kycResp.data.requirements.fields_needed.toString() };
    //             }
    //         }
    //     } else {
    //         return kycResp;
    //     }
    // } catch (e) {
    //     return { status: HttpStatus.BAD_REQUEST, error: "Sorry something went wrong, " + e.message };
    // }
  }

  async create_investment_account(onboarding: UserOnboardingDetails) {
    ///v2/mf_investment_accounts
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const folio_defaults = new FolioDefaultsDTO();
        const fp_addresses = await this.userAddressDetailsRepository.findOneBy({
          user_id: onboarding.user_id,
        });
        const fp_email = {}; // await this.emailAddressRepository.findOne({ where: { profile: onboarding.fp_investor_id }, order: { created_at: 'DESC' } });
        const fp_phone = {}; //await this.phoneNumberRepository.findOne({ where: { profile: onboarding.fp_investor_id }, order: { created_at: 'DESC' } })
        const fp_bank = await this.userBankDetailsRepository.findOneBy({
          user_id: onboarding.user_id,
        });

        const fp_nominees = await this.userNomineeDetailsRepository.find({
          where: { user_id: onboarding.user_id },
        });

        // folio_defaults.communication_address = fp_addresses.fp_id;
        // folio_defaults.communication_email_address = fp_email.fp_id;
        // folio_defaults.communication_mobile_number = fp_phone.fp_id;
        // folio_defaults.payout_bank_account = fp_bank.fp_bank_id;
        if (fp_nominees.length >= 1) {
          // folio_defaults.nominee1 = fp_nominees[0].fp_id;
          folio_defaults.nominee1_allocation_percentage =
            fp_nominees[0].allocation_percentage;
        }

        if (fp_nominees.length >= 2) {
          // folio_defaults.nominee2 = fp_nominees[1].fp_id;
          folio_defaults.nominee2_allocation_percentage =
            fp_nominees[1].allocation_percentage;
        }

        if (fp_nominees.length >= 3) {
          // folio_defaults.nominee3 = fp_nominees[2].fp_id;
          folio_defaults.nominee3_allocation_percentage =
            fp_nominees[2].allocation_percentage;
        }

        const headersReq = {
          'Content-Type': 'application/json', // afaik this one is not needed
          'x-tenant-id': this.fp_tenant_id,
          Authorization: 'Bearer ' + token_response.access_token,
        };
        const bodyRequest = {
          primary_investor: onboarding.fp_investor_id,
          folio_defaults: folio_defaults,
        };

        const response = this.httpService
          .post(this.fp_base_url + '/v2/mf_investment_accounts', bodyRequest, {
            headers: headersReq,
          })
          .pipe(
            map((resp) => {
              console.log('FP RESPONSE' + resp);
              return resp.data;
            }),
          )
          .pipe(
            catchError((e) => {
              console.log(e.response);

              if (e.response && e.response.data && e.response.data.error) {
                console.log(e.response.data.error);
                e.response.data.error.message = '';
                e.response.data.error.errors.map((er) => {
                  e.response.data.error.message +=
                    er.field + ' : ' + er.message + '. ';
                });
              }

              throw new ForbiddenException(e.response.data.error, e.message);
            }),
          );

        const result = await lastValueFrom(response);
        console.log(result);
        return { status: HttpStatus.OK, data: result };
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async create_update_investor_v2(onboarding: UserOnboardingDetails) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const headersRequest = {
          'Content-Type': 'application/json', // afaik this one is not needed
          'x-tenant-id': this.fp_tenant_id,
          Authorization: 'Bearer ' + token_response.access_token,
        };
        //                 let bank_accounts = [];
        //                 for(let bank_detail of bank ){
        //                    let  bank_account = {};
        //                    bank_account['account_holder_name'] = bank_detail.account_holder_name;
        //                    bank_account['number'] = bank_detail.account_number;
        //                    bank_account['primary_account'] = bank_detail.is_primary;
        //                    bank_account['type'] = 'SAVINGS'; //select one from - "SAVINGS", "CURRENT", "NRE", "NRO"
        //                    bank_account['ifsc_code'] = bank_detail.ifsc_code;

        //                     if(onboarding.fp_investor_id && bank_detail.fp_bank_id){
        //                         bank_account['id'] = bank_detail.fp_bank_id;
        //                     }

        //                     bank_accounts.push(bank_account);

        //                 }

        //                 console.log("BANK ACCOUNTS", bank_accounts);

        //                 let contact_detail = {};

        //                 contact_detail["email"] = onboarding.user.email;
        //                 contact_detail["isd_code"] = onboarding.user.country_code;
        //                 contact_detail["mobile"] = onboarding.user.mobile;

        //                 console.log("contact_detail", contact_detail);

        //                 let fatca_detail = {};

        //                 fatca_detail["country_of_birth_ansi_code"] = 'IN';
        //                 fatca_detail["no_other_tax_residences"] = true ;

        // //upto_1lakh, above_1lakh_upto_5lakh, above_5lakh_upto_10lakh, above_10lakh_upto_25lakh, above_25lakh_upto_1cr, above_1cr
        //                let gross_annual_income = 100000;
        //                 if(onboarding.annual_income == 'above_1lakh_upto_5lakh'){
        //                     gross_annual_income = 250000;
        //                 }else if(onboarding.annual_income == 'above_5lakh_upto_10lakh'){
        //                     gross_annual_income = 750000;
        //                 }else if(onboarding.annual_income == 'above_10lakh_upto_25lakh'){
        //                     gross_annual_income = 1550000;
        //                 }else if(onboarding.annual_income == 'above_25lakh_upto_1cr'){
        //                     gross_annual_income = 6000000;
        //                 }else if(onboarding.annual_income == 'above_1cr'){
        //                     gross_annual_income = 10000000;
        //                 }

        //                 fatca_detail["gross_annual_income"] = gross_annual_income ;

        //                 console.log("fatca_detail", fatca_detail);

        //                 let nomination = { "skip_nomination": false};
        //                 let index = 1;

        //                 for( let nominee of nominees){
        //                     let nomination_index= {};
        //                     nomination_index['name'] = nominee.name;

        //                     var m =  (nominee.date_of_birth.getMonth() + 1) > 9 ? (nominee.date_of_birth.getMonth() + 1) : "0"+ (nominee.date_of_birth.getMonth() + 1);
        //                     let d = nominee.date_of_birth.getDate().toString();
        //                     if(nominee.date_of_birth.getDate()< 10){
        //                         d = "0"+ nominee.date_of_birth.getDate().toString();
        //                     }

        //                     nomination_index['date_of_birth'] = nominee.date_of_birth.getFullYear() + "-"+ m +"-"+ d;
        //                     nomination_index['relationship'] = nominee.relationship;
        //                     nomination_index['allocation_percentage'] = nominee.allocation_percentage;
        //                     if(nominee.guardian_name){
        //                         nomination_index['guardian_name'] = nominee.guardian_name;
        //                         nomination_index['guardian_relationship'] = nominee.guardian_relationship;
        //                     }
        //                     nomination['nominee'+index] = nomination_index;
        //                     index++;

        //                 }
        //                 console.log("nomination", nomination);

        const kyc_identity_detail = {};

        kyc_identity_detail['type'] = 'individual';
        kyc_identity_detail['tax_status'] = 'resident_individual';

        kyc_identity_detail['name'] = onboarding.full_name;
        const mon =
          onboarding.date_of_birth.getMonth() + 1 > 9
            ? onboarding.date_of_birth.getMonth() + 1
            : '0' + (onboarding.date_of_birth.getMonth() + 1);
        let day = onboarding.date_of_birth.getDate().toString();
        if (onboarding.date_of_birth.getDate() < 10) {
          day = '0' + onboarding.date_of_birth.getDate().toString();
        }
        kyc_identity_detail['date_of_birth'] =
          onboarding.date_of_birth.getFullYear() + '-' + mon + '-' + day;
        kyc_identity_detail['gender'] = onboarding.gender;
        let occupation = onboarding.occupation;
        if (occupation == 'self_employed') {
          occupation = 'professional';
        } else if (occupation == 'housewife') {
          occupation = 'house_wife';
        } else if (occupation == 'public_sector') {
          occupation = 'public_sector_service';
        } else if (occupation == 'private_sector') {
          occupation = 'private_sector_service';
        } else if (occupation == 'government_sector') {
          occupation = 'government_service';
        }
        kyc_identity_detail['occupation'] = occupation;
        kyc_identity_detail['pan'] = onboarding.pan;
        // kyc_identity_detail['signature']= onboarding.fp_signature_file_id;

        kyc_identity_detail['country_of_birth'] = 'IN';

        kyc_identity_detail['use_default_tax_residences'] = true;

        const first_tax_residency = {};
        first_tax_residency['country'] = 'IN';
        first_tax_residency['taxid_type'] = 'pan';
        first_tax_residency['taxid_number'] = onboarding.pan;
        kyc_identity_detail['first_tax_residency'] = first_tax_residency;
        let source_of_wealth = 'salary';

        if (onboarding.occupation == 'business') {
          source_of_wealth = 'business';
        } else {
          source_of_wealth = 'others';
        }
        kyc_identity_detail['source_of_wealth'] = source_of_wealth;
        kyc_identity_detail['income_slab'] = onboarding.annual_income;
        kyc_identity_detail['pep_details'] = 'not_applicable';
        kyc_identity_detail['ip_address'] = '';

        // guardian_name
        // guardian_date_of_birth
        // guardian_pan

        // kyc_identity_detail['father_or_spouse_name'] = onboarding.father_name;
        // kyc_identity_detail['mothers_name'] = onboarding.mother_name;
        // kyc_identity_detail['kyc_relation']= 'FATHER';
        // kyc_identity_detail['country_of_citizenship_ansi_code'] = 'IN';

        // kyc_identity_detail['marital_status'] = onboarding.marital_status == 'unmarried'? 'single' :onboarding.marital_status;
        // kyc_identity_detail['residential_status'] = 'RESIDENT_INDIVIDUAL';

        // //AGRICULTURE, BUSINESS, DOCTOR, FOREX_DEALER, GOVERNMENT_SERVICE, HOUSE_WIFE, OTHERS, PRIVATE_SECTOR_SERVICE, PROFESSIONAL, PUBLIC_SECTOR_SERVICE, RETIRED, SERVICE, STUDENT

        // //business, professional, self_employed, retired, housewife, student, public_sector, private_sector, government_sector, others

        // kyc_identity_detail['pan_exempt']= false;
        // kyc_identity_detail['pep_exposed']= false;
        // kyc_identity_detail['pep_related']= false;

        // console.log("kyc_identity_detail",kyc_identity_detail);

        // let correspondence_address = {};
        // correspondence_address["line1"] = address.line_1;
        // correspondence_address["line2"] = address.line_2;
        // correspondence_address["line3"] = address.line_3;
        // correspondence_address["city"] = address.city;
        // correspondence_address["pincode"] = address.pincode;
        // correspondence_address["state"] = address.state;

        // console.log("correspondence_address",correspondence_address);
        console.log(
          'investor_profiles kyc_identity_detail: ',
          kyc_identity_detail,
        );
        let url = this.fp_base_url + '/v2/investor_profiles';
        if (onboarding.fp_investor_id) {
          url = url + '/' + onboarding.fp_investor_id;
        }

        // const bodyRequest = {
        // "perm_addr_is_corres_addr":true,
        // "bank_accounts": bank_accounts,
        // "contact_detail":contact_detail,
        // "fatca_detail" : fatca_detail,
        // "nomination" : nomination,
        // "kyc_identity_detail":kyc_identity_detail,
        // "correspondence_address":correspondence_address
        // };

        const bodyRequest = kyc_identity_detail;

        console.log('final investor body', bodyRequest);

        const headersReq = {
          'Content-Type': 'application/json', // afaik this one is not needed
          'x-tenant-id': this.fp_tenant_id,
          Authorization: 'Bearer ' + token_response.access_token,
        };

        const response = this.httpService
          .post(url, bodyRequest, { headers: headersReq })
          .pipe(
            map((resp) => {
              console.log('FP RESPONSE' + resp.data);
              return resp.data;
            }),
          )
          .pipe(
            catchError((e) => {
              console.log(e.response);

              if (e.response && e.response.data && e.response.data.error) {
                console.log(e.response.data.error);
                e.response.data.error.message = '';
                e.response.data.error.errors.map((er) => {
                  e.response.data.error.message +=
                    er.field + ' : ' + er.message + '. ';
                });
              }

              throw new ForbiddenException(e.response.data.error, e.message);
            }),
          );

        const result = await lastValueFrom(response);
        console.log(result);
        return { status: HttpStatus.OK, data: result };
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async create_bank(investor_profile_id: string, bank_detail: UserBankDetails) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const bank_account = {};
        bank_account['profile'] = investor_profile_id;
        bank_account['primary_account_holder_name'] =
          bank_detail.account_holder_name;
        bank_account['account_number'] = bank_detail.account_number;
        // bank_account['primary_account'] = bank_detail.is_primary;
        bank_account['type'] = 'savings'; //select one from - "SAVINGS", "CURRENT", "NRE", "NRO"
        bank_account['ifsc_code'] = bank_detail.ifsc_code.toUpperCase();
        const url = this.fp_base_url + '/v2/bank_accounts';
        const res = await this.fp_post_request(
          url,
          token_response.access_token,
          bank_account,
        );
        return res;
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async create_phone(investor_profile_id: string, phone: string) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const phone_obj = {};
        phone_obj['profile'] = investor_profile_id;
        phone_obj['isd'] = '91';
        phone_obj['number'] = phone;
        phone_obj['belongs_to'] = 'self';

        const url = this.fp_base_url + '/v2/phone_numbers';
        const res = await this.fp_post_request(
          url,
          token_response.access_token,
          phone_obj,
        );
        return res;
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async create_email(investor_profile_id: string, email: string) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const email_obj = {};

        email_obj['profile'] = investor_profile_id;
        email_obj['email'] = email;
        email_obj['belongs_to'] = 'self';

        const url = this.fp_base_url + '/v2/email_addresses';
        const res = await this.fp_post_request(
          url,
          token_response.access_token,
          email_obj,
        );
        return res;
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async create_address(
    investor_profile_id: string,
    address: UserAddressDetails,
  ) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const correspondence_address = {};
        correspondence_address['profile'] = investor_profile_id;
        correspondence_address['line1'] = address.line_1;
        correspondence_address['line2'] = address.line_2;
        correspondence_address['line3'] = address.line_3;
        correspondence_address['city'] = address.city;
        correspondence_address['postal_code'] = address.pincode;
        correspondence_address['state'] = address.state;
        correspondence_address['country'] = 'IN';
        correspondence_address['nature'] = 'residential';

        const url = this.fp_base_url + '/v2/addresses';
        const res = await this.fp_post_request(
          url,
          token_response.access_token,
          correspondence_address,
        );
        return res;
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async create_related_parties(
    investor_profile_id: string,
    nominee: UserNomineeDetails,
  ) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const related_party = {};
        related_party['profile'] = investor_profile_id;
        related_party['name'] = nominee.name;
        related_party['date_of_birth'] = nominee.date_of_birth;
        related_party['relationship'] = nominee.relationship;
        related_party['guardian_name'] = nominee.guardian_name;
        const url = this.fp_base_url + '/v2/related_parties';
        const res = await this.fp_post_request(
          url,
          token_response.access_token,
          related_party,
        );
        return res;
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async create_update_investor(
    onboarding: UserOnboardingDetails,
    address: UserAddressDetails,
    nominees: Array<UserNomineeDetails>,
    bank: Array<UserBankDetails>,
  ) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const headersRequest = {
          'Content-Type': 'application/json', // afaik this one is not needed
          'x-tenant-id': this.fp_tenant_id,
          Authorization: 'Bearer ' + token_response.access_token,
        };
        const bank_accounts = [];
        for (const bank_detail of bank) {
          const bank_account = {};
          bank_account['account_holder_name'] = bank_detail.account_holder_name;
          bank_account['number'] = bank_detail.account_number;
          bank_account['primary_account'] = bank_detail.is_primary;
          bank_account['type'] = 'SAVINGS'; //select one from - "SAVINGS", "CURRENT", "NRE", "NRO"
          bank_account['ifsc_code'] = bank_detail.ifsc_code;

          // if (onboarding.fp_investor_id && bank_detail.fp_bank_id) {
          //     bank_account['id'] = bank_detail.fp_bank_id;
          // }

          bank_accounts.push(bank_account);
        }

        console.log('BANK ACCOUNTS', bank_accounts);

        const contact_detail = {};

        contact_detail['email'] = onboarding.user.email;
        contact_detail['isd_code'] = onboarding.user.country_code;
        contact_detail['mobile'] = onboarding.user.mobile;

        console.log('contact_detail', contact_detail);

        const fatca_detail = {};

        fatca_detail['country_of_birth_ansi_code'] = 'IN';
        fatca_detail['no_other_tax_residences'] = true;

        let source_of_wealth = 'SALARY';

        if (onboarding.occupation == 'business') {
          source_of_wealth = 'BUSINESS';
        } else {
          source_of_wealth = 'OTHERS';
        }
        fatca_detail['source_of_wealth'] = source_of_wealth;

        //upto_1lakh, above_1lakh_upto_5lakh, above_5lakh_upto_10lakh, above_10lakh_upto_25lakh, above_25lakh_upto_1cr, above_1cr
        let gross_annual_income = 100000;
        if (onboarding.annual_income == 'above_1lakh_upto_5lakh') {
          gross_annual_income = 250000;
        } else if (onboarding.annual_income == 'above_5lakh_upto_10lakh') {
          gross_annual_income = 750000;
        } else if (onboarding.annual_income == 'above_10lakh_upto_25lakh') {
          gross_annual_income = 1550000;
        } else if (onboarding.annual_income == 'above_25lakh_upto_1cr') {
          gross_annual_income = 6000000;
        } else if (onboarding.annual_income == 'above_1cr') {
          gross_annual_income = 10000000;
        }

        fatca_detail['gross_annual_income'] = gross_annual_income;

        console.log('fatca_detail', fatca_detail);

        const nomination = { skip_nomination: false };
        let index = 1;

        for (const nominee of nominees) {
          const nomination_index = {};
          nomination_index['name'] = nominee.name;

          const m =
            nominee.date_of_birth.getMonth() + 1 > 9
              ? nominee.date_of_birth.getMonth() + 1
              : '0' + (nominee.date_of_birth.getMonth() + 1);
          let d = nominee.date_of_birth.getDate().toString();
          if (nominee.date_of_birth.getDate() < 10) {
            d = '0' + nominee.date_of_birth.getDate().toString();
          }

          nomination_index['date_of_birth'] =
            nominee.date_of_birth.getFullYear() + '-' + m + '-' + d;
          nomination_index['relationship'] = nominee.relationship;
          nomination_index['allocation_percentage'] =
            nominee.allocation_percentage;
          if (nominee.guardian_name) {
            nomination_index['guardian_name'] = nominee.guardian_name;
            nomination_index['guardian_relationship'] =
              nominee.guardian_relationship;
          }
          nomination['nominee' + index] = nomination_index;
          index++;
        }
        console.log('nomination', nomination);

        const kyc_identity_detail = {};
        kyc_identity_detail['name'] = onboarding.full_name;
        kyc_identity_detail['father_or_spouse_name'] = onboarding.father_name;
        kyc_identity_detail['mothers_name'] = onboarding.mother_name;
        kyc_identity_detail['kyc_relation'] = 'FATHER';
        kyc_identity_detail['country_of_citizenship_ansi_code'] = 'IN';

        const mon =
          onboarding.date_of_birth.getMonth() + 1 > 9
            ? onboarding.date_of_birth.getMonth() + 1
            : '0' + (onboarding.date_of_birth.getMonth() + 1);
        let day = onboarding.date_of_birth.getDate().toString();
        if (onboarding.date_of_birth.getDate() < 10) {
          day = '0' + onboarding.date_of_birth.getDate().toString();
        }

        kyc_identity_detail['date_of_birth'] =
          onboarding.date_of_birth.getFullYear() + '-' + mon + '-' + day;
        kyc_identity_detail['gender'] = onboarding.gender;
        kyc_identity_detail['marital_status'] =
          onboarding.marital_status == 'unmarried'
            ? 'single'
            : onboarding.marital_status;
        kyc_identity_detail['residential_status'] = 'RESIDENT_INDIVIDUAL';

        //AGRICULTURE, BUSINESS, DOCTOR, FOREX_DEALER, GOVERNMENT_SERVICE, HOUSE_WIFE, OTHERS, PRIVATE_SECTOR_SERVICE, PROFESSIONAL, PUBLIC_SECTOR_SERVICE, RETIRED, SERVICE, STUDENT

        //business, professional, self_employed, retired, housewife, student, public_sector, private_sector, government_sector, others
        let occupation = onboarding.occupation;
        if (occupation == 'self_employed') {
          occupation = 'PROFESSIONAL';
        } else if (occupation == 'housewife') {
          occupation = 'HOUSE_WIFE';
        } else if (occupation == 'public_sector') {
          occupation = 'PUBLIC_SECTOR_SERVICE';
        } else if (occupation == 'private_sector') {
          occupation = 'PRIVATE_SECTOR_SERVICE';
        } else if (occupation == 'government_sector') {
          occupation = 'GOVERNMENT_SERVICE';
        }

        kyc_identity_detail['occupation'] = occupation;

        kyc_identity_detail['pan_number'] = onboarding.pan;
        kyc_identity_detail['pan_exempt'] = false;
        kyc_identity_detail['pep_exposed'] = false;
        kyc_identity_detail['pep_related'] = false;
        kyc_identity_detail['signature'] = onboarding.fp_signature_file_id;

        console.log('kyc_identity_detail', kyc_identity_detail);

        const correspondence_address = {};
        correspondence_address['line1'] = address.line_1;
        correspondence_address['line2'] = address.line_2;
        correspondence_address['line3'] = address.line_3;
        correspondence_address['city'] = address.city;
        correspondence_address['pincode'] = address.pincode;
        correspondence_address['state'] = address.state;

        console.log('correspondence_address', correspondence_address);

        let url = this.fp_base_url + '/api/onb/investors';
        if (onboarding.fp_investor_id) {
          url = url + '/' + onboarding.fp_investor_id;
        }

        const bodyRequest = {
          perm_addr_is_corres_addr: true,
          bank_accounts: bank_accounts,
          contact_detail: contact_detail,
          fatca_detail: fatca_detail,
          nomination: nomination,
          kyc_identity_detail: kyc_identity_detail,
          correspondence_address: correspondence_address,
        };

        console.log('final investor body', bodyRequest);

        const headersReq = {
          'Content-Type': 'application/json', // afaik this one is not needed
          'x-tenant-id': this.fp_tenant_id,
          Authorization: 'Bearer ' + token_response.access_token,
        };

        const response = this.httpService
          .post(url, bodyRequest, { headers: headersReq })
          .pipe(
            map((resp) => {
              console.log('FP RESPONSE' + resp.data);
              return resp.data;
            }),
          )
          .pipe(
            catchError((e) => {
              console.log(e.response);

              if (e.response && e.response.data && e.response.data.error) {
                console.log(e.response.data.error);
                e.response.data.error.message = '';
                e.response.data.error.errors.map((er) => {
                  e.response.data.error.message +=
                    er.field + ' : ' + er.message + '. ';
                });
              }

              throw new ForbiddenException(e.response.data.error, e.message);
            }),
          );

        const result = await lastValueFrom(response);
        console.log(result);
        return { status: HttpStatus.OK, data: result };
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async createMandate(
    mandate_type: string,
    bank_account_id: number,
    mandate_limit: number,
  ) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/api/pg/mandates';
        const bodyRequest = {
          bank_account_id: bank_account_id,
          mandate_limit: mandate_limit,
          mandate_type: mandate_type,
        };
        const headersReq = {
          'Content-Type': 'application/json', // afaik this one is not needed
          'x-tenant-id': this.fp_tenant_id,
          Authorization: 'Bearer ' + token_response.access_token,
        };
        const response = this.httpService
          .post(url, bodyRequest, { headers: headersReq })
          .pipe(
            map((resp) => {
              console.log('FP RESPONSE' + resp);
              return resp.data;
            }),
          )
          .pipe(
            catchError((e) => {
              console.log(e.response);

              if (e.response && e.response.data && e.response.data.error) {
                console.log(e.response.data.error);
                e.response.data.error.message = '';
                e.response.data.error.errors.map((er) => {
                  e.response.data.error.message +=
                    er.field + ' : ' + er.message + '. ';
                });
              }

              throw new ForbiddenException(e.response.data.error, e.message);
            }),
          );

        const result = await lastValueFrom(response);
        console.log(result);
        return { status: HttpStatus.OK, data: result };
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async authorizeMandate(mandate_id: number, postback_url: string) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/api/pg/payments/emandate/auth';
        const bodyRequest = {
          mandate_id: mandate_id,
          payment_postback_url: postback_url,
        };
        const headersReq = {
          'Content-Type': 'application/json', // afaik this one is not needed
          'x-tenant-id': this.fp_tenant_id,
          Authorization: 'Bearer ' + token_response.access_token,
        };
        const response = this.httpService
          .post(url, bodyRequest, { headers: headersReq })
          .pipe(
            map((resp) => {
              console.log('FP RESPONSE' + resp);
              return resp.data;
            }),
          )
          .pipe(
            catchError((e) => {
              console.log(e.response);

              if (e.response && e.response.data && e.response.data.error) {
                console.log(e.response.data.error);
                e.response.data.error.message = '';
                e.response.data.error.errors.map((er) => {
                  e.response.data.error.message +=
                    er.field + ' : ' + er.message + '. ';
                });
              }

              throw new ForbiddenException(e.response.data.error, e.message);
            }),
          );

        const result = await lastValueFrom(response);
        console.log(result);
        return { status: HttpStatus.OK, data: result };
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async getFpFund(isin: string) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/api/oms/fund_schemes/' + isin;

        const headersReq = {
          'Content-Type': 'application/json', // afaik this one is not needed
          'x-tenant-id': this.fp_tenant_id,
          Authorization: 'Bearer ' + token_response.access_token,
        };
        const response = this.httpService
          .get(url, { headers: headersReq })
          .pipe(
            map((resp) => {
              console.log('FP RESPONSE' + resp);
              return resp.data;
            }),
          )
          .pipe(
            catchError((e) => {
              console.log(e.response);

              if (
                e.response &&
                e.response.data &&
                e.response.data.error &&
                e.response.data.error.errors
              ) {
                console.log(e.response.data.error);
                e.response.data.error.message = '';
                e.response.data.error.errors.map((er) => {
                  e.response.data.error.message +=
                    er.field + ' : ' + er.message + '. ';
                });
              }

              throw new ForbiddenException(e.response.data.error, e.message);
            }),
          );

        const result = await lastValueFrom(response);
        console.log(result);
        return { status: HttpStatus.OK, data: result };
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async create_purchase(fp_lumpsum_dto) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/mf_purchases';
        const body = fp_lumpsum_dto;
        console.log('URL', url);
        console.log('Body', body);

        return await this.fp_post_request(
          url,
          token_response.access_token,
          body,
        );
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async fetch_sip(plan_id: string) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/mf_purchase_plans/' + plan_id;

        return await this.fp_get_request(url, token_response.access_token);
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async create_sip(fp_sip_dto) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/mf_purchase_plans';
        const body = fp_sip_dto;
        return await this.fp_post_request(
          url,
          token_response.access_token,
          body,
        );
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async cancel_sip(fp_sip_id: string, cancellation_code: string) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/mf_purchase_plans/cancel';
        return await this.fp_post_request(url, token_response.access_token, {
          id: fp_sip_id,
          cancellation_code: cancellation_code,
        });
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async cancel_stp(fp_stp_id: string) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url =
          this.fp_base_url + '/v2/mf_switch_plans/' + fp_stp_id + '/cancel';
        return await this.fp_post_request(url, token_response.access_token, {});
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async cancel_swp(fp_swp_id: string) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url =
          this.fp_base_url + '/v2/mf_redemption_plans/' + fp_swp_id + '/cancel';
        return await this.fp_post_request(url, token_response.access_token, {});
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async create_redemption(fp_redemption_dto) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/mf_redemptions';
        const body = fp_redemption_dto;
        return await this.fp_post_request(
          url,
          token_response.access_token,
          body,
        );
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async create_swp(fp_swp_dto) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/mf_redemption_plans';
        const body = fp_swp_dto;
        return await this.fp_post_request(
          url,
          token_response.access_token,
          body,
        );
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async create_switch(fp_switch_dto) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/mf_switches';
        const body = fp_switch_dto;
        return await this.fp_post_request(
          url,
          token_response.access_token,
          body,
        );
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async create_stp(fp_stp_dto) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/mf_switch_plans';
        const body = fp_stp_dto;
        return await this.fp_post_request(
          url,
          token_response.access_token,
          body,
        );
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async update_purchase(fp_update_purchase_dto) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/mf_purchases';
        const body = fp_update_purchase_dto;
        console.log('patch url', url);
        console.log('body', body);

        return await this.fp_patch_request(
          url,
          token_response.access_token,
          body,
        );
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async update_redemption(fp_update_redemption_dto) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/mf_redemptions';
        const body = fp_update_redemption_dto;
        return await this.fp_patch_request(
          url,
          token_response.access_token,
          body,
        );
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async update_switch(fp_update_switch_dto) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/mf_switches';
        const body = fp_update_switch_dto;
        return await this.fp_patch_request(
          url,
          token_response.access_token,
          body,
        );
      } else {
        return token_response;
      }
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, error: e.message };
    }
  }

  async initiatePayemnt(fp_payment_obj) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/api/pg/payments/netbanking';
        const body = fp_payment_obj;
        console.log('URL', url);
        console.log('body', body);

        return await this.fp_post_request(
          url,
          token_response.access_token,
          body,
        );
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_investment_account_wise_returns(fp_investment_account_id: string) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url =
          this.fp_base_url +
          '/v2/transactions/reports/investment_account_wise_returns';
        const body = { mf_investment_account: fp_investment_account_id };
        return await this.fp_post_request(
          url,
          token_response.access_token,
          body,
        );
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_investment_account_wise_returns_report(
    returnsFilterDto: ReturnsFilterDto,
  ) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url =
          this.fp_base_url +
          '/v2/transactions/reports/investment_account_wise_returns';

        return await this.fp_post_request(
          url,
          token_response.access_token,
          returnsFilterDto,
        );
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_scheme_wise_returns(returnsFilterDto: ReturnsFilterDto) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url =
          this.fp_base_url + '/v2/transactions/reports/scheme_wise_returns';

        return await this.fp_post_request(
          url,
          token_response.access_token,
          returnsFilterDto,
        );
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_plan_purchase(plan_id) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/mf_purchases?plan=' + plan_id;
        const res = await this.fp_get_request(url, token_response.access_token);
        if (res.status == 200) {
          res.data = res.data.data;
        }
        return res;
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_plan_redemption(plan_id) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/mf_redemptions?plan=' + plan_id;
        const res = await this.fp_get_request(url, token_response.access_token);
        if (res.status == 200) {
          res.data = res.data.data;
        }
        return res;
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_plan_switches(plan_id) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/mf_switches?plan=' + plan_id;
        const res = await this.fp_get_request(url, token_response.access_token);
        if (res.status == 200) {
          res.data = res.data.data;
        }
        return res;
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async fp_webhook_subscribe() {
    try {
      const events = [
        'kyc_request.successful',
        'kyc_request.rejected',
        'kyc_request.submitted',
        'kyc_request.esign_required',
        'mf_purchase.confirmed',
        'mf_purchase.submitted',
        'mf_purchase.successful',
        'mf_purchase.failed',
        'mf_purchase.cancelled',
        'mf_purchase.reversed',
        'mf_purchase.created',
        'mf_redemption.created',
        'mf_redemption.confirmed',
        'mf_redemption.submitted',
        'mf_redemption.successful',
        'mf_redemption.failed',
        'mf_redemption.cancelled',
        'mf_redemption.reversed',
        'mf_switch.created',
        'mf_switch.confirmed',
        'mf_switch.submitted',
        'mf_switch.successful',
        'mf_switch.failed',
        'mf_switch.cancelled',
        'mf_switch.reversed',
        'mandate.created',
        'mandate.received',
        'mandate.submitted',
        'mandate.approved',
        'mandate.rejected',
        'mandate.cancelled',
        'payment.pending',
        'payment.success',
        'payment.failed',
        'payment.submitted',
        'payment.initiated',
        'payment.approved',
        'payment.rejected',
      ];

      const responses = [];
      for (const event of events) {
        const token_response = await this.get_fp_token();
        if (token_response.status == 200) {
          const url = this.fp_base_url + '/v2/notification_webhooks';

          const body = {
            status: 'enabled',
            event: event,
            url: this.base_url + '/api/fpwebhooks/postback/' + this.tenant_id,
          };

          console.log('event creation body ', body);
          const res = await this.fp_post_request(
            url,
            token_response.access_token,
            body,
          );

          // return res;
        } else {
          return token_response;
        }
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }
  /*
        async update_user_returns_history(){
            try{
                let userOnboardingDetails = await this.userOnboardingRepository.find();
                for(let userOnboardingDetail  of userOnboardingDetails ){
                    let returns = await this.get_investment_account_wise_returns(userOnboardingDetail.fp_investment_account_id);
                    if(returns.status == 200){
                        let return_data = returns.data.data;
                        console.log("holdings value",returns);
                       
                        let userReturnsEntity = new UserReturnsHistory();
    
                        if(return_data.rows > 0){
    
    
                            userReturnsEntity.current_value = return_data.rows.length > 0 ? return_data.rows[0][2] : 0;
                            userReturnsEntity.absolute_return = return_data.rows.length > 0 ? return_data.rows[0][4] : 0;
                            userReturnsEntity.addjusted_value = return_data.rows.length > 0 > ;    
                            userReturnsEntity.cagr = return_data.rows.length > 0 ? return_data.rows[0][5] : 0;
                            userReturnsEntity.date = 
                            userReturnsEntity.invested_amount = return_data.rows.length > 0 ? return_data.rows[0][1] : 0;
                            userReturnsEntity.unrealized_gain =  return_data.rows.length > 0 ?  return_data.rows[0][3] : 0;
                            userReturnsEntity.xirr = return_data.rows.length > 0 ? return_data.rows[0][6] : 0;
                            userReturnsEntity.user_id = userOnboardingDetail.user_id;
    
    
                            await this.userReturnsHistoryRepository.save(holdingDetailEntity);
                        }
                        
                        
                    }
                }
    
            }catch(err){
                return {status:HttpStatus.BAD_REQUEST,data:err.message};
            }
        }
        */

  async get_holdings(old_investment_account_id: number, folios = '') {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        let url =
          this.fp_base_url +
          '/api/oms/investment_accounts/' +
          old_investment_account_id.toString() +
          '/holdings';
        if (folios != '') {
          url =
            this.fp_base_url +
            '/api/oms/investment_accounts/' +
            old_investment_account_id.toString() +
            '/holdings?folios=' +
            folios;
        }
        const res = await this.fp_get_request(url, token_response.access_token);

        return res;
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_holdings_report(
    old_investment_account_id: number,
    folios = '',
    as_on = '',
  ) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        let url =
          this.fp_base_url +
          '/api/oms/investment_accounts/' +
          old_investment_account_id.toString() +
          '/holdings?';
        if (folios != '') {
          url += 'folios=' + folios;
          if (as_on != '') {
            url += '&as_on=' + as_on;
          }
        } else if (as_on != '') {
          url += 'as_on=' + as_on;
        }

        console.log('URL OF HOLDING REPORT', url);
        const res = await this.fp_get_request(url, token_response.access_token);

        return res;
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_pincode_address(pincode: string) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/api/onb/pincodes/' + pincode;

        const res = await this.fp_get_request(url, token_response.access_token);

        return res;
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_bank_details(ifsc: string) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/api/onb/ifsc_codes/' + ifsc;

        const res = await this.fp_get_request(url, token_response.access_token);

        return res;
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_transactions(folios = '', types = '', from = '', to = '') {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url =
          this.fp_base_url +
          '/transactions?folios=' +
          folios +
          '&types=' +
          types +
          '&from=' +
          from +
          '&to=' +
          to;

        const res = await this.fp_get_request(url, token_response.access_token);

        return res;
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_aum_report(getAumReportDto: GetAumReportDto) {
    try {
      // for (const [key, value] of Object.entries(getAumReportDto)) {
      //     console.log(`${key}: ${value}`);
      //     if(value == null){
      //         delete getAumReportDto[key];
      //     }
      //   }

      console.log('hehehe', getAumReportDto);

      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url =
          this.fp_base_url +
          '/v2/transactions/reports/fund_scheme_category_wise_aum_summary';

        const res = await this.fp_post_request(
          url,
          token_response.access_token,
          getAumReportDto,
        );

        return res;
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_transaction_type_wise_amount_summary(
    getAumReportDto: GetAumReportDto,
  ) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url =
          this.fp_base_url +
          '/v2/transactions/reports/transaction_type_wise_amount_summary';

        const res = await this.fp_post_request(
          url,
          token_response.access_token,
          getAumReportDto,
        );

        return res;
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_transaction_list(transactionListDto: TransactionListDto) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url =
          this.fp_base_url + '/v2/transactions/reports/transaction_list';

        const res = await this.fp_post_request(
          url,
          token_response.access_token,
          transactionListDto,
        );

        return res;
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_mf_purchase_list(listFilterDto: ListFilterDto) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url =
          this.fp_base_url + '/v2/mf_purchases/reports/mf_purchase_list';

        const res = await this.fp_post_request(
          url,
          token_response.access_token,
          listFilterDto,
        );

        return res;
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_mf_redemption_list(listFilterDto: ListFilterDto) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url =
          this.fp_base_url + '/v2/mf_redemptions/reports/mf_redemption_list';

        const res = await this.fp_post_request(
          url,
          token_response.access_token,
          listFilterDto,
        );

        return res;
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_capital_gain(capitalGainFilterDto: CapitalGainFilterDto) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/transactions/reports/capital_gains';

        const res = await this.fp_post_request(
          url,
          token_response.access_token,
          capitalGainFilterDto,
        );

        return res;
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async createIdentityDocument(kyc_request_id: string, tenant_id: string) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/identity_documents';

        const res = await this.fp_post_request(
          url,
          token_response.access_token,
          {
            kyc_request: kyc_request_id,
            type: 'aadhaar',
            postback_url:
              this.base_url + '/api/onboarding/identity_postback/' + tenant_id,
          },
        );

        return res;
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async getIdentityDocument(doc_id: string) {
    try {
      const token_response = await this.get_fp_token();
      if (token_response.status == 200) {
        const url = this.fp_base_url + '/v2/identity_documents/' + doc_id;
        const res = await this.fp_get_request(url, token_response.access_token);
        return res;
      } else {
        return token_response;
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async fp_get_request(url, token) {
    const headersReq = {
      'Content-Type': 'application/json', // afaik this one is not needed
      'x-tenant-id': this.fp_tenant_id,
      Authorization: 'Bearer ' + token,
    };
    const response = this.httpService
      .get(url, { headers: headersReq })
      .pipe(
        map((resp) => {
          if (typeof resp.data != 'undefined') {
            console.log('FP RESPONSE DATA' + resp.data);

            return resp.data;
          } else {
            console.log('FP RESPONSE' + resp);

            return resp;
          }
        }),
      )
      .pipe(
        catchError((e) => {
          if (
            e.response &&
            e.response.data &&
            e.response.data.error &&
            e.response.data.error.errors
          ) {
            console.log(e.response.data.error);
            e.response.data.error.message = '';
            e.response.data.error.errors.map((er) => {
              e.response.data.error.message +=
                er.field + ' : ' + er.message + '. ';
            });
          }

          throw new ForbiddenException(e.response.data.error, e.message);
        }),
      );

    const result = await lastValueFrom(response);
    console.log('RESULT', result);
    return { status: HttpStatus.OK, data: result };
  }

  async fp_post_request(url, token, body) {
    console.log('bodyboy', body);
    const headersReq = {
      'Content-Type': 'application/json', // afaik this one is not needed
      'x-tenant-id': this.fp_tenant_id,
      Authorization: 'Bearer ' + token,
    };
    const response = this.httpService
      .post(url, body, { headers: headersReq })
      .pipe(
        map((resp) => {
          console.log('FP RESPONSE' + resp);
          console.log('FP RESPONSE' + resp.data);

          return resp.data;
        }),
      )
      .pipe(
        catchError((e) => {
          console.log('FP POST ERROR');

          console.log('kays', e.response);

          if (
            e.response &&
            e.response.data &&
            e.response.data.error &&
            e.response.data.error.errors
          ) {
            console.log('kamfi', e.response.data.error);
            e.response.data.error.message = '';
            e.response.data.error.errors.map((er) => {
              e.response.data.error.message +=
                er.field + ' : ' + er.message + '. ';
            });
          } else if (e.response && e.response.data && e.response.data.errors) {
            e.response.data['error'] = e.response.data.errors;
            console.log('korus', e.response.data.errors);
            e.response.data.error.message = '';

            const keys = Object.keys(e.response.data.errors);
            for (const key of keys) {
              console.log(
                'KEY --> ' + key + ' : ',
                e.response.data.errors[key],
              );
              e.response.data.errors[key].map((er) => {
                e.response.data.error.message +=
                  key + ' : ' + er.toString() + '. ';
              });
            }
          }

          throw new ForbiddenException(e.response.data.error, e.message);
        }),
      );

    const result = await lastValueFrom(response);
    console.log('POST RESPONSE RESULT ', result);
    return { status: HttpStatus.OK, data: result };
  }

  async fp_patch_request(url, token, body) {
    const headersReq = {
      'Content-Type': 'application/json', // afaik this one is not needed
      'x-tenant-id': this.fp_tenant_id,
      Authorization: 'Bearer ' + token,
    };
    const response = this.httpService
      .patch(url, body, { headers: headersReq })
      .pipe(
        map((resp) => {
          console.log('FP RESPONSE' + resp);
          console.log('FP RESPONSE' + resp.data);

          return resp.data;
        }),
      )
      .pipe(
        catchError((e) => {
          console.log(e.response);

          if (
            e.response &&
            e.response.data &&
            e.response.data.error &&
            e.response.data.error.errors
          ) {
            console.log(e.response.data.error);
            e.response.data.error.message = '';
            e.response.data.error.errors.map((er) => {
              e.response.data.error.message +=
                er.field + ' : ' + er.message + '. ';
            });
          }

          throw new ForbiddenException(e.response.data.error, e.message);
        }),
      );

    const result = await lastValueFrom(response);
    console.log(result);
    return { status: HttpStatus.OK, data: result };
  }
}
