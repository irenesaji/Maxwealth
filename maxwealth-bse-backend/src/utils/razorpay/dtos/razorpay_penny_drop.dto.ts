import { IsNotEmpty } from 'class-validator';
import { Users } from 'src/users/entities/users.entity';
export class RazorpayPennyDropDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  ifsc: string;

  @IsNotEmpty()
  account_number: string;

  user: Users;
}
