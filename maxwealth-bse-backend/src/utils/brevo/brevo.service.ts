import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailConfigurationRepository } from 'src/repositories/email_configuration.repository';

@Injectable()
export class BrevoService {
  private readonly brevoApiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly emailConfigurationRepo: EmailConfigurationRepository,
  ) {
    this.brevoApiKey = this.configService.get<string>('BREVO_API_KEY');
  }

  async sendTemplateEmail(
    sender,
    recipient,
    templateId: number,
    params: object,
  ): Promise<any> {
    const url = 'https://api.sendinblue.com/v3/smtp/email';
    const headers = {
      'api-key': this.brevoApiKey,
      'Content-Type': 'application/json',
    };
    console.log('sender', sender);
    const data: any = {
      sender: sender,
      to: [recipient],
      templateId: templateId,
    };

    // Add params only if it is not an empty object
    if (params && Object.keys(params).length > 0) {
      data.params = params;
    }
    console.log('dara', data);

    try {
      const response = await this.httpService
        .post(url, data, { headers })
        .toPromise();
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async hasEmail() {
    const enablex = await this.emailConfigurationRepo.find();
    if (enablex.length == 0) {
      return false;
    } else {
      const e = enablex.some((enable) => enable.provider === 'enablex');
      if (e) {
        return e;
      } else {
        return false;
      }
    }
  }

  async findOneEmail(provider: string) {
    return await this.emailConfigurationRepo.findOne({ where: { provider } });
  }
}
