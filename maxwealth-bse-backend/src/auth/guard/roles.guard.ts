import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles.decorator';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const tokenArray = req.headers.authorization;
    const jwtService = new JwtService();

    if (tokenArray) {
      const user = jwtService.decode(tokenArray.split(' ')[1]);
      console.log('AUthorization USER', user['user']);
      return requiredRoles == user['user'].role;
    } else {
      return false;
    }
  }
}
