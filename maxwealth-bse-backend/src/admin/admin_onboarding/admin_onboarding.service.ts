import { HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { Repository } from 'typeorm';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { UsersService } from 'src/users/users.service';
import moment from 'moment';
import { UsersRepository } from 'src/repositories/user.repository';
import { data } from 'cheerio/dist/commonjs/api/attributes';

@Injectable({ scope: Scope.REQUEST })
export class AdminOnboardingService extends TypeOrmCrudService<UserOnboardingDetails> {
  // constructor(@InjectRepository(UserOnboardingDetails) repo) {
  //   super(repo);
  //  }
  constructor(
    @Inject('CONNECTION') dataSource,
    private userOnboardingDetailsRepository: UserOnboardingDetailsRepository,
    private usersRepository: UsersRepository,
    private readonly usersService: UsersService,
  ) {
    const userOnboardingDetailsRepo = new Repository<UserOnboardingDetails>(
      UserOnboardingDetails,
      dataSource.createEntityManager(),
    );
    super(userOnboardingDetailsRepo);
  }

  async get_users(page?: number, limit?: number) {
    try {
      let onboarding = [];
      let total = 0;

      if (page && limit) {
        const skip = (page - 1) * limit;
        const [data, count] =
          await this.userOnboardingDetailsRepository.findAndCount({
            skip: skip,
            take: limit,
          });
        onboarding = data;
        total = count;
      } else {
        onboarding = await this.userOnboardingDetailsRepository.find();
        total = onboarding.length;
      }

      const res = onboarding.map((onboard) => {
        delete onboard.signature_buffer;
        delete onboard.pdf_buffers;
        delete onboard.aadhar_xml;
        delete onboard.cheque_buffer;
        delete onboard.pan_buffer;
        delete onboard.address_proof_buffer;
        delete onboard.photo_buffer;
        delete onboard.esign_html;
        return onboard;
      });

      const response: any = {
        status: HttpStatus.OK,
        data: res,
      };

      if (page && limit) {
        response.meta = {
          total: total,
          page: page,
          limit: limit,
          pages: Math.ceil(total / limit),
        };
      }

      return response;
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async add_signature(
    user_onboarding_detail_id: number,
    signature: Express.Multer.File,
  ) {
    try {
      const onboarding = await this.userOnboardingDetailsRepository.findOneBy({
        id: user_onboarding_detail_id,
      });

      if (onboarding) {
        const userData = await this.usersService.findOneById(
          onboarding.user_id,
        );
        const user = userData.user;

        if (signature && signature.path) {
          //     let result = await this.fintechService.fileToUpload(cwd() + "/" + signature.path);
          //     if (result.status == HttpStatus.OK) {
          onboarding.signature_url = signature.path;
          // onboarding.fp_signature_file_id = result.data.id;
          onboarding.status = 'signature';

          //     } else {
          //         return result;
          //     }
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Signature not uploaded',
          };
        }

        // if (!onboarding.is_kyc_compliant) {
        // if (onboarding.kyc_id) {
        //     let result = await this.fintechService.update_signature_kyc(onboarding);

        //     if (result.status == 200) {
        //         let temp_onboarding = await this.userOnboardingDetailsRepository.findOneBy({ user_id: user.id });
        //         onboarding.kyc_id = temp_onboarding.kyc_id;
        //         onboarding.fp_kyc_status = temp_onboarding.fp_kyc_status;
        //         await this.userOnboardingDetailsRepository.save(onboarding);
        //         return { "status": HttpStatus.OK, "message": "Updated the details" };
        //     } else {
        //         return result;
        //     }
        // } else {
        //     return { "status": HttpStatus.BAD_REQUEST, "error": "Please check your KYC compliance and confirm your PAN detailsfirst" };
        // }
        // }
        await this.userOnboardingDetailsRepository.save(onboarding);
        return { status: HttpStatus.OK, message: 'Updated the details' };
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Please check your KYC compliance first',
        };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async search(query, status, startDate, endDate, page, limit) {
    try {
      let queryBuilder = this.userOnboardingDetailsRepository
        .createQueryBuilder('onboarding')
        .leftJoinAndSelect('onboarding.user', 'user')
        .leftJoinAndSelect('onboarding.user_nominee_details', 'nominee')
        .leftJoinAndSelect('onboarding.user_address_details', 'address')
        .leftJoinAndSelect('onboarding.user_bank_details', 'bank');

      // Apply search filters
      if (query) {
        queryBuilder.andWhere(
          '(LOWER(user.email) LIKE LOWER(:query) OR ' +
            'LOWER(user.full_name) LIKE LOWER(:query) OR ' +
            'LOWER(user.mobile) LIKE LOWER(:query) OR ' +
            'LOWER(onboarding.pan) LIKE LOWER(:query))',
          { query: `%${query}%` },
        );
      }

      if (status) {
        queryBuilder.andWhere('onboarding.status = :status', { status });
      }

      if (startDate && endDate) {
        queryBuilder.andWhere(
          'onboarding.createdAt BETWEEN :startDate AND :endDate',
          {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          },
        );
      }
      if (page != null && limit != null) {
        const skip = (page - 1) * limit;
        queryBuilder = queryBuilder.skip(skip).take(limit);
        console.log('skip:', skip, 'take:', limit);
      }

      const [items, total] = await queryBuilder.getManyAndCount();

      return {
        status: HttpStatus.OK,
        message: 'Search completed successfully',
        data: items,
        total,
      };
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Search failed',
        error: error.message,
      };
    }
  }

  async search_user(query, page, limit) {
    try {
      let queryBuilder = this.usersRepository.createQueryBuilder('users');
      // Apply search filters
      if (query) {
        queryBuilder.andWhere(
          '(LOWER(users.email) LIKE LOWER(:query) OR ' +
            'LOWER(users.full_name) LIKE LOWER(:query) OR ' +
            'LOWER(users.mobile) LIKE LOWER(:query))',
          { query: `%${query}%` },
        );
      }
      if (page != null && limit != null) {
        const skip = (page - 1) * limit;
        queryBuilder = queryBuilder.skip(skip).take(limit);
        console.log('skip:', skip, 'take:', limit);
      }

      const [items, total] = await queryBuilder.getManyAndCount();

      return {
        status: HttpStatus.OK,
        message: 'Search completed successfully',
        data: items,
        total,
      };
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Search failed',
        error: error.message,
      };
    }
  }

  async get_total_investors(filter: string, year?: number) {
    try {
      console.log('Filter', filter);

      if (filter == 'yearly') {
        const selectedYear = year ? year : new Date().getFullYear();
        console.log('Selected Year', selectedYear);
        const monthsData = [];
        for (let month = 1; month <= 12; month++) {
          const startOfMonth = moment(`${selectedYear}-${month}-01`)
            .startOf('month')
            .toDate();
          const endOfMonth = moment(startOfMonth).endOf('month').toDate();

          console.log(
            'Start of Month',
            startOfMonth,
            'End of Month',
            endOfMonth,
          );
          const queryBuilder = await this.userOnboardingDetailsRepository
            .createQueryBuilder('onboarding')
            .select('COUNT(onboarding.id)', 'total_investors')
            .where('onboarding.created_at BETWEEN :start AND :end', {
              start: startOfMonth,
              end: endOfMonth,
            });

          const { total_investors } = await queryBuilder.getRawOne();

          monthsData.push({
            month: month,
            total_investors: parseInt(total_investors, 10),
          });
        }
        return {
          status: HttpStatus.OK,
          year: selectedYear,
          monthsData,
        };
      }
    } catch (err) {
      console.log('Error in get_total_users', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }
}
