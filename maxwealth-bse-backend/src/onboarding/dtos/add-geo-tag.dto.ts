import { IsNotEmpty } from 'class-validator';

export class AddGeoTagDto {
  @IsNotEmpty()
  lat: number;

  @IsNotEmpty()
  lng: number;
}
