import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  Length,
  Max,
  Validate,
} from 'class-validator';
import { Equal } from 'typeorm';
import { Users } from '../entities/users.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';

// @Injectable()
export class CreateUserDto {
  @IsNotEmpty()
  full_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(10)
  mobile: string;

  country_code: string;

  is_lead: boolean;

  fcmToken: string;
}
