import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private hasRequiredRole(
    requiredRoles: string | string[],
    currentRole?: string,
  ): boolean {
    if (!currentRole) {
      return false;
    }

    const normalizedCurrent = String(currentRole).trim().toLowerCase();
    const required = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];

    return required.some(
      (role) => String(role).trim().toLowerCase() === normalizedCurrent,
    );
  }

  private extractRole(userLike: any): string | undefined {
    return (
      userLike?.role ||
      userLike?.user?.role ||
      userLike?.payload?.role ||
      userLike?.payload?.user?.role
    );
  }

  private decodeJwtPayload(token: string): any {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json);
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string | string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();

    // If JwtAuthGuard has already populated req.user, use it directly.
    const roleFromRequest = this.extractRole(req?.user);
    if (roleFromRequest) {
      return this.hasRequiredRole(requiredRoles, roleFromRequest);
    }

    // APP_GUARD may run before JwtAuthGuard, so fallback to token inspection.
    const authHeader = req?.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    try {
      const token = authHeader.slice(7);
      const decoded: any = this.decodeJwtPayload(token);
      const roleFromToken = this.extractRole(decoded);
      if (!roleFromToken) {
        return false;
      }

      return this.hasRequiredRole(requiredRoles, roleFromToken);
    } catch (e) {
      return false;
    }

    return false;
  }
}
