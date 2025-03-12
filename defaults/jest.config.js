const { compilerOptions } = require('./tsconfig.json')
const { pathsToModuleNameMapper } = require('ts-jest')

/**
 * @type {import('jest').Config}
 */
module.exports = {
  clearMocks: true,
  collectCoverage: true,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
  preset: 'ts-jest',
  testEnvironment: 'node',
  // setupFilesAfterEnv: ["<rootDir>/tests/prisma-setup.ts"],
  // globalSetup: "<rootDir>/tests/test-setup.ts",
  // globalTeardown: "<rootDir>/tests/test-teardown.ts"
}