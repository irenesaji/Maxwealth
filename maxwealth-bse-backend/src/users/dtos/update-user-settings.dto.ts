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
import { isEmailUnique } from '../../validators/custom_email.validation';
import { isPhoneUnique } from '../../validators/custom_phone.validation';

export class UpdateUserSettingsDto {
  @IsNotEmpty()
  is_daily_portfolio_updates: boolean;

  @IsNotEmpty()
  is_whatsapp_notifications: boolean;

  @IsNotEmpty()
  is_enable_biometrics: boolean;
}
