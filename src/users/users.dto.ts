import { User } from '@prisma/client';

export type UserCreateDto = Pick<User, 'username' | 'password' | 'roles'>;
export type UserUpdateDto = Pick<User, 'username' | 'password' | 'roles'>;
