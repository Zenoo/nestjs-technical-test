import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RunCreateDto, RunUpdateDto } from './runs.dto';
import { Prisma } from '@prisma/client';

/**
 * Calculate the average speed in km/h
 * @param distance km
 * @param duration ms
 */
const getAverageSpeed = (distance: number, duration: number) => {
  // Convert duration from milliseconds to hours
  const hours = duration / (1000 * 60 * 60);
  return distance / hours;
};

/**
 * Calculate the average pace in min/km
 * @param distance km
 * @param duration ms
 */
const getAveragePace = (distance: number, duration: number) => {
  // Convert duration from milliseconds to minutes
  const minutes = duration / (1000 * 60);
  return minutes / distance;
};

@Injectable()
export class RunsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, data: RunCreateDto) {
    // Calculate averages
    const averageSpeed = getAverageSpeed(data.distance, data.duration);
    const averagePace = getAveragePace(data.distance, data.duration);

    return this.prisma.run.create({
      data: {
        ...data,
        averageSpeed,
        averagePace,
        userId,
      },
    });
  }

  findAll() {
    return this.prisma.run.findMany();
  }

  findOwn(userId: string) {
    return this.prisma.run.findMany({
      where: {
        userId,
      },
    });
  }

  findOne(uuid: string) {
    return this.prisma.run.findUnique({
      where: {
        id: uuid,
      },
    });
  }

  async update(uuid: string, data: RunUpdateDto) {
    const updateData: Prisma.RunUpdateInput = {
      ...data,
    };

    // If distance or duration is not provided, we need to fetch the current run data
    // to calculate the averages
    if (data.distance || data.duration) {
      const currentRun = await this.prisma.run.findUnique({
        where: {
          id: uuid,
        },
      });

      if (!currentRun) {
        throw new NotFoundException();
      }

      // Calculate averages
      const averageSpeed = getAverageSpeed(
        data.distance ?? currentRun.distance,
        data.duration ?? currentRun.duration,
      );
      const averagePace = getAveragePace(
        data.distance ?? currentRun.distance,
        data.duration ?? currentRun.duration,
      );

      updateData.averageSpeed = averageSpeed;
      updateData.averagePace = averagePace;
    }

    return this.prisma.run.update({
      where: {
        id: uuid,
      },
      data: updateData,
    });
  }

  remove(uuid: string) {
    return this.prisma.run.delete({
      where: {
        id: uuid,
      },
    });
  }
}
