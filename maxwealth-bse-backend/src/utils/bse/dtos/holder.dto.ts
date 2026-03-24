import { ContactDto } from './contact.dto';
import { IdentitfierDto } from './identifier.dto';
import { NominationDto } from './nomination.dto';
import { PersonDto } from './person.dto';

export class HolderDto {
  holder_rank: string;
  occ_code: string;
  auth_mode: string;
  is_pan_exempt: boolean;
  pan_exempt_category: string;
  identifier: IdentitfierDto[];
  kyc_type: string;
  ckyc_number: string;
  person: PersonDto;
  contact: ContactDto[];
  nomination: NominationDto[];
}
