export class FpSwpDTO {
  scheme: string;
  folio_number: string;
  amount: number;

  installment_day: number;
  frequency: string;
  step_up_amount: number;
  step_up_frequency: string;
  number_of_installments: number;

  user_ip: number;
  server_ip: number;
  mf_investment_account: string;
  consent: any;

  systematic: true;
  generate_first_installment_now: boolean;
  auto_generate_installments: boolean;

  fp_swp_id: string;
}
