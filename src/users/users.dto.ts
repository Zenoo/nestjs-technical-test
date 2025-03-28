import { UserRole } from '@prisma/client';
import { IsIn, IsStrongPassword, Length } from 'class-validator';

export class UserCreateDto {
  @Length(3, 32)
  username: string;

  @IsStrongPassword()
  @Length(8, 128)
  password: string;

  @IsIn(Object.values(UserRole))
  roles: UserRole[];
}
export class UserUpdateDto {
  @Length(3, 32)
  username: string;

  @IsStrongPassword()
  @Length(8, 128)
  password: string;

  @IsIn(Object.values(UserRole))
  roles: UserRole[];
}
