import { Reflector } from '@nestjs/core';
import { Role } from '../guards/roles.guard';

export const Roles = Reflector.createDecorator<Role[]>();
