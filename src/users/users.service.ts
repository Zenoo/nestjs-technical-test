import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
      omit: {
        password: true,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      omit: {
        password: true,
      },
    });
  }

  async findOne(uuid: string) {
    return this.prisma.user.findUnique({
      where: {
        id: uuid,
      },
      omit: {
        password: true,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
      omit: {
        password: false,
      },
    });
  }

  update(uuid: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: {
        id: uuid,
      },
      data,
    });
  }

  remove(uuid: string) {
    return this.prisma.user.delete({
      where: {
        id: uuid,
      },
    });
  }
}
