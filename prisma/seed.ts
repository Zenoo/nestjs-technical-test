import { PrismaClient, Prisma, UserRole, RunType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const duration = 1000 * 60 * 58 + 1000 * 36;
const distance = 5.6;
const averageSpeed = distance / (duration / (1000 * 60 * 60));
const averagePace = duration / (1000 * 60) / distance;

const userData: Prisma.UserCreateInput[] = [
  {
    username: 'admin',
    password: bcrypt.hashSync('admin', 10),
    roles: [UserRole.ADMIN],
  },
  {
    username: 'foo',
    password: bcrypt.hashSync('bar', 10),
    runs: {
      create: {
        type: RunType.TRAINING,
        start: new Date(),
        duration,
        distance,
        averageSpeed,
        averagePace,
      },
    },
  },
];

async function main() {
  const existing = await prisma.user.count();
  if (existing) {
    console.log(`Skipping seeding. ${existing} users already exist.`);
    return;
  }

  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
      select: { id: true },
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
