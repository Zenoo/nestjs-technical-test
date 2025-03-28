import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RunsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.RunCreateInput) {
    return this.prisma.run.create({
      data,
    });
  }

  findAll() {
    return this.prisma.run.findMany();
  }

  findOne(uuid: string) {
    return this.prisma.run.findUnique({
      where: {
        id: uuid,
      },
    });
  }

  update(uuid: string, data: Prisma.RunUpdateInput) {
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
