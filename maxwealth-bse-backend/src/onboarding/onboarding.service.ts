import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createDecipheriv } from 'crypto';
import e from 'express';
import { cwd } from 'process';
import { Users } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { FintechService } from 'src/utils/fintech/fintech.service';
import { SignzyService } from 'src/utils/signzy/signzy.service';
import { In, Repository } from 'typeorm';
import { UserAddressDetails } from './address/entities/user_address_details.entity';
import { UserBankDetails } from './bank/entities/user_bank_details.entity';
import { AddAadhaarNumberDto } from './dtos/add-aadhaar-number.dto';
import { AddGeoTagDto } from './dtos/add-geo-tag.dto';
import { AddOccupationDetailsDto } from './dtos/add-occupation-details.dto';
import { AddPersonalDetailsDto } from './dtos/add-personal-details.dto';
import { CheckKycResponseDto } from './dtos/check-kyc-response.dto';
import { CheckKycDto } from './dtos/check-kyc.dto';
import { ConfirmPanDetailsDto } from './dtos/confirm-pan-details.dto';
import { EsignDto } from './dtos/esign.dto';
import { GetConfirmPanDetailsDto } from './dtos/get-confirm-pan-details.dto';
import { GetOccupationDetailsDto } from './dtos/get-occupation-details.dto';
import { GetPersonalDetailsDto } from './dtos/get-personal-details.dto';
import { GetPhotoDto } from './dtos/get-photo.dto';
import { GetSignatureDto } from './dtos/get-signature.dto';
import { GetStatusDto } from './dtos/get-status.dto';
import { GetVideoDto } from './dtos/get-video.dto';
import { UserOnboardingDetails } from './entities/user_onboarding_details.entity';
import { UserNomineeDetails } from './nominee/entities/user-nominee-details.entity';
import { TransactionBasketItems } from 'src/transaction_baskets/entities/transaction_basket_items.entity';
import { Purchase } from 'src/transaction_baskets/entities/purchases.entity';
import { PichainService } from 'src/utils/pichain/pichain.service';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { UserAddressDetailsRepository } from 'src/repositories/user_address_details.repository';
import { UserNomineeDetailsRepository } from 'src/repositories/user_nominee_details.repository';
import { TransactionBasketItemsRepository } from 'src/repositories/transaction_basket_item.repository';
import { UserBankDetailsRepository } from 'src/repositories/user_bank_details.repository';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { PhoneNumber } from './entities/phone_numbers.entity';
import { EmailAddress } from './entities/email_addresses.entity';
import { PhoneNumberRepository } from 'src/repositories/phone_number.repository';
import { EmailAddressRepository } from 'src/repositories/email_address.repository';
import { SignzyKycObjectRepository } from 'src/repositories/signzy_kyc_object.repository';
import { KycStatusDetailRepository } from 'src/repositories/kyc_status_details.repository';
import { KycStatusDetail } from './entities/kyc_status_details.entity';
import { SignzyKycObject } from './entities/signzy_kyc_object.entity';
import { BseService } from 'src/utils/bse/bse.service';
import { AddUccDto } from 'src/utils/bse/dtos/add_ucc.dto';
import { ConfigService } from '@nestjs/config';
import { HolderDto } from 'src/utils/bse/dtos/holder.dto';
import {
  BseBankAccTypeRepository,
  BseGenderRepository,
  BseIncomeSlabRepository,
  BseNominationRelationRepository,
  BseOccCodeRepository,
  BseOccTypeRepository,
  BsePanExemptCategoryRepository,
  BseWealthSourceRepository,
} from 'src/repositories/bse.repository';
import { IdentitfierDto } from 'src/utils/bse/dtos/identifier.dto';
import { ContactDto } from 'src/utils/bse/dtos/contact.dto';
import { use } from 'passport';
import { AddUccBseDto } from 'src/utils/bsev1/dto/adducc.dto';
import { Bsev1Service } from 'src/utils/bsev1/bsev1.service';
import { FatcaDto } from 'src/utils/bsev1/dto/fatca.dto';
import { TransactionBasketsService } from 'src/transaction_baskets/transaction_baskets.service';
import { BseStateandCodeRepository } from 'src/repositories/bse_state_and_codes.repository';
import { Bsev1NomineeRelationshipCodeRepository } from 'src/repositories/bse_v1_nominee_relationship_code.repository';
// import { PDFDocument } from 'pdf-lib';
// import * as fs from 'fs-extra';
import * as path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import pdfParse from 'pdf-parse';
import libre from 'libreoffice-convert';
import { promisify } from 'util';
import { Logger } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import * as pdf from 'html-pdf';
import { parseStringPromise } from 'xml2js';
import * as pdfPoppler from 'pdf-poppler';
import { fromBase64, fromBuffer } from 'pdf2pic';
import gm from 'gm';
import { BankService } from './bank/bank.service';
import { AddUccNewBseDto } from 'src/utils/bsev1/dto/adduccnew.dto';
// import { fromBuffer } from 'tiff';
// import * as sharp from 'sharp';
// import Jimp from 'jimp';

const convertAsync = promisify(libre.convert);

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);
  bse_member_code: string;
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
    private bseOccCodeRepository: BseOccCodeRepository,
    private bseOccTypeRepository: BseOccTypeRepository,
    private bsePanExemptCategoryRepository: BsePanExemptCategoryRepository,
    private bseGenderRepository: BseGenderRepository,
    private bseNomineeRelationRepository: BseNominationRelationRepository,
    private bseBankAccTypeRepository: BseBankAccTypeRepository,
    private bseWealthSourceRepository: BseWealthSourceRepository,
    private bseIncomeSlabRepository: BseIncomeSlabRepository,
    private bseStateandCodeRepository: BseStateandCodeRepository,
    private bseV1NomineeRelationshipCodeRepository: Bsev1NomineeRelationshipCodeRepository,

    private readonly fintechService: FintechService,
    private readonly signzyService: SignzyService,
    private readonly usersService: UsersService,
    private readonly pichainService: PichainService,
    private readonly bseService: BseService,
    private readonly bsev1Service: Bsev1Service,
    private readonly transactionBasketService: TransactionBasketsService,
    private readonly bankService: BankService,
  ) {
    const configService = new ConfigService();
    this.bse_member_code = configService.get('SANDBOX_MEMBER_CODE');
  }

  async check_kyc(checkKycDto: CheckKycDto) {
    try {
      let user: any;
      // let result = await this.fintechService.check_kyc(checkKycDto.pan);
      const kycPanRegex = /^[A-Z]{3}P[A-Z]3751[A-Z]$/;

      console.log('pan', checkKycDto.pan);
      console.log('check result', kycPanRegex.test(checkKycDto.pan));

      let userOboardingDetail = new UserOnboardingDetails();
      const userData = await this.usersService.findOneById(checkKycDto.user_id);
      user = userData.user;
      if (user) {
        userOboardingDetail =
          await this.userOnboardingDetailsRepository.findOneBy({ user: user });
        if (!userOboardingDetail) {
          userOboardingDetail = new UserOnboardingDetails();
          userOboardingDetail.user = user;
        }
        userOboardingDetail.pan = checkKycDto.pan;
        // userOboardingDetail.is_kyc_compliant = kycPanRegex.test(checkKycDto.pan);
        userOboardingDetail.is_kyc_compliant = checkKycDto.is_compliant;
        userOboardingDetail.status = 'kyc_check';
        userOboardingDetail = await this.userOnboardingDetailsRepository.save(
          userOboardingDetail,
        );
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }

      const checkKycResponse = new CheckKycResponseDto();
      checkKycResponse.name = 'John Doe'; //(result.data && result.data.entity_details) ? result.data.entity_details.name : "";
      checkKycResponse.pan = checkKycDto.pan;
      // checkKycResponse.status = kycPanRegex.test(checkKycDto.pan);
      checkKycResponse.status = checkKycDto.is_compliant;
      checkKycResponse.user_id = user.id;
      checkKycResponse.user_onboarding_detail_id = userOboardingDetail.id;

      // let panDetails = await this.pichainService.get_pan_details(checkKycDto.pan);
      // if (panDetails.status == HttpStatus.OK) {
      //     checkKycResponse.pan_details = panDetails.data;
      // } else {
      checkKycResponse.pan_details = null;
      // }

      return { status: HttpStatus.OK, data: checkKycResponse };
    } catch (err) {
      console.log('fecs', err.message);
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
        let onboarding = await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user.id },
          relations: ['kyc_status_details'],
        });
        if (!onboarding) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Please check your KYC compliance first',
          };
        }
        onboarding.full_name = confirmPanDetailsDto.full_name;
        onboarding.date_of_birth = confirmPanDetailsDto.date_of_birth;
        onboarding.status = 'confirm_pan';
        onboarding.fp_kyc_status = 'pending';

        if (!onboarding.is_kyc_compliant) {
          console.log('is not compliant!!!');
          let kycStatusDetail = new KycStatusDetail();
          let newSignzyKycObject = new SignzyKycObject();
          console.log('user', user);

          let signzyKycObject = await this.signzyKycObjectRepository.findOne({
            where: { user_id: user.id },
            order: {
              created_at: 'DESC',
            },
          });
          console.log('signzyKycObject', signzyKycObject);
          if (
            !signzyKycObject ||
            signzyKycObject.status == 'failed' ||
            signzyKycObject.status == 'expired'
          ) {
            const new_signzy_kyc_object =
              await this.signzyService.create_onboarding_object(user);
            console.log('created channel', new_signzy_kyc_object);

            if (new_signzy_kyc_object.status == 200) {
              newSignzyKycObject.channel_id =
                new_signzy_kyc_object.data.channelId;
              newSignzyKycObject.eventual_namespace = new_signzy_kyc_object.data
                .createdObj
                ? new_signzy_kyc_object.data.createdObj.eventualNamespace
                : null;
              newSignzyKycObject.initial_namespace = new_signzy_kyc_object.data
                .createdObj
                ? new_signzy_kyc_object.data.createdObj.initialNamespace
                : null;
              newSignzyKycObject.name = new_signzy_kyc_object.data.name;
              newSignzyKycObject.password = new_signzy_kyc_object.data
                .createdObj
                ? new_signzy_kyc_object.data.createdObj.id
                : null;
              newSignzyKycObject.phone = new_signzy_kyc_object.data.phone;
              newSignzyKycObject.user_id = user.id;
              newSignzyKycObject.username = new_signzy_kyc_object.data.username;
              newSignzyKycObject.status = 'created';
              newSignzyKycObject = await this.signzyKycObjectRepository.save(
                newSignzyKycObject,
              );
              signzyKycObject = newSignzyKycObject;
              onboarding.kyc_id = newSignzyKycObject.id;
              console.log('onboarding', onboarding);
              onboarding = await this.userOnboardingDetailsRepository.save(
                onboarding,
              );
            } else {
              return new_signzy_kyc_object;
            }
            kycStatusDetail.user_id = user.id;
            kycStatusDetail.user_onboarding_detail_id = onboarding.id;
            kycStatusDetail.signzy_kyc_object_id = newSignzyKycObject.id;
            kycStatusDetail.pan = true;
            kycStatusDetail.full_name = true;
            kycStatusDetail.date_of_birth = true;

            kycStatusDetail.status = 'confirm_pan';
            kycStatusDetail = await this.kycStatusDetailRepository.save(
              kycStatusDetail,
            );
            onboarding.kyc_status_details.push(kycStatusDetail);
          } else {
            newSignzyKycObject = signzyKycObject;
            console.log('signzyKycObject 2', signzyKycObject);
            kycStatusDetail =
              onboarding.kyc_status_details[
                onboarding.kyc_status_details.length - 1
              ];
            if (kycStatusDetail == null) {
              kycStatusDetail = new KycStatusDetail();
              kycStatusDetail.user_id = user.id;
              kycStatusDetail.user_onboarding_detail_id = onboarding.id;
              kycStatusDetail.signzy_kyc_object_id = newSignzyKycObject.id;
              kycStatusDetail.pan = true;
              kycStatusDetail.full_name = true;
              kycStatusDetail.date_of_birth = true;

              kycStatusDetail.status = 'confirm_pan';
              kycStatusDetail = await this.kycStatusDetailRepository.save(
                kycStatusDetail,
              );
              console.log('kycStatusDetail saved', kycStatusDetail);
              onboarding.kyc_status_details.push(kycStatusDetail);
            }

            kycStatusDetail.pan = true;
            kycStatusDetail.full_name = true;
            kycStatusDetail.date_of_birth = true;

            kycStatusDetail.status = 'confirm_pan';
            kycStatusDetail = await this.kycStatusDetailRepository.save(
              kycStatusDetail,
            );
          }
          console.log('signzyKycObject', signzyKycObject);
          onboarding.kyc_id = signzyKycObject.id;

          const kyc_data_resp = await this.signzyService.update_kyc_data(
            user,
            newSignzyKycObject,
            kycStatusDetail,
          );
          console.log('kyc_data_resp', kyc_data_resp);
          const pdf_resp = await this.signzyService.create_pdf(
            onboarding,
            newSignzyKycObject,
            kycStatusDetail,
          );
          console.log('pdf_resp', pdf_resp);
          console.log('onboarding', onboarding);

          await this.userOnboardingDetailsRepository.save(onboarding);

          return { status: HttpStatus.OK, message: 'Updated the details' };
        }
        console.log('onboarding final', onboarding);
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
          {
            user_id: user.id,
          },
        );
        const confirmPanDetailsDto = new GetConfirmPanDetailsDto();
        console.log(onboarding);
        if (onboarding) {
          confirmPanDetailsDto.id = onboarding.id;
          confirmPanDetailsDto.full_name = onboarding.full_name;
          confirmPanDetailsDto.date_of_birth = onboarding.date_of_birth;
          confirmPanDetailsDto.pan = onboarding.pan;
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
          relations: ['kyc_status_details'],
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
        if (!onboarding.is_kyc_compliant) {
          if (onboarding.kyc_status_details.length > 0) {
            let kyc_status_detail =
              onboarding.kyc_status_details[
                onboarding.kyc_status_details.length - 1
              ];
            // let signzy_kyc_object = await this.signzyKycObjectRepository.findOneBy({id:onboarding.kyc_id})
            const signzy_kyc_object =
              await this.signzyKycObjectRepository.findOne({
                where: { user_id: user.id },
                order: {
                  created_at: 'DESC',
                },
              });
            if (signzy_kyc_object.status == 'created') {
              kyc_status_detail.gender = true;
              kyc_status_detail.father_name = true;
              kyc_status_detail.mother_name = true;
              kyc_status_detail.marital_status = true;
              kyc_status_detail.status = 'personal_details';
              kyc_status_detail = await this.kycStatusDetailRepository.save(
                kyc_status_detail,
              );
              await this.userOnboardingDetailsRepository.save(onboarding);
              const kyc_data_resp = await this.signzyService.update_kyc_data(
                user,
                signzy_kyc_object,
                kyc_status_detail,
              );
              console.log(kyc_data_resp);

              const pdf_resp = await this.signzyService.create_pdf(
                onboarding,
                signzy_kyc_object,
                kyc_status_detail,
              );
              console.log(pdf_resp);

              return { status: HttpStatus.OK, message: 'Updated the details' };
            } else {
              return {
                status: HttpStatus.BAD_REQUEST,
                error:
                  'Your KYC is already in the ' +
                  signzy_kyc_object.status +
                  ' status.If you want to onboard again then, please recheck your KYC compliance and confirm your PAN details',
              };
            }

            // let result = await this.fintechService.update_personal_details_kyc(addPersonalDetailsDto, onboarding.kyc_id);

            // if (result.status == 200) {
            //     let temp_onboarding = await this.userOnboardingDetailsRepository.findOneBy({ user_id: user.id });
            //     onboarding.kyc_id = temp_onboarding.kyc_id;
            //     onboarding.fp_kyc_status = temp_onboarding.fp_kyc_status;

            //     await this.userOnboardingDetailsRepository.save(onboarding);
            //     return { "status": HttpStatus.OK, "message": "Updated the details" };
            // } else {
            //     return result;
            // }
          } else {
            return {
              status: HttpStatus.BAD_REQUEST,
              error:
                'Please check your KYC compliance and confirm your PAN details first',
            };
          }
        }
        const temp_onboarding =
          await this.userOnboardingDetailsRepository.findOneBy({
            user_id: user.id,
          });
        onboarding.kyc_id = temp_onboarding.kyc_id;
        onboarding.fp_kyc_status = temp_onboarding.fp_kyc_status;
        await this.userOnboardingDetailsRepository.save(onboarding);
        return { status: HttpStatus.OK, message: 'Updated the details' };
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
        });
        console.log('On-onboard');
        delete onboarding.pan_buffer;
        delete onboarding.pdf_buffers;
        delete onboarding.photo_buffer;
        delete onboarding.address_proof_buffer;
        delete onboarding.signature_buffer;
        delete onboarding.aadhar_xml;

        console.log(onboarding);
        if (onboarding) {
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

          // let transaction_basket_item_ids = await this.transactionBasketItemsRepository.find({
          //     select: { id: true }, 'where': [
          //         { 'transaction_type': 'lumpsum', 'user_id': user_id },
          //         { 'transaction_type': 'sip', 'user_id': user_id },
          //         { 'transaction_type': 'no_mandate_sip', 'user_id': user_id }
          //     ]
          // });

          // console.log("Transabas", transaction_basket_item_ids);
          // let item_ids = transaction_basket_item_ids.map(item => { return item.id })

          // onboarding["is_investment_done"] = false;
          // if (transaction_basket_item_ids.length > 0) {
          //     let purchases = await this.purchaseRepository.find({ where: { transaction_basket_item_id: In(item_ids), state: "successful" } })
          //     console.log("purfes", purchases)
          //     if (purchases.length > 0) {
          //         onboarding["is_investment_done"] = true;
          //     }
          // }

          return { status: HttpStatus.OK, data: onboarding };
        } else {
          return { status: HttpStatus.NOT_FOUND, error: 'No Onboarding found' };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      console.log('err', err);
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
          relations: ['kyc_status_details'],
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
          if (onboarding.kyc_id) {
            console.log('3');

            let kyc_status_detail =
              onboarding.kyc_status_details[
                onboarding.kyc_status_details.length - 1
              ];
            const signzy_kyc_object =
              await this.signzyKycObjectRepository.findOneBy({
                id: onboarding.kyc_id,
              });
            if (signzy_kyc_object.status == 'created') {
              console.log('4');

              kyc_status_detail.occupation = true;
              kyc_status_detail.annual_income = true;
              kyc_status_detail.nationality = true;
              console.log('5');

              kyc_status_detail.status = 'occupation_details';
              kyc_status_detail = await this.kycStatusDetailRepository.save(
                kyc_status_detail,
              );
              console.log('6');

              await this.userOnboardingDetailsRepository.save(onboarding);
              const kyc_data_resp = await this.signzyService.update_kyc_data(
                user,
                signzy_kyc_object,
                kyc_status_detail,
              );
              console.log(kyc_data_resp);
              const pdf_resp = await this.signzyService.create_pdf(
                onboarding,
                signzy_kyc_object,
                kyc_status_detail,
              );
              console.log(pdf_resp);

              return { status: HttpStatus.OK, message: 'Updated the details' };
            } else {
              return {
                status: HttpStatus.BAD_REQUEST,
                error:
                  'Your KYC is already in the ' +
                  signzy_kyc_object.status +
                  ' status.If you want to onboard again then, please recheck your KYC compliance and confirm your PAN details',
              };
            }
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
          } else {
            return {
              status: HttpStatus.BAD_REQUEST,
              error:
                'Please check your KYC compliance and confirm your PAN details first',
            };
          }
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
          {
            user_id: user.id,
          },
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

  async add_photo(user_id: number, photo) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
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
        if (photo && photo.path) {
          onboarding.photo_url = photo.path;

          onboarding.status = 'photo';

          // signzy update photo details
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Photo not uploaded',
          };
        }

        if (!onboarding.is_kyc_compliant) {
          if (onboarding.kyc_id) {
            const kyc_status_detail =
              onboarding.kyc_status_details[
                onboarding.kyc_status_details.length - 1
              ];

            const signzy_kyc_object =
              await this.signzyKycObjectRepository.findOne({
                where: { user_id: user.id },
                order: {
                  created_at: 'DESC',
                },
              });
            if (signzy_kyc_object.status == 'created') {
              const result = await this.signzyService.fileToUpload(
                signzy_kyc_object,
                cwd() + '/' + photo.path,
              );
              if (result.status == HttpStatus.OK) {
                onboarding.fp_photo_file_id = result.data.id;

                // signzy update photo details
                console.log('URL of upload', result.data.file.directURL);
                const response = await this.signzyService.update_photo_upload(
                  user,
                  signzy_kyc_object,
                  kyc_status_detail,
                  result.data.file.directURL,
                );
                if (response.status != HttpStatus.OK) {
                  return response;
                } else {
                  const pdf_resp = await this.signzyService.create_pdf(
                    onboarding,
                    signzy_kyc_object,
                    kyc_status_detail,
                  );
                  console.log(pdf_resp);
                }
              } else {
                return result;
              }
            } else {
              return {
                status: HttpStatus.BAD_REQUEST,
                error:
                  'Your KYC is already in the ' +
                  signzy_kyc_object.status +
                  ' status.If you want to onboard again then, please recheck your KYC compliance and confirm your PAN details',
              };
            }
            // let result = await this.fintechService.update_photo_kyc(onboarding);

            // if (result.status == 200) {
            //     let temp_onboarding = await this.userOnboardingDetailsRepository.findOneBy({ user_id: user.id });
            //     onboarding.kyc_id = temp_onboarding.kyc_id;
            //     onboarding.fp_kyc_status = temp_onboarding.fp_kyc_status;
            //     await this.userOnboardingDetailsRepository.save(onboarding);
            //     return { "status": HttpStatus.OK, "message": "Updated the details" };
            // } else {
            //     return result;
            // }
          } else {
            return {
              status: HttpStatus.BAD_REQUEST,
              error:
                'Please check your KYC compliance and confirm your PAN details first',
            };
          }
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

  async add_signature(user_id: number, signature: Express.Multer.File) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      console.log('userData', userData);
      const user = userData.user;
      if (user) {
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
        if (signature && signature.path) {
          onboarding.signature_url = signature.path;
          onboarding.status = 'signature';

          // signzy update photo details
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Signature not uploaded',
          };
        }

        if (!onboarding.is_kyc_compliant) {
          if (onboarding.kyc_id) {
            const kyc_status_detail =
              onboarding.kyc_status_details[
                onboarding.kyc_status_details.length - 1
              ];

            const signzy_kyc_object =
              await this.signzyKycObjectRepository.findOne({
                where: { user_id: user.id },
                order: {
                  created_at: 'DESC',
                },
              });
            if (signzy_kyc_object.status == 'created') {
              const result = await this.signzyService.fileToUpload(
                signzy_kyc_object,
                cwd() + '/' + signature.path,
              );
              if (result.status == HttpStatus.OK) {
                onboarding.fp_signature_file_id = result.data.id;

                // signzy update photo details
                console.log('URL of upload', result.data.file.directURL);
                const response =
                  await this.signzyService.update_signature_upload(
                    user,
                    signzy_kyc_object,
                    kyc_status_detail,
                    result.data.file.directURL,
                  );
                if (response.status != HttpStatus.OK) {
                  return response;
                } else {
                  const pdf_resp = await this.signzyService.create_pdf(
                    onboarding,
                    signzy_kyc_object,
                    kyc_status_detail,
                  );
                  console.log(pdf_resp);
                }
              } else {
                return result;
              }
            } else {
              return {
                status: HttpStatus.BAD_REQUEST,
                error:
                  'Your KYC is already in the ' +
                  signzy_kyc_object.status +
                  ' status.If you want to onboard again then, please recheck your KYC compliance and confirm your PAN details',
              };
            }
            // let result = await this.fintechService.update_photo_kyc(onboarding);

            // if (result.status == 200) {
            //     let temp_onboarding = await this.userOnboardingDetailsRepository.findOneBy({ user_id: user.id });
            //     onboarding.kyc_id = temp_onboarding.kyc_id;
            //     onboarding.fp_kyc_status = temp_onboarding.fp_kyc_status;
            //     await this.userOnboardingDetailsRepository.save(onboarding);
            //     return { "status": HttpStatus.OK, "message": "Updated the details" };
            // } else {
            //     return result;
            // }
          } else {
            return {
              status: HttpStatus.BAD_REQUEST,
              error:
                'Please check your KYC compliance and confirm your PAN details first',
            };
          }
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

  async add_video(user_id: number, video) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          {
            user_id: user.id,
          },
        );
        if (!onboarding) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Please check your KYC compliance first',
          };
        }
        if (video && video.path) {
          const result = await this.fintechService.fileToUpload(
            cwd() + '/' + video.path,
          );
          if (result.status == HttpStatus.OK) {
            onboarding.video_url = video.path;
            onboarding.fp_video_file_id = result.data.id;
            onboarding.status = 'video';
          } else {
            return result;
          }
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Video not uploaded',
          };
        }

        if (!onboarding.is_kyc_compliant) {
          if (onboarding.kyc_id) {
            const result = await this.fintechService.update_video_kyc(
              onboarding,
            );

            // if (result.status == 200) {
            //     let temp_onboarding = await this.userOnboardingDetailsRepository.findOneBy({ user_id: user.id });
            //     onboarding.kyc_id = temp_onboarding.kyc_id;
            //     onboarding.fp_kyc_status = temp_onboarding.fp_kyc_status;
            //     await this.userOnboardingDetailsRepository.save(onboarding);
            //     return { "status": HttpStatus.OK, "message": "Updated the details" };
            // } else {
            //     return result;
            // }
          } else {
            return {
              status: HttpStatus.BAD_REQUEST,
              error:
                'Please check your KYC compliance and confirm your PAN detailsfirst',
            };
          }
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

  async get_photo_details(user_id: number) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          {
            user_id: user.id,
          },
        );
        const respDto = new GetPhotoDto();
        console.log(onboarding);
        if (onboarding) {
          respDto.id = onboarding.id;
          respDto.fp_photo_file_id = onboarding.fp_photo_file_id;
          respDto.photo_url = onboarding.photo_url;
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

  async get_video_details(user_id: number) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          {
            user_id: user.id,
          },
        );
        const respDto = new GetVideoDto();
        console.log(onboarding);
        if (onboarding) {
          respDto.id = onboarding.id;
          respDto.fp_video_file_id = onboarding.fp_video_file_id;
          respDto.video_url = onboarding.video_url;
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
          {
            user_id: user.id,
          },
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

  async get_video_otp(user_id) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          {
            user_id: user.id,
          },
        );
        console.log(onboarding);
        if (onboarding && !onboarding.is_kyc_compliant) {
          // let kyc = await this.fintechService.fetch_kyc(onboarding.kyc_id);
          // if (kyc.status == HttpStatus.OK) {
          //     return { "status": HttpStatus.OK, "otp": kyc.data.otp };
          // } else {
          //     return kyc;
          // }
        } else {
          return { status: HttpStatus.NOT_FOUND, error: 'No Onboarding found' };
        }
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async add_geo_tag(user_id, addGeoTagDto: AddGeoTagDto) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          {
            user_id: user.id,
          },
        );
        if (!onboarding) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Please check your KYC compliance first',
          };
        }
        onboarding.lat = addGeoTagDto.lat;
        onboarding.lng = addGeoTagDto.lng;

        onboarding.status = 'geo_tag';
        if (!onboarding.is_kyc_compliant) {
          // they are only allowed to use the pan used in previous step - check kyc
          if (onboarding.kyc_id) {
            // let result = await this.fintechService.update_geo_tag_kyc(addGeoTagDto, onboarding.kyc_id);
            // if (result.status == 200) {
            //     let temp_onboarding = await this.userOnboardingDetailsRepository.findOneBy({ user_id: user.id });
            //     onboarding.kyc_id = temp_onboarding.kyc_id;
            //     onboarding.fp_kyc_status = temp_onboarding.fp_kyc_status;
            //     await this.userOnboardingDetailsRepository.save(onboarding);
            //     return { "status": HttpStatus.OK, "message": "Updated the details" };
            // } else {
            //     return result;
            // }
          } else {
            return {
              status: HttpStatus.BAD_REQUEST,
              error:
                'Please check your KYC compliance and confirm your PAN detailsfirst',
            };
          }
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

  async add_aadhaar_number(user_id, addAadhaarNumberDto: AddAadhaarNumberDto) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          {
            user_id: user.id,
          },
        );
        if (!onboarding) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Please check your KYC compliance first',
          };
        }
        onboarding.aadhaar_number = addAadhaarNumberDto.aadhaar_number;
        onboarding.status = 'verify_aadhaar_number';
        if (!onboarding.is_kyc_compliant) {
          // they are only allowed to use the pan used in previous step - check kyc
          if (onboarding.kyc_id) {
            const result = await this.fintechService.update_aadhaar_number(
              addAadhaarNumberDto,
              onboarding.kyc_id,
            );

            // if (result.status == 200) {
            //     let temp_onboarding = await this.userOnboardingDetailsRepository.findOneBy({ user_id: user.id });
            //     onboarding.kyc_id = temp_onboarding.kyc_id;
            //     onboarding.fp_kyc_status = temp_onboarding.fp_kyc_status;
            //     await this.userOnboardingDetailsRepository.save(onboarding);
            //     return { "status": HttpStatus.OK, "message": "Updated the details" };
            // } else {
            //     return result;
            // }
          } else {
            return {
              status: HttpStatus.BAD_REQUEST,
              error:
                'Please check your KYC compliance and confirm your PAN detailsfirst',
            };
          }
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

  async get_aadhaar_number(user_id) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          {
            user_id: user.id,
          },
        );
        console.log(onboarding);
        if (onboarding) {
          return {
            status: HttpStatus.OK,
            aadhaar_number: onboarding.aadhaar_number,
          };
        } else {
          return { status: HttpStatus.NOT_FOUND, error: 'No Onboarding found' };
        }
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async initiate_esign(user_id: number, tenant_id: string) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      if (user) {
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
        onboarding.status = 'initiate_esign';
        if (!onboarding.is_kyc_compliant) {
          // they are only allowed to use the pan used in previous step - check kyc
          if (onboarding.kyc_id) {
            const kyc_status_detail =
              onboarding.kyc_status_details[
                onboarding.kyc_status_details.length - 1
              ];

            const signzy_kyc_object =
              await this.signzyKycObjectRepository.findOne({
                where: { user_id: user.id },
                order: {
                  created_at: 'DESC',
                },
              });
            if (signzy_kyc_object.status == 'created') {
              const result = await this.signzyService.generate_esign(
                tenant_id,
                onboarding,
                signzy_kyc_object,
                kyc_status_detail,
              );
              if (result.status == HttpStatus.OK) {
                onboarding.fp_esign_id = result['data'].object.id;
                onboarding.fp_esign_status = 'generated';

                const esign = new EsignDto();

                esign.esign_id = result['data'].object.id;
                esign.redirect_url = result['data'].object.result.url;
                esign.esign_status = 'generated';
                esign.is_kyc_compliant = onboarding.is_kyc_compliant;
                esign.kyc_id = onboarding.kyc_id;
                esign.user_id = user_id;

                onboarding.fp_kyc_status = 'esign_required';
                const temp_onboarding =
                  await this.userOnboardingDetailsRepository.findOneBy({
                    user_id: user.id,
                  });
                onboarding.kyc_id = temp_onboarding.kyc_id;
                onboarding.fp_kyc_status = temp_onboarding.fp_kyc_status;
                await this.userOnboardingDetailsRepository.save(onboarding);
                return { status: HttpStatus.OK, data: esign };
              } else {
                return result;
              }
            } else {
              return {
                status: HttpStatus.BAD_REQUEST,
                error:
                  'Your KYC is already in the ' +
                  signzy_kyc_object.status +
                  ' status.If you want to onboard again then, please recheck your KYC compliance and confirm your PAN details',
              };
            }
          } else {
            return {
              status: HttpStatus.BAD_REQUEST,
              error:
                'Please check your KYC compliance and confirm your PAN detailsfirst',
            };
          }
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

  async esign_callback(query, body) {
    try {
      const onboarding = await this.userOnboardingDetailsRepository.findOne({
        where: { id: query.onboarding_id },
        relations: ['kyc_status_details'],
      });

      if (onboarding) {
        if (body.esignData && body.esignData.success == true) {
          onboarding.fp_esign_status = 'successful';
          onboarding.fp_kyc_status = 'submitted';
        } else if (body.esignData && body.esignData.success == false) {
          onboarding.fp_esign_status = 'failed';
        }
        await this.userOnboardingDetailsRepository.save(onboarding);
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'could not find the esign onboarding',
        };
      }
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'sorry something went wrong ' + err.message,
      };
    }
  }

  async esign_postback(postback) {
    try {
      console.log(postback);
      const onboarding = await this.userOnboardingDetailsRepository.findOne({
        where: { id: postback.onboarding_id },
        relations: ['kyc_status_details'],
      });
      if (onboarding) {
        return {
          status: 'success',
          message: 'Esign status is ' + onboarding.fp_esign_status,
          esign_status: onboarding.fp_esign_status,
        };
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'could not find the esign onboarding',
        };
      }
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'sorry something went wrong ' + err.message,
      };
    }
  }

  async create_investor_v2(user_id: number) {
    try {
      const userResp = await this.usersService.findOneById(user_id);
      const user = userResp.user;

      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user.id },
          relations: ['user'],
        });
        if (onboarding.fp_investor_id != null) {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'investor already created',
          };
        }
        // var address = await this.userAddressDetailsRepository.findOneBy({user_id:user.id});
        // var nominees = await this.userNomineeDetailsRepository.findBy({user_id:user.id}) ;
        // var banks = await this.userBankDetailsRepository.findBy({user_id:user.id}) ;
        // console.log("bank",banks);
        console.log('onboarding', onboarding);
        // console.log("nominees",nominees);
        // console.log("address",address);

        const result = await this.fintechService.create_update_investor_v2(
          onboarding,
        );
        console.log('CREATE INVESTOR RESULT: ', result);
        if (result.status == 200) {
          onboarding.fp_investor_id = result.data.id;
          await this.userOnboardingDetailsRepository.save(onboarding);

          // let bank_result = await this.fintechService.create_bank(result.data.id,banks[0]);
          // console.log("bank result", bank_result );

          // if(bank_result.status != 200){
          //     console.log("ERROR: Bank not created");
          // }else{

          // let fp_bank =  bank_result.data;
          // banks[0].fp_bank_id = fp_bank.id;
          // banks[0].old_fp_bank_id = fp_bank.old_id;

          // this.userBankDetailsRepository.save(banks[0]);
          // }

          // let address_result = await this.fintechService.create_address(result.data.id,address);

          // if(address_result.status != 200){
          //     console.log("ERROR: Address not created");
          // }else{
          //     let fp_address =  address_result.data;
          //     address.fp_id = fp_address.id;
          //     this.userAddressDetailsRepository.save(address);
          // }

          // for( let nominee of nominees){

          //     let nominee_result  = await this.fintechService.create_related_parties(result.data.id,nominee);
          //     if(nominee_result.status != 200){
          //         console.log("ERROR: Nominee not created");
          //     }else{
          //         let fp_nominee =  nominee_result.data;
          //         nominee.fp_id = fp_nominee.id;
          //         this.userNomineeDetailsRepository.save(nominee);
          //     }
          // }

          const phones_result = await this.fintechService.create_phone(
            result.data.id,
            user.mobile,
          );

          if (phones_result.status != 200) {
            console.log('ERROR: Phone not created');
          } else {
            const fp_phone = phones_result.data;
            const phone_number = new PhoneNumber();
            phone_number.belongs_to = fp_phone.belongs_to;
            phone_number.created_at = fp_phone.created_at;
            phone_number.isd = fp_phone.isd;
            phone_number.number = fp_phone.number;
            // phone_number.profile = fp_phone.profile;
            phone_number.user_id = user_id;
            // phone_number.fp_id = fp_phone.id;

            this.phoneNumbersRepository.save(phone_number);
          }

          const emails_result = await this.fintechService.create_email(
            result.data.id,
            user.email,
          );

          if (emails_result.status != 200) {
            console.log('ERROR: Phone not created');
          } else {
            const fp_email = emails_result.data;
            const email_address = new EmailAddress();
            email_address.belongs_to = fp_email.belongs_to;
            email_address.created_at = fp_email.created_at;
            email_address.email = fp_email.email;
            // email_address.profile = fp_email.profile;
            email_address.user_id = user_id;
            // email_address.fp_id = fp_email.id;

            this.emailAddressesRepository.save(email_address);
          }
        }
        return result;
      } else {
        return { status: HttpStatus.BAD_REQUEST, message: 'user not found' };
      }
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message:
          'There are some errors creating the investor account - ' +
          err.message,
      };
    }
  }

  async create_investor(user_id: number) {
    try {
      const userResp = await this.usersService.findOneById(user_id);
      const user = userResp.user;

      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user.id },
          relations: ['user'],
        });
        if (onboarding.fp_investor_id != null) {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'investor already created',
          };
        }
        const address = await this.userAddressDetailsRepository.findOneBy({
          user_id: user.id,
        });
        const nominees = await this.userNomineeDetailsRepository.findBy({
          user_id: user.id,
        });
        const banks = await this.userBankDetailsRepository.findBy({
          user_id: user.id,
        });
        console.log('bank', banks);
        console.log('onboarding', onboarding);
        console.log('nominees', nominees);
        console.log('address', address);

        const result = await this.fintechService.create_update_investor_v2(
          onboarding,
        );
        console.log('CREATE INVESTOR RESULT: ', result);
        if (result.status == 200) {
          onboarding.fp_investor_id = result.data.id;
          await this.userOnboardingDetailsRepository.save(onboarding);

          const bank_result = await this.fintechService.create_bank(
            result.data.id,
            banks[0],
          );
          console.log('bank result', bank_result);

          if (bank_result.status != 200) {
            console.log('ERROR: Bank not created');
          } else {
            const fp_bank = bank_result.data;
            // banks[0].fp_bank_id = fp_bank.id;
            // banks[0].old_fp_bank_id = fp_bank.old_id;

            this.userBankDetailsRepository.save(banks[0]);
          }

          const address_result = await this.fintechService.create_address(
            result.data.id,
            address,
          );

          if (address_result.status != 200) {
            console.log('ERROR: Address not created');
          } else {
            const fp_address = address_result.data;
            // address.fp_id = fp_address.id;
            this.userAddressDetailsRepository.save(address);
          }

          for (const nominee of nominees) {
            const nominee_result =
              await this.fintechService.create_related_parties(
                result.data.id,
                nominee,
              );
            if (nominee_result.status != 200) {
              console.log('ERROR: Nominee not created');
            } else {
              const fp_nominee = nominee_result.data;
              // nominee.fp_id = fp_nominee.id;
              this.userNomineeDetailsRepository.save(nominee);
            }
          }

          const phones_result = await this.fintechService.create_phone(
            result.data.id,
            user.mobile,
          );

          if (phones_result.status != 200) {
            console.log('ERROR: Phone not created');
          } else {
            const fp_phone = phones_result.data;
            const phone_number = new PhoneNumber();
            phone_number.belongs_to = fp_phone.belongs_to;
            phone_number.created_at = fp_phone.created_at;
            phone_number.isd = fp_phone.isd;
            phone_number.number = fp_phone.number;
            // phone_number.profile = fp_phone.profile;
            phone_number.user_id = user_id;
            // phone_number.fp_id = fp_phone.id;

            this.phoneNumbersRepository.save(phone_number);
          }

          const emails_result = await this.fintechService.create_email(
            result.data.id,
            user.email,
          );

          if (emails_result.status != 200) {
            console.log('ERROR: Phone not created');
          } else {
            const fp_email = emails_result.data;
            const email_address = new EmailAddress();
            email_address.belongs_to = fp_email.belongs_to;
            email_address.created_at = fp_email.created_at;
            email_address.email = fp_email.email;
            // email_address.profile = fp_email.profile;
            email_address.user_id = user_id;
            // email_address.fp_id = fp_email.id;

            this.emailAddressesRepository.save(email_address);
          }
        }
        return result;
      } else {
        return { status: HttpStatus.BAD_REQUEST, message: 'user not found' };
      }
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message:
          'There are some errors creating the investor account - ' +
          err.message,
      };
    }
  }

  async create_investment_account(user_id: number) {
    try {
      const userResp = await this.usersService.findOneById(user_id);
      const user = userResp.user;

      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user.id },
          relations: ['user'],
        });
        if (
          onboarding.fp_investment_account_id != null &&
          onboarding.fp_investment_account_old_id != null
        ) {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'investment account already created',
          };
        }
        const result = await this.fintechService.create_investment_account(
          onboarding,
        );
        if (result.status == 200) {
          onboarding.fp_investment_account_id = result.data.id;
          onboarding.fp_investment_account_old_id = result.data.old_id;
          await this.userOnboardingDetailsRepository.save(onboarding);
        }
        return result;
      } else {
        return { status: HttpStatus.BAD_REQUEST, message: 'user not found' };
      }
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message:
          'There are some errors creating the investor account - ' +
          err.message,
      };
    }
  }

  async identity_documents(user_id: number, tenant_id: string) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;

      let userOnboardingDetail =
        await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user_id },
          relations: ['kyc_status_details'],
        });
      if (userOnboardingDetail) {
        console.log('userOnboardingDetail.kyc_id', userOnboardingDetail.kyc_id);

        const kyc_status_detail =
          userOnboardingDetail.kyc_status_details[
            userOnboardingDetail.kyc_status_details.length - 1
          ];
        // let signzy_kyc_object = await this.signzyKycObjectRepository.findOneBy({id:onboarding.kyc_id})
        const signzy_kyc_object = await this.signzyKycObjectRepository.findOne({
          where: { user_id: user.id },
          order: {
            created_at: 'DESC',
          },
        });
        if (signzy_kyc_object.status == 'created') {
          // kyc_status_detail = await this.kycStatusDetailRepository.save(kyc_status_detail);
          // await this.userOnboardingDetailsRepository.save(userOnboardingDetail);
          if (userOnboardingDetail.identity_document_status == 'successful') {
            return {
              status: HttpStatus.OK,
              data: {
                result: {
                  url: '',
                  requestId: userOnboardingDetail.identity_document_id,
                  status: userOnboardingDetail.identity_document_status,
                },
              },
            };
          } else {
            if (userOnboardingDetail.identity_document_id != null) {
              const identity_document =
                await this.signzyService.fetch_digilocker_details(
                  userOnboardingDetail.user,
                  signzy_kyc_object,
                  kyc_status_detail,
                );
              if (identity_document.status == HttpStatus.OK) {
                if (
                  'output' in identity_document['data'].result &&
                  identity_document['data'].result['output'] !== undefined &&
                  identity_document['data'].result['output'] !== null
                ) {
                  userOnboardingDetail.identity_document_status = 'successful';
                  userOnboardingDetail =
                    await this.userOnboardingDetailsRepository.save(
                      userOnboardingDetail,
                    );
                  return {
                    status: HttpStatus.OK,
                    data: {
                      result: {
                        url: '',
                        requestId: userOnboardingDetail.identity_document_id,
                        status: userOnboardingDetail.identity_document_status,
                      },
                    },
                  };
                }
              }
            }

            const result = await this.signzyService.generate_digilocker_url(
              tenant_id,
              signzy_kyc_object,
              kyc_status_detail,
            );
            if (result.status == HttpStatus.OK) {
              userOnboardingDetail.identity_document_id =
                result['data'].result.requestId;
              userOnboardingDetail.identity_document_status = 'pending';
              await this.userOnboardingDetailsRepository.save(
                userOnboardingDetail,
              );
              result['data'].result['status'] = 'pending';
            }
            return result;
          }
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            error:
              'Your KYC is already in the ' +
              signzy_kyc_object.status +
              ' status.If you want to onboard again then, please recheck your KYC compliance and confirm your PAN details',
          };
        }

        // let result = await this.fintechService.createIdentityDocument(userOnboardingDetail.kyc_id, tenant_id);

        // if (result.status == HttpStatus.OK) {
        //     userOnboardingDetail.identity_document_id = result.data.id;
        //     userOnboardingDetail.identity_document_status = result.data.fetch.status;

        //     await this.userOnboardingDetailsRepository.save(userOnboardingDetail);

        //     return result;
        // } else {
        //     result = await this.fintechService.getIdentityDocument(userOnboardingDetail.identity_document_id);
        //     if (result.status == HttpStatus.OK) {

        //         userOnboardingDetail.identity_document_id = result.data.id;
        //         userOnboardingDetail.identity_document_status = result.data.fetch.status;

        //         await this.userOnboardingDetailsRepository.save(userOnboardingDetail);
        //     }
        //     return result;
        // }
      } else {
        return { status: HttpStatus.BAD_REQUEST, message: 'KYC not found' };
      }
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'sorry something went wrong ' + err.message,
      };
    }
  }

  async identity_document_postback(requestId, status) {
    try {
      // user,signzy_kyc_object,kyc_status_detail:KycStatusDetail
      const userOnboardingDetail =
        await this.userOnboardingDetailsRepository.findOne({
          where: { identity_document_id: requestId },
          relations: ['user', 'kyc_status_details'],
        });
      if (userOnboardingDetail) {
        const user = userOnboardingDetail.user;
        const kyc_status_detail =
          userOnboardingDetail.kyc_status_details[
            userOnboardingDetail.kyc_status_details.length - 1
          ];
        // let signzy_kyc_object = await this.signzyKycObjectRepository.findOneBy({id:onboarding.kyc_id})
        const signzy_kyc_object = await this.signzyKycObjectRepository.findOne({
          where: { user_id: user.id },
          order: {
            created_at: 'DESC',
          },
        });

        const result = await this.signzyService.fetch_digilocker_details(
          userOnboardingDetail.user,
          signzy_kyc_object,
          kyc_status_detail,
        );
        if (result.status == HttpStatus.OK) {
          console.log('1', result);
          console.log('2', userOnboardingDetail);
          console.log(
            'outpu...t',
            JSON.stringify(result['data'].result.output),
          );

          userOnboardingDetail.identity_document_status = status;
          // userOnboardingDetail.aadhaar_number = result.data.data.number;
          await this.userOnboardingDetailsRepository.save(userOnboardingDetail);
          //SAVE ADDRESS AS BELOW!!! and update in signzy API

          const userAddress = new UserAddressDetails();
          const address_arr =
            result['data'].result.output.splitAddress.addressLine.match(
              /.{70}/g,
            );
          console.log('address_arr', address_arr);
          userAddress.line_1 = address_arr[0];
          userAddress.city = result['data'].result.output.splitAddress.city[0];
          userAddress.pincode =
            result['data'].result.output.splitAddress.pincode;
          userAddress.state =
            result['data'].result.output.splitAddress.state[0][0];
          userAddress.line_2 = address_arr.length > 0 ? address_arr[1] : null;
          userAddress.line_3 = address_arr.length > 1 ? address_arr[2] : null;
          userAddress.user_id = user.id;
          userAddress.user_onboarding_detail_id = userOnboardingDetail.id;

          await this.userAddressDetailsRepository.save(userAddress);

          const resp = await this.signzyService.update_address_details(
            userOnboardingDetail.user,
            signzy_kyc_object,
            kyc_status_detail,
            result['data'].result.output,
          );

          if (resp.status == HttpStatus.OK) {
            console.log('Successfully updated Identity Document', resp);
            return { message: 'Successfully updated Identity Document' };
          } else {
            console.log('FAILed to update Identity Document', result['error']);

            return { message: result['error'] };
          }
        } else {
          console.log('FAILed to update Identity Document', result['error']);

          return { message: result['error'] };
        }
      } else {
        console.log('no onboarding details found');

        return { message: 'no onboarding details found' };
      }
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'sorry something went wrong ' + err.message,
      };
    }
  }

  async get_status(user_id: number) {
    try {
      const userResp = await this.usersService.findOneById(user_id);
      const user = userResp.user;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          {
            user_id: user.id,
          },
        );
        const getStatus = new GetStatusDto();
        getStatus.is_investment_done = false;

        const transaction_basket_item_ids =
          await this.transactionBasketItemsRepository.find({
            select: { id: true },
            where: [
              { transaction_type: 'lumpsum', user_id: user_id },
              { transaction_type: 'sip', user_id: user_id },
            ],
          });

        console.log(transaction_basket_item_ids);
        const item_ids = transaction_basket_item_ids.map((item) => {
          return item.id;
        });

        if (transaction_basket_item_ids.length > 0) {
          const purchases = await this.purchaseRepository.find({
            where: {
              transaction_basket_item_id: In(item_ids),
              state: 'successful',
            },
          });
          if (purchases.length > 0) {
            getStatus.is_investment_done = true;
          }
        }

        if (onboarding) {
          getStatus.fp_esign_id = onboarding.fp_esign_id;
          getStatus.fp_esign_status = onboarding.fp_esign_status;
          getStatus.fp_investment_account_id =
            onboarding.fp_investment_account_id;
          getStatus.fp_investment_account_old_id =
            onboarding.fp_investment_account_old_id;
          getStatus.fp_investor_id = onboarding.fp_investor_id;
          getStatus.fp_kyc_reject_reasons = onboarding.fp_kyc_reject_reasons;
          getStatus.fp_kyc_status = onboarding.fp_kyc_status;
          getStatus.id = onboarding.id;
          getStatus.is_kyc_compliant = onboarding.is_kyc_compliant;
          getStatus.kyc_id = onboarding.kyc_id;
          getStatus.status = onboarding.status;
          getStatus.user_id = user_id;
        } else {
          getStatus.status = 'not_started';
        }

        return { status: HttpStatus.OK, data: getStatus };
      } else {
        return { status: HttpStatus.BAD_REQUEST, message: 'user not found' };
      }
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'sorry something went wrong ' + err.message,
      };
    }
  }

  async getKycStatus(user_id: number) {
    try {
      const kyc_status_detail = await this.kycStatusDetailRepository.findOne({
        where: { user_id: user_id },
        order: {
          created_at: 'DESC',
        },
      });
      return { status: HttpStatus.OK, data: kyc_status_detail };
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'sorry something went wrong ' + err.message,
      };
    }
  }

  async generateUccCode() {
    let uniqueCode: string;
    let isUnique = false;

    // Loop until a unique code is generated
    while (!isUnique) {
      uniqueCode = this.generateRandomCode();

      // Check if the code exists in the database
      const existingCode = await this.userOnboardingDetailsRepository.findOne({
        where: { fp_investment_account_id: uniqueCode },
      });

      if (!existingCode) {
        isUnique = true; // Found a unique code
      }
    }

    return uniqueCode;
  }

  private generateRandomCode(): string {
    // Generate a random 15-digit number as a string
    const randomCode = Math.floor(Math.random() * 10 ** 10).toString();

    // Ensure the string is exactly 15 digits by padding with leading zeroes if necessary
    return randomCode.padStart(10, '0');
  }

  //     async addUcc(user_id: number) {
  //         try {
  //             let user = await this.usersService.findOneById(user_id)
  //             let user_onboarding_details = await this.userOnboardingDetailsRepository.findOne({ where: { user_id: user_id } })
  //             let user_address_details = await this.userAddressDetailsRepository.findOne({ where: { user_id: user_id } })
  //             let user_bank_details = await this.userBankDetailsRepository.find({ where: { user_id: user_id } })
  //             let user_nominee_details = await this.userNomineeDetailsRepository.find({ where: { user_id: user_id } })
  //             let uccDto = new AddUccDto()
  //             let member_code = {
  //                 member_id: this.bse_member_code
  //             }
  //             uccDto.member_code = member_code;
  //             let ucc = {
  //                 client_code: await this.generateUccCode()
  //             }
  //             uccDto.investor = ucc;
  //             uccDto.holding_nature = "SI";
  //             uccDto.tax_code = "01";
  //             uccDto.rdmp_idcw_pay_mode = "";
  //             uccDto.is_client_physical = true;
  //             uccDto.is_client_demat = false;
  //             uccDto.is_nomination_opted = true;
  //             uccDto.nomination_auth_mode = "E";
  //             uccDto.comm_mode = "P";
  //             uccDto.onboarding = "Z";
  //             let holder = [];
  //             let holderDto = new HolderDto()
  //             holderDto.holder_rank = "1"
  //             let occ_code = await this.bseOccCodeRepository.findOne({ where: { description: user_onboarding_details.occupation } })
  //             holderDto.occ_code = occ_code.code;
  //             holderDto.kyc_type = "K"
  //             holderDto.auth_mode = "B";
  //             holderDto.is_pan_exempt = true;
  //             let pan_exempt_category = await this.bsePanExemptCategoryRepository.findOne({ where: {} })
  //             holderDto.pan_exempt_category = pan_exempt_category.code;
  //             let identifierDto = new IdentitfierDto()
  //             identifierDto.identifier_type = "pan"
  //             identifierDto.identifier_number = user_onboarding_details.pan
  //             let identifier = []
  //             identifier.push(identifierDto)
  //             holderDto.identifier = identifier
  //             holderDto.kyc_type = ""
  //             holderDto.ckyc_number = ""
  //             let split = splitFullName(user.user.full_name)
  //             console.log("userajdba", split.firstName)

  //             let holder_person = new PersonDto()
  //             holder_person.first_name = split.firstName
  //             holder_person.middle_name = split.middleName
  //             holder_person.last_name = split.lastName
  //             console.log("onboardingggggggg", user_onboarding_details)
  //             holder_person.dob = formatDate(user_onboarding_details.date_of_birth)
  //             let gender = await this.bseGenderRepository.findOne({ where: { description: user_onboarding_details.gender } })
  //             holder_person.gender = gender.code
  //             holderDto.person = holder_person
  //             let contactDto = new ContactDto();
  //             contactDto.contact_number = user.user.mobile;
  //             contactDto.country_code = user.user.country_code;
  //             contactDto.whose_contact_number = "SE";
  //             contactDto.email_address = user.user.email;
  //             contactDto.whose_email_address = "SE";
  //             contactDto.contact_type = "PR";
  //             let contact = []
  //             contact.push(contactDto)
  //             holderDto.contact = contact
  //             let nomination = []
  //             for (let nominee of user_nominee_details) {
  //                 let nominationDto = new NominationDto()
  //                 let name_split = splitFullName(nominee.name)
  //                 console.log("Anme", name_split)

  //                 let nominee_person = new PersonDto()
  //                 nominee_person.first_name = name_split.firstName;
  //                 nominee_person.middle_name = name_split.middleName;
  //                 nominee_person.last_name = name_split.lastName;
  //                 nominee_person.dob = formatDate(nominee.date_of_birth)
  //                 nominationDto.person = nominee_person
  //                 nominationDto.nomination_percent = nominee.allocation_percentage.toString();
  //                 let nomination_relation = await this.bseNomineeRelationRepository.findOne({ where: { description: nominee.relationship } })
  //                 nominationDto.nomination_relation = nomination_relation.code
  //                 nominationDto.is_pan_exempt = false;
  //                 nominationDto.pan_exempt_category = "";
  //                 let identifierDto = new IdentitfierDto()
  //                 identifierDto.identifier_type = "pan"
  //                 identifierDto.identifier_number = nominee.pan
  //                 let identifier = []
  //                 identifier.push(identifierDto)
  //                 nominationDto.identifier = identifier
  //                 if (nominee.guardian_name != null) {
  //                     nominationDto.is_minor = true;
  //                     let guardian_name = splitFullName(nominee.guardian_name)
  //                     let guardian = new GuardianDto()
  //                     guardian.first_name = guardian_name.firstName
  //                     guardian.middle_name = guardian_name.middleName;
  //                     guardian.last_name = guardian_name.lastName;
  //                     guardian.dob = '12-Jan-1990';
  //                     // guardian.dob = formatDate(nominee.guardian_dob);
  //                     // guardian.dob = new Date(nominee.guardian_dob);
  //                     guardian.is_pan_exempt = false;
  //                     identifierDto.identifier_type = "pan"
  //                     identifierDto.identifier_number = nominee.guardian_pan
  //                     let identifier = []
  //                     identifier.push(identifierDto)
  //                     guardian.identifier = identifier
  //                     nominationDto.identifier = identifier
  //                     nominationDto.guardian = guardian
  //                 }

  //                 nomination.push(nominationDto)

  //             }
  //             holderDto.nomination = nomination
  //             let comm_addr = {
  //                 address_line_1: user_address_details.line_1,
  //                 address_line_2: user_address_details.line_2,
  //                 address_line_3: user_address_details.line_3,
  //                 postalcode: user_address_details.pincode
  //             }

  //             uccDto.comm_addr = comm_addr
  //             let bank_account = []
  //             for (let bank of user_bank_details) {
  //                 let bank_accountDto = new BankAccountDto()
  //                 bank_accountDto.bank_acc_num = bank.account_number
  //                 let bank_acc_type = await this.bseBankAccTypeRepository.findOne({ where: { description: bank.account_type } })
  //                 // bank_accountDto.bank_acc_type = bank_acc_type.code
  //                 bank_accountDto.bank_acc_type = "SB"
  //                 bank_accountDto.ifsc_code = bank.ifsc_code
  //                 bank_accountDto.account_owner = "SELF"
  //                 bank_account.push(bank_accountDto)
  //             }
  //             uccDto.bank_account = bank_account

  //             holder.push(holderDto)
  //             uccDto.holder = holder
  //             let fatca = []
  //             let fatcaDto = new FatcaDto()
  //             fatcaDto.HolderRank = "1";
  //             fatcaDto.place_of_birth = user_address_details.state
  //             fatcaDto.country_of_birth = "India"
  //             fatcaDto.client_name = user.user.full_name
  //             fatcaDto.investor_type = "Individual"
  //             fatcaDto.dob = formatDate(user_onboarding_details.date_of_birth)
  //             fatcaDto.father_name = user_onboarding_details.father_name
  //             fatcaDto.spouse_name = ""
  //             fatcaDto.address_type = "1"
  //             let occ_code = await this.bseOccCodeRepository.findOne({ where: { description:} })
  //             fatcaDto.occ_code =
  //                 fatcaDto.exemption_code = "N"
  //             let fatca_identifier = new IdentitfierDto()
  //             fatca_identifier.identifier_type = "pan"
  //             fatca_identifier.identifier_number = user_onboarding_details.pan
  //             fatcaDto.identifier = fatca_identifier
  //             fatcaDto.wealth_source = "8"

  //             let result = await this.bseService.add_ucc(uccDto)
  //             user_onboarding_details.fp_investor_id = uccDto.member_code.member_id;
  //             user_onboarding_details.fp_investment_account_id = uccDto.investor.client_code
  //             user_onboarding_details = await this.userOnboardingDetailsRepository.save(user_onboarding_details)
  //             console.log("resulttttttttttttttt", result)

  //             return { status: HttpStatus.OK, user_onboarding_details: user_onboarding_details }

  //         }
  //         catch (err) {
  //             console.log("err", err)
  //             return { status: HttpStatus.BAD_REQUEST, message: "sorry something went wrong " + err.message };
  //         }
  //     }

  mapGender = (gender: string): string => {
    const genderMap = {
      male: 'M',
      female: 'F',
      other: 'O',
    };
    return genderMap[gender.toLowerCase()] || null; // Return null if no match
  };

  async add_ucc(user_id: number, tenant_id: string) {
    try {
      const user = await this.usersService.findOneById(user_id);
      let user_onboarding_details =
        await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user_id },
        });
      const user_address_details =
        await this.userAddressDetailsRepository.findOne({
          where: { user_id: user_id },
        });
      const user_bank_details = await this.userBankDetailsRepository.find({
        where: { user_id: user_id },
      });
      const user_nominee_details = await this.userNomineeDetailsRepository.find(
        {
          where: { user_id: user_id },
        },
      );
      const adduccDto = new AddUccBseDto();
      adduccDto.ucc = await this.generateUccCode();
      const split = splitFullName(user.user.full_name);
      adduccDto.primaryHolderFirstName = split.firstName;
      adduccDto.primaryHolderMiddleName = split.middleName;
      adduccDto.primaryHolderLastName = split.lastName;
      adduccDto.taxStatus = '01';
      adduccDto.gender = this.mapGender(user_onboarding_details.gender);
      adduccDto.primaryHolderDob = formatToDateString(
        user_onboarding_details.date_of_birth,
      );
      const occ_code = await this.bseOccCodeRepository.findOne({
        where: { description: user_onboarding_details.occupation },
      });
      adduccDto.occupationCode = formatTwoDigits(occ_code.code);
      adduccDto.holdingNature = 'SI';
      adduccDto.primaryHolderPanExempt = 'N';
      adduccDto.secondHolderPanExempt = '';
      adduccDto.thirdHolderPanExempt = '';
      adduccDto.guardianPanExempt = '';
      adduccDto.primaryHolderPan = user_onboarding_details.pan;
      adduccDto.primaryHolderPanExemptCategory = '';
      adduccDto.clientType = 'P';
      // adduccDto.accountType1 = "SB";
      // adduccDto.accountNo1 = user_bank_details[0].account_number
      // adduccDto.ifscCode1 = user_bank_details[0].ifsc_code;
      // adduccDto.defaultBankFlag1 = "Y"
      for (const [index, bank] of user_bank_details.entries()) {
        if (index >= 5) break; // Limit to 5 accounts

        const bankIndex = index + 1;
        Object.assign(adduccDto, {
          [`accountType${bankIndex}`]: 'SB',
          [`accountNo${bankIndex}`]: bank.account_number,
          [`ifscCode${bankIndex}`]: bank.ifsc_code,
          [`defaultBankFlag${bankIndex}`]: bank.is_primary ? 'Y' : 'N',
        });
      }
      adduccDto.divPayMode = '04';
      const address = splitAddress(user_address_details.line_1);
      adduccDto.address1 = address.address1;
      adduccDto.address2 = address.address2;
      adduccDto.address3 = address.address3;
      adduccDto.city = user_address_details.city;
      const state = await this.bseStateandCodeRepository.findOne({
        where: { state: user_address_details.state },
      });
      adduccDto.state = state.code;
      adduccDto.country = 'INDIA';
      adduccDto.pincode = user_address_details.pincode;
      adduccDto.email = user.user.email;
      adduccDto.communicationMode = 'M';
      adduccDto.indianMobileNo = user.user.mobile;
      // user_nominee_details.forEach(async (nominee, index) => {
      //     if (index === 0) {
      //         console.log("DOb", nominee.date_of_birth)
      //         adduccDto.nominee1Name = nominee.name;
      //         let relationcode = await this.bseV1NomineeRelationshipCodeRepository.findOne({ where: { value: nominee.relationship.toLocaleUpperCase() } })
      //         console.log("nom", relationcode.code, nominee)
      //         let code = relationcode.code
      //         adduccDto.nominee1Relationship = "04";
      //         adduccDto.nominee1ApplicablePercentage = nominee.allocation_percentage.toString();
      //         adduccDto.nominee1MinorFlag = nominee.guardian_name ? "Y" : "N";
      //         // adduccDto.nominee1Dob = nominee.date_of_birth ? formatToDateString(nominee.date_of_birth) : "";
      //         adduccDto.nominee1Guardian = nominee.guardian_name ? nominee.guardian_name : "";
      //     } else if (index === 1) {
      //         adduccDto.nominee2Name = nominee.name;
      //         let relationcode = await this.bseV1NomineeRelationshipCodeRepository.findOne({ where: { value: nominee.relationship.toLocaleUpperCase() } })
      //         let code = relationcode.code
      //         adduccDto.nominee2Relationship = code;
      //         adduccDto.nominee2ApplicablePercentage = nominee.allocation_percentage.toString();
      //         adduccDto.nominee2MinorFlag = nominee.guardian_name ? "Y" : "N";
      //         adduccDto.nominee2Dob = nominee.date_of_birth ? formatToDateString(nominee.date_of_birth) : "";
      //         adduccDto.nominee2Guardian = nominee.guardian_name ? nominee.guardian_name : "";
      //     } else if (index === 2) {
      //         adduccDto.nominee3Name = nominee.name;
      //         let relationcode = await this.bseV1NomineeRelationshipCodeRepository.findOne({ where: { value: nominee.relationship.toLocaleUpperCase() } })
      //         let code = relationcode.code
      //         adduccDto.nominee3Relationship = code;
      //         adduccDto.nominee3ApplicablePercentage = nominee.allocation_percentage.toString();
      //         adduccDto.nominee3MinorFlag = nominee.guardian_name ? "Y" : "N";
      //         adduccDto.nominee3Dob = nominee.date_of_birth ? formatToDateString(nominee.date_of_birth) : "";
      //         adduccDto.nominee3Guardian = nominee.guardian_name ? nominee.guardian_name : "";
      //     }
      // });

      adduccDto.primaryHolderKycType = 'E';
      // adduccDto.primaryHolderKraExemptRefNo = user_onboarding_details.pan;
      adduccDto.paperlessFlag = 'Z';
      adduccDto.filler1MobileDeclarationFlag = 'SE';
      adduccDto.filler2EmailDeclarationFlag = 'SE';
      adduccDto.nominationOpt = 'N';
      adduccDto.nominationAuthMode = 'O';
      console.log('ADADD', adduccDto, user_nominee_details);
      for (const [index, nominee] of user_nominee_details.entries()) {
        if (index >= 3) break;
        const relationcode =
          await this.bseV1NomineeRelationshipCodeRepository.findOne({
            where: { value: nominee.relationship.toUpperCase() },
          });
        const nomineeIndex = index + 1;
        Object.assign(adduccDto, {
          [`nominee${nomineeIndex}Name`]: nominee.name,
          [`nominee${nomineeIndex}Relationship`]: relationcode?.code || '',
          [`nominee${nomineeIndex}ApplicablePercentage`]:
            nominee.allocation_percentage.toString(),
          [`nominee${nomineeIndex}MinorFlag`]: nominee.guardian_name
            ? 'Y'
            : 'N',
          // [`nominee${nomineeIndex}Dob`]: nominee.date_of_birth ? formatToDateString(nominee.date_of_birth) : "",
          [`nominee${nomineeIndex}Guardian`]: nominee.guardian_name || '',
        });
      }
      console.log('ADADD@', adduccDto);
      const ucc = await this.bsev1Service.add_ucc(adduccDto);

      const fatcaDto = new FatcaDto();
      fatcaDto.pan = user_onboarding_details.pan;
      fatcaDto.pekrn = '';
      fatcaDto.inv_name = user.user.full_name;
      fatcaDto.dob = formatToDateStringmmddyyy(
        user_onboarding_details.date_of_birth,
      );
      fatcaDto.fr_name = '';
      fatcaDto.sp_name = '';
      fatcaDto.tax_status = '01';
      fatcaDto.data_src = 'P';
      fatcaDto.addr_type = '1';
      fatcaDto.po_bir_inc = 'IN';
      fatcaDto.co_bir_inc = 'IN';
      fatcaDto.tax_res1 = 'IN';
      fatcaDto.tpin_1 = user_onboarding_details.pan;
      fatcaDto.id_type_1 = 'C';
      fatcaDto.tax_res2 = '';
      fatcaDto.tpin_2 = '';
      fatcaDto.id_type_2 = '';
      fatcaDto.tax_res3 = '';
      fatcaDto.tpin_3 = '';
      fatcaDto.id_type_3 = '';
      fatcaDto.tax_res4 = '';
      fatcaDto.tpin_4 = '';
      fatcaDto.id_type_4 = '';
      fatcaDto.srce_wealt = '08';
      fatcaDto.corp_servs = '04';
      const income_slab = await this.bseIncomeSlabRepository.findOne({
        where: { description: user_onboarding_details.annual_income },
      });
      console.log(
        'income_slab',
        user_onboarding_details.annual_income,
        income_slab,
      );
      fatcaDto.inc_slab = income_slab.code;
      fatcaDto.net_worth = '';
      fatcaDto.nw_date = '';
      fatcaDto.pep_flag = 'N';
      const occupation = await this.bseOccCodeRepository.findOne({
        where: { description: user_onboarding_details.occupation },
      });
      fatcaDto.occ_code = formatTwoDigits(occupation.code);
      const occ_type = await this.bseOccTypeRepository.findOne({
        where: { description: occ_code.type },
      });
      fatcaDto.occ_type = occ_type.code;
      fatcaDto.exemp_code = 'N';
      fatcaDto.ffi_drnfe = 'NA';
      fatcaDto.giin_no = 'NA';
      fatcaDto.spr_entity = '';
      fatcaDto.giin_na = '';
      fatcaDto.giin_exemc = '';
      fatcaDto.nffe_catg = '';
      fatcaDto.act_nfe_sc = '';
      fatcaDto.nature_bus = '';
      fatcaDto.rel_listed = '';
      fatcaDto.exch_name = 'B';
      fatcaDto.ubo_appl = 'N';
      fatcaDto.ubo_count = '';
      fatcaDto.ubo_name = '';
      fatcaDto.ubo_pan = '';
      fatcaDto.ubo_nation = '';
      fatcaDto.ubo_add1 = '';
      fatcaDto.ubo_add2 = '';
      fatcaDto.ubo_add3 = '';
      fatcaDto.ubo_city = '';
      fatcaDto.ubo_pin = '';
      fatcaDto.ubo_state = '';
      fatcaDto.ubo_cntry = '';
      fatcaDto.ubo_add_ty = '';
      fatcaDto.ubo_ctr = '';
      fatcaDto.ubo_tin = '';
      fatcaDto.ubo_id_ty = '';
      fatcaDto.ubo_cob = '';
      fatcaDto.ubo_dob = '';
      fatcaDto.ubo_gender = '';
      fatcaDto.ubo_fr_nam = '';
      fatcaDto.ubo_ucc = '';
      fatcaDto.ubo_ucc_ty = '';
      fatcaDto.ubo_tel = '';
      fatcaDto.ubo_mobile = '';
      fatcaDto.ubo_code = '';
      fatcaDto.ubo_hol_pc = '';
      fatcaDto.sdf_flag = '';
      fatcaDto.ubo_df = 'N';
      fatcaDto.aadhar_rp = '';
      fatcaDto.new_change = 'N';
      fatcaDto.log_name = '';
      fatcaDto.filler1 = '';
      fatcaDto.filler2 = '';
      const get_password =
        await this.bsev1Service.get_password_for_registration(tenant_id);
      const encrypted_password =
        await this.transactionBasketService.extractPassword(get_password.data);
      console.log('get_password', get_password);
      const fatca = await this.bsev1Service.fatca(fatcaDto, encrypted_password);
      console.log('FAtac', fatca);
      user_onboarding_details.status = 'ucc';
      user_onboarding_details.fp_investor_id = adduccDto.ucc;

      const document = await this.createpdfv2(user_id, adduccDto.ucc);
      const password = await this.bsev1Service.get_password_for_aof();
      const extracted = await this.extractPasswordofAOF(password.data);
      if (extracted.status == 100) {
        const aof_object = {
          client_code: user_onboarding_details.fp_investor_id,
          encrypted_password: extracted.password,
          filename: document.data.fileName,
          file_buffer: document.data.tiffBase64,
        };
        const aof = await this.bsev1Service.aof_upload(aof_object);
        // user_onboarding_details.aof_document_url = document.data.path
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Failed to Proccess AOF upload',
        };
      }

      user_onboarding_details = await this.userOnboardingDetailsRepository.save(
        user_onboarding_details,
      );

      return { status: HttpStatus.OK, data: user_onboarding_details };
    } catch (err) {
      console.log('err', err);
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'sorry something went wrong ' + err.message,
      };
    }
  }

  async add_uccv2(user_id: number, tenant_id: string) {
    try {
      const user = await this.usersService.findOneById(user_id);
      let user_onboarding_details =
        await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user_id },
        });
      const user_address_details =
        await this.userAddressDetailsRepository.findOne({
          where: { user_id: user_id },
        });
      const user_bank_details = await this.userBankDetailsRepository.find({
        where: { user_id: user_id },
      });
      const user_nominee_details = await this.userNomineeDetailsRepository.find(
        {
          where: { user_id: user_id },
        },
      );
      const adduccDto = new AddUccNewBseDto();
      adduccDto.ucc = await this.generateUccCode();
      const split = splitFullName(user.user.full_name);
      adduccDto.primaryHolderFirstName = split.firstName;
      adduccDto.primaryHolderMiddleName = split.middleName;
      adduccDto.primaryHolderLastName = split.lastName;
      adduccDto.taxStatus = '01';
      adduccDto.gender = this.mapGender(user_onboarding_details.gender);
      adduccDto.primaryHolderDob = formatToDateString(
        user_onboarding_details.date_of_birth,
      );
      const occ_code = await this.bseOccCodeRepository.findOne({
        where: { description: user_onboarding_details.occupation },
      });
      adduccDto.occupationCode = formatTwoDigits(occ_code.code);
      adduccDto.holdingNature = 'SI';
      adduccDto.primaryHolderPanExempt = 'N';
      adduccDto.secondHolderPanExempt = '';
      adduccDto.thirdHolderPanExempt = '';
      adduccDto.guardianPanExempt = '';
      adduccDto.primaryHolderPan = user_onboarding_details.pan;
      adduccDto.primaryHolderPanExemptCategory = '';
      adduccDto.clientType = 'P';
      // adduccDto.accountType1 = "SB";
      // adduccDto.accountNo1 = user_bank_details[0].account_number
      // adduccDto.ifscCode1 = user_bank_details[0].ifsc_code;
      // adduccDto.defaultBankFlag1 = "Y"
      for (const [index, bank] of user_bank_details.entries()) {
        if (index >= 5) break; // Limit to 5 accounts

        const bankIndex = index + 1;
        Object.assign(adduccDto, {
          [`accountType${bankIndex}`]: 'SB',
          [`accountNo${bankIndex}`]: bank.account_number,
          [`ifscCode${bankIndex}`]: bank.ifsc_code,
          [`defaultBankFlag${bankIndex}`]: bank.is_primary ? 'Y' : 'N',
        });
      }
      adduccDto.divPayMode = '04';
      const address = splitAddress(user_address_details.line_1);
      adduccDto.address1 = address.address1;
      adduccDto.address2 = address.address2;
      adduccDto.address3 = address.address3;
      adduccDto.city = user_address_details.city;
      const state = await this.bseStateandCodeRepository.findOne({
        where: { state: user_address_details.state },
      });
      adduccDto.state = state.code;
      adduccDto.country = 'INDIA';
      adduccDto.pincode = user_address_details.pincode;
      adduccDto.email = user.user.email;
      adduccDto.communicationMode = 'M';
      adduccDto.indianMobileNo = user.user.mobile;

      adduccDto.primaryHolderKycType = 'E';
      // adduccDto.primaryHolderKraExemptRefNo = user_onboarding_details.pan;
      adduccDto.paperlessFlag = 'Z';
      adduccDto.filler1MobileDeclarationFlag = 'SE';
      adduccDto.filler2EmailDeclarationFlag = 'SE';
      adduccDto.nominationOpt = 'Y';
      adduccDto.nominationAuthMode = 'O';
      console.log('ADADD', adduccDto, user_nominee_details);
      const identityProofTypeMap: Record<
        string,
        { type: string; field: string }
      > = {
        pan: { type: '1', field: 'pan' },
        adhaar: { type: '2', field: 'aadhaar_number' }, // Assuming this spelling comes from user input
        'driving licence': { type: '3', field: 'driving_licence_number' },
      };
      for (const [index, nominee] of user_nominee_details.entries()) {
        if (index >= 3) break;
        const relationcode =
          await this.bseV1NomineeRelationshipCodeRepository.findOne({
            where: { value: nominee.relationship.toUpperCase() },
          });
        console.log(
          'relation',
          relationcode,
          nominee.relationship,
          nominee.relationship.toUpperCase(),
        );
        const nomineeIndex = index + 1;

        const proofTypeKey =
          nominee.identity_proof_type?.toLowerCase().trim() || '';

        const mapped = identityProofTypeMap[proofTypeKey];

        const mappedProofType = mapped?.type || '';
        const idNumber = mapped ? nominee[mapped.field] : '';
        Object.assign(adduccDto, {
          [`nominee${nomineeIndex}Name`]: nominee.name,
          [`nominee${nomineeIndex}Relationship`]: relationcode?.code || '',
          [`nominee${nomineeIndex}ApplicablePercentage`]:
            nominee.allocation_percentage.toString(),
          [`nominee${nomineeIndex}MinorFlag`]: nominee.guardian_name
            ? 'Y'
            : 'N',
          [`nominee${nomineeIndex}Dob`]: nominee.guardian_name
            ? formatToDateString(nominee.date_of_birth)
            : '',
          [`nominee${nomineeIndex}Guardian`]: nominee.guardian_name || '',
          [`nomineeGuardianPan${nomineeIndex}`]: nominee.guardian_pan || '',
          // [`nominee${nomineeIndex}IDType`]: nominee.identity_proof_type ? nominee.identity_proof_type : "", // Assuming PAN is the only ID type used
          // [`nominee${nomineeIndex}IDNumber`]: nominee.pan ? nominee.pan : "",
          [`nominee${nomineeIndex}Email`]: nominee.email_address
            ? nominee.email_address
            : '',
          [`nominee${nomineeIndex}MobileNo`]: nominee.phone_number
            ? nominee.phone_number
            : '',
          [`nominee${nomineeIndex}Address1`]: nominee.address_line_1
            ? nominee.address_line_1
            : '',
          [`nominee${nomineeIndex}Address2`]: nominee.address_line_2
            ? nominee.address_line_2
            : '',
          [`nominee${nomineeIndex}Address3`]: nominee.address_line_3
            ? nominee.address_line_3
            : '',
          [`nominee${nomineeIndex}City`]: nominee.address_city
            ? nominee.address_city
            : '',
          // [`nominee${nomineeIndex}State`]: nominee.state ? nominee.state : "",
          [`nominee${nomineeIndex}Pincode`]: nominee.address_postal_code
            ? nominee.address_postal_code
            : '',
          [`nominee${nomineeIndex}Country`]: nominee.address_country
            ? nominee.address_country
            : '',
          ...(mappedProofType && idNumber
            ? {
                [`nominee${nomineeIndex}IDType`]: mappedProofType,
                [`nominee${nomineeIndex}IDNumber`]: idNumber,
              }
            : {}),
        });
      }
      adduccDto.nominee_soa = 'Y';
      console.log('ADADD@', adduccDto);
      const ucc = await this.bsev1Service.add_ucc_v2(adduccDto);
      if (ucc.status == 200 && ucc.Status !== '0') {
        return { status: HttpStatus.BAD_REQUEST, message: ucc.Remarks };
      }

      const fatcaDto = new FatcaDto();
      fatcaDto.pan = user_onboarding_details.pan;
      fatcaDto.pekrn = '';
      fatcaDto.inv_name = user.user.full_name;
      fatcaDto.dob = formatToDateStringmmddyyy(
        user_onboarding_details.date_of_birth,
      );
      fatcaDto.fr_name = '';
      fatcaDto.sp_name = '';
      fatcaDto.tax_status = '01';
      fatcaDto.data_src = 'P';
      fatcaDto.addr_type = '1';
      fatcaDto.po_bir_inc = 'IN';
      fatcaDto.co_bir_inc = 'IN';
      fatcaDto.tax_res1 = 'IN';
      fatcaDto.tpin_1 = user_onboarding_details.pan;
      fatcaDto.id_type_1 = 'C';
      fatcaDto.tax_res2 = '';
      fatcaDto.tpin_2 = '';
      fatcaDto.id_type_2 = '';
      fatcaDto.tax_res3 = '';
      fatcaDto.tpin_3 = '';
      fatcaDto.id_type_3 = '';
      fatcaDto.tax_res4 = '';
      fatcaDto.tpin_4 = '';
      fatcaDto.id_type_4 = '';
      fatcaDto.srce_wealt = '08';
      fatcaDto.corp_servs = '04';
      const income_slab = await this.bseIncomeSlabRepository.findOne({
        where: { description: user_onboarding_details.annual_income },
      });
      console.log(
        'income_slab',
        user_onboarding_details.annual_income,
        income_slab,
      );
      fatcaDto.inc_slab = income_slab.code;
      fatcaDto.net_worth = '';
      fatcaDto.nw_date = '';
      fatcaDto.pep_flag = 'N';
      const occupation = await this.bseOccCodeRepository.findOne({
        where: { description: user_onboarding_details.occupation },
      });
      fatcaDto.occ_code = formatTwoDigits(occupation.code);
      const occ_type = await this.bseOccTypeRepository.findOne({
        where: { description: occ_code.type },
      });
      fatcaDto.occ_type = occ_type.code;
      fatcaDto.exemp_code = 'N';
      fatcaDto.ffi_drnfe = 'NA';
      fatcaDto.giin_no = 'NA';
      fatcaDto.spr_entity = '';
      fatcaDto.giin_na = '';
      fatcaDto.giin_exemc = '';
      fatcaDto.nffe_catg = '';
      fatcaDto.act_nfe_sc = '';
      fatcaDto.nature_bus = '';
      fatcaDto.rel_listed = '';
      fatcaDto.exch_name = 'B';
      fatcaDto.ubo_appl = 'N';
      fatcaDto.ubo_count = '';
      fatcaDto.ubo_name = '';
      fatcaDto.ubo_pan = '';
      fatcaDto.ubo_nation = '';
      fatcaDto.ubo_add1 = '';
      fatcaDto.ubo_add2 = '';
      fatcaDto.ubo_add3 = '';
      fatcaDto.ubo_city = '';
      fatcaDto.ubo_pin = '';
      fatcaDto.ubo_state = '';
      fatcaDto.ubo_cntry = '';
      fatcaDto.ubo_add_ty = '';
      fatcaDto.ubo_ctr = '';
      fatcaDto.ubo_tin = '';
      fatcaDto.ubo_id_ty = '';
      fatcaDto.ubo_cob = '';
      fatcaDto.ubo_dob = '';
      fatcaDto.ubo_gender = '';
      fatcaDto.ubo_fr_nam = '';
      fatcaDto.ubo_ucc = '';
      fatcaDto.ubo_ucc_ty = '';
      fatcaDto.ubo_tel = '';
      fatcaDto.ubo_mobile = '';
      fatcaDto.ubo_code = '';
      fatcaDto.ubo_hol_pc = '';
      fatcaDto.sdf_flag = '';
      fatcaDto.ubo_df = 'N';
      fatcaDto.aadhar_rp = '';
      fatcaDto.new_change = 'N';
      fatcaDto.log_name = '';
      fatcaDto.filler1 = '';
      fatcaDto.filler2 = '';
      const get_password =
        await this.bsev1Service.get_password_for_registration(tenant_id);
      const encrypted_password =
        await this.transactionBasketService.extractPassword(get_password.data);
      console.log('get_password', get_password);
      const fatca = await this.bsev1Service.fatca(fatcaDto, encrypted_password);
      console.log('FAtac', fatca);
      user_onboarding_details.status = 'ucc';
      user_onboarding_details.fp_investor_id = adduccDto.ucc;

      const document = await this.createpdfv2(user_id, adduccDto.ucc);
      const password = await this.bsev1Service.get_password_for_aof();
      const extracted = await this.extractPasswordofAOF(password.data);
      if (extracted.status == 100) {
        const aof_object = {
          client_code: user_onboarding_details.fp_investor_id,
          encrypted_password: extracted.password,
          filename: document.data.fileName,
          file_buffer: document.data.tiffBase64,
        };
        const aof = await this.bsev1Service.aof_upload(aof_object);
        // user_onboarding_details.aof_document_url = document.data.path
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Failed to Proccess AOF upload',
        };
      }

      user_onboarding_details = await this.userOnboardingDetailsRepository.save(
        user_onboarding_details,
      );

      return { status: HttpStatus.OK, data: user_onboarding_details };
    } catch (err) {
      console.log('err', err);
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'sorry something went wrong ' + err.message,
      };
    }
  }

  async extractPasswordofAOF(soapResponse: string) {
    try {
      const parsedResult = await parseStringPromise(soapResponse, {
        explicitArray: false,
      });

      const passwordResult =
        parsedResult['s:Envelope']['s:Body']['GetPasswordResponse'][
          'GetPasswordResult'
        ]['b:ResponseString'];

      const status =
        parsedResult['s:Envelope']['s:Body']['GetPasswordResponse'][
          'GetPasswordResult'
        ]['b:Status'];

      return { password: passwordResult, status: status };
    } catch (error) {
      throw new Error(`Failed to extract password: ${error.message}`);
    }
  }

  async createpdf(user_id: number) {
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
      const user_bank_details = await this.userBankDetailsRepository.find({
        where: { user_id: user_id },
      });
      const user_nominee_details = await this.userNomineeDetailsRepository.find(
        {
          where: { user_id: user_id },
        },
      );
      const date = formatToDateString(new Date());
      console.log('user_onboarding_details', user_onboarding_details);

      const placeholders = {
        user_name: user_onboarding_details.user.full_name || '',
        pan: user_onboarding_details.pan || '',
        dob: formatToDateString(user_onboarding_details.date_of_birth) || '',
        father_name: user_onboarding_details.father_name || '',
        mother_name: user_onboarding_details.mother_name || '',
        user_address_city: user_address_details.city || '',
        user_address_pincode: user_address_details.pincode || '',
        user_address_state: user_address_details.state || '',
        user_address_country: 'India',
        email: user_onboarding_details.email_addresses || '',
        mobile_number: user_onboarding_details.user.mobile || '',
        income: user_onboarding_details.annual_income || '',
        occupation: user_onboarding_details.occupation || '',
        place_of_birth: user_onboarding_details.place_of_birth || '',
        country: 'India',
        bank_name:
          (user_bank_details[0] && user_bank_details[0].bank_name) || '',
        bank_branch:
          (user_bank_details[0] && user_bank_details[0].branch_name) || '',
        bank_account_number:
          (user_bank_details[0] && user_bank_details[0].account_number) || '',
        bank_account_type:
          (user_bank_details[0] && user_bank_details[0].account_type) || '',
        bank_ifsc_code:
          (user_bank_details[0] && user_bank_details[0].ifsc_code) || '',
        nominee_name:
          (user_nominee_details[0] && user_nominee_details[0].name) || '',
        nominee_relationship:
          (user_nominee_details[0] && user_nominee_details[0].relationship) ||
          '',
        nominee_guardian_name:
          (user_nominee_details[0] && user_nominee_details[0].guardian_name) ||
          '',
        date: date || '',
        political: user_onboarding_details.is_political || '',
      };

      // let placeholders = {
      //     "user_name": "Rahul Sharma",
      //     "pan": "ABCDE1234F",
      //     "dob": "1990-05-15",
      //     "father_name": "Anil Sharma",
      //     "mother_name": "Sunita Sharma",
      //     "user_address_city": "Mumbai",
      //     "user_address_pincode": "400001",
      //     "user_address_state": "Maharashtra",
      //     "user_address_country": "India",
      //     "email": "rahul.sharma@example.com",
      //     "mobile_number": "+91 9876543210",
      //     "income": "10,00,000 - 15,00,000",
      //     "occupation": "Software Engineer",
      //     "place_of_birth": "Pune",
      //     "country": "India",
      //     "bank_name": "HDFC Bank",
      //     "bank_branch": "Andheri West",
      //     "bank_account_number": "123456789012",
      //     "bank_account_type": "Savings",
      //     "bank_ifsc_code": "HDFC0000123",
      //     "nominee_name": "Aarav Sharma",
      //     "nominee_relationship": "Son",
      //     "nominee_guardian_name": "N/A",
      //     "date": "2025-02-27"
      // };

      console.log('place    text it', placeholders);
      const docxPath = path.resolve(
        __dirname,
        '../../../aof/AOF Physical1.pdf',
      );
      const signaturePath = path.resolve(
        __dirname,
        `../../../${user_onboarding_details.signature_url}`,
      );
      const data = await this.generatePDFWithSignature(
        docxPath,
        signaturePath,
        placeholders,
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

  async createpdfv2(user_id: number, ucc) {
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
      const user_bank_details = await this.userBankDetailsRepository.find({
        where: { user_id: user_id },
      });
      const user_nominee_details = await this.userNomineeDetailsRepository.find(
        {
          where: { user_id: user_id },
        },
      );
      const bank = await this.bankService.get_fp_bank_details(
        user_bank_details[0].ifsc_code,
      );
      console.log('ifsc', bank);
      const date = formatToDateString(new Date());
      console.log('user_onboarding_details', user_onboarding_details);

      const placeholders = {
        user_name: user_onboarding_details.user.full_name || '',
        pan: user_onboarding_details.pan || '',
        dob: formatToDateString(user_onboarding_details.date_of_birth) || '',
        father_name: user_onboarding_details.father_name || '',
        mother_name: user_onboarding_details.mother_name || '',
        user_address_city: user_address_details.city || '',
        user_address_pincode: user_address_details.pincode || '',
        user_address_state: user_address_details.state || '',
        user_address_country: 'India',
        email: user_onboarding_details.email_addresses || '',
        mobile_number: user_onboarding_details.user.mobile || '',
        income: user_onboarding_details.annual_income || '',
        occupation: user_onboarding_details.occupation || '',
        place_of_birth: user_onboarding_details.place_of_birth || '',
        country: 'India',
        bank_name:
          (user_bank_details[0] && user_bank_details[0].bank_name) || '',
        bank_branch: (user_bank_details[0] && bank.data.branch_name) || '',
        bank_account_number:
          (user_bank_details[0] && user_bank_details[0].account_number) || '',
        bank_account_type:
          (user_bank_details[0] && user_bank_details[0].account_type) || '',
        bank_ifsc_code:
          (user_bank_details[0] && user_bank_details[0].ifsc_code) || '',
        nominee_name:
          (user_nominee_details[0] && user_nominee_details[0].name) || '',
        nominee_relationship:
          (user_nominee_details[0] && user_nominee_details[0].relationship) ||
          '',
        nominee_guardian_name:
          (user_nominee_details[0] && user_nominee_details[0].guardian_name) ||
          '',
        date: date || '',
        political: user_onboarding_details.is_political || '',
      };

      // let placeholders = {
      //     "user_name": "Rahul Sharma",
      //     "pan": "ABCDE1234F",
      //     "dob": "1990-05-15",
      //     "father_name": "Anil Sharma",
      //     "mother_name": "Sunita Sharma",
      //     "user_address_city": "Mumbai",
      //     "user_address_pincode": "400001",
      //     "user_address_state": "Maharashtra",
      //     "user_address_country": "India",
      //     "email": "rahul.sharma@example.com",
      //     "mobile_number": "+91 9876543210",
      //     "income": "10,00,000 - 15,00,000",
      //     "occupation": "Software Engineer",
      //     "place_of_birth": "Pune",
      //     "country": "India",
      //     "bank_name": "HDFC Bank",
      //     "bank_branch": "Andheri West",
      //     "bank_account_number": "123456789012",
      //     "bank_account_type": "Savings",
      //     "bank_ifsc_code": "HDFC0000123",
      //     "nominee_name": "Aarav Sharma",
      //     "nominee_relationship": "Son",
      //     "nominee_guardian_name": "N/A",
      //     "date": "2025-02-27"
      // };

      console.log('place    text it', placeholders);
      const docxPath = path.resolve(
        __dirname,
        '../../../aof/AOF Physical1.pdf',
      );
      const signaturePath = path.resolve(
        __dirname,
        `../../../${user_onboarding_details.signature_url}`,
      );
      const data = await this.generateTIFFWithSignature(
        docxPath,
        signaturePath,
        placeholders,
        ucc,
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

  // async embedImageInPdf(
  //     pdfPath: string,
  //     signaturePath: string,
  //     replacements: Record<string, string>
  // ): Promise<Buffer> {
  //     // Load the PDF
  //     const pdfBytes = fs.readFileSync(pdfPath);
  //     console.log("pdfBytes", pdfBytes)
  //     const pdfDoc = await PDFDocument.load(pdfBytes);
  //     console.log("pdfDoc", pdfDoc)
  //     // Extract text content from the PDF
  //     const parsedData = await pdfParse(pdfBytes);
  //     console.log("parsedData", parsedData)
  //     let pdfText = parsedData.text;
  //     console.log("pdfText", pdfText)
  //     // Replace placeholders dynamically in the extracted text
  //     Object.entries(replacements).forEach(([placeholder, value]) => {
  //         const regex = new RegExp(`{{${placeholder}}}`, 'g');
  //         pdfText = pdfText.replace(regex, value);
  //     });

  //     // Get all pages
  //     const pages = pdfDoc.getPages();
  //     console.log("pages", pages)
  //     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  //     console.log("font", font)

  //     // Loop through all pages and redraw only modified text
  //     pages.forEach((page, index) => {
  //         page.drawText(pdfText, {
  //             x: 50, // Keep X fixed
  //             y: page.getHeight() - 50, // Start near top
  //             size: 12,
  //             font,
  //             color: rgb(0, 0, 0),
  //         });

  //         // Add signature on Page 2 only
  //         if (index === 1) {
  //             const signatureImageBytes = fs.readFileSync(signaturePath);
  //             pdfDoc.embedPng(signatureImageBytes).then((signatureImage) => {
  //                 page.drawImage(signatureImage, {
  //                     x: 100,
  //                     y: 70,
  //                     width: 100,
  //                     height: 50,
  //                 });
  //             });
  //         }
  //     });

  //     // Save modified PDF
  //     const modifiedPdfBytes = await pdfDoc.save();
  //     console.log("modifiedPdfBytes", modifiedPdfBytes)
  //     const outputFilePath = path.join(__dirname, '../../../uploads', `AOF-${Date.now()}.pdf`);
  //     console.log("outputFilePath", outputFilePath)
  //     fs.writeFileSync(outputFilePath, modifiedPdfBytes);

  //     return Buffer.from(modifiedPdfBytes);
  // }

  async generatePDFWithSignature(
    htmlPath: string,
    signaturePath: string,
    data: any,
  ) {
    try {
      // Load HTML template
      console.log('data', data);
      const pdfBytes = fs.readFileSync(htmlPath);

      // Load the existing PDF
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Get the form in the PDF
      const form = pdfDoc.getForm();

      const placeholders = {
        broker_code: '280456',
        euin: 'E371361',
        user_name: data.user_name,
        pan: data.pan,
        dob: data.dob,
        father_name: data.father_name,
        mother_name: data.mother_name,
        city: data.user_address_city,
        pincode: data.user_address_pincode,
        state: data.user_address_state,
        country: data.user_address_country,
        email: data.email,
        mobile: data.mobile_number,
        income_slab: data.income,
        occupation: data.occupation,
        place_of_birth: data.place_of_birth,
        country_of_residence: data.country,
        bank_name: data.bank_name,
        branch: data.bank_branch,
        account_number: data.bank_account_number,
        account_type: data.bank_account_type,
        ifsc_code: data.bank_ifsc_code,
        nominee_name: data.nominee_name,
        relationship: data.nominee_relationship,
        nominee_guardian_name: data.nominee_guardian_name,
        date: data.date,
      };
      // let checkboxes = {}
      if (data.is_political == true) {
        placeholders['Yes'] = 'X';
      } else {
        placeholders['No'] = 'X';
      }
      console.log('template placeholders', placeholders);
      // const filledHtml = htmlTemplate
      //     .replace('{{arn_code}}', '280456')
      //     .replace('{{sub_broker}}', '')
      //     .replace('{{euin}}', 'E371361')
      //     .replace('{{user_name}}', data.user_name)
      //     .replace('{{pan}}', data.pan)
      //     .replace('{{dob}}', data.dob)
      //     .replace('{{father_name}}', data.father_name)
      //     .replace('{{mother_name}}', data.mother_name)
      //     .replace('{{user_address_city}}', data.user_address_city)
      //     .replace('{{user_address_pincode}}', data.user_address_pincode)
      //     .replace('{{user_address_state}}', data.user_address_state)
      //     .replace('{{user_address_country}}', data.user_address_country)
      //     .replace('{{email}}', data.email)
      //     .replace('{{mobile_number}}', data.mobile_number)
      //     .replace('{{income}}', data.income)
      //     .replace('{{occupation}}', data.occupation)
      //     .replace('{{place_of_birth}}', data.place_of_birth)
      //     .replace('{{country}}', data.country)
      //     .replace('{{bank_name}}', data.bank_name)
      //     .replace('{{bank_branch}}', data.bank_branch)
      //     .replace('{{bank_account_number}}', data.bank_account_number)
      //     .replace('{{bank_account_type}}', data.bank_account_type)
      //     .replace('{{bank_ifsc_code}}', data.bank_ifsc_code)
      //     .replace('{{nominee_name}}', data.nominee_name)
      //     .replace('{{nominee_relationship}}', data.nominee_relationship)
      //     .replace('{{nominee_guardian_name}}', data.nominee_guardian_name)
      //     .replace('{{date}}', data.date)

      // const pdfBuffer = await this.generatePdfFromHtml(filledHtml);

      // console.log("filledHtml", filledHtml)

      // // Launch Puppeteer and generate PDF
      // const browser = await puppeteer.launch();
      // console.log("browser", browser)
      // const page = await browser.newPage();
      // console.log("page", page)
      // await page.setContent(filledHtml, { waitUntil: 'networkidle0' });

      // Generate PDF
      // const pdfBuffer = await page.pdf({ format: 'A4' });
      // console.log("pdfBuffer", pdfBuffer)

      // await browser.close();
      for (const [field, value] of Object.entries(placeholders)) {
        const textField = form.getTextField(field);
        if (textField) {
          textField.setText(value);
        }
      }

      form.flatten();

      // for (const [field, value] of Object.entries(checkboxes)) {
      //     const textField = form.getCheckBox(field);
      //     if (textField) {
      //         if (value == "yes") {
      //             textField.check()
      //         }
      //         else {
      //             textField.uncheck()
      //         }
      //     }
      // }

      const updatedPdfBytes = await pdfDoc.save();

      const pdfBuffer = Buffer.from(updatedPdfBytes);
      // Add Signature on the Second Page
      const newpdfDoc = await PDFDocument.load(pdfBuffer);
      console.log('pdfDoc', pdfDoc);
      const signatureImage = await pdfDoc.embedPng(
        await fs.readFile(signaturePath),
      );
      console.log('signatureImage', signatureImage);
      const pages = pdfDoc.getPages();
      console.log('pages', pages);
      if (pages.length > 1) {
        const secondPage = pages[1];
        console.log('secondPage', secondPage);
        secondPage.drawImage(signatureImage, {
          x: 70, // Adjust as needed
          y: 65, // Adjust as needed
          width: 80,
          height: 20,
        });
      }

      // Save final PDF
      const finalPdf = await pdfDoc.save();
      console.log('finalPdf', finalPdf);
      const fileName = `AOF-${Date.now()}.pdf`;
      const outputFilePath = path.join(__dirname, '../../../uploads', fileName);
      console.log('outputFilePath', outputFilePath);
      await fs.writeFile(outputFilePath, finalPdf);

      return {
        buffer: Buffer.from(finalPdf).toString('base64'),
        path: outputFilePath,
        filename: fileName,
      };
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  // private async generatePdfFromHtml(htmlContent: string): Promise<Buffer> {
  //     try {
  //         const browser = await puppeteer.launch({
  //             headless: true,
  //             args: ['--no-sandbox', '--disable-setuid-sandbox']
  //         });
  //         const page = await browser.newPage();
  //         await page.setContent(htmlContent);

  //         const pdfBuffer = await page.pdf({
  //             format: 'Letter',
  //             margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
  //         });

  //         await browser.close();
  //         return Buffer.from(pdfBuffer);
  //     } catch (error) {
  //         console.error("Error generating PDF:", error);
  //         // throw error;
  //     }
  // }

  // async generateTIFFWithSignature(htmlPath: string, signaturePath: string, data: any) {
  //     try {
  //         this.logger.log('Loading PDF template');
  //         const pdfBytes = fs.readFileSync(htmlPath);
  //         const pdfDoc = await PDFDocument.load(pdfBytes);
  //         const form = pdfDoc.getForm();

  //         this.logger.log('Filling placeholders');
  //         let placeholders = {
  //             broker_code: '280456',
  //             euin: 'E371361',
  //             user_name: data.user_name,
  //             pan: data.pan,
  //             dob: data.dob,
  //             father_name: data.father_name,
  //             mother_name: data.mother_name,
  //             city: data.user_address_city,
  //             pincode: data.user_address_pincode,
  //             state: data.user_address_state,
  //             country: data.user_address_country,
  //             email: data.email,
  //             mobile: data.mobile_number,
  //             income_slab: data.income,
  //             occupation: data.occupation,
  //             place_of_birth: data.place_of_birth,
  //             country_of_residence: data.country,
  //             bank_name: data.bank_name,
  //             branch: data.bank_branch,
  //             account_number: data.bank_account_number,
  //             account_type: data.bank_account_type,
  //             ifsc_code: data.bank_ifsc_code,
  //             nominee_name: data.nominee_name,
  //             relationship: data.nominee_relationship,
  //             nominee_guardian_name: data.nominee_guardian_name,
  //             date: data.date,
  //             Yes: data.is_political ? 'X' : '',
  //             No: !data.is_political ? 'X' : ''
  //         };

  //         for (const [field, value] of Object.entries(placeholders)) {
  //             const textField = form.getTextField(field);
  //             if (textField) {
  //                 textField.setText(value);
  //             }
  //         }

  //         form.flatten();
  //         const updatedPdfBytes = await pdfDoc.save();
  //         const pdfBuffer = Buffer.from(updatedPdfBytes);

  //         this.logger.log('Adding signature to the second page');
  //         const newPdfDoc = await PDFDocument.load(pdfBuffer);
  //         const signatureImage = await newPdfDoc.embedPng(await fs.readFile(signaturePath));
  //         const pages = newPdfDoc.getPages();

  //         if (pages.length > 1) {
  //             pages[1].drawImage(signatureImage, {
  //                 x: 70,
  //                 y: 65,
  //                 width: 80,
  //                 height: 20,
  //             });
  //         }

  //         const finalPdfBytes = await newPdfDoc.save();

  //         // Define output directory
  //         const uploadsDir = path.join(__dirname, '../../../uploads');
  //         if (!fs.existsSync(uploadsDir)) {
  //             fs.mkdirSync(uploadsDir, { recursive: true });
  //         }

  //         // Generate unique filename based on user name and date
  //         const fileName = `${data.user_name.replace(/\s+/g, '_')}_${Date.now()}`;

  //         this.logger.log('Converting PDF to TIFF');
  //         const options = {
  //             density: 300,
  //             format: 'tiff',
  //             width: 2480,  // A4 width at 300 DPI
  //             height: 3508, // A4 height at 300 DPI
  //         };

  //         const convert = fromBuffer(Buffer.from(finalPdfBytes), options);
  //         const tiffBuffersArray = await convert.bulk(-1, { responseType: 'buffer' });

  //         if (!tiffBuffersArray || tiffBuffersArray.length === 0) {
  //             throw new Error('No TIFF pages generated');
  //         }

  //         this.logger.log(`Generated ${tiffBuffersArray.length} TIFF pages`);

  //         // Save TIFF files temporarily
  //         const tiffFiles = tiffBuffersArray.map((obj, index) => {
  //             const tiffFilename = path.join(uploadsDir, `${fileName}_page_${index + 1}.tiff`);
  //             fs.writeFileSync(tiffFilename, obj.buffer);
  //             return tiffFilename;
  //         });

  //         this.logger.log('Merging TIFF pages');
  //         const tiffFilePath = path.join(uploadsDir, `${fileName}.tiff`);

  //         await new Promise((resolve, reject) => {
  //             gm()
  //                 .in(...tiffFiles)
  //                 .write(tiffFilePath, (err) => {
  //                     if (err) {
  //                         console.error('Error merging TIFF files:', err);
  //                         reject(err);
  //                     } else {
  //                         console.log(`Merged TIFF saved to ${tiffFilePath}`);
  //                         resolve(fs.readFileSync(tiffFilePath));
  //                     }
  //                 });
  //         });

  //         // Cleanup temp TIFF files
  //         tiffFiles.forEach(file => fs.unlinkSync(file));

  //         return {
  //             tiffPath: tiffFilePath,
  //             tiffBase64: fs.readFileSync(tiffFilePath).toString('base64'),
  //             fileName: `${fileName}.tiff`
  //         };

  //     } catch (error) {
  //         console.log('❌ Error generating TIFF:', error);
  //         throw new Error('Failed to generate TIFF');
  //     }
  // }

  async generateTIFFWithSignature(
    htmlPath: string,
    signaturePath: string,
    data: any,
    ucc,
  ) {
    try {
      this.logger.log('Loading PDF template');
      const pdfBytes = fs.readFileSync(htmlPath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const form = pdfDoc.getForm();

      this.logger.log('Filling placeholders');
      const placeholders = {
        broker_code: '280456',
        euin: 'E371361',
        user_name: data.user_name,
        pan: data.pan,
        dob: data.dob,
        father_name: data.father_name,
        mother_name: data.mother_name,
        city: data.user_address_city,
        pincode: data.user_address_pincode,
        state: data.user_address_state,
        country: data.user_address_country,
        email: data.email,
        mobile: data.mobile_number,
        income_slab: data.income,
        occupation: data.occupation,
        place_of_birth: data.place_of_birth,
        country_of_residence: data.country,
        bank_name: data.bank_name,
        branch: data.bank_branch,
        account_number: data.bank_account_number,
        account_type: data.bank_account_type,
        ifsc_code: data.bank_ifsc_code,
        nominee_name: data.nominee_name,
        relationship: data.nominee_relationship,
        nominee_guardian_name: data.nominee_guardian_name,
        date: data.date,
        Yes: data.is_political ? 'X' : '',
        No: !data.is_political ? 'X' : '',
      };

      for (const [field, value] of Object.entries(placeholders)) {
        const textField = form.getTextField(field);
        if (textField) {
          textField.setText(value);
        }
      }

      form.flatten();
      const updatedPdfBytes = await pdfDoc.save();
      const pdfBuffer = Buffer.from(updatedPdfBytes);

      this.logger.log('Adding signature to the second page');
      const newPdfDoc = await PDFDocument.load(pdfBuffer);
      const signatureImage = await newPdfDoc.embedPng(
        await fs.readFile(signaturePath),
      );
      const pages = newPdfDoc.getPages();

      if (pages.length > 1) {
        pages[1].drawImage(signatureImage, {
          x: 70,
          y: 65,
          width: 80,
          height: 20,
        });
      }

      const finalPdfBytes = await newPdfDoc.save();

      // Define output directory
      const uploadsDir = path.join(__dirname, '../../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const fileName = `${ucc}`;

      this.logger.log('Converting PDF to TIFF');
      const options = {
        density: 150, // Reduced DPI for smaller file size
        format: 'tiff',
        width: 1240, // A4 width at 150 DPI
        height: 1754, // A4 height at 150 DPI
      };

      const convert = fromBuffer(Buffer.from(finalPdfBytes), options);
      const tiffBuffersArray = await convert.bulk(-1, {
        responseType: 'buffer',
      });

      if (!tiffBuffersArray || tiffBuffersArray.length === 0) {
        throw new Error('No TIFF pages generated');
      }

      this.logger.log(`Generated ${tiffBuffersArray.length} TIFF pages`);

      // Save TIFF files temporarily
      const tiffFiles = tiffBuffersArray.map((obj, index) => {
        const tiffFilename = path.join(
          uploadsDir,
          `${fileName}_page_${index + 1}.tiff`,
        );
        fs.writeFileSync(tiffFilename, obj.buffer);
        return tiffFilename;
      });

      this.logger.log('Merging TIFF pages with compression');
      const tiffFilePath = path.join(uploadsDir, `${fileName}.tiff`);

      await new Promise((resolve, reject) => {
        gm()
          .in(...tiffFiles)
          .compress('LZW') // Apply LZW compression
          // .monochrome()  // Convert to grayscale (optional for further reduction)
          .write(tiffFilePath, (err) => {
            if (err) {
              console.error('Error merging TIFF files:', err);
              reject(err);
            } else {
              console.log(`Merged TIFF saved to ${tiffFilePath}`);
              resolve(fs.readFileSync(tiffFilePath));
            }
          });
      });

      // Cleanup temp TIFF files
      tiffFiles.forEach((file) => fs.unlinkSync(file));

      return {
        tiffPath: tiffFilePath,
        tiffBase64: fs.readFileSync(tiffFilePath).toString('base64'),
        fileName: `${fileName}.tiff`,
      };
    } catch (error) {
      console.log('❌ Error generating TIFF:', error);
      throw new Error('Failed to generate TIFF');
    }
  }

  // this.logger.log('Converting PDF to TIFF3');
  // const tiffBuffersArray = await convert.bulk(-1, { responseType: 'buffer' }); // Convert all pages
  // this.logger.log('Converting PDF to TIFF5');
  // const buffers = tiffBuffersArray.map(obj => obj.buffer);

  // if (buffers.length === 0) {
  //     throw new Error('No TIFF pages available to merge');
  // }

  // // Merge TIFF pages into a single multi-page TIFF
  // const mergedTiff = await fromBuffer(buffers[0]).bulk(buffers.slice(1), { responseType: 'base64' });

  // return { base64: mergedTiff };
  // const converter = fromBuffer(finalPdfBuffer, options);

  private async generatePdfFromHtml(htmlContent: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      // const options = {
      //     format: 'A4',
      //     // border: {
      //     //     top: '0.5in',
      //     //     right: '0.5in',
      //     //     bottom: '0.5in',
      //     //     left: '0.5in'
      //     // }
      //     paginationOffset: 1 // Ensures correct page numbering
      // };

      const options = {
        format: 'A4', // Change from 'Letter' to 'A4'
        border: '0.3in',
        dpi: 96, // Ensure correct rendering
        zoomFactor: 0.5, // Prevents scaling issues
        paginationOffset: 1, // Reset pagination to avoid blank pages
      };
      pdf.create(htmlContent, options).toBuffer((err, buffer) => {
        if (err) {
          console.error('Error generating PDF:', err);
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });
  }
}

function splitFullName(fullName: string): {
  firstName: string;
  middleName?: string;
  lastName: string;
} {
  // Split the name by spaces
  const nameParts = fullName.trim().split(/\s+/);

  if (nameParts.length === 2) {
    // If there are two words, assign to first and last names
    return {
      firstName: nameParts[0],
      middleName: '',
      lastName: nameParts[1],
    };
  } else if (nameParts.length > 2) {
    // If there are more than two words
    return {
      firstName: nameParts[0],
      middleName: nameParts.slice(1, -1).join(' '), // Join the middle parts
      lastName: nameParts[nameParts.length - 1],
    };
  } else {
    // If there's only one word, treat it as the first name
    return {
      firstName: nameParts[0],
      middleName: '',
      lastName: '',
    };
  }
}

function formatDate(date: Date): string {
  // Array of month names
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  console.log('dateeeeeeeeeeeee', date);
  // Extract day, month, and year
  const day = date.getDate().toString().padStart(2, '0'); // Ensures two digits for the day
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Return formatted string
  return `${day}-${month}-${year}`;
}

function formatToDateString(date: Date): string {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatToDateStringmmddyyy(date: Date): string {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function formatTwoDigits(value: string): string {
  return value.padStart(2, '0');
}

function splitAddress(address: string) {
  const parts = address.split(',').map((part) => part.trim()); // Split by commas and trim spaces

  return {
    address1: parts[0] || '',
    address2: parts[1] || '',
    address3: parts.slice(2).join(', ') || '', // Join remaining parts into address3
  };
}
