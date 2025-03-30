import { ApiProperty } from '@nestjs/swagger';
import { RunType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  MaxDate,
} from 'class-validator';

export class RunCreateDto {
  /**
   * Type of run
   * @example TRAINING
   */
  @ApiProperty({
    enum: RunType,
  })
  @IsEnum(RunType)
  type: RunType;

  /**
   * Start time of the run
   * @example '2023-10-01T10:00:00Z'
   */
  @Type(() => Date)
  @MaxDate(() => new Date())
  start: Date;

  /**
   * Duration of the run in milliseconds
   * @example 3600000
   */
  @IsPositive()
  @IsInt()
  duration: number;

  /**
   * Distance of the run in kilometers
   * @example 6.5
   */
  @IsPositive()
  distance: number;

  /**
   * Comment about the run
   * @example 'Morning run'
   */
  @IsOptional()
  comment?: string;
}

export class RunUpdateDto {
  @ApiProperty({
    enum: RunType,
  })
  /**
   * Type of run
   * @example TRAINING
   */
  @IsOptional()
  @IsEnum(RunType)
  type?: RunType;

  /**
   * Start time of the run
   * @example '2023-10-01T10:00:00Z'
   */
  @IsOptional()
  @Type(() => Date)
  @MaxDate(() => new Date())
  start?: Date;

  /**
   * Duration of the run in milliseconds
   * @example 3600000
   */
  @IsOptional()
  @IsPositive()
  @IsInt()
  duration?: number;

  /**
   * Distance of the run in kilometers
   * @example 6.5
   */
  @IsOptional()
  @IsPositive()
  distance?: number;

  /**
   * Comment about the run
   * @example 'Morning run'
   */
  @IsOptional()
  comment?: string;

  /**
   * Run public status
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  public?: boolean;
}

export class RunDto extends RunCreateDto {
  /**
   * UUID of the run
   * @example '123e4567-e89b-12d3-a456-426614174000'
   */
  uuid: string;

  /**
   * Average speed of the run in km/h
   * @example 10.5
   */
  averageSpeed: number;

  /**
   * Average pace of the run in minutes per kilometer
   * @example 5.7
   */
  averagePace: number;

  /**
   * Run public status
   * @example true
   */
  public: boolean;
}
