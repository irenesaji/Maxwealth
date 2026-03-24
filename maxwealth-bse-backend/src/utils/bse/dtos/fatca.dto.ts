import { IdentitfierDto } from './identifier.dto';
import { TaxResidencyDto } from './tax_residency.dto';

export class FatcaDto {
  HolderRank: string;
  place_of_birth: string;
  country_of_birth: string;
  client_name: string;
  investor_type: string;
  dob: string;
  father_name: string;
  spouse_name: string;
  address_type: string;
  occ_code: string;
  occ_type: string;
  tax_status: string;
  exemption_code: string;
  identifier: IdentitfierDto;
  corporate_service_sector: string;
  wealth_source: string;
  income_slab: string;
  net_worth: number;
  date_of_net_worth: string;
  politically_exposed: string;
  is_self_declared: boolean;
  data_source: string;
  tax_residency: TaxResidencyDto[];
}
