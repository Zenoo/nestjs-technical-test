import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { User, UserRole } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';
import { Request } from 'express';

export type JwtPayload = Pick<User, 'id' | 'username' | 'roles'>;

export type AuthedRequest = Request & {
  user: JwtPayload;
};

@ApiSchema({
  description: 'User authentication data',
})
export class UserAuthDto {
  /**
   * Username must be unique
   * @example 'john_doe'
   */
  @IsString()
  readonly username: string;

  /**
   * Password must be strong
   * @example 'P@ssw0rd123'
   */
  @IsString()
  readonly password: string;
}

export class JwtUserDto {
  /**
   * User ID
   * @example '123e4567-e89b-12d3-a456-426614174000'
   */
  @IsString()
  readonly id: string;

  /**
   * User roles
   * @example ['ADMIN']
   */
  @ApiProperty({
    enum: UserRole,
  })
  @IsEnum(UserRole, { each: true })
  readonly roles: UserRole[];

  /**
   * User username
   * @example 'john_doe'
   */
  @IsString()
  readonly username: string;
}
