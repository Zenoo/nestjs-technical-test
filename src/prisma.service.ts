import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      omit: {
        user: {
          password: true, // Omit the password field for the User model
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
