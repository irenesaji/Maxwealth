export class CreateTransactionBasketItemDTO {
  transaction_basket_id: number;
  transaction_type: string;
  fund_isin: string;
  folio_number: string | null;
  frequency: string;
  installment_day: number;
  number_of_installments: number;
  amount: number;
  units: number;
  to_fund_isin: string | null;
  status: string;
  user_id: number;
  response_message: string;
  generate_first_installment_now: boolean;
  payment_method: string;
  payment_source: string;
  is_payment: boolean; // to simply create an SIP without first payment and skipped used in smart sip
  is_instant_redemption: boolean;
  constructor() {
    this.is_payment = true; // Set the default value in the constructor
    this.is_instant_redemption = false;
  }
}
