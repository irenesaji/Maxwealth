import { GuardianDto } from './guardian.dto';
import { IdentifierDto } from './identifier.dto';

export class RegisterSxpNomineeDto {
  first_name: string;
  middle_name: string;
  last_name: string;
  dob: Date;
  nomination_percent: number;
  nomination_relation: number;
  is_pan_exempt: boolean;
  pan_exempt_category: string;
  is_minor: boolean;
  identifier: IdentifierDto[];
  guardian: GuardianDto[];
}
