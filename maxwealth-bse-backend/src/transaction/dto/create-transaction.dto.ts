export class CreateTransactionDto {
  folio_number: string;

  isin: string;

  type?: string;

  amount?: number;

  units?: number;

  traded_on?: Date;

  traded_at?: number;

  order?: string;

  corporate_action?: string;

  related_transaction_id?: number;

  rta_order_reference?: string;

  rta_product_code?: string;

  rta_investment_option?: string;

  rta_scheme_name?: string;

  user_id?: number;

  rta?: string;
}
