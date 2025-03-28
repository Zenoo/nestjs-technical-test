import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      omit: {
        user: {
          password: true, // Omit the password to prevent leaks
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
