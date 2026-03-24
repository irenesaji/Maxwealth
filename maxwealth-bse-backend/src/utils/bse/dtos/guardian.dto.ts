import { IdentitfierDto } from './identifier.dto';

export class GuardianDto {
  first_name: string;
  middle_name: string;
  last_name: string;
  dob: string;
  is_pan_exempt: boolean;
  identifier: IdentitfierDto[];
}
