import { IsNotEmpty } from 'class-validator';

export class DashboardOutputDto {
  mf_investment_account: number;

  user_id: number;

  invested_amount: number;

  current_value: number;

  unrealized_gain: number;

  absolute_return: number;

  cagr: number;

  xirr: number;

  day_change: number;

  day_change_percentage: number;

  total_returns: number;

  total_returns_percentage: number;
}
