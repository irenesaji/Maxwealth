import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CrossRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tokenArray = request.headers.authorization;
    const jwtService = new JwtService(); // Assuming user info is set by an Auth Guard or middleware
    let user: any;
    if (tokenArray) {
      user = jwtService.decode(tokenArray.split(' ')[1]);
    }
    // Check if user is authenticated
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const userIdFromRequest =
      request.query.user_id || request.params.user_id || request.body.user_id; // Adjust based on where the user_id is sent
    user = user.user;
    console.log('HELLOW', user.id);
    console.log('HELLOW 1', userIdFromRequest);

    // If user has 'admin' role, allow the request
    if (user.role === 'Admin') {
      return true;
    }

    // If user has 'user' role, check if the provided user_id matches their own
    if (user.role == 'User' && userIdFromRequest != user.id) {
      throw new ForbiddenException(
        'You are not allowed to perform this action with this user ID',
      );
    }

    return true; // Allow request if all checks pass
  }
}
