import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  Length,
  Max,
  Validate,
} from 'class-validator';

export class MpinDto {
  @Length(4)
  @IsNotEmpty()
  mpin: string;
}
