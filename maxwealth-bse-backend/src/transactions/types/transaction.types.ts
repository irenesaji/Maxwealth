export interface Scheme {
  isin: string;
  investment_account_id: string;
  invested_amount: number;
  current_value: number;
  units: number;
  unrealized_gain: number;
}

export interface AggregatedScheme {
  user: {
    id: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
  };
  investment_account_id: string;
  invested_amount: number;
  current_value: number;
  units: number;
  unrealized_gain: number;
}

export interface ISINLookupResult {
  schemeName: string;
  isin: string | null;
}
