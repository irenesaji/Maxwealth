import { MemDetailsDTO } from './mem_details.sdto';

export class InfoDto {
  mem_details: {
    euin: string;
    euin_flag: boolean;
    sub_br_code: string;
    sub_br_arn: string;
    partner_id: string;
  };
}
