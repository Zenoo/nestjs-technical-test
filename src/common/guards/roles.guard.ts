import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthedRequest } from 'src/auth/dto/sign-in.dto';
import { Roles } from '../decorator/roles.decorator';
import { User, UserRole } from '@prisma/client';

export const isAdmin = (user: Pick<User, 'roles'>) =>
  user.roles.includes(UserRole.ADMIN);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthedRequest>();

    return roles.some((role) => request.user.roles.includes(role));
  }
}
