import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { JwtAuthGuard } from '../src/auth/guard/jwt-auth.guard';

describe('Auth flow (e2e)', () => {
  let app: INestApplication;

  const authServiceMock = {
    verify_mobile: jest.fn(),
    generate_email_otp: jest.fn(),
    verify_admin_otp: jest.fn(),
    verify_email: jest.fn(),
    mpin_login: jest.fn(),
    verify_google: jest.fn(),
    verify_apple: jest.fn(),
    generate_otp: jest.fn(),
    verify_otp: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    authServiceMock.generate_otp.mockResolvedValue({ status: 200 });
    authServiceMock.generate_email_otp.mockResolvedValue({ status: 200 });
    authServiceMock.verify_mobile.mockResolvedValue({ status: 200, access_token: 'mock-mobile-token' });
    authServiceMock.verify_email.mockResolvedValue({ status: 200, message: 'Email verified' });
    authServiceMock.mpin_login.mockResolvedValue({ status: 200, access_token: 'mock-mpin-token' });
    authServiceMock.verify_google.mockResolvedValue({ status: 200, access_token: 'mock-google-token' });
    authServiceMock.verify_apple.mockResolvedValue({ status: 200, access_token: 'mock-apple-token' });
    authServiceMock.verify_otp.mockImplementation(async (dto) => {
      if (dto.mobile === '7306100556' && Number(dto.otp) === 1111) {
        return {
          status: 200,
          id: 1,
          role: 'Admin',
          access_token: 'mock-admin-token',
        };
      }

      return { status: 400, error: 'Invalid OTP' };
    });

    authServiceMock.verify_admin_otp.mockImplementation(async (dto) => {
      if (dto.mobile === '7306100556' && Number(dto.otp) === 1111) {
        return {
          status: 200,
          id: 1,
          role: 'Admin',
          access_token: 'mock-admin-token',
        };
      }

      return { status: 400, error: 'User is not registered as Admin' };
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /api/auth/generate_otp should return 200', () => {
    return request(app.getHttpServer())
      .post('/api/auth/generate_otp')
      .set('tenant_id', 'maxwealth')
      .send({ mobile: '7306100556' })
      .expect(200)
      .expect({ status: 200 });
  });

  it('POST /api/auth/generate_email_otp should return 200', () => {
    return request(app.getHttpServer())
      .post('/api/auth/generate_email_otp')
      .send({ email: 'u@test.com' })
      .expect(200)
      .expect({ status: 200 });
  });

  it('POST /api/auth/verify_otp should return token for valid OTP', () => {
    return request(app.getHttpServer())
      .post('/api/auth/verify_otp')
      .send({ mobile: '7306100556', otp: 1111 })
      .expect(200)
      .expect((res) => {
        expect(res.body.access_token).toBe('mock-admin-token');
        expect(res.body.role).toBe('Admin');
      });
  });

  it('POST /api/auth/verify_otp should return 400 for invalid OTP', () => {
    return request(app.getHttpServer())
      .post('/api/auth/verify_otp')
      .send({ mobile: '7306100556', otp: 9999 })
      .expect(400)
      .expect({ status: 400, error: 'Invalid OTP' });
  });

  it('POST /api/auth/admin/verify_otp should return token for admin user', () => {
    return request(app.getHttpServer())
      .post('/api/auth/admin/verify_otp')
      .send({ mobile: '7306100556', otp: 1111 })
      .expect(200)
      .expect((res) => {
        expect(res.body.access_token).toBe('mock-admin-token');
        expect(res.body.role).toBe('Admin');
      });
  });

  it('POST /api/auth/admin/verify_otp should return 400 for non-admin case', () => {
    return request(app.getHttpServer())
      .post('/api/auth/admin/verify_otp')
      .send({ mobile: '7306100556', otp: 9999 })
      .expect(400)
      .expect({ status: 400, error: 'User is not registered as Admin' });
  });

  it('POST /api/auth/verifymobile should return token for valid mobile verification', () => {
    return request(app.getHttpServer())
      .post('/api/auth/verifymobile')
      .send({ user_id: 1, otp: 1111, fcmToken: 'fcm-1' })
      .expect(200)
      .expect({ status: 200, access_token: 'mock-mobile-token' });
  });

  it('POST /api/auth/verify_email should return email verified message', () => {
    return request(app.getHttpServer())
      .post('/api/auth/verify_email')
      .send({ user_id: 1, otp: 2222 })
      .expect(200)
      .expect({ status: 200, message: 'Email verified' });
  });

  it('POST /api/auth/mpin_login should return token', () => {
    return request(app.getHttpServer())
      .post('/api/auth/mpin_login')
      .set('user', JSON.stringify({ id: 1 }))
      .send({ mpin: '1234' })
      .expect(200)
      .expect({ status: 200, access_token: 'mock-mpin-token' });
  });

  it('POST /api/auth/verify_google should return token', () => {
    return request(app.getHttpServer())
      .post('/api/auth/verify_google')
      .set('tenant_id', 'maxwealth')
      .send({ token: 'google-token', email: 'u@test.com', fcmToken: 'fcm-1' })
      .expect(200)
      .expect({ status: 200, access_token: 'mock-google-token' });
  });

  it('POST /api/auth/verify_apple should return token', () => {
    return request(app.getHttpServer())
      .post('/api/auth/verify_apple')
      .set('tenant_id', 'maxwealth')
      .send({ token: 'apple-token', email: 'u@test.com', fcmToken: 'fcm-1' })
      .expect(200)
      .expect({ status: 200, access_token: 'mock-apple-token' });
  });

  it('GET /api/auth/user should return user from headers', () => {
    const userHeader = JSON.stringify({ id: 1, role: 'Admin' });

    return request(app.getHttpServer())
      .get('/api/auth/user')
      .set('user', userHeader)
      .expect(200)
      .expect({ status: 200, data: userHeader });
  });
});
