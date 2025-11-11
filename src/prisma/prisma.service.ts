import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'colorless',
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  async cleanDatabase(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    // Get model names by filtering out internal Prisma methods
    const modelKeys = Object.keys(this).filter((key): key is string => {
      if (typeof key !== 'string' || key[0] === '_' || key[0] === '$') {
        return false;
      }
      const value = (this as Record<string, unknown>)[key];
      return (
        typeof value === 'object' &&
        value !== null &&
        'deleteMany' in value &&
        typeof (value as { deleteMany: unknown }).deleteMany === 'function'
      );
    });

    await Promise.all(
      modelKeys.map((modelKey) => {
        const model = (
          this as unknown as Record<
            string,
            { deleteMany: () => Promise<unknown> }
          >
        )[modelKey];
        return model.deleteMany();
      }),
    );
  }
}
