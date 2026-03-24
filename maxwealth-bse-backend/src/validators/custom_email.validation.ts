import {
  Inject,
  Injectable,
  Scope,
  Headers,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource, Repository } from 'typeorm';
import { Users } from '../users/entities/users.entity';
import { UsersRepository } from 'src/repositories/user.repository';

@ValidatorConstraint({ name: 'email', async: true })
@Injectable()
export class CustomEmailvalidation implements ValidatorConstraintInterface {
  constructor(private readonly usersRepository: UsersRepository) {
    console.log('helllo');
  }

  async validate(value: string): Promise<boolean> {
    console.log('this.usersRepository', this.usersRepository);

    const user = await this.usersRepository.findOne({
      where: { email: value },
    });

    if (user) {
      throw new UnprocessableEntityException('Email already exists');
    } else {
      return true;
    }
  }
}

export function isEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CustomEmailvalidation,
    });
  };
}
