import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { AddUserNomineeDetailsDto } from './dtos/add-user-nominee-details.dto';
import { UserNomineeDetails } from './entities/user-nominee-details.entity';
import { UserOnboardingDetails } from '../entities/user_onboarding_details.entity';
import { UserNomineeDetailsRepository } from 'src/repositories/user_nominee_details.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { FintechService } from 'src/utils/fintech/fintech.service';
import { KycStatusDetailRepository } from 'src/repositories/kyc_status_details.repository';
import { UpdateUserNomineeDetailsDto } from './dtos/update-user-nominee-details.dto';
import { Bsev1Service } from 'src/utils/bsev1/bsev1.service';
import { UpdateBseNomineeUccDto } from './dtos/update_bse_nominee_ucc.dto';
import { Bsev1NomineeRelationshipCodeRepository } from 'src/repositories/bse_v1_nominee_relationship_code.repository';

@Injectable()
export class NomineeService {
  constructor(
    // @InjectRepository(UserNomineeDetails)
    // private userNomineeDetailsRepository: Repository<UserNomineeDetails>,
    // @InjectRepository(UserOnboardingDetails)
    // private userOnboardingDetailsRepository: Repository<UserOnboardingDetails>,
    private kycStatusDetailRepository: KycStatusDetailRepository,
    private userNomineeDetailsRepository: UserNomineeDetailsRepository,
    private userOnboardingDetailsRepository: UserOnboardingDetailsRepository,
    private bseV1NomineeRelationshipCodeRepository: Bsev1NomineeRelationshipCodeRepository,
    private readonly fintechService: FintechService,
    private readonly usersService: UsersService,
    private readonly bseV1Service: Bsev1Service,
  ) {}

  async get_user_nominee_details(user_id: number) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData.user;
      console.log('user_id - ', user_id);
      const results = await this.userNomineeDetailsRepository.find({
        where: {
          user_id: user.id,
        },
      });
      console.log('results nominee - ', results);
      return { status: HttpStatus.OK, data: results };
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Something went wrong ' + err.message,
      };
    }
  }

  async add_user_nominee_details(
    addUserNomineeDetailsDtoArray: Array<AddUserNomineeDetailsDto>,
  ) {
    try {
      console.log('Nominee 1');
      const userData = await this.usersService.findOneById(
        addUserNomineeDetailsDtoArray[0].user_id,
      );
      const user = userData.user;
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
        onboarding.kyc_status_details[onboarding.kyc_status_details.length - 1];

      const nominee_relations = [];
      let nominee_relation_unique = true;

      const nominee_names = [];
      let nominee_name_unique = true;
      console.log('Nominee 2');

      if (addUserNomineeDetailsDtoArray.length > 3) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'There should be less than or equal to 3 nominees',
        };
      }
      let allocation_total = 0;
      let is_percentage_zero = false;
      let guardian_error_message = '';
      const promise = new Promise<void>((resolve, reject) => {
        addUserNomineeDetailsDtoArray.forEach(
          (addUserNomineeDetailsDto, index) => {
            console.log('Nominee 3');

            const today = new Date();
            const birthDate = new Date(addUserNomineeDetailsDto.date_of_birth);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }

            if (
              age < 18 &&
              (addUserNomineeDetailsDto.guardian_name == null ||
                addUserNomineeDetailsDto.guardian_relationship == null)
            ) {
              guardian_error_message +=
                ' Nominee - ' +
                addUserNomineeDetailsDto.name +
                ' needs a guardians name and relationship to be filled,';
            }

            if (
              addUserNomineeDetailsDto.relationship == 'mother' ||
              addUserNomineeDetailsDto.relationship == 'father' ||
              addUserNomineeDetailsDto.relationship == 'spouse'
            ) {
              if (
                !nominee_relations.includes(
                  addUserNomineeDetailsDto.relationship,
                )
              ) {
                nominee_relations.push(addUserNomineeDetailsDto.relationship);
              } else {
                nominee_relation_unique = false;
              }
            }

            if (!nominee_names.includes(addUserNomineeDetailsDto.name)) {
              nominee_names.push(addUserNomineeDetailsDto.name);
            } else {
              nominee_name_unique = false;
            }

            console.log('Nominee 4');

            if (Number(addUserNomineeDetailsDto.allocation_percentage) <= 0) {
              is_percentage_zero = true;
            }
            allocation_total += Number(
              addUserNomineeDetailsDto.allocation_percentage,
            );

            delete addUserNomineeDetailsDto['user_id'];

            addUserNomineeDetailsDto['user'] = user;
            addUserNomineeDetailsDto['user_onboarding_detail_id'] =
              onboarding.id;
            addUserNomineeDetailsDtoArray[index] = addUserNomineeDetailsDto;

            console.log('Nominee 5');

            if (index === addUserNomineeDetailsDtoArray.length - 1) {
              console.log('resolving');
              resolve();
            }
          },
        );
      });

      const response = await promise.then(async () => {
        console.log('Nominee 7');

        if (guardian_error_message != '') {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: guardian_error_message,
          };
        } else if (!nominee_relation_unique) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'User nominee relations needs to be unique',
          };
        } else if (!nominee_name_unique) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'User nominee Names needs to be unique',
          };
        } else if (allocation_total != 100) {
          console.log('number ' + allocation_total);
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'The total allocation percentage needs to be equal to 100',
          };
        } else if (is_percentage_zero) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Every allocation percentage needs to be greater than 0',
          };
        } else {
          await this.userNomineeDetailsRepository.delete({ user_id: user.id });
          await this.userNomineeDetailsRepository.save(
            addUserNomineeDetailsDtoArray,
          );

          console.log('Nominee 8');

          // if(onboarding.fp_investor_id != null){
          //      let nominees = await this.userNomineeDetailsRepository.findBy({user_id:user.id});
          //     for( let nominee of nominees){
          //         let nominee_result  = await this.fintechService.create_related_parties(onboarding.fp_investor_id,nominee);
          //         if(nominee_result.status != 200){
          //             console.log("ERROR: Nominee not created");
          //             return nominee_result;
          //         }else{
          //             let fp_nominee =  nominee_result.data;
          //             // nominee.fp_id = fp_nominee.id;
          //             this.userNomineeDetailsRepository.save(nominee);
          //         }
          //     }
          // }

          onboarding.status = 'nominee';
          console.log('nomuineee');
          await this.userOnboardingDetailsRepository.save(onboarding);

          if (kyc_status_detail) {
            kyc_status_detail.nominee = true;
            kyc_status_detail.status = 'nominee';
            await this.kycStatusDetailRepository.save(kyc_status_detail);
          }

          return { status: HttpStatus.OK, message: 'Saved Successfully' };
        }
      });

      return response;
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Something went wrong ' + err.message,
      };
    }
  }

  async update_user_nominee_details(
    user_id: number,
    updateUserNomineeDetailsDtoArray: UpdateUserNomineeDetailsDto[],
  ) {
    try {
      console.log('ke', user_id);
      const onboarding = await this.userOnboardingDetailsRepository.findOne({
        where: { user_id: user_id },
        relations: ['user'],
      });
      console.log('Onke', onboarding);
      const nominee_details = await this.userNomineeDetailsRepository.find({
        where: { user_id: user_id },
      });
      const count = updateUserNomineeDetailsDtoArray.filter(
        (obj) => obj.id == null,
      ).length;

      if (nominee_details.length + count > 3) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Only 3 Nominees Can be Registered',
        };
      }

      let allocation = 0;
      allocation = updateUserNomineeDetailsDtoArray.reduce((total, obj) => {
        // Safely parse allocation_percentage (convert string to number if needed)
        const percentage = Number(obj.allocation_percentage || 0);
        return total + percentage;
      }, 0);

      console.log('Allocation', allocation);

      // Check if total allocation is 100
      if (allocation !== 100) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Overall Allocation value should be equal to 100',
        };
      }

      const nomineeDto = new UpdateBseNomineeUccDto();
      nomineeDto.ClientCode = onboarding.fp_investor_id;
      nomineeDto.NominationOpt = 'Y';
      nomineeDto.NominationAuthMode = 'O';
      nomineeDto.Nom_SOA = 'Y';
      for (const [
        index,
        nominee,
      ] of updateUserNomineeDetailsDtoArray.entries()) {
        if (index >= 3) break;
        const relationcode =
          await this.bseV1NomineeRelationshipCodeRepository.findOne({
            where: { value: nominee.relationship.toUpperCase() },
          });
        const nomineeIndex = index + 1;
        // const identityProofTypeMap: Record<string, string> = {
        //     pan: "1",
        //     aadhar_number: "2",
        //     driving_licence_number: "3",
        // };

        // // const nomineeDto: any = {};

        // const proofTypeKey = nominee.identity_proof_type?.toLowerCase() || "";
        // const mappedProofType = identityProofTypeMap[proofTypeKey];

        // const idNumber = proofTypeKey === "pan"
        //     ? nominee.pan
        //     : proofTypeKey === "adhaar"
        //         ? nominee.aadhar_number
        //         : proofTypeKey === "driving licence"
        //             ? nominee.driving_licence_number
        //             : "";
        const identityProofTypeMap: Record<
          string,
          { type: string; field: string }
        > = {
          pan: { type: '1', field: 'pan' },
          adhaar: { type: '2', field: 'aadhaar_number' }, // Assuming this spelling comes from user input
          'driving licence': { type: '3', field: 'driving_licence_number' },
        };

        const proofTypeKey =
          nominee.identity_proof_type?.toLowerCase().trim() || '';

        const mapped = identityProofTypeMap[proofTypeKey];

        const mappedProofType = mapped?.type || '';
        const idNumber = mapped ? nominee[mapped.field] : '';

        console.log(
          'indexsssssss',
          nomineeIndex,
          nominee,
          proofTypeKey,
          mapped,
          mappedProofType,
          idNumber,
        );
        console.log(
          `Nom${nomineeIndex}_Name`,
          ` Nom${nomineeIndex}_Relationship`,
        );
        Object.assign(nomineeDto, {
          [`Nom${nomineeIndex}_Name`]: nominee.name,
          [`Nom${nomineeIndex}_Relationship`]: relationcode?.code || '',
          [`Nom${nomineeIndex}_${
            nomineeIndex === 1 ? 'App_Percent' : 'Appl_Percent'
          }`]: nominee.allocation_percentage.toString(),
          [`Nom${nomineeIndex}_MinorFlag`]: nominee.guardian_name ? 'Y' : 'N',
          [`Nom${nomineeIndex}_Dob`]: nominee.guardian_name
            ? formatToDateString(nominee.date_of_birth)
            : '',
          [`Nom${nomineeIndex}_Guardian`]: nominee.guardian_name || '',
          [`Nom${nomineeIndex}_GuardianPAN`]: nominee.guardian_pan || '',
          [`Nom${nomineeIndex}_Email`]: nominee.email_address || '',
          [`Nom${nomineeIndex}_MobileNo`]: nominee.phone_number || '',
          [`Nom${nomineeIndex}_Add1`]: nominee.address_line_1 || '',
          [`Nom${nomineeIndex}_Add2`]: nominee.address_line_2 || '',
          [`Nom${nomineeIndex}_Add3`]: nominee.address_line_3 || '',
          [`Nom${nomineeIndex}_City`]: nominee.address_city || '',
          [`Nom${nomineeIndex}_Pincode`]: nominee.address_postal_code || '',
          [`Nom${nomineeIndex}_Country`]: nominee.address_country || 'IN',
          ...(mappedProofType && idNumber
            ? {
                [`Nom${nomineeIndex}_IdType`]: mappedProofType,
                [`Nom${nomineeIndex}_IdNo`]: idNumber,
              }
            : {}),
        });
        console.log(`Nominee Dto`, nomineeDto);
      }

      const nominee_update = await this.bseV1Service.update_nominee(nomineeDto);
      console.log(
        'Nominee update',
        nominee_update,
        nominee_update.data.StatusCode,
        nominee_update.data.Remarks,
        nominee_update.status !== 200 &&
          nominee_update.data.StatusCode !== '100',
      );
      if (
        nominee_update.status !== 200 ||
        nominee_update.data.StatusCode !== '100'
      ) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Something went wrong while updating nominee details on BSE ' +
            nominee_update.data.Remarks,
        };
      }
      console.log('nomineee dto', nomineeDto);
      console.log('Nominee update', nominee_update);
      for (const dto of updateUserNomineeDetailsDtoArray) {
        let res: UserNomineeDetails;
        if (dto.id) {
          res = await this.userNomineeDetailsRepository.findOne({
            where: { id: dto.id },
          });
          if (res) {
            // if (res.name !== dto.name && res.relationship !== dto.relationship) {
            //     let nominee_result: any = await this.fintechService.create_related_parties(onboarding.fp_investor_id, res);
            //     console.log("nominee Result", nominee_result)

            //     if (nominee_result.status != 200) {
            //         console.log("ERROR: Nominee not updated");
            //         return nominee_result;
            //     } else {
            //         res.fp_id = nominee_result.id
            //         console.log("Res fp id", res)
            //     }
            // }
            Object.assign(res, dto);
            res.user_id = user_id;
            res = await this.userNomineeDetailsRepository.save(res);
            console.log('Nominee Result 1', res);
          }
        } else {
          res = this.userNomineeDetailsRepository.create(dto);
          // let nominee_result: any = await this.fintechService.create_related_parties(onboarding.fp_investor_id, res);
          // console.log("nominee Result", nominee_result)

          // if (nominee_result.status != 200) {
          //     console.log("ERROR: Nominee not updated");
          //     return nominee_result;
          // } else {
          //     res.fp_id = nominee_result.data.id
          res.user_id = user_id;
          res.user_onboarding_detail_id = onboarding.id;
          console.log('Res fp id 2', res);
          res = await this.userNomineeDetailsRepository.save(res);
          console.log('Nominee Result 2', res);
          // }
        }
      }

      return { status: HttpStatus.OK, message: 'Saved Successfully' };
    } catch (err) {
      console.log('Err', err);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Something went wrong ' + err.message,
      };
    }
  }

  async delete(id: number) {
    try {
      const delete_nominee = await this.userNomineeDetailsRepository.findOne({
        where: { id },
      });
      console.log('Delete Nominee', delete_nominee);
      if (!delete_nominee) {
        return { status: HttpStatus.NOT_FOUND, message: 'Nominee not found' };
      }
      const nominee_list = await this.userNomineeDetailsRepository.find({
        where: { user_id: delete_nominee.user_id },
      });
      console.log('Nominee List', nominee_list);
      const filteredNomineeList = nominee_list.filter(
        (nom) => Number(nom.id) !== Number(id),
      );
      console.log('Filtered Nominee List', filteredNomineeList);
      // Check if this is the last nominee
      if (filteredNomineeList.length === 0) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message:
            'Cannot delete the last nominee. At least one nominee is required.',
        };
      }
      const onboarding = await this.userOnboardingDetailsRepository.findOne({
        where: { user_id: delete_nominee.user_id },
      });
      console.log('Onboarding', onboarding);
      // Calculate total allocation to redistribute
      const allocationToRedistribute = Math.round(
        delete_nominee.allocation_percentage,
      );
      // Calculate base share for each remaining nominee
      const baseShare = Math.floor(
        allocationToRedistribute / filteredNomineeList.length,
      );
      const remainder = allocationToRedistribute % filteredNomineeList.length;
      console.log(
        `Redistribution - Total: ${allocationToRedistribute}%, Base: ${baseShare}%, Remainder: ${remainder}%`,
      );
      // Store original allocations for rollback
      const originalAllocations = filteredNomineeList.map((nom) => ({
        id: nom.id,
        allocation_percentage: nom.allocation_percentage,
      }));
      // Update allocation percentages
      const savedNominees: any[] = [];
      for (let i = 0; i < filteredNomineeList.length; i++) {
        const nom = filteredNomineeList[i];
        // First 'remainder' nominees get (baseShare + 1), others get baseShare
        const additionalShare = i < remainder ? baseShare + 1 : baseShare;
        nom.allocation_percentage = Math.round(
          nom.allocation_percentage + additionalShare,
        );
        console.log(
          `Nominee ${i + 1} (ID: ${
            nom.id
          }) gets additional ${additionalShare}%, new total: ${
            nom.allocation_percentage
          }%`,
        );
        const savedNom = await this.userNomineeDetailsRepository.save(nom);
        savedNominees.push(savedNom);
      }
      // Verify total is exactly 100%
      const newTotal = savedNominees.reduce(
        (sum, nom) => sum + nom.allocation_percentage,
        0,
      );
      console.log(`Final total allocation: ${newTotal}%`);
      if (newTotal !== 100) {
        console.warn(
          `Warning: Allocation total is ${newTotal}% after redistribution`,
        );
      }
      // Build BSE nominee DTO
      const nomineeDto = new UpdateBseNomineeUccDto();
      nomineeDto.ClientCode = onboarding.fp_investor_id;
      nomineeDto.NominationOpt = 'Y';
      nomineeDto.NominationAuthMode = 'O';
      nomineeDto.Nom_SOA = 'Y';
      // Clear all nominee fields first
      for (let i = 1; i <= 3; i++) {
        nomineeDto[`Nom${i}_Name`] = '';
        nomineeDto[`Nom${i}_Relationship`] = '';
        nomineeDto[`Nom${i}_Appl_Percent`] = '';
        nomineeDto[`Nom${i}_MinorFlag`] = '';
        nomineeDto[`Nom${i}_Dob`] = '';
        nomineeDto[`Nom${i}_Guardian`] = '';
        nomineeDto[`Nom${i}_GuardianPAN`] = '';
        nomineeDto[`Nom${i}_IdType`] = '';
        nomineeDto[`Nom${i}_IdNo`] = '';
        nomineeDto[`Nom${i}_Email`] = '';
        nomineeDto[`Nom${i}_MobileNo`] = '';
        nomineeDto[`Nom${i}_Add1`] = '';
        nomineeDto[`Nom${i}_Add2`] = '';
        nomineeDto[`Nom${i}_Add3`] = '';
        nomineeDto[`Nom${i}_City`] = '';
        nomineeDto[`Nom${i}_Pincode`] = '';
        nomineeDto[`Nom${i}_Country`] = '';
      }
      // Populate nominee data (max 3 nominees)
      for (const [index, nominee] of savedNominees.entries()) {
        if (index >= 3) break;
        const relationcode =
          await this.bseV1NomineeRelationshipCodeRepository.findOne({
            where: { value: nominee.relationship.toUpperCase() },
          });
        const nomineeIndex = index + 1;
        const identityProofTypeMap: Record<string, string> = {
          pan: '1',
          aadhar_number: '2',
          adhaar: '2',
          driving_licence_number: '3',
        };
        const proofTypeKey = nominee.identity_proof_type?.toLowerCase() || '';
        const mappedProofType = identityProofTypeMap[proofTypeKey];
        const idNumber =
          proofTypeKey === 'pan'
            ? nominee.pan
            : proofTypeKey === 'aadhar_number' || proofTypeKey === 'adhaar'
            ? nominee.aadhaar_number
            : proofTypeKey === 'driving_licence_number'
            ? nominee.driving_licence_number
            : '';
        nomineeDto[`Nom${nomineeIndex}_Name`] = nominee.name || '';
        nomineeDto[`Nom${nomineeIndex}_Relationship`] =
          relationcode?.code || '';
        nomineeDto[`Nom${nomineeIndex}_Appl_Percent`] = Math.round(
          nominee.allocation_percentage,
        ).toString();
        nomineeDto[`Nom${nomineeIndex}_MinorFlag`] = nominee.guardian_name
          ? 'Y'
          : 'N';
        nomineeDto[`Nom${nomineeIndex}_Dob`] = nominee.guardian_name
          ? formatToDateString(nominee.date_of_birth)
          : '';
        nomineeDto[`Nom${nomineeIndex}_Guardian`] = nominee.guardian_name || '';
        nomineeDto[`Nom${nomineeIndex}_GuardianPAN`] =
          nominee.guardian_pan || '';
        nomineeDto[`Nom${nomineeIndex}_Email`] = nominee.email_address || '';
        nomineeDto[`Nom${nomineeIndex}_MobileNo`] = nominee.phone_number || '';
        nomineeDto[`Nom${nomineeIndex}_Add1`] = nominee.address_line_1 || '';
        nomineeDto[`Nom${nomineeIndex}_Add2`] = nominee.address_line_2 || '';
        nomineeDto[`Nom${nomineeIndex}_Add3`] = nominee.address_line_3 || '';
        nomineeDto[`Nom${nomineeIndex}_City`] = nominee.address_city || '';
        nomineeDto[`Nom${nomineeIndex}_Pincode`] =
          nominee.address_postal_code || '';
        nomineeDto[`Nom${nomineeIndex}_Country`] =
          nominee.address_country || 'IN';
        if (mappedProofType && idNumber) {
          nomineeDto[`Nom${nomineeIndex}_IdType`] = mappedProofType;
          nomineeDto[`Nom${nomineeIndex}_IdNo`] = idNumber;
        }
      }
      // Handle special fields for BSE
      if (savedNominees.length >= 1) {
        nomineeDto.Nom1_App_Percent = Math.round(
          savedNominees[0].allocation_percentage,
        ).toString();
      }
      if (savedNominees.length >= 2) {
        nomineeDto['Nom2_App_Percent'] = Math.round(
          savedNominees[1].allocation_percentage,
        ).toString();
      }
      if (savedNominees.length >= 3) {
        nomineeDto['Nom3_App_Percent'] = Math.round(
          savedNominees[2].allocation_percentage,
        ).toString();
      }
      console.log('BSE Nominee DTO:', JSON.stringify(nomineeDto, null, 2));
      // Call BSE API to update nominees
      const nominee_update = await this.bseV1Service.update_nominee(nomineeDto);
      console.log('BSE Nominee Updated data', nominee_update);
      // Check if BSE API call was successful
      if (
        nominee_update.status !== 200 ||
        nominee_update.data.StatusCode !== '100'
      ) {
        // Rollback the allocation percentage changes
        console.log('BSE API failed, rolling back allocation changes...');
        for (const original of originalAllocations) {
          const nominee = await this.userNomineeDetailsRepository.findOne({
            where: { id: original.id },
          });
          if (nominee) {
            nominee.allocation_percentage = original.allocation_percentage;
            await this.userNomineeDetailsRepository.save(nominee);
            console.log(
              `Rolled back nominee ${original.id} to ${original.allocation_percentage}%`,
            );
          }
        }
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Failed to update nominees in BSE system',
          error: nominee_update.data.Remarks || 'BSE API error',
          details: nominee_update.data.ErrorMessage || [],
        };
      }
      // Only delete from database if BSE API call was successful
      await this.userNomineeDetailsRepository.delete({ id });
      return {
        status: HttpStatus.OK,
        message: 'Nominee deleted successfully and allocations redistributed',
        data: {
          deleted_nominee_id: id,
          updated_nominees: savedNominees.map((nom) => ({
            id: nom.id,
            name: nom.name,
            allocation_percentage: nom.allocation_percentage,
          })),
          total_allocation: newTotal,
        },
      };
    } catch (err) {
      console.log('Error in delete nominee:', err);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Something went wrong: ' + err.message,
      };
    }
  }
}

// function formatToDateString(date: Date): string {
//     if (!date) return '';
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
// }

function formatToDateString(
  dateInput: Date | string | null | undefined,
): string {
  if (!dateInput) return '';

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return ''; // Invalid date

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
