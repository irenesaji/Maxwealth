import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { UsersRepository } from 'src/repositories/user.repository';

import { Users } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from '../dtos/user-response.dto';
import moment, { months } from 'moment';
import { start } from 'repl';

@Injectable({ scope: Scope.REQUEST })
export class UsersService extends TypeOrmCrudService<Users> {
  private usersRepository: Repository<Users>;
  constructor(@Inject('CONNECTION') dataSource) {
    const usersRepo = new Repository<Users>(
      Users,
      dataSource.createEntityManager(),
    );

    super(usersRepo);
    this.usersRepository = usersRepo;
  }
  // Override createOneBase to handle duplicate entry error
  async createOne(dto: any): Promise<Users> {
    try {
      // Attempt to save the new user to the database
      return await this.usersRepository.save(dto);
    } catch (error) {
      // Check for duplicate entry error
      if (error.code === 'ER_DUP_ENTRY') {
        // Throw a conflict exception with a custom message
        throw new ConflictException(
          `User with mobile number / email already exists.`,
        );
      }
      // Re-throw any other errors for further handling
      throw error;
    }
  }

  async findUsers(
    email,
    countryCode,
    sortBy,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    page: number,
    limit: number,
    isActive,
    isBlocked,
  ) {
    // Destructure query parameters with defaults

    // Create query builder for users
    let queryBuilder = this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect(
        'users.user_onboarding_details',
        'user_onboarding_details',
      )
      .select([
        'users.id',
        'users.email',
        'users.full_name',
        'users.country_code',
        'users.mobile',
        'users.mobile_verified',
        'users.is_active',
        'users.is_blocked',
        'user_onboarding_details.pan',
      ]);

    // Apply optional filters
    if (email) {
      queryBuilder.andWhere('users.email LIKE :email', { email: `%${email}%` });
    }

    if (countryCode) {
      queryBuilder.andWhere('users.country_code = :countryCode', {
        countryCode,
      });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('users.is_active = :isActive', { isActive });
    }

    if (isBlocked !== undefined) {
      queryBuilder.andWhere('users.is_blocked = :isBlocked', { isBlocked });
    }

    // Apply sorting
    if (sortBy) {
      queryBuilder.orderBy(`users.${sortBy}`, sortOrder);
    }
    // queryBuilder.orderBy('users.id', 'DESC');

    if (page != null && limit != null) {
      const skip = (page - 1) * limit;
      queryBuilder = queryBuilder.skip(skip).take(limit);
      console.log('skip:', skip, 'take:', limit);
    }

    // Execute query and get results
    const [users, total] = await queryBuilder.getManyAndCount();
    console.log('users', users);

    // Transform results to response DTO
    const transformedUsers: UserResponseDto[] = users.map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      countryCode: user.country_code,
      mobile: user.mobile,
      mobileVerified: user.mobile_verified,
      isActive: user.is_active,
      isBlocked: user.is_blocked,
      pan: user.user_onboarding_details?.pan
        ? user.user_onboarding_details.pan
        : null,
    }));

    return {
      users: transformedUsers,
      total,
      page,
      limit,
    };
  }

  async get_total_users(filter: string, year?: number) {
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
          const queryBuilder = await this.usersRepository
            .createQueryBuilder('users')
            .select('COUNT(users.id)', 'total_users')
            .where('users.is_active = :isActive', { isActive: true })
            .andWhere('users.created_at BETWEEN :start AND :end', {
              start: startOfMonth,
              end: endOfMonth,
            });

          const { total_users } = await queryBuilder.getRawOne();

          monthsData.push({
            month: month,
            active_users: parseInt(total_users, 10),
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
