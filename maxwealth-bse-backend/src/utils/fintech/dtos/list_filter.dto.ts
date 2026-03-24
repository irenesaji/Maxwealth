import { IsArray, IsIn, IsString, ValidateIf } from 'class-validator';

export class ListFilterDto {
  @IsArray()
  // @IsIn([['pending', 'confirmed', 'submitted', 'successful', 'failed', 'cancelled', 'refunded' , 'reversed']])
  @ValidateIf((object, value) => Array.isArray(value) && value.length > 0)
  states: string[];

  @IsArray()
  @IsString({ each: true })
  @ValidateIf((object, value) => Array.isArray(value) && value.length > 0)
  plans: string[];

  @IsArray()
  @IsString({ each: true })
  @ValidateIf((object, value) => Array.isArray(value) && value.length > 0)
  ids: string[];
}
