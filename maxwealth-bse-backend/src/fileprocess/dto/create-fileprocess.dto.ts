import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateFileprocessDto {
  @IsString()
  file_name: string;

  @IsBoolean()
  @IsOptional()
  is_processed?: boolean;
}
