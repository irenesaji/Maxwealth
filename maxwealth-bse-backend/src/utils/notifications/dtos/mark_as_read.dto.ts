import { IsNotEmpty } from 'class-validator';

export class MarkAsReadDto {
  @IsNotEmpty()
  notification_id: number;
}
