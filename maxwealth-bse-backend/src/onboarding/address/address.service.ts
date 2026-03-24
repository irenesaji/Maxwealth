import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { FintechService } from 'src/utils/fintech/fintech.service';
import { Repository } from 'typeorm';
import { UserOnboardingDetails } from '../entities/user_onboarding_details.entity';
import { ProofsService } from '../proofs/proofs.service';
import { AddAddressDetailsDto } from './dtos/add-address-details.dto';
import { UserAddressDetails } from './entities/user_address_details.entity';
import { UserAddressDetailsRepository } from 'src/repositories/user_address_details.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import * as pincode_query from 'india-pincode-search';
@Injectable()
export class AddressService {
  constructor(
    // @InjectRepository(UserAddressDetails)
    // private userAddressDetailsRepository :Repository<UserAddressDetails>,
    // @InjectRepository(UserOnboardingDetails)
    // private userOnboardingDetailsRepository : Repository<UserOnboardingDetails>,

    private readonly userAddressDetailsRepository: UserAddressDetailsRepository,
    private readonly userOnboardingDetailsRepository: UserOnboardingDetailsRepository,

    private readonly fintechService: FintechService,
    private readonly usersService: UsersService,
    private readonly proofsService: ProofsService,
  ) {}

  async get_address_details(user_id: number) {
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
        const addressDetails =
          await this.userAddressDetailsRepository.findOneBy({
            user_id: user.id,
          });

        if (addressDetails) {
          return { status: HttpStatus.OK, data: addressDetails };
        } else {
          return {
            status: HttpStatus.NOT_FOUND,
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

        if (!onboarding.is_kyc_compliant) {
          if (onboarding.kyc_id) {
            if (onboarding.identity_document_status == 'successful') {
              // let result = await this.fintechService.update_address_details_identity_doc_kyc(addAddressDetailsDto,onboarding.identity_document_id,onboarding.kyc_id);
              // if(result.status ==200){
              //     await this.userAddressDetailsRepository.save(userAddress);
              //     await this.userOnboardingDetailsRepository.save(onboarding);
              //     return { "status": HttpStatus.OK , "message": "Updated the details"};
              // }else{
              //     return result;
              // }
            } else {
              const proofResponse = await this.proofsService.get_proof(
                user.id,
                'proof_of_address',
              );
              if (proofResponse.status == HttpStatus.OK) {
                const proof = proofResponse.data;

                // let result = await this.fintechService.update_address_details_kyc(addAddressDetailsDto,proof,onboarding.kyc_id);
                // if(result.status ==200){
                //     await this.userAddressDetailsRepository.save(userAddress);

                //     await this.userOnboardingDetailsRepository.save(onboarding);
                //     return { "status": HttpStatus.OK , "message": "Updated the details"};
                // }else{
                //     return result;
                // }
              } else {
                proofResponse.error =
                  'Please upload the Proof of Address Image Before this step';
                return proofResponse;
              }
            }
          } else {
            return {
              status: HttpStatus.BAD_REQUEST,
              error:
                'Please check your KYC compliance and confirm your PAN detailsfirst',
            };
          }
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

  async get_fp_pincode_address(pincode: string) {
    try {
      // let result = this.fintechService.get_pincode_address(pincode);
      /*{
    "status": 200,
    "data": {
        "code": "575005",
        "city": "Dakshina Kannada",
        "district": "Dakshina Kannada",
        "state_name": "KARNATAKA",
        "country_ansi_code": "IN",
        "_links": [
            {
                "href": "https://s.finprim.com/api/onb/pincodes/575005",
                "rel": "self",
                "method": "GET"
            }
        ]
    }
}*/
      console.log('pincode_query', pincode_query);
      let result = pincode_query.search(pincode);
      if (result.length > 0) {
        result = result[0];
      } else {
        result = {};
      }
      console.log('pincode_query result', result);

      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }
}
