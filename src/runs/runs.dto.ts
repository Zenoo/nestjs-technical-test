import { RunType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsPositive, MaxDate } from 'class-validator';

export class RunCreateDto {
  @IsIn(Object.values(RunType))
  type: RunType;

  @Type(() => Date)
  @MaxDate(() => new Date())
  start: Date;

  @IsPositive()
  @IsInt()
  duration: number;

  @IsPositive()
  distance: number;

  @IsOptional()
  comment?: string;
}

export class RunUpdateDto {
  @IsOptional()
  @IsIn(Object.values(RunType))
  type?: RunType;

  @IsOptional()
  comment?: string;
}
