import { User } from '@prisma/client';
import { IsString } from 'class-validator';
import { Request } from 'express';

export type JwtPayload = Pick<User, 'id' | 'username' | 'roles'>;

export type AuthedRequest = Request & {
  user: JwtPayload;
};

export class SignInDto {
  @IsString()
  readonly username: string;
  @IsString()
  readonly password: string;
}
