import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyMobileDto } from './dtos/verify-mobile.dto';
import { Response } from 'express';
import { GenerateOtpDto } from './dtos/generate-otp.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { MpinDto } from 'src/users/dtos/mpin.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { GenerateEmailOtpDto } from './dtos/generate-email-otp.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/verifymobile')
  async verifyMobile(
    @Body() verifyMobileDto: VerifyMobileDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.verify_mobile(verifyMobileDto);
    return res.status(result.status).json(result);
  }

  @Post('/generate_otp')
  async generate_otp(
    @Headers() header,
    @Body() generateOtpDto: GenerateOtpDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.generate_otp(
      header.tenant_id,
      generateOtpDto,
    );
    return res.status(result.status).json(result);
  }

  @Post('/generate_email_otp')
  async generate_email_otp(
    @Body() generateOtpDto: GenerateEmailOtpDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.generate_email_otp(generateOtpDto);
    return res.status(result.status).json(result);
  }

  @Post('/verify_otp')
  async verify_otp(@Body() verifyOtpDto: VerifyOtpDto, @Res() res: Response) {
    console.log('verify_otp', verifyOtpDto);
    const result = await this.authService.verify_otp(verifyOtpDto);
    return res.status(result.status).json(result);
  }

  @Post('admin/verify_otp')
  async verify_admin_otp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.verify_admin_otp(verifyOtpDto);
    return res.status(result.status).json(result);
  }

  @Post('/verify_email')
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.verify_email(verifyEmailDto);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/mpin_login')
  async mpin_login(
    @Body() mpinDto: MpinDto,
    @Headers() headers,
    @Res() res: Response,
  ) {
    const result = await this.authService.mpin_login(mpinDto, headers.user.id);
    return res.status(result.status).json(result);
  }

  @Post('/verify_google')
  async verify_google(
    @Body() google_token_obj,
    @Res() res: Response,
    @Headers() headers,
  ) {
    const result = await this.authService.verify_google(
      google_token_obj.token,
      google_token_obj.email,
      google_token_obj.fcmToken,
      headers,
    );
    return res.status(result.status).json(result);
  }

  @Post('/verify_apple')
  async verify_apple(
    @Body() apple_token_obj,
    @Res() res: Response,
    @Headers() headers,
  ) {
    const result = await this.authService.verify_apple(
      apple_token_obj.token,
      apple_token_obj.email,
      apple_token_obj.fcmToken,
      headers,
    );
    console.log('result', result);
    if (result.error) {
      return res.status(result.status).json(result);
    } else {
      return res.status(result.status).json(result);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async user(@Headers() headers, @Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: headers.user });
  }
}
