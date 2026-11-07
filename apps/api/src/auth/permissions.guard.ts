import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { hasPermission, type Permission } from '@compras-ja/shared';
import { PERMISSIONS_KEY } from '../common/permissions.decorator';
import type { RequestUser } from './auth.types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;

    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = request.user;
    if (!user?.activeRole) {
      throw new ForbiddenException('Contexto organizacional obrigatório');
    }

    const ok = required.every((p) => hasPermission(user.activeRole!, p));
    if (!ok) {
      throw new ForbiddenException('Permissão insuficiente');
    }
    return true;
  }
}
