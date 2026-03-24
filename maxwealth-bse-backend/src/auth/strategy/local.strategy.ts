import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'mobile',
      passwordField: 'otp',
    });
  }

  async validate(mobile: string, otp: number): Promise<any> {
    const user = await this.authService.validateUser(mobile, otp);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
