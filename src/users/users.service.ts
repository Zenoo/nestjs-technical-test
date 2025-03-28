import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreateDto, UserUpdateDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: UserCreateDto) {
    return this.prisma.user.create({
      data,
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(uuid: string) {
    return this.prisma.user.findUnique({
      where: {
        id: uuid,
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

  async update(uuid: string, data: UserUpdateDto) {
    // Hash the password if it's being updated
    const hashedData = { ...data };
    if (hashedData.password) {
      hashedData.password = await bcrypt.hash(hashedData.password, 10);
    }

    return this.prisma.user.update({
      where: {
        id: uuid,
      },
      data: hashedData,
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
