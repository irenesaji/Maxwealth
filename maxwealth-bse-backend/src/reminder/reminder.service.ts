import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';

@Injectable()
export class ReminderService {
  constructor(private readonly onboarding: UserOnboardingDetailsRepository) {}
  private readonly logger = new Logger(ReminderService.name);

  @Cron(`45 * * * * *`)
  handleKyc() {}
}
