import { GuardianDto } from './guardian.dto';
import { IdentitfierDto } from './identifier.dto';
import { PersonDto } from './person.dto';

export class NominationDto {
  person: PersonDto;
  nomination_percentage: string;
  nomination_relation: string;
  is_pan_exempt: boolean;
  pan_exempt_category: string;
  is_minor: boolean;
  identifier: IdentitfierDto[];
  guardian: GuardianDto;
}
