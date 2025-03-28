import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RunCreateDto, RunUpdateDto } from './runs.dto';

@Injectable()
export class RunsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, data: RunCreateDto) {
    // Calculate average speed and pace
    const averageSpeed = data.distance / (data.duration / (1000 * 60 * 60));
    const averagePace = data.duration / (1000 * 60) / data.distance;

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

  update(uuid: string, data: RunUpdateDto) {
    return this.prisma.run.update({
      where: {
        id: uuid,
      },
      data,
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
