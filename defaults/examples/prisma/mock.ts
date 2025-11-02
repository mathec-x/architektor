import { readFileSync } from 'fs';
import { join } from 'path';
import type { PrismaClient } from './generated/client';
import type { PrismaAction } from './generated/internal/prismaNamespace';

type DeepMockProxy<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
  ? jest.Mock<ReturnType<T[K]>, Parameters<T[K]>>
  : T[K] extends object
  ? DeepMockProxy<T[K]>
  : T[K];
};

const prismaFile = readFileSync(join(__dirname, 'schema.prisma'), 'utf-8');
const prismaActions: { [P in PrismaAction]: jest.Mock } = {
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  findUnique: jest.fn(),
  findUniqueOrThrow: jest.fn(),
  findFirstOrThrow: jest.fn(),
  createMany: jest.fn(),
  createManyAndReturn: jest.fn(),
  updateMany: jest.fn(),
  updateManyAndReturn: jest.fn(),
  upsert: jest.fn(),
  aggregate: jest.fn(),
  count: jest.fn(),
  deleteMany: jest.fn(),
  executeRaw: jest.fn(),
  findRaw: jest.fn(),
  groupBy: jest.fn(),
  queryRaw: jest.fn(),
  runCommandRaw: jest.fn(),
};

const models = [...prismaFile.matchAll(/model\s+(\w+)\s*\{/g)].map(m => [m[1].toLowerCase(), prismaActions]);
const prismaMock = Object.fromEntries(models);

jest.mock('./generated/client', () => ({
  PrismaClient: jest.fn(() => prismaMock),
}));

export default prismaMock as DeepMockProxy<PrismaClient>;