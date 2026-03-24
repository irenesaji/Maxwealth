import { IsNotEmpty } from 'class-validator';

export class AddPersonalDetailsDto {
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  father_name: string;

  @IsNotEmpty()
  mother_name: string;

  @IsNotEmpty()
  marital_status: string;

  @IsNotEmpty()
  gender: string;
}
