import { IsString } from 'class-validator';
import { Request } from 'express';

export type JwtPayload = {
  sub: string;
  username: string;
};

export type TimedJwtPayload = JwtPayload & {
  iat: number;
  exp: number;
};

export type AuthedRequest = Request & {
  user: TimedJwtPayload;
};

export class SignInDto {
  @IsString()
  readonly username: string;
  @IsString()
  readonly password: string;
}
