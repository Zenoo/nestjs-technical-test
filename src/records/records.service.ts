import { Injectable } from '@nestjs/common';
import { Run } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RecordDto } from './records.dto';

@Injectable()
export class RecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOwn(userId: string, distances: number[]) {
    const records: Record<number, RecordDto[]> = {};

    for (const distance of distances) {
      const fastestRuns = await this.prisma.$queryRaw<Run[]>`
        SELECT * FROM "Run"
        WHERE "userId" = ${userId}
        AND "distance" >= ${distance}
        ORDER BY "averagePace" ASC
        LIMIT 3
      `;

      records[distance] = fastestRuns.map((run) => ({
        // Calculate time from pace and distance
        time: run.averagePace * distance,
        distance: distance,
        averagePace: run.averagePace,
        runId: run.id,
      }));
    }

    return records;
  }

  async getTop(distances: number[]) {
    const records: Record<number, RecordDto[]> = {};

    for (const distance of distances) {
      const fastestRuns = await this.prisma.$queryRaw<Run[]>`
        SELECT * FROM "Run"
        WHERE "distance" >= ${distance}
        ORDER BY "averagePace" ASC
        LIMIT 3
      `;

      records[distance] = fastestRuns.map((run) => ({
        // Calculate time from pace and distance
        time: run.averagePace * distance,
        distance: distance,
        averagePace: run.averagePace,
        runId: run.id,
      }));
    }

    return records;
  }
}
