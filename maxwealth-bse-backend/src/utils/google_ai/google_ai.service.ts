import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { GoogleAiInputDTO } from './dtos/google_ai_input.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleAiService {
  google_llm_key: string;
  constructor(private readonly httpService: HttpService) {
    const configService = new ConfigService();
    this.google_llm_key = configService.get('GOOGLE_LLM_KEY');
  }

  async llm_execute(google_ai_input: GoogleAiInputDTO) {
    try {
      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
      };

      const bodyRequest = {
        contents: [{ parts: [{ text: google_ai_input.query }] }],
      };
      const response = this.httpService
        .post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' +
            this.google_llm_key,
          bodyRequest,
          { headers: headersRequest },
        )
        .pipe(
          map((resp) => {
            return resp.data;
          }),
        )
        .pipe(
          catchError((e) => {
            console.log(e.response);
            // console.log(e.response.data.error.errors.join(","));

            throw new ForbiddenException('FP API not available,' + e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log(result);
      return { status: HttpStatus.OK, data: result };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Sorry something went wrong, ' + e.message,
      };
    }
  }
}
