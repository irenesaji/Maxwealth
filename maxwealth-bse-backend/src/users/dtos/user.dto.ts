import { use } from 'passport';
import { Users } from '../entities/users.entity';

export class UserDto {
  id: number;

  full_name: string;

  email: string;

  mobile: string;

  is_active: boolean;

  is_blocked: boolean;

  country_code: string;

  mobile_verified: boolean;

  is_email_verified: boolean;

  risk_profile_id: number;

  is_daily_portfolio_updates: boolean;

  is_whatsapp_notifications: boolean;

  is_enable_biometrics: boolean;

  user_code: string;

  referral_code: string;
  mpin: string;
  otp: number;

  created_at: Date;

  updated_at: Date;
}

export function toUserDTO(user: Users): UserDto {
  const userDTO = new UserDto();
  userDTO.id = user.id;
  userDTO.full_name = user.full_name;
  userDTO.email = user.email;
  userDTO.mobile = user.mobile;
  userDTO.is_active = user.is_active;
  userDTO.mobile_verified = user.mobile_verified;
  userDTO.is_email_verified = user.is_email_verified;
  userDTO.mpin = user.mpin;
  userDTO.otp = Math.floor(10000 + Math.random() * 90000);

  userDTO.is_blocked = user.is_blocked;

  userDTO.country_code = user.country_code;

  userDTO.risk_profile_id = user.risk_profile_id;

  userDTO.is_daily_portfolio_updates = user.is_daily_portfolio_updates;

  userDTO.is_whatsapp_notifications = user.is_whatsapp_notifications;

  userDTO.is_enable_biometrics = user.is_enable_biometrics;

  userDTO.created_at = user.created_at;

  userDTO.updated_at = user.updated_at;
  // map other fields as needed...

  return userDTO;
}
