// create-lead.dto.ts

import { IsEmail, IsString, IsPhoneNumber } from 'class-validator';

export class ContactDto {
  @IsEmail()
  Email: string;

  @IsString()
  First_Name: string;

  @IsString()
  Phone: string;

  Mobile: string;

  Home_Phone: string;

  @IsString()
  Last_Name: string;

  @IsString()
  Lead_Source: string;
}
