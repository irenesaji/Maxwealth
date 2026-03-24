import { MemDetailsDTO } from './mem_details.sdto';

export class OrderInfoDto {
  min_redeem_flag: boolean;
  src: string;
  reg_no: string;
  mem_details: MemDetailsDTO;
}
