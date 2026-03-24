import { HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { UserNomineeDetails } from 'src/onboarding/nominee/entities/user-nominee-details.entity';
import { Repository } from 'typeorm';
import { AddUserNomineeDetailsDto } from 'src/onboarding/nominee/dtos/add-user-nominee-details.dto';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { UsersService } from 'src/users/users.service';
import { UserNomineeDetailsRepository } from 'src/repositories/user_nominee_details.repository';

@Injectable({ scope: Scope.REQUEST })
export class AdminNomineeService extends TypeOrmCrudService<UserNomineeDetails> {
  // constructor(@InjectRepository(UserNomineeDetails) repo) {
  //   super(repo);
  // }
  constructor(
    @Inject('CONNECTION') dataSource,
    private userOnboardingDetailsRepository: UserOnboardingDetailsRepository,
    private userNomineeDetailsRepository: UserNomineeDetailsRepository,
    private readonly usersService: UsersService,
  ) {
    const UserNomineeDetailsRepo = new Repository<UserNomineeDetails>(
      UserNomineeDetails,
      dataSource.createEntityManager(),
    );
    super(UserNomineeDetailsRepo);
  }

  async add_user_nominee_details(
    addUserNomineeDetailsDtoArray: Array<AddUserNomineeDetailsDto>,
  ) {
    try {
      const userData = await this.usersService.findOneById(
        addUserNomineeDetailsDtoArray[0].user_id,
      );
      const user = userData.user;
      const nominee_relations = [];
      let nominee_relation_unique = true;

      const nominee_names = [];
      let nominee_name_unique = true;

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

            if (Number(addUserNomineeDetailsDto.allocation_percentage) <= 0) {
              is_percentage_zero = true;
            }
            allocation_total += Number(
              addUserNomineeDetailsDto.allocation_percentage,
            );

            delete addUserNomineeDetailsDto['user_id'];

            addUserNomineeDetailsDto['user'] = user;
            addUserNomineeDetailsDtoArray[index] = addUserNomineeDetailsDto;

            if (index === addUserNomineeDetailsDtoArray.length - 1) {
              console.log('resolving');
              resolve();
            }
          },
        );
      });

      const response = await promise.then(async () => {
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

          const onboarding =
            await this.userOnboardingDetailsRepository.findOneBy({
              user_id: user.id,
            });
          if (!onboarding) {
            return {
              status: HttpStatus.BAD_REQUEST,
              error: 'Please check your KYC compliance first',
            };
          }

          if (onboarding.fp_investor_id != null) {
            const nominees = await this.userNomineeDetailsRepository.findBy({
              user_id: user.id,
            });
            for (const nominee of nominees) {
              // let nominee_result  = await this.fintechService.create_related_parties(onboarding.fp_investor_id,nominee);
              // if(nominee_result.status != 200){
              //     console.log("ERROR: Nominee not created");
              //     return nominee_result;
              // }else{
              //     let fp_nominee =  nominee_result.data;
              // nominee.fp_id = fp_nominee.id;
              this.userNomineeDetailsRepository.save(nominee);
              // }
            }
          }

          onboarding.status = 'nominee';
          await this.userOnboardingDetailsRepository.save(onboarding);

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
}
