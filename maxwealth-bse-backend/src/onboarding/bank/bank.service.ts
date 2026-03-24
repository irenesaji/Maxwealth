import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { FintechService } from 'src/utils/fintech/fintech.service';
import { Repository } from 'typeorm';
import { UserOnboardingDetails } from '../entities/user_onboarding_details.entity';
import { AddUserBankDetailsDto } from './dtos/add-user-bank-details.dto';
import { GetUserBankDetailsDto } from './dtos/get-user-bank-details.dto';
import { UserBankDetails } from './entities/user_bank_details.entity';
import { UserNomineeDetails } from '../nominee/entities/user-nominee-details.entity';
import { UserAddressDetails } from '../address/entities/user_address_details.entity';
import { PichainService } from 'src/utils/pichain/pichain.service';
import e from 'express';
import { Pennydrops } from './entities/pennydrops.entity';
import { UserBankDetailsRepository } from 'src/repositories/user_bank_details.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { UserAddressDetailsRepository } from 'src/repositories/user_address_details.repository';
import { UserNomineeDetailsRepository } from 'src/repositories/user_nominee_details.repository';
import { PennydropsRepository } from 'src/repositories/pennydrops.repository';
import { RazorpayService } from 'src/utils/razorpay/razorpay.service';
import { RazorpayPennyDropDto } from 'src/utils/razorpay/dtos/razorpay_penny_drop.dto';
import { SignzyService } from 'src/utils/signzy/signzy.service';
import { SignzyKycObjectRepository } from 'src/repositories/signzy_kyc_object.repository';
import { KycStatusDetailRepository } from 'src/repositories/kyc_status_details.repository';
import * as ifsc from 'ifsc';
import { UpdateBseBankUccDto } from './dtos/update_bse_bank_ucc.dto';
import { Bsev1Service } from 'src/utils/bsev1/bsev1.service';
import axios from 'axios';
@Injectable()
export class BankService {
  constructor(
    // @InjectRepository(UserBankDetails)
    // private userBankDetailsRepository : Repository<UserBankDetails>,
    // @InjectRepository(UserOnboardingDetails)
    // private userOnboardingDetailsRepository : Repository<UserOnboardingDetails>,
    // @InjectRepository(UserAddressDetails)
    // private userAddressDetailsRepository : Repository<UserAddressDetails>,
    // @InjectRepository(UserNomineeDetails)
    // private userNomineeDetailsRepository : Repository<UserNomineeDetails>,
    // @InjectRepository(Pennydrops)
    // private pennyDropsRepository: Repository<Pennydrops>,

    private userBankDetailsRepository: UserBankDetailsRepository,
    private userOnboardingDetailsRepository: UserOnboardingDetailsRepository,
    private userAddressDetailsRepository: UserAddressDetailsRepository,
    private userNomineeDetailsRepository: UserNomineeDetailsRepository,
    private pennyDropsRepository: PennydropsRepository,
    private razorpayService: RazorpayService,
    private signzyKycObjectRepository: SignzyKycObjectRepository,
    private kycStatusDetailRepository: KycStatusDetailRepository,

    private signzyService: SignzyService,
    private readonly fintechService: FintechService,
    private readonly pichainService: PichainService,
    private readonly bseV1Service: Bsev1Service,

    private readonly usersService: UsersService,
  ) {}
  /*
    
    
    */

  async add_additional_bank(addUserBankDetailsDto: AddUserBankDetailsDto) {
    try {
      const userData = await this.usersService.findOneById(
        addUserBankDetailsDto.user_id,
      );
      const user = userData.user;
      let is_new_bank = true;
      if (user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user.id },
          relations: ['user'],
        });
        if (!onboarding) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Please check your KYC compliance first',
          };
        }

        let userBank = await this.userBankDetailsRepository.findOneBy({
          account_number: addUserBankDetailsDto.account_number,
          user_id: user.id,
        });
        if (!userBank) {
          userBank = new UserBankDetails();
        } else {
          is_new_bank = false;
        }

        // if (onboarding.fp_investor_id) {

        userBank.user = user;
        userBank.account_holder_name =
          addUserBankDetailsDto.account_holder_name;
        userBank.account_number = addUserBankDetailsDto.account_number;
        userBank.bank_name = addUserBankDetailsDto.bank_name;
        userBank.ifsc_code = addUserBankDetailsDto.ifsc_code;
        if (is_new_bank) {
          userBank.is_primary = false;
        }

        userBank.user_onboarding_detail_id = onboarding.id;
        // "NO MATCH"

        const razor_pay_penny_drop_dto = new RazorpayPennyDropDto();
        razor_pay_penny_drop_dto.account_number =
          addUserBankDetailsDto.account_number;
        razor_pay_penny_drop_dto.ifsc = addUserBankDetailsDto.ifsc_code;
        razor_pay_penny_drop_dto.name = onboarding.full_name;
        razor_pay_penny_drop_dto.user = user;

        const bank_validation = await this.razorpayService.check_validation(
          razor_pay_penny_drop_dto,
        );

        if (bank_validation.status == HttpStatus.OK) {
          userBank.is_penny_drop_attempted = true;

          if (
            bank_validation['data'] &&
            bank_validation['data'].account_status == 'valid'
          ) {
            userBank.is_penny_drop_success = true;
          }
        }

        const primary_accounts = await this.userBankDetailsRepository.findBy({
          user_id: user.id,
          is_primary: true,
        });

        if (primary_accounts.length == 0) {
          const primary_account = await this.userBankDetailsRepository.find({
            where: { user_id: user.id },
            skip: 0,
            take: 1,
            order: { created_at: 'DESC' },
          });

          console.log('Primary ACcounts', primary_account[0]);
          if (primary_account.length > 0) {
            primary_account[0].is_primary = true;
            await this.userBankDetailsRepository.save(primary_account[0]);
          }
        }

        await this.userBankDetailsRepository.save(userBank);
        const bank_all = await this.userBankDetailsRepository.find({
          where: { user_id: user.id },
        });
        const bankDto = new UpdateBseBankUccDto();
        bankDto.client_code = onboarding.fp_investor_id;
        for (const [index, bank] of bank_all.entries()) {
          if (index >= 5) break; // Limiting to 5 banks

          const bankIndex = index + 1;
          Object.assign(bankDto, {
            [`bnk${bankIndex}_acc_typ`]: 'SB',
            [`bnk${bankIndex}_acc_no`]: bank.account_number,
            [`bnk${bankIndex}_micr`]: '',
            [`bnk${bankIndex}_ifsc`]: bank.ifsc_code || '',
            [`bnk${bankIndex}_dflt`]: bank.is_primary ? 'Y' : 'N',
          });
        }
        const res = await this.bseV1Service.updatebank(bankDto);
        console.log('RESDFFSF', res);

        await this.userOnboardingDetailsRepository.save(onboarding);
        return { status: HttpStatus.OK, message: 'Updated the details' };

        // var banks = await this.userBankDetailsRepository.findBy({user_id:user.id}) ;

        // if(is_new_bank){
        //     banks.push(userBank);
        // }
        // console.log("bank",banks);
        // console.log("onboarding",onboarding);
        // console.log("nominees",nominees);
        // console.log("address",address);

        // if (is_new_bank) {

        //     let result = await this.fintechService.create_bank(onboarding.fp_investor_id, userBank);
        //     if (result.status == 200) {
        //         // userBank.fp_bank_id = result.data.id;
        //         // userBank.old_fp_bank_id = result.data.old_id;

        //         this.userBankDetailsRepository.save(userBank);

        //         return { "status": HttpStatus.OK, "message": "Updated the details" };
        //     } else {
        //         return result;
        //     }
        // } else {
        //     return { "status": HttpStatus.BAD_REQUEST, "error": "Updating Bank Account is not allowed" };
        // }
        // } else {
        //     return { "status": HttpStatus.BAD_REQUEST, "error": "Please create investor account first" };
        // }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async add_user_bank_details(addUserBankDetailsDto: AddUserBankDetailsDto) {
    try {
      const userData = await this.usersService.findOneById(
        addUserBankDetailsDto.user_id,
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
        const kyc_status_detail =
          onboarding.kyc_status_details[
            onboarding.kyc_status_details.length - 1
          ];

        onboarding.status = 'bank_details';
        let userBank = await this.userBankDetailsRepository.findOneBy({
          user_id: user.id,
        });
        if (!userBank) {
          userBank = new UserBankDetails();
        }
        userBank.user = user;
        userBank.account_holder_name =
          addUserBankDetailsDto.account_holder_name;
        userBank.account_number = addUserBankDetailsDto.account_number;
        userBank.bank_name = addUserBankDetailsDto.bank_name;
        userBank.ifsc_code = addUserBankDetailsDto.ifsc_code;
        userBank.is_primary = true;
        userBank.user_onboarding_detail_id = onboarding.id;
        // "NO MATCH"

        const razor_pay_penny_drop_dto = new RazorpayPennyDropDto();
        razor_pay_penny_drop_dto.account_number =
          addUserBankDetailsDto.account_number;
        razor_pay_penny_drop_dto.ifsc = addUserBankDetailsDto.ifsc_code;
        razor_pay_penny_drop_dto.name = onboarding.full_name;
        razor_pay_penny_drop_dto.user = user;

        const bank_validation = await this.razorpayService.check_validation(
          razor_pay_penny_drop_dto,
        );

        // let userBankDetails = await this.pennyDropsRepository.findOneBy({ account_number: addUserBankDetailsDto.account_number, ifsc: addUserBankDetailsDto.ifsc_code });

        if (bank_validation.status == HttpStatus.OK) {
          userBank.is_penny_drop_attempted = true;

          if (
            bank_validation['data'] &&
            bank_validation['data'].account_status == 'valid'
          ) {
            userBank.is_penny_drop_success = true;
          }
        }
        // else{
        //     if(userBankDetails.is_bank_valid){
        //         let name_match = await this.pichainService.match_names(onboarding.full_name,userBankDetails.name)
        //         console.log("name match" ,name_match );
        //         if(name_match.status == HttpStatus.OK ){
        //             if(name_match.data.data.nameMatchScore >=  80)
        //             {
        //                 userBank.is_penny_drop_attempted = true;
        //                 userBank.is_penny_drop_success = true;
        //             }
        //             else{
        //                  return { "status": HttpStatus.BAD_REQUEST , "error": "The name on the PAN card does not match the actual bank account holder's name."};
        //             }

        //         }
        //         else{
        //              return { "status": HttpStatus.BAD_REQUEST , "error": "Could not verify the name of the bank account details please retry"};

        //         }

        //     }
        //     else{
        //         return { "status": HttpStatus.BAD_REQUEST , "error": "Invalid Bank Details, please send the correct bank details"};
        //     }
        // }

        // if (onboarding.fp_investor_id != null) {
        //     let result = await this.fintechService.create_bank(onboarding.fp_investor_id, userBank);
        //     if (result.status == 200) {
        //         // userBank.fp_bank_id = result.data.id;
        //         // userBank.old_fp_bank_id = result.data.old_id;
        //         this.userBankDetailsRepository.save(userBank);
        //     } else {
        //         return result;
        //     }
        // }

        // if (!onboarding.is_kyc_compliant) {
        //     if (onboarding.kyc_id) {
        //         let signzy_kyc_object = await this.signzyKycObjectRepository.findOneBy({ id: onboarding.kyc_id })

        //         let result = await this.signzyService.update_bank_details(addUserBankDetailsDto, signzy_kyc_object, kyc_status_detail);
        //         console.log("Bank in signzy", result);
        //         // let result = await this.fintechService.update_bank_details_kyc(addUserBankDetailsDto, onboarding.kyc_id);
        //         // if (result.status == 200) {
        //         //     // userBank.proof = result.data.id;
        //         //     await this.userBankDetailsRepository.save(userBank);

        //         //     await this.userOnboardingDetailsRepository.save(onboarding);
        //         //     return { "status": HttpStatus.OK, "message": "Updated the details" };
        //         // } else
        //         if (result.status != 200) {
        //             return result;
        //         }
        //     } else {
        //         return { "status": HttpStatus.BAD_REQUEST, "error": "Please check your KYC compliance and confirm your PAN details first" };
        //     }
        // }
        await this.userBankDetailsRepository.save(userBank);
        if (kyc_status_detail) {
          kyc_status_detail.bank_account_details = true;
          kyc_status_detail.status = 'bank_details';
          await this.kycStatusDetailRepository.save(kyc_status_detail);
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

  async get_all_user_bank_details(user_id: number) {
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
        const bankDetails = await this.userBankDetailsRepository.find({
          where: { user_id: user.id },
          relations: ['mandates'],
        });
        const bankDetailsDtoArray = [];
        console.log(bankDetails);
        if (bankDetails.length > 0) {
          for (const bank of bankDetails) {
            const getUserBankDetailsDto = new GetUserBankDetailsDto();
            getUserBankDetailsDto.id = bank.id;
            getUserBankDetailsDto.account_holder_name =
              bank.account_holder_name;
            getUserBankDetailsDto.account_number = bank.account_number;
            getUserBankDetailsDto.bank_name = bank.bank_name;
            getUserBankDetailsDto.ifsc_code = bank.ifsc_code;
            getUserBankDetailsDto.kyc_id = onboarding.kyc_id;
            getUserBankDetailsDto.is_kyc_compliant =
              onboarding.is_kyc_compliant;
            getUserBankDetailsDto.user_id = user_id;
            getUserBankDetailsDto.penny_drop_request_id =
              bank.penny_drop_request_id;
            getUserBankDetailsDto.is_penny_drop_attempted =
              bank.is_penny_drop_attempted;
            getUserBankDetailsDto.is_penny_drop_success =
              bank.is_penny_drop_success;
            getUserBankDetailsDto.is_primary = bank.is_primary;
            getUserBankDetailsDto.mandates = bank.mandates;

            if (bank.bank_name != null) {
              const words = bank.bank_name.split(' ');

              for (let i = 0; i < words.length; i++) {
                words[i] = words[i][0].toUpperCase() + words[i].substr(1);
              }

              const bank_name = words.join('_');

              getUserBankDetailsDto.logo_url =
                '/uploads/bank_logos/' + bank_name + '.png';
            }

            bankDetailsDtoArray.push(getUserBankDetailsDto);
          }
          return { status: HttpStatus.OK, data: bankDetailsDtoArray };
        } else {
          return {
            status: HttpStatus.NOT_FOUND,
            error: 'No Bank Details found',
          };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_user_bank_details(user_id: number) {
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
        const bankDetails = await this.userBankDetailsRepository.findOneBy({
          user_id: user.id,
          is_primary: true,
        });
        const getUserBankDetailsDto = new GetUserBankDetailsDto();
        console.log(bankDetails);
        if (bankDetails) {
          getUserBankDetailsDto.id = bankDetails.id;
          getUserBankDetailsDto.account_holder_name =
            bankDetails.account_holder_name;
          getUserBankDetailsDto.account_number = bankDetails.account_number;
          getUserBankDetailsDto.bank_name = bankDetails.bank_name;
          getUserBankDetailsDto.ifsc_code = bankDetails.ifsc_code;
          getUserBankDetailsDto.kyc_id = onboarding.kyc_id;
          getUserBankDetailsDto.is_kyc_compliant = onboarding.is_kyc_compliant;
          getUserBankDetailsDto.user_id = user_id;
          getUserBankDetailsDto.penny_drop_request_id =
            bankDetails.penny_drop_request_id;
          getUserBankDetailsDto.is_penny_drop_attempted =
            bankDetails.is_penny_drop_attempted;
          getUserBankDetailsDto.is_penny_drop_success =
            bankDetails.is_penny_drop_success;
          getUserBankDetailsDto.is_primary = bankDetails.is_primary;
          if (bankDetails.bank_name != null) {
            const words = bankDetails.bank_name.split(' ');

            for (let i = 0; i < words.length; i++) {
              words[i] = words[i][0].toUpperCase() + words[i].substr(1);
            }

            const bank_name = words.join('_');

            getUserBankDetailsDto.logo_url =
              '/uploads/bank_logos/' + bank_name + '.png';
          }
          return { status: HttpStatus.OK, data: getUserBankDetailsDto };
        } else {
          return {
            status: HttpStatus.NOT_FOUND,
            error: 'No Bank Details found',
          };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_fp_bank_details(ifs: string) {
    try {
      const result = await this.fetchDetails(ifs);
      console.log(result);

      const new_result = {
        ifsc_code: result.IFSC,
        micr_code: result.MICR,
        branch_name: result.BRANCH,
        bank_name: result.BANK,
        branch_address: result.ADDRESS,
        contact: result.CONTACT,
        city: result.CITY,
        district: result.DISTRICT,
        state: result.STATE,
      };

      // let result = await this.fintechService.get_bank_details(ifsc);
      return { status: HttpStatus.OK, data: new_result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async fetchDetails(ifsc) {
    const response = await axios.get(`https://ifsc.razorpay.com/${ifsc}`);
    return response.data;
  }

  async update_primary(user_id, id: number) {
    try {
      // Find the bank account to be set as primary
      const findBank = await this.userBankDetailsRepository.findOne({
        where: { id, user_id },
      });
      const user_onboarding_details =
        await this.userOnboardingDetailsRepository.findOne({
          where: { user_id: user_id },
        });
      console.log('Primary bank to be updated:', findBank);

      if (!findBank) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Bank account not found for the given user',
        };
      }
      const bank_all = await this.userBankDetailsRepository.find({
        where: { user_id },
      });

      // Set all to false first
      bank_all.forEach((bank) => {
        bank.is_primary = false;
      });
      console.log('banksaLl', bank_all);
      // Set specific one to true
      const target = bank_all.find((bank) => bank.id === id);
      console.log('target', target, typeof id);
      if (target) {
        target.is_primary = true;
      }
      console.log('bank', target);
      console.log('new', bank_all);

      const bankDto = new UpdateBseBankUccDto();
      bankDto.client_code = user_onboarding_details.fp_investor_id;
      for (const [index, bank] of bank_all.entries()) {
        if (index >= 5) break; // Limiting to 5 banks

        const bankIndex = index + 1;
        Object.assign(bankDto, {
          [`bnk${bankIndex}_acc_typ`]: 'SB',
          [`bnk${bankIndex}_acc_no`]: bank.account_number,
          [`bnk${bankIndex}_micr`]: '',
          [`bnk${bankIndex}_ifsc`]: bank.ifsc_code || '',
          [`bnk${bankIndex}_dflt`]: bank.is_primary ? 'Y' : 'N',
        });
      }

      const fp_bank = await this.bseV1Service.updatebank(bankDto);
      if (fp_bank.status == HttpStatus.OK) {
        // Set all existing primary accounts for the user to false
        await this.userBankDetailsRepository.update(
          { user_id, is_primary: true },
          { is_primary: false },
        );

        // Set the specified bank as primary
        findBank.is_primary = true;

        const result = await this.userBankDetailsRepository.save(findBank);
        console.log('Updated primary bank account:', result);

        return {
          status: HttpStatus.OK,
          message: 'Bank updated successfully',
          data: result,
        };
      } else if (fp_bank.status == HttpStatus.FORBIDDEN) {
        console.log('FFp', fp_bank);
        return { status: HttpStatus.FORBIDDEN, error: 'Permission Denied' };
      }
    } catch (err) {
      console.error('Error updating primary bank account:', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }
}
