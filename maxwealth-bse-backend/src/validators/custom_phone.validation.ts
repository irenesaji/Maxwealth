import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/users.entity';

export function isPhoneUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CustomPhonevalidation,
    });
  };
}

@ValidatorConstraint({ name: 'mobile', async: true })
@Injectable()
export class CustomPhonevalidation implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async validate(value: string): Promise<boolean> {
    return this.usersRepository
      .findOne({ where: { mobile: value } })
      .then((user) => {
        if (user) {
          throw new UnprocessableEntityException('Mobile already exists');
        } else {
          return true;
        }
      });
  }
}
