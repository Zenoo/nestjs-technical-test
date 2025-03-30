import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class UserCreateDto {
  /**
   * Username must be unique
   * @example 'john_doe'
   */
  @IsString()
  @Length(3, 32)
  username: string;

  /**
   * Password must be strong
   * @example 'P@ssw0rd123'
   */
  @IsString()
  @IsStrongPassword()
  @Length(8, 128)
  password: string;

  /**
   * User roles
   * @example ['ADMIN']
   */
  @ApiProperty({
    enum: UserRole,
  })
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];
}

export class UserUpdateDto {
  /**
   * Username must be unique
   * @example 'john_doe'
   */
  @IsString()
  @Length(3, 32)
  username: string;

  /**
   * Password must be strong
   * @example 'P@ssw0rd123'
   */
  @IsString()
  @IsStrongPassword()
  @Length(8, 128)
  @IsOptional()
  password?: string;

  /**
   * User roles
   * @example ['ADMIN']
   */
  @ApiProperty({
    enum: UserRole,
  })
  @IsEnum(UserRole, { each: true })
  @IsOptional()
  roles?: UserRole[];

  /**
   * Auto publish runs
   * @example false
   */
  @IsOptional()
  @IsBoolean()
  autoPublishRuns?: boolean;
}

export class UserDto {
  /**
   * UUID of the user
   * @example '123e4567-e89b-12d3-a456-426614174000'
   */
  @IsString()
  id: string;

  /**
   * Username of the user
   * @example 'john_doe'
   */
  @IsString()
  username: string;

  /**
   * User roles
   * @example ['ADMIN']
   */
  @ApiProperty({
    enum: UserRole,
  })
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];

  /**
   * Auto publish runs
   * @example false
   */
  @IsBoolean()
  autoPublishRuns: boolean;
}
