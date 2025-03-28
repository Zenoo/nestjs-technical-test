import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthedRequest } from 'src/auth/dto/sign-in.dto';
import { Roles } from '../decorator/roles.decorator';

export enum Role {
  ADMIN = 'admin',
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthedRequest>();
    const user = request.user;
    // return matchRoles(roles, user.roles);
    return true;
  }
}
