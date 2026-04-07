import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const authService = {
    verify_mobile: jest.fn(),
    generate_otp: jest.fn(),
    generate_email_otp: jest.fn(),
    verify_otp: jest.fn(),
    verify_admin_otp: jest.fn(),
    verify_email: jest.fn(),
    mpin_login: jest.fn(),
    verify_google: jest.fn(),
    verify_apple: jest.fn(),
  };

  const makeRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('generate_otp should return service status and body', async () => {
    authService.generate_otp.mockResolvedValue({ status: 200, ok: true });
    const res = makeRes();

    await controller.generate_otp(
      { tenant_id: 'maxwealth' },
      { mobile: '7306100556' } as any,
      res,
    );

    expect(authService.generate_otp).toHaveBeenCalledWith('maxwealth', {
      mobile: '7306100556',
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 200, ok: true });
  });

  it('verify_otp should map service response to http response', async () => {
    authService.verify_otp.mockResolvedValue({ status: 200, access_token: 'x' });
    const res = makeRes();

    await controller.verify_otp(
      { mobile: '7306100556', otp: 1111 } as any,
      res,
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 200, access_token: 'x' });
  });

  it('verify_admin_otp should map service response to http response', async () => {
    authService.verify_admin_otp.mockResolvedValue({ status: 400, error: 'no' });
    const res = makeRes();

    await controller.verify_admin_otp(
      { mobile: '7306100556', otp: 1111 } as any,
      res,
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ status: 400, error: 'no' });
  });

  it('user should return status OK with header user data', async () => {
    const res = makeRes();
    const user = { id: 1, role: 'Admin' };

    await controller.user({ user } as any, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      data: user,
    });
  });
});
