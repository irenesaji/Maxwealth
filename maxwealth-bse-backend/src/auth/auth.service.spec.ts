import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/utils/notifications/notifications.service';
import { EnablexService } from 'src/utils/enablex/enablex.service';
import { ConfigService } from '@nestjs/config';
import { BrevoService } from 'src/utils/brevo/brevo.service';
import { Users } from 'src/users/entities/users.entity';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';

describe('AuthService', () => {
  let service: AuthService;

  const usersService = {
    findOneByMobile: jest.fn(),
    findOneByEmail: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
  };

  const jwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  const notificationService = {
    sendOtp: jest.fn().mockReturnValue(true),
  };

  const enablexService = {
    hasEnablexSMS: jest.fn().mockResolvedValue(false),
    findOneSms: jest.fn(),
    sendSMS: jest.fn(),
  };

  const configService = {
    get: jest.fn().mockReturnValue('test-value'),
  };

  const brevoService = {
    hasEmail: jest.fn().mockResolvedValue(false),
    findOneEmail: jest.fn(),
    sendTemplateEmail: jest.fn(),
  };

  const userRepo = {};
  const userOnboardRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(Users), useValue: userRepo },
        {
          provide: getRepositoryToken(UserOnboardingDetails),
          useValue: userOnboardRepo,
        },
        { provide: HttpService, useValue: {} },
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: NotificationsService, useValue: notificationService },
        { provide: EnablexService, useValue: enablexService },
        { provide: ConfigService, useValue: configService },
        { provide: BrevoService, useValue: brevoService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('login should sign JWT with user payload', async () => {
    const result = await service.login({
      user: {
        id: 1,
        email: 'u@test.com',
        full_name: 'Test User',
        role: 'Admin',
      },
    });

    expect(jwtService.sign).toHaveBeenCalledWith({
      user: {
        id: 1,
        email: 'u@test.com',
        full_name: 'Test User',
        role: 'Admin',
      },
    });
    expect(result).toEqual({ access_token: 'mock-jwt-token' });
  });

  it('generate_otp should return OK for active user', async () => {
    const user = {
      id: 1,
      mobile: '7306100556',
      is_blocked: false,
      otp: 0,
    };
    usersService.findOneByMobile.mockResolvedValue({ status: 'success', user });
    usersService.update.mockResolvedValue({ status: 'success', user });

    const result = await service.generate_otp('maxwealth', {
      mobile: '7306100556',
      is_generate: true,
    } as any);

    expect(result).toEqual({ status: HttpStatus.OK });
    expect(usersService.update).toHaveBeenCalled();
  });

  it('verify_otp should return token for valid OTP', async () => {
    const user = {
      id: 1,
      otp: 1111,
      email: 'u@test.com',
      full_name: 'Test User',
      role: 'Admin',
      fcmToken: '',
    };
    usersService.findOneByMobile.mockResolvedValue({ status: 'success', user });
    usersService.update.mockResolvedValue({ status: 'success', user });

    const result = await service.verify_otp({
      mobile: '7306100556',
      otp: 1111,
      fcmToken: 'fcm-1',
    } as any);

    expect(result.status).toBe(HttpStatus.OK);
    expect((result as any).access_token).toBe('mock-jwt-token');
    expect(usersService.update).toHaveBeenCalled();
  });

  it('verify_admin_otp should reject non-admin user', async () => {
    usersService.findOneByMobile.mockResolvedValue({
      status: 'success',
      user: { role: 'User' },
    });

    const result = await service.verify_admin_otp({
      mobile: '7306100556',
      otp: 1111,
    } as any);

    expect(result).toEqual({
      status: HttpStatus.BAD_REQUEST,
      error: 'User is not registered as Admin',
    });
  });

  it('mpin_login should return error for invalid mpin', async () => {
    usersService.findOneById.mockResolvedValue({
      status: 'success',
      user: { mpin: '1234' },
    });

    const result = await service.mpin_login({ mpin: '9999' } as any, 1);

    expect(result).toEqual({
      status: HttpStatus.BAD_REQUEST,
      error: 'Invalid MPIN',
    });
  });

  it('verify_email should mark email as verified', async () => {
    const user = {
      id: 1,
      full_name: 'Test User',
      email: 'u@test.com',
      email_otp: 2222,
      is_email_verified: false,
    };

    usersService.findOneById.mockResolvedValue({ status: 'success', user });
    usersService.update.mockResolvedValue({ status: 'success', user });
    userOnboardRepo.findOne.mockResolvedValue(null);

    const result = await service.verify_email({
      user_id: 1,
      otp: 2222,
    } as any);

    expect(result).toEqual({
      status: HttpStatus.OK,
      message: 'Email verified',
    });
    expect(userOnboardRepo.save).toHaveBeenCalled();
  });
});
